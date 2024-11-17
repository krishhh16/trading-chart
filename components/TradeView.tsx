"use client";
import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

function TradeView() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChart = async () => { 
        if (!chartRef.current) return;
    
        const firstChart = createChart(chartRef.current, {
          layout: {
            textColor: "white",
            //@ts-ignore
            background: { color: "black" },
        },
        grid: {
            horzLines: {
                visible: false
            },
            vertLines: {
                visible: false
            }
        }
        });
    
        const candlestickSeries = firstChart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
          wickVisible: false
        });
    
        const response = await fetch('https://frontend-api-2.pump.fun/candlesticks/8TBYkVWEE4fW5qQoV9xAPowM35qxBLsfuuo4YMVipump?offset=0&limit=1000&timeframe=5');
        const data = await response.json();
    
        const series = data.map((candle: any) => {
            return {
                time: candle.timestamp,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close
            }
        })
        
        candlestickSeries.setData(series as any);
        firstChart.timeScale().fitContent();

    }

    initChart();

  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}

export default TradeView;
