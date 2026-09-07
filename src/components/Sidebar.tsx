import { Archive, ChevronDown, Download, LayoutDashboard, Plus, Settings, Upload } from "lucide-react";
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

export default function Sidebar({
  boards,
  activeBoardId,
  onSelectBoard,
  onAddBoard,
  onExport,
  onImport,
  onSettings,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">K</div>
        <div>
          <strong>Kanban</strong>
          <span>Personal workspace</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active" type="button">
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <div className="section-label">
          <span>Boards</span>
          <button type="button" onClick={onAddBoard} aria-label="Add board">
            <Plus size={16} />
          </button>
        </div>
        {boards.map((board) => (
          <button
            key={board.id}
            className={`nav-item board-nav ${board.id === activeBoardId ? "selected" : ""}`}
            type="button"
            onClick={() => onSelectBoard(board.id)}
          >
            <span className="board-dot" />
            <span className="truncate">{board.title}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" type="button" onClick={onExport}>
          <Download size={17} /> Export backup
        </button>
        <button className="nav-item" type="button" onClick={onImport}>
          <Upload size={17} /> Import backup
        </button>
        <button className="nav-item" type="button" onClick={onSettings}>
          <Settings size={17} /> Settings
        </button>
        <div className="sidebar-tip">
          <Archive size={17} />
          <div>
            <strong>Local storage</strong>
            <span>Your data stays in this browser for now.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}