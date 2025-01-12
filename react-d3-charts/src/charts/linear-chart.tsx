import style from './linear-chart.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear, line, select, axisBottom, axisLeft } from 'd3';

export type LinearChartProps = {
    title: string;
    xLabel: string;
    yLabel: string;
    x: number[];
    y: number[];
};

const config = {
    margin: {
        x: 60,
        y: 50,
    },
    maxTicks: 10,
    colors: {
        axis: '#ffdbaa',
        plot: '#aabdff',
    },
};

export const LinearChart = (props: LinearChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const xAxisRef = useRef<SVGSVGElement>(null);
    const yAxisRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setChartSize({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const x = useMemo(
        () => scaleLinear([0, props.x.length - 1], [config.margin.x, chartSize.width - config.margin.x]),
        [chartSize, props.x],
    );

    const y = useMemo(
        () =>
            scaleLinear(
                [Math.min(...props.y), Math.max(...props.y)],
                [chartSize.height - config.margin.y, config.margin.y],
            ),
        [chartSize, props.y],
    );
    const plotLine = line((_, i) => x(i), y);

    useEffect(() => {
        if (xAxisRef.current) {
            const xAxis = axisBottom(x).ticks(Math.min(config.maxTicks, props.x.length));
            select(xAxisRef.current)
                .attr('transform', `translate(0, ${chartSize.height - config.margin.y})`)
                .attr('color', config.colors.axis)
                .attr('font-size', '12px')
                .attr('stroke-width', '2')
                .call(xAxis);
        }
        if (yAxisRef.current) {
            const yAxis = axisLeft(y).ticks(Math.min(config.maxTicks, props.x.length));
            select(yAxisRef.current)
                .attr('transform', `translate(${config.margin.x},0)`)
                .attr('color', config.colors.axis)
                .attr('font-size', '12px')
                .attr('stroke-width', '2')
                .call(yAxis);
        }
    }, [chartSize, props.x, props.y, x, y]);

    return (
        <div ref={containerRef} className={style.chartWrapper}>
            <p className={style.chartTitle}>{props.title}</p>
            <p className={style.chartLabelX}>{props.xLabel}</p>
            <p className={style.chartLabelY}>{props.yLabel}</p>
            <svg ref={svgRef} viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}>
                <path fill="none" stroke={config.colors.plot} strokeWidth="2" d={plotLine(props.y) ?? ''} />
                <g ref={xAxisRef} />
                <g ref={yAxisRef} />
            </svg>
        </div>
    );
};
