import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },

    onUploadProgress: setUploadProgress,

    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((prevAttachment) => {
          const uploadResult = res.find(
            (uploadedAttachment) =>
              uploadedAttachment.name === prevAttachment.file.name,
          );

          if (!uploadResult) return prevAttachment;

          return {
            ...prevAttachment,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },

    onUploadError(e) {
      setAttachments((prev) =>
        prev.filter((attachment) => !attachment.isUploading),
      );
      toast.error(e.message);
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Please wait for the current upload to finish.");
    }

    if (files.length + attachments.length > 4) {
      toast.error("You can only upload up to 4 attachments per post");
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
