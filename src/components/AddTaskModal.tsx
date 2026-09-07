import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import type { KanbanCard, KanbanColumn, Priority } from "../types";
import { createId } from "../data/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (card: KanbanCard, columnId: string) => void;
  defaultColumnId: string;
  columns: KanbanColumn[];
}

export default function AddTaskModal({ open, onClose, onCreate, defaultColumnId, columns }: Props) {
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId);
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      setColumnId(defaultColumnId || columns[0]?.id || "");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
  }, [open, defaultColumnId, columns]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim() || !columnId) return;
    const stamp = new Date().toISOString();
    onCreate(
      {
        id: createId("card"),
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: [],
        dueDate: dueDate || null,
        checklist: [],
        createdAt: stamp,
        updatedAt: stamp,
      },
      columnId,
    );
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="task-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">New task</span>
            <h2>Create something to move forward</h2>
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
              placeholder="What needs to be done?"
            />
          </label>

          <label className="field">
            <span>Description <small>optional</small></span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add useful context, links or notes..."
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Status</span>
              <select value={columnId} onChange={(e) => setColumnId(e.target.value)}>
                {columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
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

          <label className="field">
            <span>Due date <small>optional</small></span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>

        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="button" onClick={submit} disabled={!title.trim()}>
            <Plus size={16} /> Create task
          </button>
        </div>
      </div>
    </div>
  );
}
