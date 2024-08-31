"use client";

import { useState } from "react";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "../SessionProvider";
import useDebounce from "@/hooks/useDebounce";
import { UserResponse } from "stream-chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  Dice1,
  LoaderCircle,
  SearchIcon,
  XIcon,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

interface NewChatModalProps {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

export default function NewChatModal({
  onOpenChange,
  onChatCreated,
}: NewChatModalProps) {
  const { client, setActiveChannel } = useChatContext();

  const { toast } = useToast();

  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounced = useDebounce(searchInput);

  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", searchInputDebounced],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(searchInputDebounced
            ? {
                $or: [
                  { name: { $autocomplete: searchInputDebounced } },
                  { username: { $autocomplete: searchInputDebounced } },
                ],
              }
            : {}),
        },
        { name: 1, image: 1, username: 1 },
        { limit: 15 },
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [...selectedUsers.map((u) => u.id), loggedInUser.id],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ", " +
              selectedUsers.map((u) => u.name).join(", ")
            : undefined,
      });
      await channel.create();
      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: (error) => {
      console.error("Error creating chat: ", error);
      toast({
        description: "Error creating chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="">
      <div className="">
        <Dialog open onOpenChange={onOpenChange}>
          <DialogContent className="bg-card p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>New Chat</DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="group relative flex">
                <SearchIcon className="text-muted-foreground-400 absolute left-4 top-1/2 size-5 -translate-y-1/2 transform group-focus:text-primary" />
                <input
                  placeholder="Search for users..."
                  className="mx-2 h-10 flex-1 rounded-2xl border bg-card pe-4 pl-10 ps-14 focus:border-primary focus:outline-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              {!!selectedUsers.length && (
                <div className="mt-4 flex flex-wrap gap-2 px-2">
                  {selectedUsers.map((user) => (
                    <SelectedUserTag
                      key={user.id}
                      user={user}
                      onRemove={() =>
                        setSelectedUsers((prev) =>
                          prev.filter((u) => u.id !== user.id),
                        )
                      }
                    />
                  ))}
                </div>
              )}
              <Separator className="my-4" />
              <div className="h-96 overflow-y-auto">
                {isSuccess &&
                  data.users.map((user) => (
                    <UserResult
                      key={user.id}
                      user={user}
                      selected={selectedUsers.some((u) => u.id === user.id)}
                      onClick={() => {
                        setSelectedUsers((prev) =>
                          prev.some((u) => u.id === user.id)
                            ? prev.filter((u) => u.id !== user.id)
                            : [...prev, user],
                        );
                      }}
                    />
                  ))}
                {isSuccess && !data.users.length && (
                  <p className="my-2 text-center text-muted-foreground">
                    No users found.
                  </p>
                )}
                {isFetching && <Loader />}
                {isError && (
                  <p className="my-2 text-center text-destructive">
                    Error fetching users.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="px-6 pb-6">
              <Button
                variant="outline"
                disabled={!selectedUsers.length}
                onClick={() => mutation.mutate()}
                className="w-40 border-none bg-gorse-300/70 text-foreground hover:bg-gorse-300/90"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="size-5 animate-spin opacity-90" />
                    Creating...
                  </span>
                ) : (
                  "Start Chat"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

function UserResult({ user, selected, onClick }: UserResultProps) {
  return (
    <button
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground-400 lowercase">
            @{user.username}
          </p>
        </div>
      </div>
      {selected && <CheckIcon className="text-emerald-500" />}
    </button>
  );
}

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="group flex items-center gap-2 rounded-full border border-primary/50 p-1 hover:bg-muted/50"
    >
      <UserAvatar
        avatarUrl={user.image}
        size={24}
        className="transition-transform duration-300 group-hover:-rotate-10"
      />
      <p className="font-bold">{user.name}</p>
      <XIcon className="mx-2 size-5 scale-90 text-muted-foreground/70 transition-all duration-300 group-hover:scale-100 group-hover:text-muted-foreground" />
    </button>
  );
}
