import { Upload, X } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { openUploadWidget } from "../../lib/cloudinary";

export default function ImageUploader({ images, onChange }) {
  const { settings, isCloudinaryConfigured } = useSettings();

  const handleUpload = () => {
    if (!isCloudinaryConfigured) {
      alert("Add your Cloudinary cloud name and upload preset in Settings (gear icon) first.");
      return;
    }
    openUploadWidget({
      cloudName: settings.cloudName,
      uploadPreset: settings.uploadPreset,
      onUpload: (url) => onChange([...images, url]),
    });
  };

  const removeAt = (i) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={url + i} className="relative h-16 w-16">
            <img src={url} alt="" className="h-full w-full rounded-md border border-border object-cover" />
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
      <button type="button" onClick={handleUpload} className="btn-secondary btn-small">
        <Upload size={13} /> Upload image
      </button>
      <p className="field-hint">Uploaded images go straight to Cloudinary and the link is added automatically.</p>
    </div>
  );
}
