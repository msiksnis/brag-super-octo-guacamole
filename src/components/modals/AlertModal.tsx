"use client";

import { PostData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { useDeletePostMutation } from "../../app/(main)/mutations/useDeletePostMutation";

interface AlertModalProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function AlertModal({ post, open, onClose }: AlertModalProps) {
  const mutation = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">
            Are you sure you want to delete this post?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex space-x-2 w-full">
            <Button
              onClick={onClose}
              disabled={mutation.isPending}
              variant="secondary"
              size="sm"
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
              size="sm"
              className="w-1/2 bg-red-500 hover:bg-red-400"
            >
              {mutation.isPending ? (
                <div className="flex items-center">
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
