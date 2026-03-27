// entities/parent/model/types.ts

export type ParentControlRequest = {
  requestId: string;
  parentUserId: string;
  parentUsername: string;
  childUserId: string;
  childUsername: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  respondedAt: string | null;
};

export type ParentControlRequestsResponse = {
  items: ParentControlRequest[];
};

export type SendParentControlRequestResponse = {
  requestId: string;
  status: string;
};

export type ParentControlActionResponse = {
  requestId: string;
  status: string;
};

export type ParentChild = {
  childUserId: string;
  childUsername: string;
  since: string;
};

export type ParentChildrenResponse = {
  items: ParentChild[];
};

export type ChildDashboard = {
  child: {
    userId: string;
    username: string;
    xp: number;
    level: number;
    coins: number;
    lastActivityAt: string;
  };
  courses: {
    targetId: string;
    name: string;
    courseId: string;
    moduleId: string | null;
    percent: number;
    completed: boolean;
    doneItems: number;
    totalItems: number;
  }[];
  modules: {
    targetId: string;
    name: string;
    courseId: string;
    moduleId: string;
    percent: number;
    completed: boolean;
    doneItems: number;
    totalItems: number;
  }[];
  lessons: {
    targetId: string;
    name: string;
    courseId: string;
    moduleId: string;
    percent: number;
    completed: boolean;
    doneItems: number;
    totalItems: number;
  }[];
  recentActivities: {
    eventId: string;
    createdAt: string;
    eventType: 'quiz_completed' | 'task_completed' | 'exam_completed';
    progressPercent: number;
    xpGranted: number;
    coinGranted: number;
    lessonId: string | null;
    quizId: string | null;
    taskId: string | null;
    examId: string | null;
    details: any | null;
  }[];
};