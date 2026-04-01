import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
}

export function Editor({ code, onChange }: EditorProps) {
  return (
    <div className="flex-1 relative bg-[#1e1e1e] flex flex-col min-h-0">
      <div className="h-9 border-b border-[#334155] bg-[#252526] flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2 bg-[#1e1e1e] border-t border-l border-r border-[#334155] px-4 py-1.5 rounded-t text-xs font-medium text-[#3b82f6] -mb-[1px]">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]/50" />
          index.js
        </div>
      </div>
      <div className="flex-1 w-full relative">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', Menlo, monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            overviewRulerLanes: 0,
            wordWrap: "on",
          }}
          loading={
            <div className="flex items-center justify-center h-full w-full bg-[#1e1e1e] text-[#94a3b8]">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
