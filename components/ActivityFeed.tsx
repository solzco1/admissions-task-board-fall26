import { formatActivityMessage } from '@/lib/tasks.js';

type ActivityRow = {
  id: string;
  action: string;
  detail: string | null;
  created_at: string;
  profile?: { display_name: string | null; email: string } | null;
  task?: { title: string } | null;
};

type Props = {
  activities: ActivityRow[];
  title?: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ activities, title = 'Activity' }: Props) {
  return (
    <div className="card sticky top-6">
      <h2 className="mb-4 font-semibold text-slate-900">{title}</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity yet. Complete a task to get started!</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => {
            const name =
              activity.profile?.display_name ?? activity.profile?.email ?? 'Someone';
            const message = formatActivityMessage(
              activity.action,
              activity.detail ?? activity.task?.title
            );
            return (
              <li key={activity.id} className="border-b border-slate-100 pb-3 last:border-0">
                <p className="text-sm text-slate-800">
                  <span className="font-medium">{name}</span> {message}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{timeAgo(activity.created_at)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
