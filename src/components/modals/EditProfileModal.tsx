import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";

import { useUpdateProfileMutation } from "@/app/(main)/mutations/useUpdateProfileMutation";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { Button } from "../ui/button";
import CropImageModal from "./CropImageModal";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const mutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateUserProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    mutation.mutate(
      { values, avatar: newAvatarFile },
      {
        onSuccess: () => {
          setCroppedAvatar(null), onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar) // This generates a new URL for the cropped image (blob) so it can be displayed in the UI
                : user.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <div className="h-[5.5rem]">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your display name"
                        {...field}
                        className={cn(
                          "!mt-1 border !border-border focus-visible:ring-1 focus-visible:ring-offset-0",
                          {
                            "border !border-pink-500 focus-visible:ring-1 focus-visible:ring-pink-500":
                              form.formState.errors.displayName,
                          }
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-right !mt-1 text-xs font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="h-[8rem]">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell everyone a little more how awesome you are!"
                        {...field}
                        className={cn(
                          "!mt-1 border !border-border focus-visible:ring-1 focus-visible:ring-offset-0 resize-none",
                          {
                            "border !border-pink-500 focus-visible:ring-1 focus-visible:ring-pink-500":
                              form.formState.errors.bio,
                          }
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-right !mt-1 text-xs font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                disabled={mutation.isPending}
                size="sm"
                className="bg-gorse-300 hover:bg-gorse-400 dark:text-background text-foreground min-w-40"
              >
                {mutation.isPending ? (
                  <div className="flex whitespace-nowrap items-center">
                    <LoaderCircle className="animate-spin size-5 mr-2" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file"
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="hidden sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group flex items-end"
      >
        <Image
          src={src}
          alt="Selected avatar"
          width={150}
          height={150}
          className="size-32 flex-none object-cover rounded-full"
        />
        <span className="p-2 group-hover:underline underline-offset-2">
          Change Avatar
        </span>
      </button>
      {imageToCrop && (
        <CropImageModal
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
