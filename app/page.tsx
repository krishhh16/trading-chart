'use client'

import ApexCharts from 'apexcharts'
import { useEffect, useState } from 'react';
import Charts from "react-apexcharts"
// {"mint":"8TBYkVWEE4fW5qQoV9xAPowM35qxBLsfuuo4YMVipump",
//   "timestamp":1731726600,
//   "open":2.7957999999999998e-8,
//   "high":3.243044734389558e-8,
//   "low":2.7957999999999998e-8,
//   "close":3.004690897890957e-8,
//   "volume":4619999999,
//   "slot":301665310,
//   "is_5_min":true,
//   "is_1_min":true}

interface CandleData {
  mint: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  slot: number;
  is_5_min: boolean;
  is_1_min: boolean;
}

export default function Home() {

  const [candles, setCandles] = useState<any | null>([]);




  let something2 = {
    options: {
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
      legend: {
        show: false
      }
    },
    series: [{
      data: [
        [1538856000000, [6593.34, 6600, 6582.63, 6600]], 
        [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
      ]
    }],
    
 
  };

  useEffect(() => {
    const fetchCandles = async () => {
      const response = await fetch('https://frontend-api-2.pump.fun/candlesticks/8TBYkVWEE4fW5qQoV9xAPowM35qxBLsfuuo4YMVipump?offset=0&limit=1000&timeframe=5');
      const data = await response.json();

      const series = data.map((candle: CandleData) => {
        return [candle.timestamp, [candle.open, candle.high, candle.low, candle.close]]
      })
      const seriesData = [{
        data: series
      }]

      setCandles(seriesData);
    }
    fetchCandles();
  })

  return (
    <div className="w-full h-full">
      {
        candles && (
          <div className="w-full h-full">
            <Charts
              options={something2.options}
          series={candles}
          type="candlestick"
          width="1400"
  
        />
      </div>
        )
      }

    </div>

  );
}
