export default function Summary() {
  const summary = localStorage.getItem("lastSummary");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Latest Summary</h1>
      <p>{summary || "No summary yet"}</p>
    </div>
  );
}
