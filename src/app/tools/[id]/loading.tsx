export default function ToolDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 rounded mb-6" />
      <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div>
          <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
