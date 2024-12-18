
import TradeView from "@/components/TradeView";

interface Data {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function page() {

  


  return (
    <div>
      <TradeView />
    </div>
  )
}

export default page

const getData = async(link: string, from: "ETH" | "SOL" | "BTC"): Promise<Data[]> => {
    const response = await fetch(link);
    const data = await response.json();

    if (from === "ETH") {
      try {
        const response = await fetch(link);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        // Available intervals in the API response
        const intervals = [
          "last_3600_s", // 1 hour
          "last_7200_s", // 2 hours
          "last_10800_s", // 3 hours
          "last_14400_s", // 4 hours
        ];
    
        const ohlcData: Data[] = [];
    
        for (const interval of intervals) {
          const intervalData = data?.data?.attributes?.price_change_data?.[interval]?.prices;
          const volumeData = data?.data?.attributes?.volume_data?.[interval];
    
          if (intervalData && volumeData) {
            ohlcData.push({
              open: parseFloat(intervalData.base_token_start_price_in_usd),
              high: parseFloat(intervalData.base_token_high_price_in_usd),
              low: parseFloat(intervalData.base_token_low_price_in_usd),
              close: parseFloat(intervalData.base_token_last_price_in_usd),
              time: intervalData.base_token_low_price_timestamp, // Use low price timestamp as a reference
            });
          }
        }
    
        return ohlcData;
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

    return data;
}
