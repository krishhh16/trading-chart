'use client'

import TradeView from "@/components/TradeView";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

export interface Data {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function page() {

  const params = useParams<{ market: string, mint: string }>(); 
  const [data, setData] = useState<Data[] | null>(null);
  useEffect(() => {

    async function getdata() {
        console.log(params.market, params.mint);
        let link: string = '';
        if (params.market === "SOL") {
            link = `https://frontend-api-2.pump.fun/candlesticks/${params.mint}?offset=0&limit=1000&timeframe=5`;
        } else if (params.market === "ETH") {
            link = `https://api.geckoterminal.com/api/v2/networks/eth/pools/${params.mint}/ohlcv/day`;
        }
        const data = await getData(link, params.market as "ETH" | "SOL" | "BTC");
        console.log("data", data);
        setData(data);
    }

    getdata();

  },[])

  return (
    <div>
      {
        data && (
          <TradeView data={data} />
        )
      }
    </div>
  )
}

export default page

const getData = async(link: string, from: "ETH" | "SOL" | "BTC"): Promise<Data[]> => {
    let response: Response;
    let data: any;
    try { 
        response = await fetch(link);
        data = await response.json();
    } catch (error) {
        console.error("Error fetching OHLC data:", error);
        return [];
    }
      
    if (from === "ETH") {
      try {
        
        let ohclo = data.data.attributes.ohlcv_list;

        let returnData = ohclo.map((ohlc: any) => {
          return {
            time: ohlc[0],
            open: ohlc[1],
            high: ohlc[2],
            low: ohlc[3],
            close: ohlc[4],
          }
        }).sort((a: any, b: any) => a.time - b.time);

        console.log("returnData", returnData);  

        

        return returnData;

      } catch (error) {
        console.error("Error fetching OHLC data:", error);
        return [];
      }
    }

    if (from === "SOL") {
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

      return series;
    }

    return [];
}
