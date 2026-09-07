import type { AppData, Board } from "../types";

const STORAGE_KEY = "chaos-control-data-v1";

const now = () => new Date().toISOString();

const id = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createId = id;

function seedBoard(): Board {
  const cards = {
    "card-welcome": {
      id: "card-welcome",
      title: "Welcome to your personal Kanban",
      description: "Drag this card between columns, or open it to edit the details.",
      priority: "medium" as const,
      tags: ["Personal"],
      dueDate: null,
      checklist: [
        { id: "check-1", text: "Move this card around", completed: false },
        { id: "check-2", text: "Create your first task", completed: false },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    "card-finance": {
      id: "card-finance",
      title: "Review monthly finances",
      description: "Check spending, subscriptions and upcoming payments.",
      priority: "high" as const,
      tags: ["Finance"],
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      checklist: [
        { id: "check-3", text: "Review transactions", completed: true },
        { id: "check-4", text: "Check subscriptions", completed: false },
        { id: "check-5", text: "Update budget", completed: false },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    "card-website": {
      id: "card-website",
      title: "Build personal website",
      description: "Create a clean landing page and deploy it.",
      priority: "critical" as const,
      tags: ["Projects", "Web"],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      checklist: [],
      createdAt: now(),
      updatedAt: now(),
    },
    "card-shopping": {
      id: "card-shopping",
      title: "Compare monitor options",
      description: "Shortlist a few monitors before buying.",
      priority: "low" as const,
      tags: ["Shopping"],
      dueDate: null,
      checklist: [],
      createdAt: now(),
      updatedAt: now(),
    },
  };

  return {
    id: "board-personal",
    title: "Personal",
    description: "Your personal command center",
    columns: [
      { id: "backlog", title: "Backlog", color: "#94a3b8", cardIds: ["card-shopping"] },
      { id: "planned", title: "Planned", color: "#3b82f6", cardIds: ["card-finance"] },
      { id: "progress", title: "In Progress", color: "#eab308", cardIds: ["card-website"] },
      { id: "done", title: "Done", color: "#22c55e", cardIds: ["card-welcome"] },
    ],
    cards,
    createdAt: now(),
    updatedAt: now(),
  };
}

export function createInitialData(): AppData {
  const board = seedBoard();
  return {
    boards: [board],
    activeBoardId: board.id,
    theme: "light",
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.boards?.length) return createInitialData();
    return parsed;
  } catch {
    return createInitialData();
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `personal-kanban-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        if (!parsed.boards?.length) throw new Error("Invalid backup.");
        resolve(parsed);
      } catch {
        reject(new Error("That file is not a valid Kanban backup."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}