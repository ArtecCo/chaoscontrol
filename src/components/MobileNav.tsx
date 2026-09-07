import { CheckSquare, LayoutDashboard, Plus, Settings } from "lucide-react";

interface Props {
  onAdd: () => void;
  onSettings: () => void;
}

export default function MobileNav({ onAdd, onSettings }: Props) {
  return (
    <nav className="mobile-nav">
      <button type="button">
        <LayoutDashboard size={19} />
        <span>Board</span>
      </button>
      <button type="button" onClick={onAdd} className="mobile-add">
        <Plus size={22} />
        <span>Add</span>
      </button>
      <button type="button">
        <CheckSquare size={19} />
        <span>Tasks</span>
      </button>
      <button type="button" onClick={onSettings}>
        <Settings size={19} />
        <span>Settings</span>
      </button>
    </nav>
  );
}