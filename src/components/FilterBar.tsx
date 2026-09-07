import { Filter, ListFilter, Plus, SlidersHorizontal } from "lucide-react";
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
        <button className="toolbar-button" type="button">
          <ListFilter size={16} />
          View
        </button>
        <label className="toolbar-select">
          <Filter size={16} />
          <span>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "all")}>
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <button className="toolbar-button desktop-only" type="button" onClick={onAddColumn}>
          <SlidersHorizontal size={16} />
          Add column
        </button>
      </div>

      <button className="primary-button" type="button" onClick={onAddTask}>
        <Plus size={17} />
        <span>Add task</span>
      </button>
    </div>
  );
}