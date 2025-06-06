<template>
  <div class="bg-off-black p-6 rounded-xl border border-border">
    <h3 class="text-xl font-bold text-text-primary mb-4">Balance History</h3>
    <div ref="containerRef" class="w-full h-80">
      <svg ref="svgRef" class="w-full h-full"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'
import { useUserHistoryStore } from '@/stores/userHistory'

interface BalancePoint {
  date: Date
  balance: number
}

interface Props {
  userId: string
}
const props = defineProps<Props>()
const userHistoryStore = useUserHistoryStore()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

onBeforeUnmount(() => {
  if (svgRef.value) d3.select(svgRef.value).selectAll('*').remove()
  d3.select('body').selectAll('.tooltip').remove()
})

onMounted(async () => {
  if (!props.userId) return
  await userHistoryStore.loadUserBalanceHistory(props.userId)
  const raw = userHistoryStore.balanceHistory
  const points: BalancePoint[] = raw
    .map((record) => ({
      date: new Date(record.created_at),
      balance: record.balance,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  drawChart(points)
})

function drawChart(dataPoints: BalancePoint[]) {
  if (!svgRef.value || !containerRef.value) return
  if (!dataPoints.length) return

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  const containerBounds = containerRef.value.getBoundingClientRect()
  const margin = { top: 20, right: 20, bottom: 40, left: 60 }
  const fullWidth = containerBounds.width
  const fullHeight = containerBounds.height
  const width = fullWidth - margin.left - margin.right
  const height = fullHeight - margin.top - margin.bottom

  svg.attr('width', fullWidth).attr('height', fullHeight)

  const chartG = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataPoints, (pt: BalancePoint) => pt.date) as [Date, Date])
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataPoints, (pt: BalancePoint) => pt.balance)!])
    .nice()
    .range([height, 0])

  const xAxisG = chartG
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom<Date>(xScale).tickFormat(d3.timeFormat('%b %d') as any))
  xAxisG.selectAll('text').style('fill', 'var(--color-text-secondary)').style('font-size', '12px')
  xAxisG
    .selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  xAxisG.select('.domain').remove()

  const yAxisG = chartG
    .append('g')
    .call(d3.axisLeft<number>(yScale).tickFormat(d3.format('$,.0f') as any))
  yAxisG.selectAll('text').style('fill', 'var(--color-text-secondary)').style('font-size', '12px')
  yAxisG
    .selectAll('.tick line')
    .style('stroke', 'var(--color-soft-black)')
    .style('stroke-dasharray', '2,2')
  yAxisG.select('.domain').remove()

  const lineGenerator = d3
    .line<BalancePoint>()
    .x((pt: BalancePoint) => xScale(pt.date))
    .y((pt: BalancePoint) => yScale(pt.balance))
    .curve(d3.curveMonotoneX)

  const defs = chartG.append('defs')
  defs
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)

  const lineGroup = chartG.append('g').attr('clip-path', 'url(#clip)')
  const path = lineGroup
    .append('path')
    .datum(dataPoints)
    .attr('fill', 'none')
    .attr('stroke', 'var(--color-purple)')
    .attr('stroke-width', 2)
    .attr('d', lineGenerator)

  const tooltip = d3
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

  const dotGroup = chartG.append('g')
  dotGroup
    .selectAll<SVGCircleElement, BalancePoint>('.dot')
    .data(dataPoints)
    .join('circle')
    .attr('class', 'dot')
    .attr('cx', (pt: BalancePoint) => xScale(pt.date))
    .attr('cy', (pt: BalancePoint) => yScale(pt.balance))
    .attr('r', 4)
    .attr('fill', 'var(--color-purple)')
    .attr('stroke', 'var(--color-black)')
    .attr('stroke-width', 1)
    .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, pt: BalancePoint) {
      d3.select(this).attr('r', 6).attr('fill', 'var(--color-purple-light)')
      tooltip
        .html(
          `<div>${d3.timeFormat('%b %d, %Y %I:%M:%S %p')(pt.date)}</div><div>${d3.format('$,.2f')(
            pt.balance,
          )}</div>`,
        )
        .style('visibility', 'visible')
    })
    .on('mousemove', (event: MouseEvent) => {
      tooltip.style('top', `${event.pageY - 30}px`).style('left', `${event.pageX + 10}px`)
    })
    .on('mouseout', function (this: SVGCircleElement) {
      d3.select(this).attr('r', 4).attr('fill', 'var(--color-purple)')
      tooltip.style('visibility', 'hidden')
    })

  let idleTimeout: number | null = null
  function idled() {
    idleTimeout = null
  }

  function updateChart(event: d3.D3BrushEvent<unknown>) {
    const extent = event.selection as [number, number] | null
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = window.setTimeout(idled, 350))
      xScale.domain(d3.extent(dataPoints, (pt: BalancePoint) => pt.date) as [Date, Date])
    } else {
      xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])])
      lineGroup.select<SVGGElement>('.brush')!.call(brush.move, null)
    }
    xAxisG
      .transition()
      .duration(750)
      .call(d3.axisBottom<Date>(xScale).tickFormat(d3.timeFormat('%b %d') as any))
    xAxisG.selectAll('text').style('fill', 'var(--color-text-secondary)').style('font-size', '12px')
    xAxisG
      .selectAll('.tick line')
      .style('stroke', 'var(--color-soft-black)')
      .style('stroke-dasharray', '2,2')
    xAxisG.select('.domain').remove()

    path
      .transition()
      .duration(750)
      .attr(
        'd',
        d3
          .line<BalancePoint>()
          .x((pt: BalancePoint) => xScale(pt.date))
          .y((pt: BalancePoint) => yScale(pt.balance))
          .curve(d3.curveMonotoneX)(dataPoints) as string,
      )

    dotGroup
      .selectAll<SVGCircleElement, BalancePoint>('.dot')
      .transition()
      .duration(750)
      .attr('cx', (pt: BalancePoint) => xScale(pt.date))
      .attr('cy', (pt: BalancePoint) => yScale(pt.balance))
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
    xScale.domain(d3.extent(dataPoints, (pt: BalancePoint) => pt.date) as [Date, Date])
    xAxisG.transition().call(d3.axisBottom<Date>(xScale).tickFormat(d3.timeFormat('%b %d') as any))
    xAxisG.selectAll('text').style('fill', 'var(--color-text-secondary)').style('font-size', '12px')
    xAxisG
      .selectAll('.tick line')
      .style('stroke', 'var(--color-soft-black)')
      .style('stroke-dasharray', '2,2')
    xAxisG.select('.domain').remove()

    path.transition().attr(
      'd',
      d3
        .line<BalancePoint>()
        .x((pt: BalancePoint) => xScale(pt.date))
        .y((pt: BalancePoint) => yScale(pt.balance))
        .curve(d3.curveMonotoneX)(dataPoints) as string,
    )

    dotGroup
      .selectAll<SVGCircleElement, BalancePoint>('.dot')
      .transition()
      .attr('cx', (pt: BalancePoint) => xScale(pt.date))
      .attr('cy', (pt: BalancePoint) => yScale(pt.balance))
  })
}
</script>

<style scoped>
.tooltip {
  pointer-events: none;
  font-family: sans-serif;
}
</style>
