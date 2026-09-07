import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Plus, Save, Trash2, X } from "lucide-react";
import type { KanbanCard, Priority } from "../types";
import { createId } from "../data/storage";

interface Props { card: KanbanCard | null; onClose: () => void; onSave: (card: KanbanCard) => void; onDelete: (id: string) => void; }
const priorityLabel: Record<Priority, string> = { low: "Low", medium: "Medium", high: "High", critical: "Critical" };
export default function TaskDrawer({ card, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<KanbanCard | null>(card); useEffect(() => setDraft(card), [card]);
  const completed = useMemo(() => draft?.checklist.filter((item) => item.completed).length ?? 0, [draft]); if (!draft) return null;
  const update = (patch: Partial<KanbanCard>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const addChecklistItem = () => { const text = window.prompt("Checklist item"); if (!text?.trim()) return; update({ checklist: [...draft.checklist, { id: createId("check"), text: text.trim(), completed: false }] }); };
  const toggleChecklist = (id: string) => update({ checklist: draft.checklist.map((item) => item.id === id ? { ...item, completed: !item.completed } : item) });
  const save = () => { if (!draft.title.trim()) return; onSave({ ...draft, title: draft.title.trim(), updatedAt: new Date().toISOString() }); onClose(); };
  const key = `CC-${draft.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`;
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="task-drawer" onMouseDown={(event) => event.stopPropagation()}>
    <div className="drawer-header"><div><span className="eyebrow">{key} · Issue</span><h2>{draft.title || "Untitled issue"}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
    <div className="drawer-body">
      <label className="field"><span>Summary</span><input autoFocus value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="What needs to be done?" /></label>
      <label className="field"><span>Description <small>optional</small></span><textarea value={draft.description} onChange={(e) => update({ description: e.target.value })} placeholder="Add useful context, links or notes..." rows={6} /></label>
      <div className="task-property-grid"><label className="property-field"><span>Priority</span><select value={draft.priority} onChange={(e) => update({ priority: e.target.value as Priority })}>{(Object.keys(priorityLabel) as Priority[]).map((value) => <option key={value} value={value}>{priorityLabel[value]}</option>)}</select></label><label className="property-field"><span><CalendarDays size={13} /> Due date</span><input type="date" value={draft.dueDate ?? ""} onChange={(e) => update({ dueDate: e.target.value || null })} /></label></div>
      <label className="field"><span>Tags <small>comma separated</small></span><input value={draft.tags.join(", ")} onChange={(e) => update({ tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="Work, Finance" /></label>
      <section className="checklist-section"><div className="section-heading"><div><span>Checklist</span>{draft.checklist.length > 0 && <small>{completed}/{draft.checklist.length} complete</small>}</div><button className="small-button" type="button" onClick={addChecklistItem}><Plus size={14} /> Add item</button></div>{draft.checklist.length > 0 && <div className="checklist-progress"><div><span style={{ width: `${(completed / draft.checklist.length) * 100}%` }} /></div></div>}{draft.checklist.map((item) => <button className={`check-item ${item.completed ? "done" : ""}`} key={item.id} type="button" onClick={() => toggleChecklist(item.id)}><span className="check-circle">{item.completed && <Check size={13} />}</span><span>{item.text}</span></button>)}{draft.checklist.length === 0 && <p className="muted">Break this issue into smaller steps when needed.</p>}</section>
      <div className="task-info"><span>Created {new Date(draft.createdAt).toLocaleDateString()}</span><span>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span></div>
    </div>
    <div className="drawer-footer"><button className="danger-button" type="button" onClick={() => onDelete(draft.id)}><Trash2 size={16} /> Delete</button><button className="primary-button" type="button" onClick={save} disabled={!draft.title.trim()}><Save size={16} /> Save changes</button></div>
  </aside></div>;
}
