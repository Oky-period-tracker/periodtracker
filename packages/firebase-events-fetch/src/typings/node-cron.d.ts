declare module 'node-cron' {
  // Extend the module declarations if necessary
  interface ScheduleOptions {
    scheduled: boolean;
    timezone?: string;
  }

  function schedule(cronExpression: string, task: () => void, options?: ScheduleOptions): Task;
}
