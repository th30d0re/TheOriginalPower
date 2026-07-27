import { useEffect, useId, useRef } from 'react';
import * as d3 from 'd3';
import type { ChartSeries } from '../../content/types';

interface SeriesChartProps {
  series: ChartSeries[];
  xLabel?: string;
  yLabel?: string;
  area?: boolean;
}

const SERIES_COLORS = [
  'var(--chapter-accent, #e0b34c)',
  'var(--accent-blue, #3b82f6)',
  'var(--accent-red, #ef4444)',
  'var(--accent-purple, #a855f7)',
  'var(--accent-green, #10b981)',
];

const colorForSeries = (item: ChartSeries, index: number) =>
  item.color ?? SERIES_COLORS[index % SERIES_COLORS.length];

const expandedDomain = ([minimum, maximum]: [number, number]): [number, number] => {
  if (minimum !== maximum) return [minimum, maximum];
  const padding = Math.abs(minimum) * 0.1 || 1;
  return [minimum - padding, maximum + padding];
};

const SeriesChart = ({ series, xLabel, yLabel, area = false }: SeriesChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientPrefix = useId().replace(/:/g, '');

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = svgRef.current;
    if (!container || !svgElement || series.length === 0) return;

    const points = series.flatMap((item) => item.points);
    if (points.length === 0) return;

    const svg = d3.select(svgElement);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasEntered = reducedMotion;

    const draw = (containerWidth: number, animate: boolean) => {
      const width = Math.max(320, containerWidth);
      const height = Math.max(300, Math.min(480, width * 0.56));
      const margin = {
        top: 24,
        right: 24,
        bottom: xLabel ? 64 : 48,
        left: yLabel ? 72 : 56,
      };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      svg.selectAll('*').interrupt().remove();
      svg.attr('viewBox', `0 0 ${width} ${height}`);

      const xExtent = d3.extent(points, (point) => point.x);
      const yExtent = d3.extent(points, (point) => point.y);
      if (xExtent[0] === undefined || xExtent[1] === undefined) return;
      if (yExtent[0] === undefined || yExtent[1] === undefined) return;

      const xScale = d3
        .scaleLinear()
        .domain(expandedDomain([xExtent[0], xExtent[1]]))
        .nice()
        .range([margin.left, width - margin.right]);
      const yScale = d3
        .scaleLinear()
        .domain(
          expandedDomain(
            area
              ? [Math.min(0, yExtent[0]), Math.max(0, yExtent[1])]
              : [yExtent[0], yExtent[1]],
          ),
        )
        .nice()
        .range([height - margin.bottom, margin.top]);

      const yTicks = yScale.ticks(Math.max(4, Math.floor(innerHeight / 65)));
      svg
        .append('g')
        .attr('class', 'series-chart-grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .tickValues(yTicks)
            .tickSize(-innerWidth)
            .tickFormat(() => ''),
        );

      svg
        .append('g')
        .attr('class', 'series-chart-axis')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(Math.max(4, Math.floor(innerWidth / 110))));

      svg
        .append('g')
        .attr('class', 'series-chart-axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickValues(yTicks));

      if (xLabel) {
        svg
          .append('text')
          .attr('class', 'series-chart-axis-label')
          .attr('x', margin.left + innerWidth / 2)
          .attr('y', height - 12)
          .attr('text-anchor', 'middle')
          .text(xLabel);
      }

      if (yLabel) {
        svg
          .append('text')
          .attr('class', 'series-chart-axis-label')
          .attr('transform', 'rotate(-90)')
          .attr('x', -(margin.top + innerHeight / 2))
          .attr('y', 18)
          .attr('text-anchor', 'middle')
          .text(yLabel);
      }

      const definitions = svg.append('defs');
      const line = d3
        .line<ChartSeries['points'][number]>()
        .x((point) => xScale(point.x))
        .y((point) => yScale(point.y))
        .curve(d3.curveMonotoneX);
      const areaShape = d3
        .area<ChartSeries['points'][number]>()
        .x((point) => xScale(point.x))
        .y0(yScale(0))
        .y1((point) => yScale(point.y))
        .curve(d3.curveMonotoneX);

      series.forEach((item, index) => {
        const color = colorForSeries(item, index);
        const orderedPoints = [...item.points].sort((a, b) => a.x - b.x);
        const gradientId = `${gradientPrefix}-series-gradient-${index}`;

        if (area) {
          const gradient = definitions
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0')
            .attr('x2', '0')
            .attr('y1', '0')
            .attr('y2', '1');
          gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.28);
          gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.02);

          svg
            .append('path')
            .datum(orderedPoints)
            .attr('class', 'series-chart-area')
            .attr('fill', `url(#${gradientId})`)
            .attr('d', areaShape);
        }

        const path = svg
          .append('path')
          .datum(orderedPoints)
          .attr('class', 'series-chart-line')
          .attr('stroke', color)
          .attr('d', line);

        if (animate) {
          const length = path.node()?.getTotalLength() ?? 0;
          path
            .attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition()
            .duration(1100)
            .delay(index * 140)
            .ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);
        }
      });
    };

    const initialWidth = container.getBoundingClientRect().width;
    draw(initialWidth, false);

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) draw(width, false);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (!hasEntered && entries.some((entry) => entry.isIntersecting)) {
          hasEntered = true;
          draw(container.getBoundingClientRect().width, true);
          intersectionObserver.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (!reducedMotion) intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      svg.selectAll('*').interrupt();
    };
  }, [area, gradientPrefix, series, xLabel, yLabel]);

  if (series.length === 0 || series.every((item) => item.points.length === 0)) {
    return <div className="visual-placeholder">No series data is available.</div>;
  }

  return (
    <div className="series-chart" ref={containerRef}>
      {series.length > 1 && (
        <div className="series-chart-legend" aria-label="Chart legend">
          {series.map((item, index) => (
            <span className="series-chart-legend-item" key={`${item.label}-${index}`}>
              <span
                className="series-chart-legend-swatch"
                style={{ backgroundColor: colorForSeries(item, index) }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
      <svg
        ref={svgRef}
        className="series-chart-svg"
        role="img"
        aria-label={`Line chart showing ${series.map((item) => item.label).join(', ')}`}
      />
    </div>
  );
};

export default SeriesChart;
