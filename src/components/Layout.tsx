import { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import CookieBanner from './CookieBanner';
import Mascot from './Mascot';
import { ChatProvider, useChat } from './ChatContext';

function LayoutInner({ children }: { children: ReactNode }) {
  const { open, seed, openChat, closeChat } = useChat();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer onChat={() => openChat()} />

      {/* Floating Hi-5 launcher */}
      <button
        onClick={() => (open ? closeChat() : openChat())}
        aria-label="Ouvrir l'assistant Hi-5"
        className="fixed bottom-5 right-4 z-[1090] grid h-16 w-16 place-items-center rounded-full bg-white shadow-float transition-transform hover:scale-110 active:scale-95 sm:right-6"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-violet-300/40" />
        <Mascot pose="app" size={48} />
      </button>

      <Chatbot open={open} onClose={closeChat} seed={seed} />
      <CookieBanner />
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <LayoutInner>{children}</LayoutInner>
    </ChatProvider>
  );
}
