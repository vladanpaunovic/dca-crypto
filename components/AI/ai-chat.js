import { Block } from "@tremor/react";
import { useChat } from "ai/react";
import { useAppState } from "../../src/store/store";
import { ACTIONS } from "../Context/mainReducer";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import React from "react";
import {
  PaperAirplaneIcon,
  SwitchHorizontalIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { usePlausible } from "next-plausible";
import Upgrade from "../Upgrade/upgrade";

const RestrictedAccessToUnpaidUsers = () => {
  return <Upgrade />;
};

const UserIcon = () => {
  const session = useSession();
  return (
    <div className="flex items-center justify-end">
      <span className="font-medium text-sm text-gray-900">You</span>
      <div className="h-8 w-8 rounded-full ml-1">
        {session?.user?.image ? (
          <Image
            width={32}
            height={32}
            alt={session.user.email}
            src={session.user.image}
            className="rounded-full"
          />
        ) : (
          <UserCircleIcon />
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
}) => {
  return (
    <div>
      <div>
        <div>
          <div className="flex font-medium items-center w-60">
            <div className="px-1 flex">
              <span className="text-lg  text-indigo-700 transform rotate-45 font-bold">
                <SwitchHorizontalIcon className="w-4 h-4" />
              </span>
            </div>
            <span className="font-medium text-sm text-gray-900">
              DCA Cryptocurrency
            </span>
          </div>
        </div>
        <p>
          <div className="bg-white max-w-3xl rounded-lg p-4 border">
            <div>
              New parameters are:
              {JSON.stringify(
                { dateFrom, dateTo, investmentInterval, investment },
                null,
                2
              )}
            </div>
          </div>
        </p>
      </div>
    </div>
  );
};

function AiChatInner() {
  const store = useAppState();
  const messagesEndRef = useRef(null);
  const previousMessages = store.messages || [];
  const plausible = usePlausible();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
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
      onFinish: (messages) => {
        plausible("ai_chat_message");
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

  useEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [messagesString]);

  useEffect(() => {
    store.dispatch({
      type: ACTIONS.UPDATE_MESSAGES,
      payload: messages,
    });
  }, [messagesString]);

  return (
    <Block>
      <div className="flex relative border rounded-lg flex-col w-full h-full mx-auto stretch overflow-auto">
        <div
          className="space-y-4 p-3 overflow-auto h-[calc(100vh-540px)] md:h-[calc(100vh-330px)]"
          ref={messagesEndRef}
        >
          {previousMessages.map((m) => {
            if (m.content.length === 0) {
              return null;
            }

            return (
              <div
                key={m.id}
                className={`whitespace-pre-wrap flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div>
                  <div>
                    {m.role === "user" ? (
                      <UserIcon />
                    ) : (
                      <div className="flex font-medium items-center w-60">
                        <div className="px-1 flex">
                          <span className="text-lg  text-indigo-700 transform rotate-45 font-bold">
                            <SwitchHorizontalIcon className="w-4 h-4" />
                          </span>
                        </div>
                        <span className="font-medium text-sm text-gray-900">
                          DCA Cryptocurrency
                        </span>
                      </div>
                    )}
                  </div>
                  <p>
                    <div className="bg-white max-w-3xl rounded-lg p-4 border">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.toolInvocations?.map((toolInvocation) => {
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
                        if ("result" in toolInvocation) {
                          return null;
                        }
                        return <div key={toolCallId}>Getting the price...</div>;
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
                    })}
                  </p>
                  <div ref={messagesEndRef} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-14" />

        <div className="absolute inset-x-2 bottom-2">
          {isLoading && (
            <div className="text-center">Awaiting the answer...</div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-gray-900 rounded-md text-white p-2 hover:opacity-80 transition ml-2 flex items-center"
            >
              Send
              <PaperAirplaneIcon className="w-4 h-4 ml-1 transform rotate-90" />
            </button>
          </form>
        </div>
      </div>
    </Block>
  );
}

export default function AiChat() {
  const session = useSession();

  const hasSubscription = session.data?.user?.hasActivePackage;

  if (hasSubscription) {
    return <AiChatInner />;
  }

  return <RestrictedAccessToUnpaidUsers />;
}
