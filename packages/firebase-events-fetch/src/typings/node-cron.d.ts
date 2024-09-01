// Declare a module augmentation for the 'node-cron' module.
// This allows us to extend or add to the types provided by the module.
declare module 'node-cron' {

  // Define an interface `ScheduleOptions` to specify the options for scheduling a task.
  interface ScheduleOptions {
    scheduled: boolean;  // Indicates whether the task should be scheduled to run automatically.
    timezone?: string;   // Optional: Specifies the timezone in which the cron job should run.
  }

  // Define the `schedule` function within the module declaration.
  // This function allows scheduling a cron job with a specified cron expression, task, and options.
  function schedule(cronExpression: string, task: () => void, options?: ScheduleOptions): Task;
}
