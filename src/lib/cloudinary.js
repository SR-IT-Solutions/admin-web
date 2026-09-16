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

let widget = null;
let widgetKey = null;
let handleUpload = () => {};

export async function openUploadWidget({ cloudName, uploadPreset, onUpload }) {
  await loadWidgetScript();

  handleUpload = onUpload;

  const key = `${cloudName}:${uploadPreset}`;
  if (widget && widgetKey !== key) {
    widget.destroy();
    widget = null;
  }

  if (!widget) {
    widgetKey = key;
    widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: true,
        sources: ["local", "camera", "url"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          handleUpload(result.info.secure_url);
        }
      }
    );
  }

  widget.open();
}
