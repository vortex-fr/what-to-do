import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ChatCtx {
  open: boolean;
  seed: { q: string; n: number } | null; // n = nonce so repeated same query re-triggers
  openChat: (query?: string) => void;
  closeChat: () => void;
}

const Ctx = createContext<ChatCtx | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<{ q: string; n: number } | null>(null);

  const openChat = useCallback((query?: string) => {
    setOpen(true);
    if (query && query.trim()) setSeed({ q: query.trim(), n: Date.now() });
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  return <Ctx.Provider value={{ open, seed, openChat, closeChat }}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChat outside provider');
  return ctx;
}
