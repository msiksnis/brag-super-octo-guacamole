"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import { PostData } from "@/lib/types";
import { Button } from "../ui/button";
import AlertModal from "../modals/AlertModal";

interface DeletePostButtonProps {
  post: PostData;
  className?: string;
}

export default function DeletePostButton({
  post,
  className,
}: DeletePostButtonProps) {
  const [openAlertModal, setOpenAlertModal] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="flex rounded-full size-6 hover:bg-red-50"
        onClick={() => setOpenAlertModal(true)}
      >
        <Trash2Icon className="size-6 p-1 text-red-500" />
      </Button>
      <AlertModal
        post={post}
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
      />
    </>
  );
}
