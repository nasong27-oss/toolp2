export default function ToolsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-1" />
      <div className="h-3 w-48 bg-gray-200 rounded mb-5" />
      <div className="flex gap-2 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 w-14 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-full bg-gray-200 rounded mb-1" />
            <div className="h-3 w-5/6 bg-gray-200 rounded mb-4" />
            <div className="h-px bg-gray-100 mb-2" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
