export function SkeletonPlayaCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRestauranteCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonEventoCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex overflow-hidden">
      <div className="skeleton w-16 h-20 flex-shrink-0" />
      <div className="skeleton w-24 h-auto flex-shrink-0 hidden sm:block" />
      <div className="flex-1 p-4 space-y-2">
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
