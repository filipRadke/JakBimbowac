function RouteFinder() {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Znajdź trasę</h2>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Skąd..."
      />

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Dokąd..."
      />

      <button className="bg-blue-500 text-white px-4 py-2">
        Szukaj
      </button>

      <div className="mt-6">
        <p>➡️ Najlepsza trasa pojawi się tutaj</p>
      </div>
    </div>
  );
}

export default RouteFinder;