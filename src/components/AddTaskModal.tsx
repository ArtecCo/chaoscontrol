import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { KanbanCard, Priority } from "../types";
import { createId } from "../data/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (card: KanbanCard, columnId: string) => void;
  defaultColumnId: string;
}

export default function AddTaskModal({ open, onClose, onCreate, defaultColumnId }: Props) {
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId);
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) return;
    const stamp = new Date().toISOString();
    onCreate(
      {
        id: createId("card"),
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: [],
        dueDate: null,
        checklist: [],
        createdAt: stamp,
        updatedAt: stamp,
      },
      columnId,
    );
    setTitle("");
    setDescription("");
    setPriority("medium");
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="task-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Quick add</span>
            <h2>Create a task</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <div className="modal-body">
          <label className="field">
            <span>Task title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Renew car insurance"
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional"
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Column</span>
              <select value={columnId} onChange={(e) => setColumnId(e.target.value)}>
                {/* options injected by App through defaultColumnId only for now */}
                <option value={columnId}>Current column</option>
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="button" onClick={submit}>
            <Plus size={16} /> Create task
          </button>
        </div>
      </div>
    </div>
  );
}