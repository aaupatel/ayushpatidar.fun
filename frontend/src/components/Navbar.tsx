export default function Navbar({
  onNavigate,
}: {
  onNavigate: (dest: any) => void;
}) {
  return (
      <nav className="flex justify-between items-center py-4 mb-10">
        <div
          className="text-2xl font-bold text-green-400 cursor-pointer hover:text-green-500"
          onClick={() => onNavigate("home")}
        >
          {">_"}pati
        </div>
        <div className="flex gap-8 font-mono text-sm">
          <button
            onClick={() => onNavigate("about")}
            className="hover:text-green-500 transition cursor-pointer"
          >
            [ cd About ]
          </button>
          <button
            onClick={() => onNavigate("work")}
            className="hover:text-green-500 transition cursor-pointer"
          >
            [ ls Work ]
          </button>
        </div>
      </nav>
  );
}
