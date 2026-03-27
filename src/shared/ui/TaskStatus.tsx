// shared/ui/TaskStatus.tsx
import { Button } from "@/components/ui/button";

interface TaskStatusProps {
  status: 'pending' | 'running' | 'completed' | 'failed';
  onRun?: () => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export const TaskStatus = ({
  status,
  onRun,
  onComplete,
  disabled = false,
}: TaskStatusProps) => {
  if (status === 'completed') {
    return (
      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Выполнено
      </div>
    );
  }
  
  if (status === 'running') {
    return (
      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-700 border-t-transparent"></div>
        Выполнение...
      </div>
    );
  }
  
  return (
    <Button
      variant="outline"
      onClick={onRun}
      disabled={disabled}
    >
      Проверить решение
    </Button>
  );
};