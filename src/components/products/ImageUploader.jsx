import { useState } from "react";
import { Images, Upload, X } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { openUploadWidget } from "../../lib/cloudinary";
import ImagePickerModal from "./ImagePickerModal";
import ImageLightbox from "../ui/ImageLightbox";
import { thumbUrl } from "../../lib/imageUrl";

export default function ImageUploader({ images, onChange }) {
  const { settings, isCloudinaryConfigured } = useSettings();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const handleUpload = () => {
    if (!isCloudinaryConfigured) {
      alert("Add your Cloudinary cloud name and upload preset in Settings first.");
      return;
    }
    openUploadWidget({
      cloudName: settings.cloudName,
      uploadPreset: settings.uploadPreset,
      onUpload: (url) => onChange([...images, url]),
    });
  };

  const handlePick = (url) => {
    if (!images.includes(url)) onChange([...images, url]);
  };

  const removeAt = (i) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={url + i} className="relative h-16 w-16">
            <button
              type="button"
              onClick={() => setPreviewIndex(i)}
              aria-label={`Preview image ${i + 1}`}
              className="h-full w-full overflow-hidden rounded-md border border-border transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <img src={thumbUrl(url, 128)} alt="" decoding="async" className="h-full w-full object-cover" />
            </button>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleUpload} className="btn-secondary btn-small">
          <Upload size={13} /> Upload image
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="btn-secondary btn-small"
        >
          <Images size={13} /> Choose existing
        </button>
      </div>
      <p className="field-hint">Uploaded images go straight to Cloudinary and the link is added automatically.</p>

      <ImageLightbox
        images={images}
        index={previewIndex}
        onClose={() => setPreviewIndex(null)}
        onIndexChange={setPreviewIndex}
      />
      <ImagePickerModal
        open={pickerOpen}
        selected={images}
        onPick={handlePick}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
