import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { sendConciergeMessage } from '../lib/chatApi.js';
import { buildWhatsAppSupportUrl } from '../lib/orderService.js';

const SUGGESTED_QUESTIONS = [
  'Which serum suits oily, humid-climate skin?',
  'How much is shipping to Lahore?',
  'What is the difference between the cleanser and the toner?',
  'Do you have any active promo codes?',
];

const WELCOME_MESSAGE =
  'Assalam-o-alaikum! I am the Bare & Bloom concierge. Ask me anything about our serums, cleansers, toners, bundles, shipping across Pakistan, or promos.';

function fallbackReply() {
  return {
    role: 'assistant',
    text: "I'm having trouble connecting right now. Please tap 'WhatsApp Us' below and our team will help you right away.",
    isFallback: true,
  };
}

export default function Concierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (rawText) => {
    const text = (rawText || '').trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const reply = await sendConciergeMessage(nextMessages);
      setMessages([...nextMessages, { role: 'assistant', text: reply }]);
    } catch {
      setMessages([...nextMessages, fallbackReply()]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const whatsappUrl = buildWhatsAppSupportUrl('');

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Bare & Bloom concierge chat"
          className="w-[calc(100vw-2rem)] max-w-[380px] h-[min(70vh,560px)] bg-white rounded-[24px] border border-[#8FA391]/25 shadow-drawer flex flex-col overflow-hidden"
        >
          <header className="px-5 py-4 bg-[#2D3830] text-white flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-[18px] leading-[22px]">Bare &amp; Bloom Concierge</p>
              <p className="text-[12px] text-white/70">
                AI skincare advisor &middot; replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close concierge chat"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FBF9F6]"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="flex">
              <p className="max-w-[85%] rounded-[18px] rounded-bl-[6px] bg-[#DCE4DC] text-[#232924] text-[14px] leading-[21px] px-4 py-3">
                {WELCOME_MESSAGE}
              </p>
            </div>

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}>
                <p
                  className={`max-w-[85%] rounded-[18px] text-[14px] leading-[21px] px-4 py-3 whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'rounded-br-[6px] bg-[#2D3830] text-white'
                      : 'rounded-bl-[6px] bg-[#DCE4DC] text-[#232924]'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {isSending && (
              <div className="flex">
                <p className="rounded-[18px] rounded-bl-[6px] bg-[#DCE4DC] text-[#5C665E] text-[14px] px-4 py-3">
                  Typing&hellip;
                </p>
              </div>
            )}
            <div ref={scrollAnchorRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 bg-[#FBF9F6]">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border-[1.5px] border-[#8FA391]/50 bg-white text-[#2D3830] text-[12px] font-semibold px-3 py-2 hover:bg-[#DCE4DC] transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="px-3 py-3 bg-white border-t border-[#8FA391]/20 flex items-center gap-2"
            style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, shipping, promos&hellip;"
              aria-label="Message the Bare & Bloom concierge"
              enterKeyHint="send"
              className="flex-1 min-h-[44px] rounded-full bg-[#F0EDE6] border border-[#8FA391]/30 px-4 text-[16px] text-[#232924] placeholder:text-[#5C665E]/70 focus:border-[#8FA391]"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#2D3830] text-white disabled:opacity-40 transition-colors hover:bg-[#3D4C41]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[12px] font-semibold text-[#5C665E] hover:text-[#2D3830] pb-2 bg-white transition-colors"
          >
            Prefer a human? WhatsApp Us
          </a>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close concierge chat' : 'Open Bare & Bloom concierge chat'}
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2D3830] text-white shadow-drawer hover:bg-[#3D4C41] active:scale-95 transition-all duration-200"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
