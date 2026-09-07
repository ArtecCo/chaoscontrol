import { Archive, Bookmark, Download, LayoutDashboard, Plus, Settings, Upload } from "lucide-react";
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
      <div className="brand">
        <div className="brand-mark">C</div>
        <div className="brand-copy">
          <strong>Chaos Control</strong>
          <span>Personal workspace</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">Workspace</div>
        <button className="nav-item active" type="button">
          <LayoutDashboard size={16} />
          <span>Board overview</span>
        </button>
        <button className="nav-item" type="button">
          <Bookmark size={16} />
          <span>My work</span>
        </button>

        <div className="section-label">
          <span>Boards</span>
          <button type="button" onClick={onAddBoard} aria-label="Create board"><Plus size={15} /></button>
        </div>
        <div className="board-list">
          {boards.map((board) => (
            <button key={board.id} className={`nav-item board-nav ${board.id === activeBoardId ? "selected" : ""}`} type="button" onClick={() => onSelectBoard(board.id)}>
              <span className="board-dot" />
              <span className="truncate">{board.title}</span>
              <span className="board-count">{Object.keys(board.cards).length}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" type="button" onClick={onExport}><Download size={16} /><span>Export backup</span></button>
        <button className="nav-item" type="button" onClick={onImport}><Upload size={16} /><span>Import backup</span></button>
        <button className="nav-item" type="button" onClick={onSettings}><Settings size={16} /><span>Settings</span></button>
        <div className="sidebar-tip">
          <Archive size={16} />
          <div><strong>Synced workspace</strong><span>Your changes are saved to Firebase.</span></div>
        </div>
      </div>
    </aside>
  );
}
