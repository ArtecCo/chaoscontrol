import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Plus, Save, Trash2, X } from "lucide-react";
import type { KanbanCard, Priority } from "../types";
import { createId } from "../data/storage";

interface Props {
  card: KanbanCard | null;
  onClose: () => void;
  onSave: (card: KanbanCard) => void;
  onDelete: (id: string) => void;
}

export default function TaskDrawer({ card, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<KanbanCard | null>(card);

  useEffect(() => setDraft(card), [card]);

  const completed = useMemo(
    () => draft?.checklist.filter((item) => item.completed).length ?? 0,
    [draft],
  );

  if (!draft) return null;

  const update = (patch: Partial<KanbanCard>) => setDraft((current) => current ? { ...current, ...patch } : current);

  const addChecklistItem = () => {
    const text = window.prompt("Checklist item");
    if (!text?.trim()) return;
    update({
      checklist: [...draft.checklist, { id: createId("check"), text: text.trim(), completed: false }],
    });
  };

  const toggleChecklist = (id: string) => {
    update({
      checklist: draft.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    });
  };

  const save = () => {
    onSave({ ...draft, updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="task-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Task details</span>
            <h2>Edit task</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <div className="drawer-body">
          <label className="field">
            <span>Title</span>
            <input
              autoFocus
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="What needs to be done?"
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Add some context..."
              rows={4}
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Priority</span>
              <select
                value={draft.priority}
                onChange={(e) => update({ priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>

            <label className="field">
              <span><CalendarDays size={14} /> Due date</span>
              <input
                type="date"
                value={draft.dueDate ?? ""}
                onChange={(e) => update({ dueDate: e.target.value || null })}
              />
            </label>
          </div>

          <label className="field">
            <span>Tags <small>comma separated</small></span>
            <input
              value={draft.tags.join(", ")}
              onChange={(e) =>
                update({
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Work, Finance"
            />
          </label>

          <section className="checklist-section">
            <div className="section-heading">
              <div>
                <span>Checklist</span>
                {draft.checklist.length > 0 && <small>{completed}/{draft.checklist.length} complete</small>}
              </div>
              <button className="small-button" type="button" onClick={addChecklistItem}>
                <Plus size={14} /> Add
              </button>
            </div>

            {draft.checklist.map((item) => (
              <button
                className={`check-item ${item.completed ? "done" : ""}`}
                key={item.id}
                type="button"
                onClick={() => toggleChecklist(item.id)}
              >
                <span className="check-circle">{item.completed && <Check size={13} />}</span>
                <span>{item.text}</span>
              </button>
            ))}
            {draft.checklist.length === 0 && <p className="muted">Break this task into smaller steps when needed.</p>}
          </section>
        </div>

        <div className="drawer-footer">
          <button className="danger-button" type="button" onClick={() => onDelete(draft.id)}>
            <Trash2 size={16} /> Delete
          </button>
          <button className="primary-button" type="button" onClick={save}>
            <Save size={16} /> Save changes
          </button>
        </div>
      </aside>
    </div>
  );
}