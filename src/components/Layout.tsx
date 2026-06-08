import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';

export default function Layout({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer onChat={() => setChatOpen(true)} />

      {/* Floating Hi-5 launcher */}
      <button
        onClick={() => setChatOpen((o) => !o)}
        aria-label="Ouvrir le chat Hi-5"
        className="fixed bottom-5 right-4 z-[1090] grid h-16 w-16 place-items-center rounded-full bg-white shadow-float transition-transform hover:scale-110 active:scale-95 sm:right-6"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-violet-300/40" />
        <img src="/assets/mascot.png" alt="Hi-5" className="h-12 w-12 object-contain" />
      </button>

      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

      <AnimatePresence>{/* room for global overlays */}</AnimatePresence>
    </div>
  );
}
