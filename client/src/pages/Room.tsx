import { useState } from "react";
import { useParams } from "wouter";
import { TopNav } from "../components/IDE/TopNav";
import { Editor } from "../components/IDE/Editor";
import { Console } from "../components/IDE/Console";
import { ChatPanel } from "../components/IDE/ChatPanel";
import { FileTree } from "../components/IDE/FileTree";
import { useSocket } from "../hooks/use-socket";
import { useRunCode } from "../hooks/use-run-code";

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();

  const { 
    isConnected, usersOnline, username, messages, isHost, users, roles, myRole, assignRole, sendMessage, changeUsername,
    files, activeFileId, selectFile, createItem, deleteItem, renameItem, sendFileContentUpdate
  } = useSocket(roomId || "default-room");

  const { mutate: runCode, isPending: isRunning } = useRunCode();
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) ?? null;
  const activeCode = activeFile?.content ?? "";
  const activeLanguage = activeFile?.language ?? "javascript";
  const activeFilename = activeFile?.name ?? "";

  const handleCodeChange = (code: string) => {
    if (activeFileId) sendFileContentUpdate(activeFileId, code);
  };

  const handleRunCode = () => {
    setOutput("");
    setError(null);
    if (activeLanguage !== "javascript") {
      setError(`Execution is only supported for JavaScript.\nOpen or create a .js file to run code.`);
      return;
    }
    
    runCode(activeCode, {
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
      <TopNav 
        roomId={roomId} 
        usersOnline={usersOnline} 
        isConnected={isConnected} 
        isHost={isHost}
        users={users}
        roles={roles}
        currentUser={username}
        myRole={myRole}
        onAssignRole={assignRole}
        onChangeUsername={changeUsername}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: File Explorer */}
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onSelectFile={selectFile}
          onCreateItem={createItem}
          onDeleteItem={deleteItem}
          onRenameItem={renameItem}
        />

        {/* Center: Editor + Console */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <Editor 
            code={activeCode} 
            readOnly={myRole === "navigator"} 
            filename={activeFilename}
            language={activeLanguage}
            onChange={handleCodeChange} 
          />
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
