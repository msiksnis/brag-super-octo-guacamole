import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";

import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
  onClose,
  onCropped,
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
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          ref={cropperRef}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <div className="flex space-x-2 w-full">
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={crop}
              size="sm"
              className="w-1/2 bg-gorse-300 hover:bg-gorse-400 text-foreground"
            >
              Crop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
