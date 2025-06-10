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
import * as d3 from 'd3'
import { useMarketHistoryStore } from '@/stores/marketHistory'

interface Point {
  date: Date
  volume: number
}

const props = defineProps<{ marketId: string }>()
const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const store = useMarketHistoryStore()

const dataMap = computed(() => store.byOption)

let unwatch: any = null
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
  if (unwatch) {
    unwatch()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

function drawChart() {
  if (!svgRef.value || !containerRef.value) return

  const data = Object.values(dataMap.value).reduce((acc: Point[], curr) => {
    return acc.concat(curr.history)
  }, [])

  if (!data.length) return

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  const containerBounds = containerRef.value.getBoundingClientRect()
  const margin = { top: 20, right: 80, bottom: 40, left: 60 }
  const fullWidth = Math.max(containerBounds.width, 300)
  const fullHeight = Math.max(containerBounds.height, 200)
  const width = fullWidth - margin.left - margin.right
  const height = fullHeight - margin.top - margin.bottom

  if (width <= 0 || height <= 0) return

  svg.attr('width', fullWidth).attr('height', fullHeight)

  const chartG = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (pt: Point) => pt.date) as [Date, Date])
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (pt: Point) => pt.volume)!])
    .nice()
    .range([height, 0])

  const maxTicks = Math.floor(width / 80)
  const tickCount = Math.min(maxTicks, 8)

  const xAxisG = chartG
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom<Date>(xScale)
        .ticks(tickCount)
        .tickFormat(d3.timeFormat('%b %d') as any),
    )
  xAxisG
    .selectAll('text')
    .style('fill', 'var(--color-text-secondary)')
    .style('font-size', '12px')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
  xAxisG
    .selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  xAxisG.select('.domain').remove()

  const yAxisG = chartG
    .append('g')
    .call(d3.axisLeft<number>(yScale).tickFormat((d: number) => `$${d3.format(',.0f')(d)}` as any))
  yAxisG.selectAll('text').style('fill', 'var(--color-text-secondary)').style('font-size', '12px')
  yAxisG
    .selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  yAxisG.select('.domain').remove()

  const lineGenerator = d3
    .line<Point>()
    .x((pt: Point) => xScale(pt.date))
    .y((pt: Point) => yScale(pt.volume))
    .curve(d3.curveMonotoneX)

  const defs = chartG.append('defs')
  defs
    .append('clipPath')
    .attr('id', `clip-${props.marketId}`)
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)

  const lineGroup = chartG.append('g').attr('clip-path', `url(#clip-${props.marketId})`)

  const ids = Object.keys(dataMap.value)
  const color = d3.scaleOrdinal<string, string>(d3.schemeCategory10).domain(ids)

  ids.forEach((id) => {
    const { history } = dataMap.value[id]
    lineGroup
      .append('path')
      .datum(history)
      .attr('fill', 'none')
      .attr('stroke', color(id))
      .attr('stroke-width', 2)
      .attr('d', lineGenerator)
  })

  let tooltip = d3.select('body').select<HTMLElement>('.tooltip')
  if (tooltip.empty()) {
    tooltip = d3
      .select('body')
      .append('div')
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

  const dotGroup = chartG.append('g')
  ids.forEach((id) => {
    const { text, history } = dataMap.value[id]

    dotGroup
      .selectAll<SVGCircleElement, Point>(`.dot-${id}`)
      .data(history)
      .join('circle')
      .attr('class', `dot-${id}`)
      .attr('cx', (pt: Point) => xScale(pt.date))
      .attr('cy', (pt: Point) => yScale(pt.volume))
      .attr('r', 4)
      .attr('fill', color(id))
      .attr('stroke', 'var(--color-black)')
      .attr('stroke-width', 1)
      .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, pt: Point) {
        d3.select(this).attr('r', 6)
        tooltip
          .html(
            `<div><strong>${text}</strong></div>` +
              `<div>${d3.timeFormat('%b %d, %Y %I:%M:%S %p')(pt.date)}</div>` +
              `<div>$${d3.format(',.0f')(pt.volume)}</div>`,
          )
          .style('visibility', 'visible')
      })
      .on('mousemove', (event: MouseEvent) => {
        tooltip.style('top', `${event.pageY - 30}px`).style('left', `${event.pageX + 10}px`)
      })
      .on('mouseout', function (this: SVGCircleElement) {
        d3.select(this).attr('r', 4)
        tooltip.style('visibility', 'hidden')
      })
  })

  ids.forEach((id, i) => {
    const { text } = dataMap.value[id]
    const legendX = Math.min(width + 10, fullWidth - 100)
    chartG
      .append('circle')
      .attr('cx', legendX)
      .attr('cy', i * 20 + 10)
      .attr('r', 4)
      .attr('fill', color(id))

    chartG
      .append('text')
      .attr('x', legendX + 10)
      .attr('y', i * 20 + 14)
      .text(text.length > 12 ? text.substring(0, 10) + '...' : text)
      .style('font-size', '11px')
      .style('fill', 'var(--color-text-primary)')
  })

  let idleTimeout: number | null = null
  function idled() {
    idleTimeout = null
  }

  function updateChart(event: d3.D3BrushEvent<unknown>) {
    const extent = event.selection as [number, number] | null
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = window.setTimeout(idled, 350))
      xScale.domain(d3.extent(data, (pt: Point) => pt.date) as [Date, Date])
    } else {
      xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])])
      lineGroup.select<SVGGElement>('.brush')!.call(brush.move, null)
    }

    xAxisG
      .transition()
      .duration(750)
      .call(
        d3
          .axisBottom<Date>(xScale)
          .ticks(tickCount)
          .tickFormat(d3.timeFormat('%b %d') as any),
      )
    xAxisG
      .selectAll('text')
      .style('fill', 'var(--color-text-secondary)')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
    xAxisG
      .selectAll('.tick line')
      .style('stroke', 'var(--color-soft-black)')
      .style('stroke-dasharray', '2,2')
    xAxisG.select('.domain').remove()

    lineGroup.selectAll('path').transition().duration(750).attr('d', lineGenerator)

    dotGroup
      .selectAll<SVGCircleElement, Point>('circle')
      .transition()
      .duration(750)
      .attr('cx', (pt: Point) => xScale(pt.date))
      .attr('cy', (pt: Point) => yScale(pt.volume))
  }

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on('end', updateChart)

  lineGroup.append('g').attr('class', 'brush').call(brush)

  svg.on('dblclick', () => {
    xScale.domain(d3.extent(data, (pt: Point) => pt.date) as [Date, Date])
    xAxisG.transition().call(
      d3
        .axisBottom<Date>(xScale)
        .ticks(tickCount)
        .tickFormat(d3.timeFormat('%b %d') as any),
    )
    xAxisG
      .selectAll('text')
      .style('fill', 'var(--color-text-secondary)')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
    xAxisG
      .selectAll('.tick line')
      .style('stroke', 'var(--color-soft-black)')
      .style('stroke-dasharray', '2,2')
    xAxisG.select('.domain').remove()

    lineGroup.selectAll('path').transition().attr('d', lineGenerator)

    dotGroup
      .selectAll<SVGCircleElement, Point>('circle')
      .transition()
      .attr('cx', (pt: Point) => xScale(pt.date))
      .attr('cy', (pt: Point) => yScale(pt.volume))
  })
}
</script>

<style scoped>
.tooltip {
  pointer-events: none;
  font-family: sans-serif;
}
</style>
