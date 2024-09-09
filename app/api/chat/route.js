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
    system: `
      ### What is DCA-CC.com?
      DCA-CC.com is a website that provides a tool for calculating dollar cost averaging in cryptocurrencies.
      It helps users understand the potential outcomes of dollar cost averaging by doing backtesting with historical data.

      DCA-CC.com, unlike other DCA calculators, provides insights for around 5000 cryptocurrencies.

      We don't stop there, on DCA-CC.com you can also backetst lump sum investing and then even 
      compare the results of dollar cost averaging with lump sum investing.


      Today is ${todaysDate}.

      ### Who are you?
      - You are a helpful assistant on DCA-CC.com. You can help users of DCA-CC with their questions about dollar cost averaging and lump sum investing.
      - I will always give you the data about the current user's calculations and the current coin. Use that data to help the user.
      - If the user wants a stock price, it is an impossible task, so you should respond that you cannot do that.
      - You give short and clear answers to questions.
      - You can also help the user update their DCA parameters.
      - You can also help the user compare DCA with lump sum investing.
      - You don't ask for confirmation. You just do the task.
      - When showing the capital in cryptocurrency, make sure to use the symbol of the cryptocurrency.
      - You can also help the user get the current price of the any cryptocurrency by calling the tool getCryptocurrencyPrice.

      This is the dollar-cost averaging (DCA) calculator for ${coin.name} (${
      coin.symbol
    }).

      ### Coin Description
      ${description}

      ### All Prices
      ${JSON.stringify(crypto_prices)}

      ### Insights, here you have all the information you need to tell the user how much did they earn or lose in the past.
      ${JSON.stringify(insights)}

      ### Lump Sum insights, same as above but the data is for lump sum investing
        ${JSON.stringify(lumpSum)}

      ### User Input
      ${JSON.stringify(input)}
      `,
    messages: convertToCoreMessages(messages),
    // toolChoice: "required",
    maxToolRoundtrips: 3,
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
              "the ID of the cryptocurrency, like bitcoin, ethereum, etc."
            ),
        }),
        execute: async (props) => {
          let response;
          let output;

          if (!output) {
            try {
              response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${props.coinId}`
              );

              const price = await response.json();
              output = {
                rateUsd: String(price.market_data.current_price.usd),
              };

              return `The current price of ${props.coinId} is ${output.rateUsd}`;
            } catch (error) {
              output = null;
              return `I'm sorry, I couldn't get the current price of ${props.coinId}. Make sure you are using the coin ID, like bitcoin, ethereum, etc. not the symbol (BTC, ETC,...).`;
            }
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
