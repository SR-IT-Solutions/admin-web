export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "border-accent bg-accent" : "border-border bg-[#ddd]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-[19px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
