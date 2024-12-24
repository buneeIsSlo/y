"use client";

import { useSession } from "@/app/(core)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import LoadingButton from "@/components/ui/loader-button";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useSubmitPostMutation from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Spinner, X } from "@mynaui/icons-react";
import { ClipboardEvent, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDropzone } from "@uploadthing/react";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({ placeholder: "What's on your mind?" }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

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
      },
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar user={user} className="hidden sm:inline md:h-14 md:w-14" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 pb-8 pt-2",
              isDragActive && "outline-dashed outline-primary",
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
      <div className="flex items-center justify-end gap-1">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Spinner className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 4}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="hover:bg-primary/30"
      >
        <ImageIcon size={20} className="text-primary" />
      </Button>
      <input
        type="file"
        multiple
        accept="image/*, video/*"
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
  if (attachments.length === 1) {
    return (
      <div className="relative w-full">
        <AttachmentPreview
          key={attachments[0].file.name}
          attachment={attachments[0]}
          onRemoveClick={() => removeAttachment(attachments[0].file.name)}
        />
      </div>
    );
  }

  if (attachments.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {attachments.map((attachment) => (
          <AttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={() => removeAttachment(attachment.file.name)}
            maintainSquareAspect
          />
        ))}
      </div>
    );
  }

  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        slidesToScroll: 2,
        startIndex: 0,
        containScroll: "trimSnaps",
      }}
    >
      <CarouselContent className="-ml-2">
        {attachments.map((attachment) => (
          <CarouselItem key={attachment.file.name} className="basis-1/2 pl-2">
            <AttachmentPreview
              attachment={attachment}
              onRemoveClick={() => removeAttachment(attachment.file.name)}
              maintainSquareAspect
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
  maintainSquareAspect?: boolean;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
  maintainSquareAspect = false,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div className={cn("relative", isUploading && "opacity-50")}>
      {file.type.startsWith("image") ? (
        <div>
          <Image
            src={src}
            alt="Attachment preview"
            width={0}
            height={0}
            sizes="100vw"
            className={cn(
              "h-auto w-full rounded-2xl",
              maintainSquareAspect && "aspect-square object-cover",
            )}
            unoptimized
          />
        </div>
      ) : (
        <video
          controls
          className={cn(
            "h-auto w-full rounded-2xl object-cover",
            maintainSquareAspect && "aspect-square",
          )}
        >
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute right-3 top-3 rounded-full bg-black/80 p-1.5 text-background transition-colors hover:bg-black/60"
          onClick={onRemoveClick}
        >
          <X size={20} className="text-white" />
        </Button>
      )}
    </div>
  );
}
