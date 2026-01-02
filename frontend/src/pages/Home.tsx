export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* Visual Status Indicator */}
      <div className="mb-8 flex items-center gap-3 bg-green-500/10 border border-green-500/50 px-4 py-2 rounded-full">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-green-500 font-mono text-sm uppercase tracking-widest">
          System Status: Initializing
        </span>
      </div>

      <h1 className="text-2xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight">
        AYUSH
        <span className="text-green-500 underline decoration-2 underline-offset-8">
          PATIDAR
        </span>
        .FUN
      </h1>

      <div className="max-w-2xl bg-gray-900/50 border border-gray-800 p-8 rounded-lg backdrop-blur-sm">
        <p className="text-xl text-gray-400 mb-6 font-mono">
          &gt; Status:{" "}
          <span className="text-white font-bold underline italic">
            Coming Soon
          </span>
        </p>
        <div className="mt-6 text-left font-mono text-sm space-y-2 opacity-80 mb-8">
          <p className="text-blue-400">➜ Initializing MERN Stack...</p>
          <p className="text-purple-400">➜ Configuring AWS Infrastructure...</p>
          <p className="text-yellow-400">➜ Injecting "Pati" Energy...</p>
          <p className="text-green-500 font-bold">
            ➜ Ready for the after-party. (Coming Feb 2026)
          </p>
        </div>

        {/* Progress Bar Simulation */}
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
          <div className="bg-green-500 h-full w-[65%] animate-[progress_3s_ease-in-out]"></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase">
          <span>Compiling Core</span>
          <span>65% Complete</span>
        </div>
      </div>

      <div className="mt-12 text-gray-600 font-mono text-sm">
        Follow the progress on{" "}
        <a
          href="https://github.com/aaupatel"
          className="text-green-500 hover:underline"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
