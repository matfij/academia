import { useEffect, useRef } from 'react';
import style from './linear-chart.module.scss';
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
        x: 40,
        y: 30,
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

    const x = scaleLinear([0, props.x.length - 1], [config.margin.x, 600 - config.margin.x]);
    const y = scaleLinear(
        [Math.min(...props.y), Math.max(...props.y)],
        [400 - config.margin.y, config.margin.y],
    );
    const plotLine = line((_, i) => x(i), y);

    useEffect(() => {
        if (xAxisRef.current) {
            const xAxis = axisBottom(x).ticks(Math.min(config.maxTicks, props.x.length));
            select(xAxisRef.current)
                .attr('transform', `translate(0, ${400 - config.margin.y})`)
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
    }, []);

    return (
        <div className={style.chartWrapper}>
            <p className={style.chartTitle}>{props.title}</p>
            <p className={style.chartLabelX}>{props.xLabel}</p>
            <p className={style.chartLabelY}>{props.yLabel}</p>
            <svg ref={svgRef} width={600} height={400}>
                <path fill="none" stroke={config.colors.plot} strokeWidth="2" d={plotLine(props.y) ?? ''} />
                <g ref={xAxisRef} />
                <g ref={yAxisRef} />
            </svg>
        </div>
    );
};
