// shared/ui/CodeOutput.tsx
interface CodeOutputProps {
  stdout?: string;
  stderr?: string;
  status?: 'ok' | 'compile_error' | 'runtime_error' | 'timeout' | 'error';
  durationMs?: number;
}

export const CodeOutput = ({
  stdout,
  stderr,
  status,
  durationMs,
}: CodeOutputProps) => {
  if (!stdout && !stderr) return null;
  
  const hasError = status !== 'ok' && status !== undefined;
  
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Вывод:</p>
        {durationMs && (
          <p className="text-gray-500 text-xs">Выполнено за {durationMs}мс</p>
        )}
      </div>
      <pre className={`text-sm font-mono overflow-x-auto ${
        hasError ? 'text-red-400' : 'text-white'
      }`}>
        {stdout || stderr || "Нет вывода"}
      </pre>
      {status === 'compile_error' && (
        <p className="text-red-400 text-sm mt-2">Ошибка компиляции</p>
      )}
      {status === 'runtime_error' && (
        <p className="text-red-400 text-sm mt-2">Ошибка выполнения</p>
      )}
      {status === 'timeout' && (
        <p className="text-yellow-400 text-sm mt-2">Превышено время выполнения</p>
      )}
    </div>
  );
};