import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-wider font-mono">
          {language}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="!bg-slate-900 !p-4 !m-0 text-xs sm:text-sm"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function TypewriterText({ text, speed = 8, className = '', onDone, onUpdate }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    indexRef.current = 0;
    setDisplayed('');

    const step = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      const charsThisFrame = Math.max(1, Math.floor(elapsed / speed));
      if (elapsed >= speed) {
        indexRef.current = Math.min(indexRef.current + charsThisFrame, text.length);
        setDisplayed(text.slice(0, indexRef.current));
        lastTimeRef.current = timestamp;
        onUpdate?.();
      }

      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [text, speed]);

  const isTyping = text && displayed.length < text.length;

  return (
    <div className={`prose dark:prose-invert prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : 'text';
            const value = String(children).replace(/\n$/, '');
            
            return !inline ? (
              <CodeBlock language={lang} value={value} />
            ) : (
              <code className={`${className} bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md font-mono text-xs`} {...props}>
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-6 border-slate-200 dark:border-white/10" />,
          blockquote: ({children}) => (
            <blockquote className="border-l-4 border-violet-500/50 pl-4 italic text-slate-500 dark:text-white/40">
              {children}
            </blockquote>
          ),
          ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
          li: ({children}) => <li className="text-slate-700 dark:text-white/70">{children}</li>,
          a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">{children}</a>,
        }}
      >
        {displayed + (isTyping ? ' ▍' : '')}
      </ReactMarkdown>
    </div>
  );
}
