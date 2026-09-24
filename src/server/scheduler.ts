import { db } from './db.ts';

let schedulerInterval: NodeJS.Timeout | null = null;
let isExecuting = false;

/**
 * Checks all enabled scheduled tasks and executes any whose nextRunAt timestamp has arrived.
 */
export async function tickScheduler(): Promise<void> {
  if (isExecuting) return;
  isExecuting = true;

  try {
    const tasks = db.getScheduledTasks();
    const now = Date.now();

    for (const task of tasks) {
      if (!task.enabled) continue;

      const nextRunTime = new Date(task.nextRunAt).getTime();
      if (!isNaN(nextRunTime) && nextRunTime <= now) {
        console.log(`[Gen Scheduler] Triggering due maintenance task: "${task.title}" (${task.id})`);
        try {
          const result = await db.executeScheduledTask(task.id, false);
          console.log(`[Gen Scheduler] Task "${task.title}" completed. Result: ${result.summary}`);
        } catch (taskErr) {
          console.error(`[Gen Scheduler] Error executing task "${task.title}":`, taskErr);
        }
      }
    }
  } catch (err) {
    console.error('[Gen Scheduler] Unexpected error in scheduler tick:', err);
  } finally {
    isExecuting = false;
  }
}

/**
 * Starts the Gen agent background maintenance scheduler runner.
 */
export function startBackgroundScheduler(intervalMs = 20000): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  console.log('[Gen Scheduler] Background maintenance scheduler initialized.');
  // Check immediately once, then set periodic interval
  tickScheduler();
  schedulerInterval = setInterval(tickScheduler, intervalMs);
}

/**
 * Stops the background scheduler runner.
 */
export function stopBackgroundScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Gen Scheduler] Background maintenance scheduler stopped.');
  }
}
