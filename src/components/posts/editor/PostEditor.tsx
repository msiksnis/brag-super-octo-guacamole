"use client";

import { useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { ImageIcon, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitPostMutation } from "./submitPostMutation";
import useMediaUpload, { Attachment } from "@/hooks/useMediaUpload";
import { cn } from "@/lib/utils";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-braggin'?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      }
    );
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];

    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm @container">
      <div className="flex gap-4">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={60}
          className="hidden @sm:inline ring-1 ring-muted-foreground ring-offset-2 ring-offset-accent hover:-rotate-10 transition-transform duration-300"
        />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "w-full min-h-[42px] max-h-[20rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border shadow-sm",
              isDragActive && "border border-foreground"
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex justify-between items-center gap-4">
        <div className="flax items-center space-x-4">
          <AddAttachmentsButton
            onFilesSelected={startUpload}
            disabled={isUploading || attachments.length >= 8}
            isUploading={isUploading}
            uploadProgress={uploadProgress || 0}
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={(!input.trim() && !attachments.length) || isUploading}
          size="sm"
          className="bg-gorse-300 hover:bg-gorse-400 dark:text-background text-foreground min-w-40"
        >
          {mutation.isPending ? (
            <div className="flex whitespace-nowrap items-center">
              <LoaderCircle className="animate-spin size-5 mr-2" />
              Posting...
            </div>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
  isUploading: boolean;
  uploadProgress: number;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
  isUploading,
  uploadProgress,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled}
        className="min-w-32 justify-start bg-muted hover:bg-muted/70"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
        <span className="ml-2">
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <LoaderCircle className="animate-spin size-5" />
              <span>{uploadProgress}%</span>
            </div>
          ) : (
            "Add media"
          )}
        </span>
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video
          controls
          autoPlay
          loop
          className="size-fit max-h-[30rem] rounded-2xl"
        >
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
