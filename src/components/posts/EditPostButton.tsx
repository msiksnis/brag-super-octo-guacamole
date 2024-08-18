"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";

import { PostData } from "@/lib/types";
import { Button } from "../ui/button";
import AlertModal from "../modals/AlertModal";

interface EditPostButtonProps {
  post: PostData;
  className?: string;
}

export default function EditPostButton({
  post,
  className,
}: EditPostButtonProps) {
  const [openAlertModal, setOpenAlertModal] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="flex rounded-full size-6 hover:bg-emerald-50"
        onClick={() => setOpenAlertModal(true)}
      >
        <PencilIcon className="size-6 p-1 text-emerald-500" />
      </Button>
      <AlertModal
        post={post}
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
      />
    </>
  );
}
