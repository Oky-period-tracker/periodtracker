// typings/node-cron.d.ts
declare module 'node-cron' {
    interface ScheduledTask {
      start: () => void;
      stop: () => void;
      destroy: () => void;
    }
  
    type CronExpression = string;
  
    interface NodeCron {
      schedule: (
        cronExpression: CronExpression,
        func: () => void,
        options?: object
      ) => ScheduledTask;
    }
  
    const cron: NodeCron;
    export = cron;
  }
  