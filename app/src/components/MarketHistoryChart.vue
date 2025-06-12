<template>
  <div class="w-full bg-off-black rounded-xl border border-border p-6">
    <h3 class="text-xl font-bold text-text-primary mb-4">Volume History</h3>
    <div ref="containerRef" class="w-full h-80">
      <svg ref="svgRef" class="w-full h-full"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import type { WatchStopHandle } from 'vue'
import * as d3 from 'd3'
import { useMarketHistoryStore } from '@/stores/marketHistory'

interface Point {
  date: Date
  volume: number
}

interface OptionHistory {
  text: string
  history: Point[]
}

const props = defineProps<{ marketId: string }>()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const store = useMarketHistoryStore()
const dataMap = computed<Record<string, OptionHistory>>(() => store.byOption)

let unwatch: WatchStopHandle | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  if (!props.marketId) return
  await store.loadMarketOptionsHistory(props.marketId)
  await nextTick()
  drawChart()
  unwatch = watch(
    dataMap,
    async () => {
      await nextTick()
      drawChart()
    },
    { deep: true },
  )
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      drawChart()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (svgRef.value) d3.select(svgRef.value).selectAll('*').remove()
  d3.select('body').selectAll('.tooltip').remove()
  if (unwatch) unwatch()
  if (resizeObserver) resizeObserver.disconnect()
})

function drawChart(): void {
  if (!svgRef.value || !containerRef.value) return

  const data = Object.values(dataMap.value).flatMap(o => o.history)
  if (data.length === 0) return

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  const { width: w0, height: h0 } = containerRef.value.getBoundingClientRect()
  const margin = { top: 20, right: 80, bottom: 40, left: 60 }
  const width = Math.max(w0, 300) - margin.left - margin.right
  const height = Math.max(h0, 200) - margin.top - margin.bottom
  if (width <= 0 || height <= 0) return

  svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom)
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const xScale = d3.scaleTime().domain(d3.extent(data, d => d.date) as [Date, Date]).range([0, width])
  const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.volume)!]).nice().range([height, 0])

  const ticks = Math.min(Math.floor(width / 80), 8)

  const xAxis = g.append('g').attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(ticks).tickFormat(d3.timeFormat('%b %d') as any))
  xAxis.selectAll('text')
    .style('fill', 'var(--color-text-secondary)')
    .style('font-size', '12px')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
  xAxis.selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  xAxis.select('.domain').remove()

  const yAxis = g.append('g')
    .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format(',.0f')(d)}` as any))
  yAxis.selectAll('text')
    .style('fill', 'var(--color-text-secondary)')
    .style('font-size', '12px')
  yAxis.selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  yAxis.select('.domain').remove()

  const lineGen = d3.line<Point>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.volume))
    .curve(d3.curveMonotoneX)

  g.append('defs').append('clipPath').attr('id', `clip-${props.marketId}`)
    .append('rect').attr('width', width).attr('height', height)

  const lineGroup = g.append('g').attr('clip-path', `url(#clip-${props.marketId})`)
  const ids = Object.keys(dataMap.value)
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(ids)

  ids.forEach(id => {
    lineGroup.append('path')
      .datum(dataMap.value[id].history)
      .attr('fill', 'none')
      .attr('stroke', color(id) as string)
      .attr('stroke-width', 2)
      .attr('d', lineGen)
  })

  let tooltip = d3.select('body').select<HTMLElement>('.tooltip')
  if (tooltip.empty()) {
    tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'var(--color-black)')
      .style('border', '1px solid var(--color-soft-black)')
      .style('border-radius', '4px')
      .style('padding', '6px')
      .style('color', 'var(--color-white)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
  }

  const dotGroup = g.append('g')
  ids.forEach(id => {
    dotGroup.selectAll<SVGCircleElement, Point>(`.dot-${id}`)
      .data(dataMap.value[id].history)
      .join('circle')
      .attr('class', `dot-${id}`)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.volume))
      .attr('r', 4)
      .attr('fill', color(id) as string)
      .attr('stroke', 'var(--color-black)')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6)
        tooltip.html(
          `<div><strong>${dataMap.value[id].text}</strong></div>` +
          `<div>${d3.timeFormat('%b %d, %Y %I:%M:%S %p')(d.date)}</div>` +
          `<div>$${d3.format(',.0f')(d.volume)}</div>`
        ).style('visibility', 'visible')
      })
      .on('mousemove', event => {
        tooltip.style('top', `${event.pageY - 30}px`).style('left', `${event.pageX + 10}px`)
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4)
        tooltip.style('visibility', 'hidden')
      })
  })

  ids.forEach((id, i) => {
    const x0 = width + 10
    g.append('circle')
      .attr('cx', x0)
      .attr('cy', i * 20 + 10)
      .attr('r', 4)
      .attr('fill', color(id) as string)
    g.append('text')
      .attr('x', x0 + 10)
      .attr('y', i * 20 + 14)
      .text(
        dataMap.value[id].text.length > 12
          ? `${dataMap.value[id].text.slice(0, 10)}…`
          : dataMap.value[id].text
      )
      .style('font-size', '11px')
      .style('fill', 'var(--color-text-primary)')
  })

  let idle: number | null = null
  const resetIdle = () => { idle = null }

  function update(event: any) {
    const sel = event.selection as [number, number] | null
    if (!sel) {
      if (!idle) return (idle = window.setTimeout(resetIdle, 350))
      xScale.domain(d3.extent(data, d => d.date) as [Date, Date])
    } else {
      xScale.domain([xScale.invert(sel[0]), xScale.invert(sel[1])])
      lineGroup.select<SVGGElement>('.brush')!.call(brush.move, null)
    }
    xAxis.transition().duration(750).call(d3.axisBottom(xScale).ticks(ticks).tickFormat(d3.timeFormat('%b %d') as any))
    lineGroup.selectAll('path').transition().duration(750).attr('d', lineGen)
    dotGroup.selectAll<SVGCircleElement, Point>('circle')
      .transition().duration(750)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.volume))
  }

  const brush = d3.brushX().extent([[0, 0], [width, height]]).on('end', update)
  lineGroup.append('g').attr('class', 'brush').call(brush)

  svg.on('dblclick', () => {
    xScale.domain(d3.extent(data, d => d.date) as [Date, Date])
    xAxis.transition().call(d3.axisBottom(xScale).ticks(ticks).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text').attr('transform', 'rotate(-45)').style('text-anchor', 'end')
    lineGroup.selectAll('path').transition().attr('d', lineGen)
    dotGroup.selectAll<SVGCircleElement, Point>('circle')
      .transition()
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.volume))
  })
}
</script>

<style scoped>
.tooltip {
  pointer-events: none;
  font-family: sans-serif;
}
</style>
