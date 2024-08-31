"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Chat as StreamChat } from "stream-chat-react";

import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";
import Loader from "@/components/loader";

export default function Chat() {
  const chatClient = useInitializeChatClient();

  const { resolvedTheme } = useTheme();

  const [openSidebar, setOpenSidebar] = useState(false);

  if (!chatClient) {
    return <Loader />;
  }

  return (
    <main className="relative mb-20 mt-4 flex w-full overflow-hidden rounded-2xl bg-card py-2 shadow-sm sm:mb-4 sm:mt-8">
      <StreamChat
        client={chatClient}
        theme={
          resolvedTheme === "dark"
            ? "str-chat__theme-dark"
            : "str-chat__theme-light"
        }
      >
        <div className="absolute bottom-0 top-0 flex w-full">
          <ChatSidebar
            open={openSidebar}
            onClose={() => setOpenSidebar(false)}
          />
          <ChatChannel
            open={!openSidebar}
            openSidebar={() => setOpenSidebar(true)}
          />
        </div>
      </StreamChat>
    </main>
  );
}
