// entities/task/model/types.ts
export type TaskStartResponse = {
  taskId: string;
  lessonId: string;
  examId: string | null;
  completed: boolean;
};

export type TaskCompleteResponse = {
  taskId: string;
  lessonId: string;
  examId: string | null;
  completed: boolean;
  firstCompletion: boolean;
  xpGranted: number;
  coinGranted: number;
};

export type TaskRunnerConfig = {
  runnerLanguage: string;
  expectedOutput: string;
  inputData?: string;
};

export type TaskRunnerConfigResponse = {
  taskId: string;
  runnerLanguage: string;
  hasExpectedOutput: boolean;
  hasInputData: boolean;
};

export type TaskRunRequest = {
  language: string;
  code: string;
};

export type TaskRunResponse = {
  taskId: string;
  language: string;
  status: 'ok' | 'compile_error' | 'runtime_error' | 'timeout';
  correct: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
  durationMs: number;
  completed: boolean;
  firstCompletion: boolean;
  xpGranted: number;
  coinGranted: number;
};

export type TaskRewardsRequest = {
  xpReward: number;
  coinReward: number;
};

export type TaskRewardsResponse = {
  taskId: string;
  lessonId: string;
  examId: string | null;
  xpReward: number;
  coinReward: number;
};