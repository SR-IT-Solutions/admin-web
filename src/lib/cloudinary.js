const WIDGET_SRC = "https://upload-widget.cloudinary.com/latest/global/all.js";

let loadPromise = null;

function loadWidgetScript() {
  if (window.cloudinary) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cloudinary widget"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Opens the Cloudinary unsigned upload widget and resolves with the
 * secure URL of each successfully uploaded image.
 */
export async function openUploadWidget({ cloudName, uploadPreset, onUpload }) {
  await loadWidgetScript();

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      multiple: true,
      sources: ["local", "camera", "url"],
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        onUpload(result.info.secure_url);
      }
    }
  );

  widget.open();
}
