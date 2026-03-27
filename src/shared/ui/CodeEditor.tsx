// shared/ui/CodeEditor.tsx
"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

export const CodeEditor = ({
  language,
  value,
  onChange,
  readOnly = false,
  height = "300px",
  placeholder = "Напишите ваш код здесь...",
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Подсветка при изменении значения
  useEffect(() => {
    if (preRef.current && value) {
      const highlighted = hljs.highlight(value, { language }).value;
      preRef.current.innerHTML = `<code class="language-${language}">${highlighted}</code>`;
    } else if (preRef.current) {
      preRef.current.innerHTML = '<code></code>';
    }
  }, [value, language]);

  // Синхронизация скролла
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="relative border rounded-xl overflow-hidden bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        {!readOnly && value && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Копировать
          </button>
        )}
      </div>
      
      <div className="relative" style={{ height }}>
        {/* Textarea для ввода - должен быть выше pre */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full p-4 bg-transparent text-white/50  caret-white font-mono text-sm resize-none focus:outline-none z-10"
          style={{ caretColor: "#fff" }}
          spellCheck={false}
        />
        {/* Pre для подсветки - под textarea */}
        <pre
          ref={preRef}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm overflow-auto pointer-events-none"
        >
          <code className={`language-${language}`}>{value || " "}</code>
        </pre>
      </div>
    </div>
  );
};