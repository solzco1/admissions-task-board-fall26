type Props = {
  progress: number;
  className?: string;
};

export function ProgressBar({ progress, className = '' }: Props) {
  return (
    <div className={`card ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Project progress</span>
        <span className="text-sm font-bold text-brand-600">{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress === 100 && (
        <p className="mt-2 text-sm font-medium text-emerald-600">All tasks complete — great work!</p>
      )}
    </div>
  );
}
