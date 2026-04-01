import { Terminal, Play, Trash2, AlertCircle } from "lucide-react";

interface ConsoleProps {
  output: string;
  error?: string | null;
  isRunning: boolean;
  onRun: () => void;
  onClear: () => void;
  className?: string;
}

export function Console({ output, error, isRunning, onRun, onClear, className = "" }: ConsoleProps) {
  return (
    <div className={`flex flex-col bg-[#0a1120] border-t border-[#334155] ${className}`}>
      <div className="h-10 flex items-center justify-between px-4 border-b border-[#334155] bg-[#1a2744] shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          <Terminal size={14} />
          <span>Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] rounded transition-colors"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#10b981] hover:bg-[#059669] rounded shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={14} className={isRunning ? "animate-pulse" : ""} fill="currentColor" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
        {!output && !error && (
          <div className="text-[#64748b] italic h-full flex items-center justify-center">
            Output will appear here...
          </div>
        )}
        {output && <pre className="text-[#f8fafc] whitespace-pre-wrap mb-2">{output}</pre>}
        {error && (
          <div className="flex items-start gap-2 text-[#ef4444] mt-2 p-3 bg-[#ef4444]/10 rounded border border-[#ef4444]/20">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap break-words">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
