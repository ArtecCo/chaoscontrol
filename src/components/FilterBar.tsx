import { Filter, Plus, SlidersHorizontal } from "lucide-react";
import type { Priority } from "../types";

interface Props {
  priority: Priority | "all";
  setPriority: (value: Priority | "all") => void;
  onAddTask: () => void;
  onAddColumn: () => void;
}

export default function FilterBar({ priority, setPriority, onAddTask, onAddColumn }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <div className="toolbar-context"><Filter size={14} /><span>Filter</span></div>
        <label className={`toolbar-select ${priority !== "all" ? "active" : ""}`}>
          <span>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "all")}>
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        {priority !== "all" && <button className="filter-chip" type="button" onClick={() => setPriority("all")}>Priority: {priority} ×</button>}
        <button className="toolbar-button desktop-only" type="button" onClick={onAddColumn}><SlidersHorizontal size={14} /> Add column</button>
      </div>
      <button className="primary-button" type="button" onClick={onAddTask}><Plus size={16} /><span>Create issue</span></button>
    </div>
  );
}
