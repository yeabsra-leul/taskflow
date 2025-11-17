"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import LoaderDots from "./ui/loader-dots";

export default function Chat() {
  const [input, setInput] = useState("");
  const [currentMessageId, setCurrentMessageId] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-full">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Ask your question about TaskFlow!"
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "assistant" ? (
                    (isLoading && message.id === messages[messages.length - 1]?.id) ? (
                      <LoaderDots />
                    ) : (
                      <MessageResponse>
                        {message.parts
                          ?.filter((part) => part.type === "text")
                          .map((part) => part.text)
                          .join("")}
                      </MessageResponse>
                    )
                  ) : (
                    message.parts?.map((part) => (part.type === "text" ? part.text : null))
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text) {
              sendMessage({ text: message.text });
              setInput("");
            }
          }}
          className="max-w-3xl mx-auto flex gap-2 items-end"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="flex-1"
          />
          <PromptInputSubmit disabled={isLoading} className="mr-2" />
        </PromptInput>
      </div>
    </div>
  );
}
