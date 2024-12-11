import "./cropper.css";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Cropper, ReactCropperElement } from "react-cropper";
import { useRef } from "react";
import { Button } from "../ui/button";

interface CropImageModalProps {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export default function CropImageModal({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: CropImageModalProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant={"outline"} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
