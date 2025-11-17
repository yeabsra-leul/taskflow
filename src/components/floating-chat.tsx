"use client";


import { BotMessageSquare, MessageCircle } from "lucide-react";
import Chat from "@/components/chat";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function FloatingChat() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="
          fixed bottom-6 right-6 z-50
          h-14 w-14 rounded-full shadow-lg
          bg-primary/80 hover:bg-primary text-white flex items-center justify-center
        transition cursor-pointer
        "
          >
            <BotMessageSquare className="h-7 w-7" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="
            p-0 overflow-hidden
            rounded-xl shadow-2xl
            h-90 w-90 md:h-96 md:w-96 border border-gray-300 mr-4 md:mr-1
          "
        >
          <Chat />
        </PopoverContent>
      </Popover>
    </>
  );
}
