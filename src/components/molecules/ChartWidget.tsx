"use client";

import { useEffect, useRef } from "react";
import { WidgetContainer } from "@/components/atoms/WidgetContainer";
import * as echarts from "echarts";

interface ChartDataPoint {
  name: string;
  value: number | string;
  date?: string;
}

interface ChartWidgetProps {
  id: string;
  title: string;
  data: ChartDataPoint[] | { [key: string]: unknown };
  chartType: "bar" | "pie" | "line" | "timeline";
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function ChartWidget({
  id,
  title,
  data,
  chartType,
  editable = true,
  onEdit,
  onRemove,
}: ChartWidgetProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    const getChartOption = () => {
      const colors = ["#EA580C", "#22C55E", "#0EA5E9", "#F59E0B", "#EF4444"];

      switch (chartType) {
        case "pie":
          return {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            color: colors,
            series: [
              {
                name: title,
                type: "pie",
                radius: ["40%", "70%"],
                center: ["50%", "50%"],
                data: Array.isArray(data)
                  ? data
                  : Object.entries(data).map(([name, value]) => ({
                      name,
                      value,
                    })),
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
                label: {
                  fontSize: 12,
                },
              },
            ],
          };

        case "bar":
          const barData = Array.isArray(data)
            ? data
            : Object.entries(data).map(([name, value]) => ({ name, value }));
          return {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
            },
            color: colors,
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              data: barData.map((item) => item.name),
              axisLabel: {
                fontSize: 11,
              },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                fontSize: 11,
              },
            },
            series: [
              {
                name: title,
                type: "bar",
                data: barData.map((item) => item.value),
                itemStyle: {
                  borderRadius: [4, 4, 0, 0],
                },
              },
            ],
          };

        case "line":
          const lineData = Array.isArray(data)
            ? data
            : Object.entries(data).map(([name, value]) => ({ name, value }));
          return {
            tooltip: {
              trigger: "axis",
            },
            color: colors,
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: lineData.map((item) => item.name),
              axisLabel: {
                fontSize: 11,
              },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                fontSize: 11,
              },
            },
            series: [
              {
                name: title,
                type: "line",
                stack: "Total",
                smooth: true,
                data: lineData.map((item) => item.value),
                areaStyle: {
                  opacity: 0.3,
                },
              },
            ],
          };

        case "timeline":
          const timelineData = Array.isArray(data) ? data : [];
          return {
            tooltip: {
              trigger: "axis",
              formatter: (params: unknown[]) => {
                const param = params[0] as {
                  name: string;
                  value: string | number;
                };
                return `${param.name}<br/>${param.value}`;
              },
            },
            color: colors,
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "time",
              axisLabel: {
                fontSize: 11,
                formatter: (value: number) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                },
              },
            },
            yAxis: {
              type: "category",
              data: timelineData.map((item) => item.name),
              axisLabel: {
                fontSize: 11,
              },
            },
            series: [
              {
                name: title,
                type: "scatter",
                symbolSize: 8,
                data: timelineData.map((item) => [
                  item.date || item.name,
                  item.name,
                ]),
              },
            ],
          };

        default:
          return {};
      }
    };

    const option = getChartOption();
    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data, chartType, title]);

  // Resize chart when container changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <WidgetContainer
      id={id}
      title={title}
      editable={editable}
      onEdit={onEdit}
      onRemove={onRemove}
    >
      <div
        ref={chartRef}
        className="w-full h-64"
        style={{ minHeight: "200px" }}
      />
    </WidgetContainer>
  );
}
