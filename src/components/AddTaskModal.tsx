import { useEffect, useState } from "react";
import { CheckSquare, Plus, Tag, X } from "lucide-react";
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
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [checklistInput, setChecklistInput] = useState("");
  const [checklist, setChecklist] = useState<KanbanCard["checklist"]>([]);

  useEffect(() => {
    if (open) {
      setColumnId(defaultColumnId || columns[0]?.id || "");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setTagInput("");
      setTags([]);
      setChecklistInput("");
      setChecklist([]);
    }
  }, [open, defaultColumnId, columns]);

  if (!open) return null;

  const addTag = () => {
    const value = tagInput.trim().replace(/^#/, "");
    if (!value || tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) return;
    setTags((current) => [...current, value]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((current) => current.filter((item) => item !== tag));

  const addChecklistItem = () => {
    const value = checklistInput.trim();
    if (!value) return;
    setChecklist((current) => [...current, { id: createId("check"), text: value, completed: false }]);
    setChecklistInput("");
  };

  const removeChecklistItem = (id: string) => setChecklist((current) => current.filter((item) => item.id !== id));

  const submit = () => {
    if (!title.trim() || !columnId) return;
    addTag();
    const stamp = new Date().toISOString();
    onCreate(
      {
        id: createId("card"),
        title: title.trim(),
        description: description.trim(),
        priority,
        tags,
        dueDate: dueDate || null,
        checklist,
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
          <div className="modal-title-block">
            <span className="eyebrow">New issue</span>
            <h2>Create task</h2>
            <p>Capture the work, context and next steps.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <div className="modal-body">
          <label className="field field-title">
            <span>Summary</span>
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
              placeholder="Add useful context, links or acceptance notes..."
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

          <div className="field-grid">
            <label className="field">
              <span>Due date <small>optional</small></span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>
            <div className="field">
              <span><Tag size={13} /> Tags</span>
              <div className="token-input">
                {tags.map((tag) => (
                  <button className="token" key={tag} type="button" onClick={() => removeTag(tag)} title="Remove tag">
                    #{tag}<X size={11} />
                  </button>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder={tags.length ? "Add tag..." : "e.g. frontend"}
                />
              </div>
            </div>
          </div>

          <section className="create-checklist">
            <div className="create-section-heading">
              <div>
                <span><CheckSquare size={14} /> Checklist</span>
                <small>{checklist.length ? `${checklist.length} step${checklist.length === 1 ? "" : "s"}` : "Optional"}</small>
              </div>
            </div>
            <div className="checklist-entry">
              <input
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
                placeholder="Add a step and press Enter"
              />
              <button className="small-button" type="button" onClick={addChecklistItem} disabled={!checklistInput.trim()}>
                <Plus size={14} /> Add
              </button>
            </div>
            {checklist.length > 0 && (
              <div className="create-checklist-list">
                {checklist.map((item, index) => (
                  <div className="create-checklist-item" key={item.id}>
                    <span>{index + 1}</span>
                    <strong>{item.text}</strong>
                    <button type="button" onClick={() => removeChecklistItem(item.id)} aria-label={`Remove ${item.text}`}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
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
