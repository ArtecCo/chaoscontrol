import { Archive, BarChart3, Bookmark, Download, FolderKanban, Inbox, LayoutDashboard, Plus, Settings, Tag, Upload } from "lucide-react";
import type { Board } from "../types";

interface Props {
  boards: Board[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
  onAddBoard: () => void;
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
}

export default function Sidebar({ boards, activeBoardId, onSelectBoard, onAddBoard, onExport, onImport, onSettings }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">C</div>
        <div><strong>Chaos Control</strong><span>Workspace</span></div>
      </div>

      <div className="workspace-switcher">
        <div className="workspace-avatar">CC</div>
        <div><strong>Personal workspace</strong><span>{boards.length} board{boards.length === 1 ? "" : "s"}</span></div>
        <span className="workspace-chevron">⌄</span>
      </div>

      <nav className="global-nav">
        <div className="nav-caption">Navigation</div>
        <button className="global-nav-item selected" type="button"><LayoutDashboard size={15} /><span>Boards</span></button>
        <button className="global-nav-item" type="button"><Inbox size={15} /><span>Issues</span><kbd>G I</kbd></button>
        <button className="global-nav-item" type="button"><Bookmark size={15} /><span>My work</span></button>
        <button className="global-nav-item" type="button"><BarChart3 size={15} /><span>Reports</span></button>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-title"><span>Boards</span><button type="button" onClick={onAddBoard} aria-label="Create board"><Plus size={14} /></button></div>
        <div className="board-list">
          {boards.map((board) => (
            <button key={board.id} className={`board-nav ${board.id === activeBoardId ? "selected" : ""}`} type="button" onClick={() => onSelectBoard(board.id)}>
              <FolderKanban size={14} /><span className="truncate">{board.title}</span><span className="board-count">{Object.keys(board.cards).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section secondary-section">
        <div className="sidebar-section-title"><span>Shortcuts</span></div>
        <button className="board-nav" type="button"><Tag size={14} /><span>Tags</span></button>
        <button className="board-nav" type="button"><Bookmark size={14} /><span>Saved searches</span></button>
      </div>

      <div className="sidebar-bottom">
        <button className="board-nav" type="button" onClick={onExport}><Download size={14} /><span>Export backup</span></button>
        <button className="board-nav" type="button" onClick={onImport}><Upload size={14} /><span>Import backup</span></button>
        <button className="board-nav" type="button" onClick={onSettings}><Settings size={14} /><span>Settings</span></button>
        <div className="sidebar-sync"><Archive size={14} /><span>Synced to Firebase</span></div>
      </div>
    </aside>
  );
}
