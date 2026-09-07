import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CheckCircle2, GripVertical, MoreHorizontal } from "lucide-react";
import type { KanbanCard as CardType } from "../types";

interface Props { card: CardType; onOpen: (id: string) => void; }

const priorityLabel = { low: "Low", medium: "Medium", high: "High", critical: "Critical" };

export default function KanbanCard({ card, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id, data: { type: "card", card } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const completed = card.checklist.filter((item) => item.completed).length;
  const total = card.checklist.length;
  const shortId = card.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  const overdue = card.dueDate ? new Date(`${card.dueDate}T23:59:59`) < new Date() : false;

  return (
    <article ref={setNodeRef} style={style} className={`kanban-card ${isDragging ? "dragging" : ""}`} onClick={() => onOpen(card.id)}>
      <div className="issue-line">
        <span className="issue-key">CC-{shortId}</span>
        <button className="drag-handle" type="button" aria-label="Drag card" onClick={(event) => event.stopPropagation()} {...attributes} {...listeners}><GripVertical size={14} /></button>
        <button className="card-menu" type="button" aria-label="Open task" onClick={(event) => { event.stopPropagation(); onOpen(card.id); }}><MoreHorizontal size={16} /></button>
      </div>

      <h3>{card.title}</h3>

      {card.description && <p>{card.description}</p>}

      <div className="card-labels">
        <span className={`priority-badge ${card.priority}`}><span className="priority-dot" />{priorityLabel[card.priority]}</span>
        {card.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        {card.tags.length > 3 && <span className="tag-more">+{card.tags.length - 3}</span>}
      </div>

      {(card.dueDate || total > 0) && (
        <div className="card-meta">
          {card.dueDate && <span className={overdue ? "overdue" : ""}><CalendarDays size={12} />{new Date(`${card.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>}
          {total > 0 && <span><CheckCircle2 size={12} />{completed}/{total}</span>}
        </div>
      )}
    </article>
  );
}
