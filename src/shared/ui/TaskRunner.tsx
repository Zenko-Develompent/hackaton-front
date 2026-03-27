// shared/ui/TaskRunner.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { TaskStatus } from "./TaskStatus";
import { taskApi } from "@/entities/task/api/task.api";
import { mockTaskRunResponse, mockTaskCompleteResponse } from "@/entities/mockData";

interface TaskRunnerProps {
  taskId: string;
  language: string;
  initialCode?: string;
  onComplete?: (result: any) => void;
}

export const TaskRunner = ({
  taskId,
  language,
  initialCode = "",
  onComplete,
}: TaskRunnerProps) => {
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  // Синхронизация с initialCode при изменении
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = async () => {
    if (!code.trim()) return;
    
    setRunning(true);
    try {
      // Используем мок
      setTimeout(() => {
        const response = mockTaskRunResponse;
        setResult(response);
        
        if (response.correct && !completed) {
          setCompleted(true);
          onComplete?.(mockTaskCompleteResponse);
        }
        setRunning(false);
      }, 500);
      
      // Реальный API:
      // const response = await taskApi.run(taskId, { language, code });
      // setResult(response);
      // if (response.correct && !completed) {
      //   const completeResponse = await taskApi.complete(taskId);
      //   setCompleted(true);
      //   onComplete?.(completeResponse);
      // }
    } catch (error) {
      setResult({
        status: 'error',
        stderr: 'Ошибка выполнения кода',
      });
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        language={language}
        value={code}
        onChange={setCode}
        placeholder={`Напишите код на ${language}...`}
      />
      
      <div className="flex justify-between items-center">
        <TaskStatus 
          status={completed ? 'completed' : running ? 'running' : 'pending'}
          onRun={handleRun}
          disabled={running || !code.trim()}
        />
        {result && <CodeOutput {...result} />}
      </div>
    </div>
  );
};