import { useState, useEffect, useRef } from "react";

// const commands = [
//   { text: "git clone ayushpatidar.fun", delay: 500 },
//   { text: "npm install dependencies...", delay: 800 },
//   { text: "optimizing MERN stack...", delay: 600 },
//   { text: "starting the party...", delay: 400 },
// ];

export default function TerminalLoader({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState<string>("");

  // Ref to hold latest lines array
  const linesRef = useRef<string[]>([]);
  linesRef.current = lines;

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const appendLine = async (line: string) => {
    setLines((prev) => {
      const updated = [...prev, line];
      linesRef.current = updated;
      return updated;
    });
    await delay(100);
  };

  const typeLine = async (prefix: string, content: string, speed = 10) => {
    let typed = "";
    for (let i = 0; i < content.length; i++) {
      typed += content[i];
      setCurrentTyping(prefix + typed);
      await delay(speed);
    }
    setLines((prev) => {
      const updated = [...prev, prefix + content];
      linesRef.current = updated;
      return updated;
    });
    setCurrentTyping("");
    await delay(100);
  };

  const updateLastLine = (line: string) => {
    const updated = [...linesRef.current.slice(0, -1), line];
    linesRef.current = updated;
    setLines(updated);
  };
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const simulate = async () => {
      await delay(100);
      await appendLine("Windows PowerShell");
      await appendLine("Microsoft Corporation. All rights reserved.");
      await appendLine(
        "Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows"
      );

      await typeLine("PS D:\\> ", "git clone ayushpatidar.fun");
      await appendLine("Cloning into 'ayushpatidar.fun'...");

      // Receiving objects
      await appendLine(
        "Receiving objects: 0% (91/91), 577.18 KiB | 1.69 MiB/s, done."
      );
      for (let i = 10; i <= 100; i += 10) {
        updateLastLine(
          `Receiving objects: ${i}% (91/91), 577.18 KiB | 1.69 MiB/s, done.`
        );
        await delay(10);
      }

      // Resolving deltas
      await appendLine("Resolving deltas: 0% (12/12), done.");
      for (let i = 10; i <= 100; i += 10) {
        updateLastLine(`Resolving deltas: ${i}% (12/12), done.`);
        await delay(10);
      }

      await typeLine("PS D:\\ayushpatidar.fun> ", "npm run dev");

      await delay(500);
      onFinished();
    };

    simulate();
  }, [onFinished]);

  return (
    <div className="flex h-screen items-center justify-center bg-black font-mono">
      <div className="w-full max-w-2xl min-h-1/2 rounded-md border border-gray-600 shadow-lg overflow-hidden bg-black text-green-400 font-mono flex flex-col">
        {/* Terminal Header */}
        <div className="bg-[#202020] text-white px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-sm">Windows PowerShell</span>
          <span className="text-sm opacity-0">--</span> {/* For centering */}
        </div>

        {/* Terminal Body */}
        <div className="p-4 text-sm space-y-1 overflow-y-auto flex-1">
          {lines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
          {currentTyping && <div>{currentTyping}</div>}
        </div>
      </div>
    </div>
    // <div className="flex h-screen items-center justify-center bg-black font-mono">
    //   <div className="w-full max-w-lg p-6">
    //     {lines.map((line, i) => (
    //       <p key={i} className="text-green-500 mb-2 leading-relaxed">
    //         {line}
    //       </p>
    //     ))}
    //     <span className="inline-block w-3 h-6 bg-green-500 animate-pulse"></span>
    //   </div>
    // </div>
  );
}
