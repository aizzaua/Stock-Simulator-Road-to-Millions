import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { KLineData, Stock } from '../types';
import { STOCKS } from '../data/stocks';

interface KLineChartProps {
  stock: Stock;
  data: KLineData[];
}

export const KLineChart: React.FC<KLineChartProps> = ({ stock, data }) => {
  const chartRef = useRef<ReactECharts>(null);

  // 计算MA指标
  const calculateMA = (dayCount: number) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  };

  const dates = data.map(d => d.date);
  const values = data.map(d => [d.open, d.close, d.low, d.high]);
  const volumes = data.map(d => [d.volume, d.open <= d.close ? 1 : -1]);
  const ma5 = calculateMA(5);
  const ma20 = calculateMA(20);

  const option = {
    backgroundColor: '#161b22',
    title: {
      text: `${stock.name} (${stock.code})`,
      left: 'center',
      textStyle: {
        color: '#f0f6fc',
        fontSize: 16,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: '#0d1117',
      borderColor: '#30363d',
      textStyle: {
        color: '#f0f6fc'
      }
    },
    legend: {
      data: ['K线', 'MA5', 'MA20'],
      top: 30,
      textStyle: {
        color: '#8b949e'
      }
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        top: 80,
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '70%',
        height: '15%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { color: '#8b949e', fontSize: 10 },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 1,
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']
          }
        },
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { color: '#8b949e', fontSize: 10 },
        splitLine: { lineStyle: { color: '#21262d' } }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: Math.max(0, 100 - (100 / data.length) * 100),
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        bottom: 10,
        start: Math.max(0, 100 - (100 / data.length) * 100),
        end: 100,
        height: 20,
        borderColor: '#30363d',
        backgroundColor: '#0d1117',
        fillerColor: 'rgba(88, 166, 255, 0.2)',
        handleStyle: {
          color: '#30363d',
          borderColor: '#8b949e'
        },
        textStyle: {
          color: '#8b949e',
          fontSize: 10
        }
      }
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: '#3fb950',
          color0: '#f85149',
          borderColor: '#3fb950',
          borderColor0: '#f85149'
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: ma5,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#58a6ff',
          opacity: 0.7
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: ma20,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#f0883e',
          opacity: 0.7
        }
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes.map((v, i) => ({
          value: v[0],
          itemStyle: {
            color: values[i][1] >= values[i][0] ? '#3fb950' : '#f85149',
            opacity: 0.5
          }
        }))
      }
    ]
  };

  return (
    <div style={styles.container}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        notMerge={true}
      />
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    minHeight: 0,
    background: '#161b22',
    borderRadius: '16px',
    border: '1px solid #30363d',
    overflow: 'hidden'
  }
};
