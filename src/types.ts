export type Priority = "low" | "medium" | "high" | "critical";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  dueDate: string | null;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: KanbanColumn[];
  cards: Record<string, KanbanCard>;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  boards: Board[];
  activeBoardId: string;
  theme: "light" | "dark";
}