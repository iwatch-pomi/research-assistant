"use client";

import { Delete } from "lucide-react";

/**
 * オンスクリーン数値キーパッド。値は文字列で受け渡し（"0.6" など）。
 * 小数点は1つまで。先頭の不要なゼロなどの整形は最小限。
 */
export default function NumericKeypad({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const press = (key: string) => {
    if (key === "." && value.includes(".")) return;
    if (key === "." && value === "") {
      onChange("0.");
      return;
    }
    // 先頭ゼロの抑制（"0" の後に数字 → 置き換え）
    if (value === "0" && key !== ".") {
      onChange(key);
      return;
    }
    onChange(value + key);
  };

  const backspace = () => onChange(value.slice(0, -1));

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((k) => (
        <KeyButton key={k} onClick={() => press(k)}>
          {k}
        </KeyButton>
      ))}
      <KeyButton onClick={() => press(".")}>.</KeyButton>
      <KeyButton onClick={() => press("0")}>0</KeyButton>
      <KeyButton onClick={backspace} ariaLabel="1文字削除">
        <Delete size={20} className="mx-auto text-slate-500" />
      </KeyButton>
    </div>
  );
}

function KeyButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded-xl border border-slate-200 bg-white py-3 text-xl font-semibold text-slate-700 active:bg-slate-100"
    >
      {children}
    </button>
  );
}
