export default function CheckboxGroups({ groups, selected, onChange }) {
  const toggle = (value) => {
    const set = new Set(selected);
    set.has(value) ? set.delete(value) : set.add(value);
    onChange(Array.from(set));
  };

  const toggleGroup = (options, allOn) => {
    const set = new Set(selected);
    options.forEach((opt) => (allOn ? set.delete(opt) : set.add(opt)));
    onChange(Array.from(set));
  };

  return (
    <div className="flex gap-4 overflow-x-auto rounded-md border border-border bg-[#fbfaf8] p-2.5">
      {groups.map((group) => {
        const chosen = group.options.filter((opt) => selected.includes(opt));
        const allOn = chosen.length === group.options.length;

        return (
          <div
            key={group.label}
            className="w-40 shrink-0 sm:w-47.5 border-r border-border/60 pr-4 last:border-r-0 last:pr-0"
          >
            <div className="mb-1.5 flex items-center gap-2 border-b border-border/70 pb-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.options, allOn)}
                className="text-[11.5px] font-semibold uppercase tracking-wide text-muted hover:text-accent"
              >
                {group.label}
              </button>
              {chosen.length > 0 && (
                <span className="rounded-full bg-accent-soft px-1.5 text-[10.5px] text-accent">
                  {chosen.length}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-y-1.5">
              {group.options.map((opt) => (
                <label
                  key={opt}
                  title={opt}
                  className="flex cursor-pointer items-center gap-1.5 text-[13px] font-normal"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggle(opt)}
                    className="h-3.5 w-3.5 shrink-0 accent-accent"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
