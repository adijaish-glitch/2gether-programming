import { useState } from "react";
import { useParams } from "wouter";
import { TopNav } from "../components/IDE/TopNav";
import { Editor } from "../components/IDE/Editor";
import { Console } from "../components/IDE/Console";
import { ChatPanel } from "../components/IDE/ChatPanel";
import { useSocket } from "../hooks/use-socket";
import { useRunCode } from "../hooks/use-run-code";

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();

  const { isConnected, usersOnline, username, code, messages, sendCodeUpdate, sendMessage } =
    useSocket(roomId || "default-room");

  const { mutate: runCode, isPending: isRunning } = useRunCode();
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRunCode = () => {
    setOutput("");
    setError(null);
    runCode(code, {
      onSuccess: (data) => {
        setOutput(data.output);
        setError(data.error ?? null);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  if (!roomId) return null;

  return (
    <div className="h-screen w-full flex flex-col bg-[#1e1e1e] text-[#f8fafc] overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <TopNav roomId={roomId} usersOnline={usersOnline} isConnected={isConnected} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor + Console */}
        <div className="flex-1 flex flex-col min-w-0">
          <Editor code={code} onChange={sendCodeUpdate} />
          <Console
            className="h-1/3 min-h-[180px]"
            output={output}
            error={error}
            isRunning={isRunning}
            onRun={handleRunCode}
            onClear={() => { setOutput(""); setError(null); }}
          />
        </div>

        {/* Right: Chat */}
        <ChatPanel
          className="w-[280px] lg:w-[320px] shrink-0"
          messages={messages}
          currentUser={username}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
