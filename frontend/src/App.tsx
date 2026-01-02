import Home from "./pages/Home";
// import { useState } from "react";
// import TerminalLoader from "./components/TerminalLoader";
// import Navbar from "./components/Navbar";
// import About from "./pages/About";
// import Work from "./pages/Work";

// type View = "home" | "about" | "work";

function App() {
  // const [view, setView] = useState<View>("home");
  // const [isNavigating, setIsNavigating] = useState(true);
  // const [terminalMode, setTerminalMode] = useState<View>("home");

  // const handleNavigation = (target: View) => {
  //   if (target === view) return; // Don't reload same page
  //   setTerminalMode(target);
  //   setIsNavigating(true);
  //   setView(target);
  // };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      <Home/>
      {/* {isNavigating && (
        <TerminalLoader
          // mode={terminalMode === "home" ? "initial" : terminalMode}
          onFinished={() => setIsNavigating(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-6">
        <Navbar onNavigate={handleNavigation} /> 

        {!isNavigating && (
          <div className="pb-20">
            {view === "home" && <Home />}
            {view === "about" && <About />}
            {view === "work" && <Work />}
          </div>
        )}
      </div> */}
    </div>
  );
}

export default App;
