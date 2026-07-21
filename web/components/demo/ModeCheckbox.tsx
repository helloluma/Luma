"use client";

import styles from "./ModeCheckbox.module.css";

// The run-mode toggle: unchecked = Luma only, checked = Compare with ChatGPT.
// The checkbox mark is the Coachmark animated checkbox (the box + tick draw in on
// toggle); the label swaps to reflect the current mode.
export function ModeCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label="Compare with ChatGPT"
      onClick={() => onChange(!checked)}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors hover:bg-surface-2"
    >
      <span className={styles.checkbox} data-checked={checked}>
        <svg
          viewBox="0 0 21 21"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
        </svg>
      </span>
      <span className="text-xs font-medium text-ink">
        {checked ? "Compare with ChatGPT" : "Luma only"}
      </span>
    </button>
  );
}
