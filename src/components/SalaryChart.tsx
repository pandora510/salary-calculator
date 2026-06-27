// 薪资图表组件
import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { MonthlySalary } from '../types/salary';
import { BarChart3 } from 'lucide-react';

interface SalaryChartProps {
  data: MonthlySalary[];
}

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export default function SalaryChart({ data }: SalaryChartProps) {
  // 堆叠面积图配置 - 每月薪资构成占比
  const areaOption = {
    title: {
      text: '每月薪资构成趋势',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'cross' as const
      },
      formatter: (params: any) => {
        const month = params[0].axisValue;
        let result = `${month}<br/>`;
        let total = 0;
        params.forEach((param: any) => {
          if (param.value > 0) {
            result += `${param.marker} ${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
            total += param.value;
          }
        });
        result += `<br/><strong>总薪资: ¥${total.toLocaleString()}</strong>`;
        return result;
      }
    },
    legend: {
      data: ['到手金额', '个税', '公积金', '五险'],
      bottom: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: monthNames,
      axisLabel: {
        interval: 0,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter: (value: number) => {
          return value >= 10000 ? (value / 10000).toFixed(1) + '万' : value.toString();
        }
      }
    },
    series: [
      {
        name: '到手金额',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.9)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.3)' }
          ])
        },
        itemStyle: {
          color: '#10b981'
        },
        emphasis: {
          focus: 'series' as const
        },
        data: data.map(item => item.netSalary)
      },
      {
        name: '个税',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.9)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.3)' }
          ])
        },
        itemStyle: {
          color: '#f59e0b'
        },
        emphasis: {
          focus: 'series' as const
        },
        data: data.map(item => item.tax)
      },
      {
        name: '公积金',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 92, 246, 0.9)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.3)' }
          ])
        },
        itemStyle: {
          color: '#8b5cf6'
        },
        emphasis: {
          focus: 'series' as const
        },
        data: data.map(item => item.housingFund)
      },
      {
        name: '五险',
        type: 'line' as const,
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.9)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.3)' }
          ])
        },
        itemStyle: {
          color: '#3b82f6'
        },
        emphasis: {
          focus: 'series' as const
        },
        data: data.map(item => item.socialInsurance)
      }
    ]
  };

  // 堆叠柱状图配置 - 每月薪资收入构成
  const compositionOption = {
    title: {
      text: '每月收入构成',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      },
      formatter: (params: any) => {
        const month = params[0].axisValue;
        let result = `${month}<br/>`;
        let total = 0;
        params.forEach((param: any) => {
          if (param.value > 0) {
            result += `${param.marker} ${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
            total += param.value;
          }
        });
        result += `<br/><strong>总薪资: ¥${total.toLocaleString()}</strong>`;
        return result;
      }
    },
    legend: {
      data: ['基本薪资', '加班费', '年终奖'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: monthNames,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter: (value: number) => {
          return value >= 10000 ? (value / 10000).toFixed(1) + '万' : value.toString();
        }
      }
    },
    series: [
      {
        name: '基本薪资',
        type: 'bar' as const,
        stack: 'income',
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#2563eb' }
          ])
        },
        data: data.map(item => item.baseSalary)
      },
      {
        name: '加班费',
        type: 'bar' as const,
        stack: 'income',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ef4444' },
            { offset: 1, color: '#dc2626' }
          ])
        },
        data: data.map(item => item.overtimePay)
      },
      {
        name: '年终奖',
        type: 'bar' as const,
        stack: 'income',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: '#d97706' }
          ])
        },
        data: data.map(item => item.yearEndBonus)
      }
    ]
  };

  // 柱状图配置 - 全年收入对比
  const barOption = {
    title: {
      text: '全年收入对比',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      },
      formatter: (params: any) => {
        const month = params[0].axisValue;
        let result = `${month}<br/>`;
        params.forEach((param: any) => {
          result += `${param.marker} ${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['总薪资', '到手金额'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: monthNames,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter: (value: number) => {
          return value >= 10000 ? (value / 10000).toFixed(1) + '万' : value.toString();
        }
      }
    },
    series: [
      {
        name: '总薪资',
        type: 'bar' as const,
        barWidth: '35%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#2563eb' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        data: data.map(item => item.totalSalary)
      },
      {
        name: '到手金额',
        type: 'bar' as const,
        barWidth: '35%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        data: data.map(item => item.netSalary)
      }
    ]
  };

  // 判断是否有加班或年终奖
  const hasOvertimeOrBonus = data.some(item => item.overtimePay > 0 || item.yearEndBonus > 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        可视化分析
      </h2>

      <div className="space-y-8">
        {/* 堆叠面积图 - 仅在有加班或年终奖时显示 */}
        {hasOvertimeOrBonus && (
          <div>
            <div className="h-96">
              <EChartComponent option={areaOption} />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              堆叠面积图展示每月薪资构成，不同颜色区域代表各部分占比
            </p>
          </div>
        )}

        {/* 堆叠柱状图 - 仅在有加班或年终奖时显示 */}
        {hasOvertimeOrBonus && (
          <div>
            <div className="h-96">
              <EChartComponent option={compositionOption} />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              基本薪资 + 加班费 + 年终奖 = 当月总薪资
            </p>
          </div>
        )}

        {/* 柱状图 - 全年收入对比 */}
        <div>
          <div className="h-96">
            <EChartComponent option={barOption} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 通用图表组件
function EChartComponent({ option }: { option: echarts.EChartsOption }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(option);
      
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }
  }, [option]);

  return <div ref={chartRef} className="w-full h-full" />;
}
