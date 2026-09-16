export const ENQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const STATUS_LABEL = Object.fromEntries(
  ENQUIRY_STATUSES.map((s) => [s.value, s.label]),
);

export const STATUS_CLASS = {
  new: "bg-accent-soft text-accent border-accent-softBorder",
  contacted: "bg-[#eef2f7] text-[#3d5a80] border-[#cdd9e5]",
  quoted: "bg-[#fff4e0] text-[#8a5a00] border-[#f0ddb8]",
  won: "bg-[#e8f3ec] text-[#256b45] border-[#c3e0ce]",
  lost: "bg-[#f6eceb] text-[#8a3b32] border-[#e6cdc9]",
};

export const ENQUIRY_SOURCES = [
  { value: "walk-in", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

export const SOURCE_LABEL = Object.fromEntries(
  ENQUIRY_SOURCES.map((s) => [s.value, s.label]),
);

export const EMPTY_ENQUIRY = {
  name: "",
  phone: "",
  item: "",
  status: "new",
  source: "walk-in",
  note: "",
};
