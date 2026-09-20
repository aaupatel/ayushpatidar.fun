import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { sendAssistantMessage } from '@/services/assistant';
import { cn } from '@/utils/cn';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

let msgId = 0;

export function AssistantChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: msgId++, role: 'assistant', content: "Hey! I am Ayush's AI assistant. Ask me about his projects, skills, or experience." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setMessages((m) => [...m, { id: msgId++, role: 'user', content: text }]);

    const reply = await sendAssistantMessage(text);

    setMessages((m) => [...m, { id: msgId++, role: 'assistant', content: reply }]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className="panel rounded-lg overflow-hidden flex flex-col w-[min(92vw,360px)] max-h-[50vh] sm:max-h-[60vh]"
      role="dialog"
      aria-label="AI Assistant chat"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-panel shrink-0">
        <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulseDot shrink-0" />
        <span className="mono text-xs text-terminal-text font-medium">ai-assistant</span>
        <span className="mono text-[10px] text-terminal-dim/60 ml-auto">online</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="ml-2 p-1 -m-1 text-terminal-dim hover:text-terminal-text transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent rounded"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto terminal-scroll p-3 sm:p-4 space-y-2.5 mono text-[13px] min-h-[160px]"
        aria-live="polite"
        aria-label="Assistant conversation"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex',
              m.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'max-w-[85%] px-3 py-2 rounded text-[13px] leading-relaxed',
                m.role === 'user'
                  ? 'bg-terminal-accent/10 text-terminal-text border border-terminal-accent/30'
                  : 'bg-terminal-hover text-terminal-dim border border-terminal-border',
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded bg-terminal-hover border border-terminal-border text-terminal-dim text-[13px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-dim animate-pulseDot" />
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-dim animate-pulseDot" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-dim animate-pulseDot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-terminal-border p-2.5 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Type a message…"
            aria-label="Message input"
            className="flex-1 bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text placeholder:text-terminal-muted outline-none focus:border-terminal-accent transition-colors resize-none max-h-24 min-w-0"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="shrink-0 w-9 h-9 flex items-center justify-center border border-terminal-border rounded bg-terminal-panel text-terminal-dim hover:text-terminal-text hover:bg-terminal-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-1 focus-visible:outline-terminal-accent"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
