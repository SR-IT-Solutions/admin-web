import { useEffect, useRef } from "react";

const LENGTH = 4;

export default function PinInput({
  id,
  value = "",
  onChange,
  onComplete,
  disabled,
  autoFocus,
  masked = true,
  center,
}) {
  const refs = useRef([]);
  const digits = value.padEnd(LENGTH, " ").slice(0, LENGTH).split("");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const emit = (next, focusIndex) => {
    onChange(next);
    if (focusIndex !== undefined) {
      refs.current[Math.min(focusIndex, LENGTH - 1)]?.focus();
    }
    if (next.length === LENGTH) onComplete?.(next);
  };

  const handleChange = (index) => (event) => {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) return;

    const chars = value.split("");
    let cursor = index;
    for (const char of typed) {
      if (cursor >= LENGTH) break;
      chars[cursor] = char;
      cursor += 1;
    }
    emit(chars.join("").slice(0, LENGTH), cursor);
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.split("");
      if (chars[index]) {
        chars[index] = "";
        emit(chars.join("").replace(/\s/g, ""), index);
      } else if (index > 0) {
        chars[index - 1] = "";
        emit(chars.slice(0, index - 1).join(""), index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    emit(pasted.slice(0, LENGTH), pasted.length);
  };

  return (
    <div className={`flex gap-2.5 ${center ? "justify-center" : ""}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          id={index === 0 ? id : undefined}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type={masked ? "password" : "text"}
          inputMode="numeric"
          autoComplete="off"
          data-bwignore="true"
          data-1p-ignore="true"
          data-lpignore="true"
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className="text-input h-12 w-12 flex-none p-0 text-center text-lg font-semibold"
          value={digit.trim()}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}
