import { useCallback, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { MessageCirclePlus, X } from "lucide-react";

import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewChatModal from "./NewChatModal";
import { set } from "date-fns";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ presence: true, state: true, limit: 10 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: { filters: { members: { $in: [user.id] } } },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [openNewChatModal, setOpenNewChatModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-2 pl-4 md:pl-2">
        <h1 className="text-left font-bold md:ms-2">Messages</h1>
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenNewChatModal(true)}
            title="Start new chat"
          >
            <MessageCirclePlus className="size-6" strokeWidth={1.9} />
          </Button>
          <div className="h-full md:hidden">
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      {openNewChatModal && (
        <NewChatModal
          onOpenChange={setOpenNewChatModal}
          onChatCreated={() => {
            setOpenNewChatModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
