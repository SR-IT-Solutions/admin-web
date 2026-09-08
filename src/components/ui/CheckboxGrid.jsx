export default function CheckboxGrid({ options, selected, onChange }) {
  const toggle = (value) => {
    const set = new Set(selected);
    set.has(value) ? set.delete(value) : set.add(value);
    onChange(Array.from(set));
  };

  return (
    <div className="grid max-h-40 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-3 gap-y-1.5 overflow-y-auto rounded-md border border-border bg-[#fbfaf8] p-2.5">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-1.5 text-[13px] font-normal"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-3.5 w-3.5 accent-accent"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
