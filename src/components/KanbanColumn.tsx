import { useDroppable } from "@dnd-kit/core";
import { MoreHorizontal, Plus } from "lucide-react";
import type { KanbanCard, KanbanColumn as ColumnType } from "../types";
import KanbanCardView from "./KanbanCard";

interface Props { column: ColumnType; cards: KanbanCard[]; onOpenCard: (id: string) => void; onAddCard: (columnId: string) => void; onDeleteColumn: (columnId: string) => void; }

export default function KanbanColumn({ column, cards, onOpenCard, onAddCard, onDeleteColumn }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: "column", column } });
  return (
    <section ref={setNodeRef} className={`kanban-column ${isOver ? "column-over" : ""}`}>
      <div className="column-header">
        <div className="column-title"><span className="status-dot" style={{ background: column.color }} /><strong>{column.title}</strong><span className="count">{cards.length}</span></div>
        <button className="column-menu" type="button" aria-label={`Delete ${column.title} column`} onClick={() => onDeleteColumn(column.id)}><MoreHorizontal size={16} /></button>
      </div>
      <div className="card-list">
        {cards.map((card) => <KanbanCardView key={card.id} card={card} onOpen={onOpenCard} />)}
        {cards.length === 0 && <div className="empty-column"><span>No issues</span><small>Drag an issue here or create one below.</small></div>}
      </div>
      <button className="add-card-button" type="button" onClick={() => onAddCard(column.id)}><Plus size={14} /> Add issue</button>
    </section>
  );
}
