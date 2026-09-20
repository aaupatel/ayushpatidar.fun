import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/ThemeContext';
import { Background } from '@/components/ui/Background';
import { Cursor } from '@/components/ui/Cursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/ui/Footer';
import { TerminalLoader } from '@/components/terminal/TerminalLoader';
import { MatrixOverlay } from '@/components/ui/MatrixOverlay';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { LabPage } from '@/pages/LabPage';
import { ContactPage } from '@/pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell({ matrix, onMatrix }: { matrix: boolean; onMatrix: () => void }) {
  return (
    <>
      <ScrollToTop />
      <Background />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      {matrix && <MatrixOverlay onClose={onMatrix} />}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage onMatrix={onMatrix} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/lab" element={<LabPage onMatrix={onMatrix} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage onMatrix={onMatrix} />} />
        </Routes>
      </main>
      <Footer />
      <AIAssistant />
    </>
  );
}

function App() {
  const [booted, setBooted] = useState(false);
  const [matrix, setMatrix] = useState(false);

  useEffect(() => {
    if (booted) {
      document.documentElement.classList.add('dark');
      const stored = localStorage.getItem('ayush-theme');
      if (stored === 'light') document.documentElement.classList.remove('dark');
    }
  }, [booted]);

  return (
    <ThemeProvider>
      <HashRouter>
        {!booted && <TerminalLoader onDone={() => setBooted(true)} />}
        {booted && (
          <Shell matrix={matrix} onMatrix={() => setMatrix((m) => !m)} />
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
