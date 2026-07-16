import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  nextStatus,
  isValidStatus,
  countByStatus,
  computeProgress,
  groupTasksByStatus,
  formatActivityMessage,
  TASK_STATUSES,
} from '../lib/tasks.js';

describe('task status workflow', () => {
  it('defines three status columns', () => {
    assert.deepEqual(TASK_STATUSES, ['todo', 'in_progress', 'done']);
  });

  it('validates status values', () => {
    assert.equal(isValidStatus('todo'), true);
    assert.equal(isValidStatus('invalid'), false);
  });

  it('advances status in order', () => {
    assert.equal(nextStatus('todo'), 'in_progress');
    assert.equal(nextStatus('in_progress'), 'done');
    assert.equal(nextStatus('done'), 'done');
  });
});

describe('progress and grouping', () => {
  const tasks = [
    { id: '1', title: 'A', status: 'todo' },
    { id: '2', title: 'B', status: 'in_progress' },
    { id: '3', title: 'C', status: 'done' },
    { id: '4', title: 'D', status: 'done' },
  ];

  it('counts tasks by status', () => {
    assert.deepEqual(countByStatus(tasks), { todo: 1, in_progress: 1, done: 2 });
  });

  it('computes progress percentage', () => {
    assert.equal(computeProgress([]), 0);
    assert.equal(computeProgress(tasks), 50);
    assert.equal(computeProgress(tasks.map((t) => ({ ...t, status: 'done' }))), 100);
  });

  it('groups tasks into kanban columns', () => {
    const grouped = groupTasksByStatus(tasks);
    assert.equal(grouped.todo.length, 1);
    assert.equal(grouped.in_progress.length, 1);
    assert.equal(grouped.done.length, 2);
  });
});

describe('activity feed', () => {
  it('formats activity messages', () => {
    assert.match(formatActivityMessage('completed', 'Write tests'), /completed/);
    assert.match(formatActivityMessage('created', 'New task'), /New task/);
  });
});
