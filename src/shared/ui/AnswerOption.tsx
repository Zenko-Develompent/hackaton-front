// shared/ui/AnswerOption.tsx
"use client";

interface AnswerOptionProps {
  id: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const AnswerOption = ({
  id,
  label,
  description,
  selected,
  onSelect,
  disabled = false,
}: AnswerOptionProps) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-primary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="radio"
        id={id}
        name="answer"
        value={id}
        checked={selected}
        onChange={onSelect}
        disabled={disabled}
        className="w-4 h-4 text-primary mr-3 mt-0.5"
      />
      <div>
        <span className="text-gray-700 font-medium">{label}</span>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </label>
  );
};