"use client";

import { useState } from "react";

import { UserData } from "@/lib/types";
import { Button } from "./ui/button";
import { PencilLineIcon } from "lucide-react";
import EditProfileModal from "./modals/EditProfileModal";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [openEditProfileModal, setEditProfileModal] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="link"
        onClick={() => setEditProfileModal(true)}
      >
        <span className="">Edit Profile</span>
        <PencilLineIcon className="size-4 ml-2" />
      </Button>
      <EditProfileModal
        user={user}
        open={openEditProfileModal}
        onOpenChange={setEditProfileModal}
      />
    </>
  );
}
