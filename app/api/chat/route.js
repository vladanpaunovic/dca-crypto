import { openai } from "@ai-sdk/openai";
import { streamText, tool, convertToCoreMessages } from "ai";
import * as z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const {
    messages,
    crypto_prices,
    description,
    coin,
    lumpSum,
    insights,
    input,
  } = await req.json();

  const todaysDate = new Date().toLocaleDateString("en-GB");

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    stream: true,
    system: `
      ### About DCA-CC.com
      I'm your crypto investment assistant at DCA-CC.com, specializing in dollar-cost averaging (DCA) and lump sum investment analysis. I can help you:
      • Calculate and compare DCA vs lump sum strategies
      • Analyze historical performance for 5000+ cryptocurrencies
      • Get real-time crypto prices
      • Adjust your investment parameters
      
      Today's date: ${todaysDate}

      ### Current Analysis
      You're currently analyzing ${coin.name} (${coin.symbol}).

      ### How I Can Help
      • Explain your investment results and provide insights
      • Update your investment parameters (frequency, amount, dates) - calling the tool updateParameters
      • Compare DCA vs lump sum performance
      • Get any cryptocurrency prices - calling the tool getCryptocurrencyPrice
      • Explain DCA and investment concepts
      
      Note: While I can help with crypto investments, I cannot provide stock market data or financial advice.

      ### Technical Context
      ${description}

      ### Additional Features
      • Get detailed market statistics (market cap, 24h volume, ATH) - calling the tool getMarketStats
      • View risk metrics and market sentiment
      
      ### Data Sources
      • Price data: CoinGecko API
      • Market statistics: Updated every 5 minutes
      • Historical data: Daily close prices

      ### Response Guidelines
      IMPORTANT: Never provide both a tool response and a text message together.
      
      1. For data requests, ONLY use tools:
         • Current price → ONLY use getCryptocurrencyPrice
         • Market stats → ONLY use getMarketStats
         • Parameter updates → ONLY use updateParameters
      
      2. For explanations and analysis, ONLY provide text responses:
         • Explaining concepts
         • Analyzing results
         • Answering general questions
         
      3. Never summarize or explain tool responses in text - let the UI components handle the display.

      Examples:
      ❌ Wrong: Call getCryptocurrencyPrice AND explain the price
      ✅ Right: Only call getCryptocurrencyPrice
      
      ❌ Wrong: Call updateParameters AND confirm the changes
      ✅ Right: Only call updateParameters
      
      ❌ Wrong: Call getMarketStats AND provide market analysis
      ✅ Right: Only call getMarketStats

      ### Available Data
      • Historical Prices: ${JSON.stringify(crypto_prices)}
      • DCA Insights: ${JSON.stringify(insights)}
      • Lump Sum Data: ${JSON.stringify(lumpSum)}
      • Current Parameters: ${JSON.stringify(input)}
    `,
    messages: convertToCoreMessages(messages),
    toolChoice: "auto",

    maxToolRoundtrips: 0,
    tools: {
      updateParameters: tool({
        description: `Update the parameters for the DCA calculation. You can update all parameters except the coin ID.
        Please, notify the user that you can't change the coin ID. They have to change the coin ID manually.
        `,
        parameters: z.object({
          dateFrom: z
            .string()
            .optional()
            .describe(
              "date in YYYY-MM-DD format from which the DCA should start"
            ),
          dateTo: z
            .string()
            .optional()
            .describe(
              "date in YYYY-MM-DD format until which the DCA should run"
            ),

          investmentInterval: z
            .enum(["1", "7", "14", "30"])
            .optional()
            .describe(
              "number of days between each investment. Limit this to 1, 7, 14 or 30 days"
            ),
          investment: z
            .number()
            .optional()
            .describe("amount in USD to invest at each interval"),
        }),
        execute: async (props) => props,
      }),
      getCryptocurrencyPrice: tool({
        description: `Get the current price of the selected cryptocurrency. You can use this tool to get the current price of the selected cryptocurrency.`,
        parameters: z.object({
          coinId: z
            .string()
            .describe(
              "the ID of the cryptocurrency, like bitcoin, ethereum, etc. Make sure you are using the coin ID, not the symbol (BTC, ETC,...)."
            ),
        }),
        execute: async (props) => {
          try {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/coins/${props.coinId}`
            );
            const price = await response.json();
            return {
              rateUsd: String(price.market_data.current_price.usd),
              symbol: price.symbol,
              image: price.image.small,
            };
          } catch (error) {
            return null;
          }
        },
      }),
      getMarketStats: tool({
        description: "Get market statistics for the selected cryptocurrency",
        parameters: z.object({
          coinId: z.string().describe("the ID of the cryptocurrency"),
        }),
        execute: async (props) => {
          try {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/coins/${props.coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
            );
            const data = await response.json();
            return {
              marketCap: data.market_data.market_cap.usd,
              volume24h: data.market_data.total_volume.usd,
              priceChange24h: data.market_data.price_change_percentage_24h,
              athPrice: data.market_data.ath.usd,
              athDate: data.market_data.ath_date.usd,
            };
          } catch (error) {
            return null;
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
