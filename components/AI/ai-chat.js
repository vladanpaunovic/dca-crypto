import { Block } from "@tremor/react";
import { useChat } from "ai/react";
import { useAppState } from "../../src/store/store";
import { ACTIONS } from "../Context/mainReducer";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import React from "react";
import {
  SwitchHorizontalIcon,
  UserCircleIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { SparklesIcon } from "@heroicons/react/solid";
import { format } from "date-fns";

const UserIcon = () => {
  const session = useSession();
  return (
    <div className="flex items-center justify-end mb-1">
      <span className="font-medium text-sm text-gray-900 mr-2">You</span>
      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-100">
        {session?.user?.image ? (
          <Image
            width={32}
            height={32}
            alt={session.user.email}
            src={session.user.image}
            className="rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="text-gray-600" />
        )}
      </div>
    </div>
  );
};

const ChangedParameters = ({
  dateFrom,
  dateTo,
  investmentInterval,
  investment,
}) => (
  <div className="mt-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm">
    <div className="flex items-center mb-3">
      <div className="p-1.5 bg-indigo-100 rounded-full">
        <AdjustmentsIcon className="w-4 h-4 text-indigo-600" />
      </div>
      <span className="font-medium text-sm text-indigo-900 ml-2">
        Parameters Updated
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">From</div>
        <div className="text-sm text-gray-900">
          {dateFrom ? new Date(dateFrom).toLocaleDateString() : "—"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">To</div>
        <div className="text-sm text-gray-900">
          {dateTo ? new Date(dateTo).toLocaleDateString() : "—"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">Interval</div>
        <div className="text-sm text-gray-900">
          {investmentInterval ? `Every ${investmentInterval} days` : "—"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">Investment</div>
        <div className="text-sm text-gray-900">
          {investment ? `$${investment.toLocaleString()}` : "—"}
        </div>
      </div>
    </div>
  </div>
);

const CryptoPriceDisplay = ({ rateUsd, symbol, image }) => {
  // If no result yet, show loading state
  if (!rateUsd || !symbol || !image) {
    return (
      <div className="mt-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm animate-pulse">
        <div className="flex items-center">
          <div className="p-1.5 bg-indigo-100 rounded-full">
            <SparklesIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-medium text-sm text-indigo-900 ml-2">
            Fetching current price...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm">
      <div className="flex items-center mb-3">
        {image ? (
          <div className="p-1.5 bg-indigo-100 rounded-full">
            <Image
              src={image}
              alt={`${symbol} icon`}
              width={16}
              height={16}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="p-1.5 bg-indigo-100 rounded-full">
            <SparklesIcon className="w-4 h-4 text-indigo-600" />
          </div>
        )}
        <span className="font-medium text-sm text-indigo-900 ml-2">
          <span className="font-semibold uppercase">{symbol}</span> Price
        </span>
      </div>

      <div className="flex items-baseline">
        <div className="text-2xl font-semibold text-gray-900">
          $
          {parseFloat(rateUsd).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="ml-2 text-sm text-gray-500">
          per <span className="font-semibold uppercase">{symbol}</span>
        </div>
      </div>
    </div>
  );
};

const MarketStatsDisplay = ({ result }) => {
  // If no result yet, show loading state
  if (!result) {
    return (
      <div className="mt-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm animate-pulse">
        <div className="flex items-center">
          <div className="p-1.5 bg-indigo-100 rounded-full">
            <SparklesIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-medium text-sm text-indigo-900 ml-2">
            Fetching market stats...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="p-1.5 bg-indigo-100 rounded-full">
          <SparklesIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <span className="font-medium text-sm text-indigo-900 ml-2">
          Market Stats
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="text-xs font-medium text-gray-500 capitalize">
              {key.replace(/_/g, " ")}
            </div>
            <div className="text-sm text-gray-900">
              {typeof value === "number"
                ? key.includes("price") || key.includes("cap")
                  ? `$${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : key.includes("percentage") || key.includes("change")
                  ? `${value.toFixed(2)}%`
                  : value.toLocaleString()
                : value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg w-16">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

export default function AiChat() {
  const messagesContainerRef = useRef(null);
  const store = useAppState();
  const previousMessages = store.messages || [];

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    completion,
  } = useChat({
    body: {
      crypto_prices: store.chart.dca.chartData,
      insights: store.chart.dca.insights,
      lumpSum: store.chart.lumpSum.insights,
      coin: {
        name: store.currentCoin.coinId,
        symbol: store.currentCoin.symbol,
        description: store.currentCoin.description,
      },
      input: store.input,
    },

    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "updateParameters") {
        const payload = {
          ...store.input,
          ...toolCall.args,
        };

        store.dispatch({
          type: ACTIONS.UPDATE_ALL_INPUTS,
          payload,
        });
      }
    },
    initialMessages: previousMessages.length
      ? previousMessages
      : [
          {
            id: "init",
            role: "assistant",
            content: `Hi there! You can use this calculator to interract with the data on this page for ${store.currentCoin.symbol}.`,
          },
        ],
  });

  const messagesString = JSON.stringify(messages);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, completion]);

  useEffect(() => {
    store.dispatch({
      type: ACTIONS.UPDATE_MESSAGES,
      payload: messages,
    });
  }, [messagesString]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Block>
      <div className="flex flex-col h-[calc(100vh-540px)] md:h-[calc(100vh-330px)] border rounded-lg bg-gray-50">
        <div
          ref={messagesContainerRef}
          className="flex-grow space-y-6 p-4 overflow-y-auto scroll-smooth"
        >
          {previousMessages.map((m) => {
            const isLastMessage = m.id === messages[messages.length - 1]?.id;
            const streamedContent =
              isLastMessage && m.role === "assistant"
                ? m.content + (completion || "")
                : m.content;

            if (!streamedContent && m.toolInvocations?.length) {
              return (
                <div
                  key={m.id}
                  className={`whitespace-pre-wrap flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div>
                    {m.role === "user" ? (
                      <UserIcon />
                    ) : (
                      <div className="flex font-medium items-center mb-1">
                        <div className="p-1 bg-indigo-100 rounded-full">
                          <SwitchHorizontalIcon className="w-5 h-5 text-indigo-700" />
                        </div>
                        <span className="font-medium text-sm text-gray-900 ml-2">
                          DCA Cryptocurrency
                        </span>
                      </div>
                    )}
                    {m.toolInvocations.map((toolInvocation) => {
                      const toolCallId = toolInvocation.toolCallId;

                      if (toolInvocation.toolName === "updateParameters") {
                        if ("result" in toolInvocation) {
                          return (
                            <ChangedParameters
                              key={toolCallId}
                              {...toolInvocation.result}
                            />
                          );
                        }
                        return (
                          <div key={toolCallId}>Changing parameters...</div>
                        );
                      }

                      if (
                        toolInvocation.toolName === "getCryptocurrencyPrice"
                      ) {
                        return (
                          <CryptoPriceDisplay
                            key={toolCallId}
                            {...toolInvocation.result}
                          />
                        );
                      }

                      if (toolInvocation.toolName === "getMarketStats") {
                        return (
                          <MarketStatsDisplay
                            key={toolCallId}
                            result={toolInvocation.result}
                          />
                        );
                      }

                      // other tools:
                      return "result" in toolInvocation ? (
                        <div key={toolCallId}>
                          Tool call {`${toolInvocation.toolName}: `}
                        </div>
                      ) : (
                        <div key={toolCallId}>
                          Calling {toolInvocation.toolName}...
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (!streamedContent && !m.toolInvocations?.length) {
              return null;
            }

            return (
              <div
                key={m.id}
                className={`whitespace-pre-wrap flex group mb-4 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%]">
                  <div>
                    {m.role === "user" ? (
                      <UserIcon />
                    ) : (
                      <div className="flex font-medium items-center mb-1">
                        <div className="p-1 bg-indigo-100 rounded-full">
                          <SwitchHorizontalIcon className="w-5 h-5 text-indigo-700" />
                        </div>
                        <span className="font-medium text-sm text-gray-900 ml-2">
                          DCA Cryptocurrency
                        </span>
                      </div>
                    )}
                  </div>
                  {m.toolInvocations?.length > 0
                    ? m.toolInvocations.map((toolInvocation) => {
                        const toolCallId = toolInvocation.toolCallId;

                        if (toolInvocation.toolName === "updateParameters") {
                          if ("result" in toolInvocation) {
                            return (
                              <ChangedParameters
                                key={toolCallId}
                                {...toolInvocation.result}
                              />
                            );
                          }
                          return (
                            <div key={toolCallId}>Changing parameters...</div>
                          );
                        }

                        if (
                          toolInvocation.toolName === "getCryptocurrencyPrice"
                        ) {
                          return (
                            <CryptoPriceDisplay
                              key={toolCallId}
                              result={toolInvocation.result}
                            />
                          );
                        }

                        // other tools:
                        return "result" in toolInvocation ? (
                          <div key={toolCallId}>
                            Tool call {`${toolInvocation.toolName}: `}
                            {toolInvocation.result}
                          </div>
                        ) : (
                          <div key={toolCallId}>
                            Calling {toolInvocation.toolName}...
                          </div>
                        );
                      })
                    : streamedContent && (
                        <div className="bg-white rounded-lg p-4 border shadow-sm">
                          <div className="text-sm space-y-2">
                            <ReactMarkdown className="[&>*]:my-1 [&>h2]:mb-1 [&>h2]:mt-3 first:[&>h2]:mt-0">
                              {streamedContent}
                            </ReactMarkdown>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {format(
                              new Date(m.createdAt || Date.now()),
                              "HH:mm"
                            )}
                          </div>
                        </div>
                      )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-indigo-100 rounded-full">
                <SwitchHorizontalIcon className="w-5 h-5 text-indigo-700" />
              </div>
              <TypingIndicator />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-3 border-t rounded-b-lg bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-center bg-gray-50 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow duration-200">
              <input
                disabled={isLoading}
                className="flex-1 p-3.5 bg-transparent border-0 focus:ring-0 rounded-l-lg"
                value={input}
                placeholder={
                  isLoading
                    ? "Waiting for response..."
                    : "Ask anything about your DCA strategy..."
                }
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-3.5 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                  active:scale-95"
                title="Send message (Ctrl + Enter)"
              >
                {isLoading ? (
                  <SparklesIcon className="w-5 h-5 animate-pulse" />
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 px-1 text-right">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded-md">Ctrl</kbd> +{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded-md">Enter</kbd>{" "}
              to send
            </div>
          </form>
        </div>
      </div>
    </Block>
  );
}
