import { useState, useRef, useEffect } from "react";
import {
  Folder, FolderOpen, FilePlus, FolderPlus, Trash2, Edit2, Check, X,
  ChevronRight, ChevronDown, FileCode, FileText, Globe, Palette,
} from "lucide-react";
import type { FileNode } from "../../hooks/use-socket";

interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onCreateItem: (parentId: string | null, name: string, type: "file" | "folder") => void;
  onDeleteItem: (id: string) => void;
  onRenameItem: (id: string, name: string) => void;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const iconClass = "shrink-0";
  const size = 14;
  switch (ext) {
    case "js": case "jsx": return <span className={`${iconClass} text-[#f7df1e] font-bold text-[10px] w-4 text-center`}>JS</span>;
    case "ts": case "tsx": return <span className={`${iconClass} text-[#3178c6] font-bold text-[10px] w-4 text-center`}>TS</span>;
    case "py": return <span className={`${iconClass} text-[#3776ab] font-bold text-[10px] w-4 text-center`}>PY</span>;
    case "java": return <span className={`${iconClass} text-[#f89820] font-bold text-[10px] w-4 text-center`}>JV</span>;
    case "cpp": case "cc": case "cxx": case "c": return <span className={`${iconClass} text-[#004482] font-bold text-[10px] w-4 text-center`}>C+</span>;
    case "html": case "htm": return <Globe size={size} className={`${iconClass} text-[#e34f26]`} />;
    case "css": return <Palette size={size} className={`${iconClass} text-[#1572b6]`} />;
    case "json": return <span className={`${iconClass} text-[#f0a500] font-bold text-[10px] w-4 text-center`}>{"{}"}</span>;
    case "md": return <FileText size={size} className={`${iconClass} text-[#94a3b8]`} />;
    case "rs": return <span className={`${iconClass} text-[#ce422b] font-bold text-[10px] w-4 text-center`}>RS</span>;
    case "go": return <span className={`${iconClass} text-[#00add8] font-bold text-[10px] w-4 text-center`}>GO</span>;
    default: return <FileCode size={size} className={`${iconClass} text-[#94a3b8]`} />;
  }
}

interface NewItemInputProps {
  type: "file" | "folder";
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function NewItemInput({ type, onConfirm, onCancel }: NewItemInputProps) {
  const [value, setValue] = useState(type === "file" ? "newfile.js" : "newfolder");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const confirm = () => {
    const name = value.trim();
    if (name) onConfirm(name);
    else onCancel();
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#0f172a]/80 border border-[#3b82f6]/40 rounded mx-2 my-0.5">
      {type === "file" ? <FileCode size={12} className="text-[#3b82f6] shrink-0" /> : <Folder size={12} className="text-yellow-400 shrink-0" />}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirm();
          if (e.key === "Escape") onCancel();
        }}
        onBlur={onCancel}
        className="flex-1 bg-transparent text-xs text-[#f8fafc] focus:outline-none min-w-0"
      />
    </div>
  );
}

interface RenameInputProps {
  defaultValue: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function RenameInput({ defaultValue, onConfirm, onCancel }: RenameInputProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const dot = defaultValue.lastIndexOf(".");
    inputRef.current?.setSelectionRange(0, dot > 0 ? dot : defaultValue.length);
  }, [defaultValue]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => { if (value.trim()) onConfirm(value.trim()); else onCancel(); }}
      className="flex-1 bg-[#0f172a] border border-[#3b82f6]/50 rounded px-1 text-xs text-[#f8fafc] focus:outline-none min-w-0"
    />
  );
}

interface TreeNodeProps {
  node: FileNode;
  allFiles: FileNode[];
  depth: number;
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onCreateItem: (parentId: string | null, name: string, type: "file" | "folder") => void;
  onDeleteItem: (id: string) => void;
  onRenameItem: (id: string, name: string) => void;
}

function TreeNode({
  node, allFiles, depth, activeFileId, onSelectFile, onCreateItem, onDeleteItem, onRenameItem,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const children = allFiles.filter((f) => f.parentId === node.id);
  const isActive = node.id === activeFileId;
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) setIsOpen((v) => !v);
    else onSelectFile(node.id);
  };

  const handleCreate = (type: "file" | "folder") => {
    setIsOpen(true);
    setCreating(type);
  };

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 h-7 pr-2 rounded cursor-pointer select-none transition-colors relative ${
          isActive ? "bg-[#3b82f6]/15 text-[#3b82f6]" : "hover:bg-[#1e293b]/60 text-[#94a3b8] hover:text-[#f8fafc]"
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {isFolder ? (
          <span className="shrink-0 text-[#64748b]">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {isFolder
          ? (isOpen ? <FolderOpen size={14} className="shrink-0 text-[#f59e0b]" /> : <Folder size={14} className="shrink-0 text-[#f59e0b]" />)
          : getFileIcon(node.name)
        }

        {renaming ? (
          <RenameInput
            defaultValue={node.name}
            onConfirm={(name) => { onRenameItem(node.id, name); setRenaming(false); }}
            onCancel={() => setRenaming(false)}
          />
        ) : (
          <span className="flex-1 text-xs truncate font-medium" onDoubleClick={() => setRenaming(true)}>
            {node.name}
          </span>
        )}

        {hovering && !renaming && (
          <div className="flex items-center gap-0.5 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
            {isFolder && (
              <>
                <button onClick={() => handleCreate("file")} className="p-1 rounded hover:bg-[#334155] text-[#64748b] hover:text-[#94a3b8] transition-colors" title="New File">
                  <FilePlus size={11} />
                </button>
                <button onClick={() => handleCreate("folder")} className="p-1 rounded hover:bg-[#334155] text-[#64748b] hover:text-[#94a3b8] transition-colors" title="New Folder">
                  <FolderPlus size={11} />
                </button>
              </>
            )}
            <button onClick={() => setRenaming(true)} className="p-1 rounded hover:bg-[#334155] text-[#64748b] hover:text-[#94a3b8] transition-colors" title="Rename">
              <Edit2 size={11} />
            </button>
            {node.parentId !== null && (
              <button onClick={() => onDeleteItem(node.id)} className="p-1 rounded hover:bg-red-500/20 text-[#64748b] hover:text-red-400 transition-colors" title="Delete">
                <Trash2 size={11} />
              </button>
            )}
          </div>
        )}
      </div>

      {isFolder && creating && isOpen && (
        <NewItemInput
          type={creating}
          onConfirm={(name) => { onCreateItem(node.id, name, creating); setCreating(null); }}
          onCancel={() => setCreating(null)}
        />
      )}

      {isFolder && isOpen && children.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          allFiles={allFiles}
          depth={depth + 1}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onCreateItem={onCreateItem}
          onDeleteItem={onDeleteItem}
          onRenameItem={onRenameItem}
        />
      ))}
    </div>
  );
}

export function FileTree({
  files, activeFileId, onSelectFile, onCreateItem, onDeleteItem, onRenameItem,
}: FileTreeProps) {
  const [newItemAtRoot, setNewItemAtRoot] = useState<"file" | "folder" | null>(null);

  const roots = files.filter((f) => f.parentId === null);
  const rootFolderId = roots.find((f) => f.type === "folder")?.id ?? null;

  return (
    <div className="flex flex-col h-full bg-[#111827] border-r border-[#334155] w-52 shrink-0 select-none overflow-hidden">
      <div className="h-9 flex items-center justify-between px-3 border-b border-[#334155] bg-[#1a2744] shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Explorer</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setNewItemAtRoot("file")}
            className="p-1.5 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
            title="New File"
          >
            <FilePlus size={13} />
          </button>
          <button
            onClick={() => setNewItemAtRoot("folder")}
            className="p-1.5 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
            title="New Folder"
          >
            <FolderPlus size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {newItemAtRoot && (
          <NewItemInput
            type={newItemAtRoot}
            onConfirm={(name) => {
              onCreateItem(rootFolderId, name, newItemAtRoot);
              setNewItemAtRoot(null);
            }}
            onCancel={() => setNewItemAtRoot(null)}
          />
        )}

        {roots.map((root) => (
          <TreeNode
            key={root.id}
            node={root}
            allFiles={files}
            depth={0}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
            onCreateItem={onCreateItem}
            onDeleteItem={onDeleteItem}
            onRenameItem={onRenameItem}
          />
        ))}

        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-[#64748b] text-xs text-center gap-2 px-4">
            <FileCode size={24} className="opacity-40" />
            <span>No files yet.<br />Create one above.</span>
          </div>
        )}
      </div>
    </div>
  );
}
