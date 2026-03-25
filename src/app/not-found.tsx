export const runtime = 'edge';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4 ls-tight">
        404
      </h1>
      <p className="text-xl text-slate-400 mb-8">Página no encontrada</p>
      <a 
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all font-medium"
      >
        Volver al inicio
      </a>
    </div>
  );
}
