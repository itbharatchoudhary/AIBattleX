export default function Skeleton() {
  return (
    <div className="flex flex-col gap-4 h-full animate-pulse">
      {/* Header badge */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full skeleton" />
        <div className="w-24 h-5 rounded-lg skeleton" />
        <div className="ml-auto w-16 h-5 rounded-lg skeleton" />
      </div>

      {/* Divider */}
      <div className="h-px w-full skeleton rounded" />

      {/* Content lines */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-11/12 rounded skeleton" />
        <div className="h-4 w-10/12 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-9/12 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-8/12 rounded skeleton" />
        <div className="mt-2 h-4 w-full rounded skeleton" />
        <div className="h-4 w-10/12 rounded skeleton" />
        <div className="h-4 w-11/12 rounded skeleton" />
        <div className="h-4 w-6/12 rounded skeleton" />
      </div>
    </div>
  );
}

export function JudgeSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-5">
      <div className="h-5 w-40 skeleton rounded-lg" />
      <div className="flex flex-col gap-3">
        <div className="h-10 w-full skeleton rounded-xl" />
        <div className="h-10 w-full skeleton rounded-xl" />
      </div>
      <div className="h-px w-full skeleton" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-10/12 skeleton rounded" />
      <div className="h-4 w-9/12 skeleton rounded" />
    </div>
  );
}
