/** @typedef {'todo' | 'in_progress' | 'done'} TaskStatus */

/** @type {TaskStatus[]} */
export const TASK_STATUSES = ['todo', 'in_progress', 'done'];

/**
 * @param {TaskStatus} current
 * @returns {TaskStatus}
 */
export function nextStatus(current) {
  const order = ['todo', 'in_progress', 'done'];
  const idx = order.indexOf(current);
  return order[Math.min(idx + 1, order.length - 1)];
}

/**
 * @param {string} status
 * @returns {status is TaskStatus}
 */
export function isValidStatus(status) {
  return TASK_STATUSES.includes(/** @type {TaskStatus} */ (status));
}

/**
 * @param {{ status: TaskStatus }[]} tasks
 * @returns {Record<TaskStatus, number>}
 */
export function countByStatus(tasks) {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    },
    /** @type {Record<TaskStatus, number>} */ ({ todo: 0, in_progress: 0, done: 0 })
  );
}

/**
 * @param {{ status: TaskStatus }[]} tasks
 * @returns {number} progress percentage 0-100
 */
export function computeProgress(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

/**
 * @param {{ status: TaskStatus, id: string, title: string }[]} tasks
 * @returns {Record<TaskStatus, typeof tasks>}
 */
export function groupTasksByStatus(tasks) {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    { todo: [], in_progress: [], done: [] }
  );
}

/**
 * @param {string} action
 * @param {string | null | undefined} detail
 * @returns {string}
 */
export function formatActivityMessage(action, detail) {
  const messages = {
    created: 'created a task',
    updated: 'updated a task',
    status_changed: 'moved a task',
    completed: 'completed a task',
    assigned: 'assigned a task',
    deleted: 'deleted a task',
  };
  const base = messages[/** @type {keyof typeof messages} */ (action)] ?? action;
  return detail ? `${base}: ${detail}` : base;
}
