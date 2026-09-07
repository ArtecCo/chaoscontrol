import { useEffect, useMemo, useRef, useState } from "react";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CalendarDays, CheckCircle2, Plus, X } from "lucide-react";
import type { AppData, Board, KanbanCard, Priority } from "./types";
import { createInitialData, createId, exportData, importData, loadData, saveData } from "./data/storage";
import { auth, firebaseConfigured } from "./firebase";
import { saveUserData, subscribeToUserData } from "./data/firestore";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FilterBar from "./components/FilterBar";
import KanbanColumn from "./components/KanbanColumn";
import TaskDrawer from "./components/TaskDrawer";
import AddTaskModal from "./components/AddTaskModal";
import MobileNav from "./components/MobileNav";

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [cloudReady, setCloudReady] = useState(!firebaseConfigured);
  const [cloudError, setCloudError] = useState("");
  const hydratedRef = useRef(!firebaseConfigured);
  const lastSavedRef = useRef("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [view, setView] = useState<"board" | "list">("board");
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState("");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    if (!firebaseConfigured || !auth?.currentUser) return;
    hydratedRef.current = false; setCloudReady(false); setCloudError("");
    const unsubscribe = subscribeToUserData(auth.currentUser.uid, loadData(), (remote) => {
      lastSavedRef.current = JSON.stringify(remote); setData(remote); hydratedRef.current = true; setCloudReady(true);
    }, (error) => { hydratedRef.current = false; setCloudError(error.message); setCloudReady(false); });
    return unsubscribe;
  }, []);

  useEffect(() => {
    saveData(data); document.documentElement.dataset.theme = data.theme;
    if (!firebaseConfigured || !auth?.currentUser || !hydratedRef.current) return;
    const serialized = JSON.stringify(data); if (serialized === lastSavedRef.current) return;
    lastSavedRef.current = serialized;
    void saveUserData(auth.currentUser.uid, data).catch((error) => setCloudError(error instanceof Error ? error.message : "Cloud save failed."));
  }, [data]);

  const board = data.boards.find((item) => item.id === data.activeBoardId) ?? data.boards[0];
  const filteredCards = useMemo(() => {
    if (!board) return new Set<string>(); const query = search.trim().toLowerCase();
    return new Set(Object.values(board.cards).filter((card) => {
      const searchMatch = !query || card.title.toLowerCase().includes(query) || card.description.toLowerCase().includes(query) || card.tags.some((tag) => tag.toLowerCase().includes(query));
      return searchMatch && (priority === "all" || card.priority === priority);
    }).map((card) => card.id));
  }, [board, search, priority]);
  const openCard = board?.cards[openCardId ?? ""] ?? null;
  const updateBoard = (updater: (current: Board) => Board) => setData((current) => ({ ...current, boards: current.boards.map((item) => item.id === board.id ? updater(item) : item) }));
  const selectBoard = (id: string) => { setData((current) => ({ ...current, activeBoardId: id })); setMobileSidebar(false); setSearch(""); setPriority("all"); };

  const addBoard = () => {
    const title = window.prompt("Board name", "New board"); if (!title?.trim()) return; const stamp = new Date().toISOString();
    const newBoard: Board = { id: createId("board"), title: title.trim(), description: "", columns: [
      { id: createId("column"), title: "Backlog", color: "#94a3b8", cardIds: [] }, { id: createId("column"), title: "In Progress", color: "#eab308", cardIds: [] }, { id: createId("column"), title: "Done", color: "#22c55e", cardIds: [] },
    ], cards: {}, createdAt: stamp, updatedAt: stamp };
    setData((current) => ({ ...current, boards: [...current.boards, newBoard], activeBoardId: newBoard.id }));
  };
  const addColumn = () => { const title = window.prompt("Column name", "New column"); if (!title?.trim()) return; updateBoard((current) => ({ ...current, columns: [...current.columns, { id: createId("column"), title: title.trim(), color: "#64748b", cardIds: [] }], updatedAt: new Date().toISOString() })); };
  const deleteColumn = (columnId: string) => {
    if (board.columns.length <= 1) return window.alert("A board needs at least one column."); const column = board.columns.find((item) => item.id === columnId); if (!column) return;
    if (column.cardIds.length > 0 && !window.confirm("This column contains issues. Delete it anyway?")) return;
    updateBoard((current) => { const cards = { ...current.cards }; column.cardIds.forEach((id) => delete cards[id]); return { ...current, cards, columns: current.columns.filter((item) => item.id !== columnId), updatedAt: new Date().toISOString() }; });
  };
  const openAddTask = (columnId = board.columns[0]?.id) => { setAddTaskColumn(columnId); setAddTaskOpen(true); };
  const createTask = (card: KanbanCard, columnId: string) => updateBoard((current) => ({ ...current, cards: { ...current.cards, [card.id]: card }, columns: current.columns.map((column) => column.id === columnId ? { ...column, cardIds: [...column.cardIds, card.id] } : column), updatedAt: new Date().toISOString() }));
  const saveCard = (card: KanbanCard) => updateBoard((current) => ({ ...current, cards: { ...current.cards, [card.id]: card }, updatedAt: new Date().toISOString() }));
  const deleteCard = (id: string) => { if (!window.confirm("Delete this issue?")) return; updateBoard((current) => { const cards = { ...current.cards }; delete cards[id]; return { ...current, cards, columns: current.columns.map((column) => ({ ...column, cardIds: column.cardIds.filter((cardId) => cardId !== id) })), updatedAt: new Date().toISOString() }; }); setOpenCardId(null); };
  const onDragStart = (event: { active: { id: string | number } }) => { const id = String(event.active.id); if (board.cards[id]) setDraggedCard(board.cards[id]); };
  const onDragCancel = () => setDraggedCard(null);
  const onDragEnd = (event: DragEndEvent) => {
    setDraggedCard(null); const activeId = String(event.active.id); const overId = event.over ? String(event.over.id) : null; if (!overId) return;
    const sourceColumn = board.columns.find((column) => column.cardIds.includes(activeId)); if (!sourceColumn) return;
    const destinationColumn = board.columns.find((column) => column.id === overId) ?? board.columns.find((column) => column.cardIds.includes(overId)); if (!destinationColumn) return;
    if (sourceColumn.id === destinationColumn.id) { const oldIndex = sourceColumn.cardIds.indexOf(activeId); const newIndex = destinationColumn.cardIds.indexOf(overId); if (newIndex < 0 || oldIndex === newIndex) return; updateBoard((current) => ({ ...current, columns: current.columns.map((column) => column.id === sourceColumn.id ? { ...column, cardIds: arrayMove(column.cardIds, oldIndex, newIndex) } : column), updatedAt: new Date().toISOString() })); return; }
    updateBoard((current) => { const source = current.columns.find((column) => column.id === sourceColumn.id)!; const destination = current.columns.find((column) => column.id === destinationColumn.id)!; const sourceCards = source.cardIds.filter((id) => id !== activeId); const targetIndex = destination.cardIds.indexOf(overId); const nextDestination = [...destination.cardIds.filter((id) => id !== activeId)]; nextDestination.splice(targetIndex >= 0 ? targetIndex : nextDestination.length, 0, activeId); return { ...current, columns: current.columns.map((column) => column.id === source.id ? { ...column, cardIds: sourceCards } : column.id === destination.id ? { ...column, cardIds: nextDestination } : column), updatedAt: new Date().toISOString() }; });
  };

  if (!board) { setData(createInitialData()); return null; }
  const totalCards = Object.keys(board.cards).length;
  const completedCards = board.columns.find((column) => column.title.toLowerCase() === "done")?.cardIds.length ?? 0;
  const progress = totalCards ? Math.round((completedCards / totalCards) * 100) : 0;
  const statusCounts = board.columns.map((column) => ({ ...column, visibleCount: column.cardIds.filter((id) => filteredCards.has(id)).length }));
  const visibleList = board.columns.flatMap((column) => column.cardIds.map((id) => board.cards[id]).filter((card): card is KanbanCard => Boolean(card) && filteredCards.has(card.id)).map((card) => ({ card, status: column.title, color: column.color })));

  return <div className="app-shell">
    <Sidebar boards={data.boards} activeBoardId={board.id} onSelectBoard={selectBoard} onAddBoard={addBoard} onExport={() => exportData(data)} onImport={() => document.getElementById("backup-input")?.click()} onSettings={() => window.alert("Settings will be expanded in the next phase.")} />
    {mobileSidebar && <div className="mobile-sidebar-overlay" onClick={() => setMobileSidebar(false)}><div onClick={(e) => e.stopPropagation()} className="mobile-sidebar"><div className="mobile-sidebar-header"><strong>Your boards</strong><button className="icon-button" type="button" onClick={() => setMobileSidebar(false)}><X size={18} /></button></div>{data.boards.map((item) => <button className={`mobile-board ${item.id === board.id ? "selected" : ""}`} key={item.id} type="button" onClick={() => selectBoard(item.id)}><span className="board-dot" />{item.title}</button>)}<button className="mobile-board" type="button" onClick={addBoard}><Plus size={17} /> New board</button></div></div>}
    <main className="main-content">
      <Topbar boardTitle={board.title} search={search} setSearch={setSearch} theme={data.theme} onToggleTheme={() => setData((current) => ({ ...current, theme: current.theme === "light" ? "dark" : "light" }))} onMenu={() => setMobileSidebar(true)} />
      <div className="page-content">
        <section className="board-hero"><div><div className="breadcrumb">Workspace / Boards</div><div className="board-title-row"><h1>{board.title}</h1><span className="board-private">PRIVATE</span></div><p>{board.description || "Your active workspace for planning, tracking and finishing work."}</p></div><div className="board-summary"><div><strong>{totalCards}</strong><span>issues</span></div><div><strong>{completedCards}</strong><span>done</span></div><div><strong>{Math.max(totalCards - completedCards, 0)}</strong><span>open</span></div></div></section>
        <section className="board-progress"><div className="progress-label"><span>Board progress</span><strong>{progress}%</strong></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div></section>
        {!cloudReady && firebaseConfigured ? <div className="filter-result">Connecting to your cloud workspace…</div> : null}
        {cloudError ? <div className="filter-result">Cloud sync error: {cloudError}</div> : null}
        <FilterBar priority={priority} setPriority={setPriority} view={view} setView={setView} onAddTask={() => openAddTask()} onAddColumn={addColumn} />
        {search || priority !== "all" ? <div className="filter-result">Showing {filteredCards.size} of {totalCards} issues<button type="button" onClick={() => { setSearch(""); setPriority("all"); }}>Clear filters</button></div> : null}
        {view === "board" ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragCancel={onDragCancel} onDragEnd={onDragEnd}><div className="kanban-board">{board.columns.map((column) => { const cards = column.cardIds.map((id) => board.cards[id]).filter(Boolean).filter((card) => filteredCards.has(card.id)); return <SortableContext key={column.id} items={column.cardIds} strategy={verticalListSortingStrategy}><KanbanColumn column={column} cards={cards} onOpenCard={setOpenCardId} onAddCard={openAddTask} onDeleteColumn={deleteColumn} /></SortableContext>; })}<button className="add-column-tile" type="button" onClick={addColumn}><Plus size={17} /> Add column</button></div><DragOverlay>{draggedCard ? <div className="drag-preview"><strong>{draggedCard.title}</strong><span>{draggedCard.priority} priority</span></div> : null}</DragOverlay></DndContext> : <section className="issue-list"><div className="issue-list-head"><span>Issue</span><span>Status</span><span>Priority</span><span>Due</span><span>Checklist</span></div>{visibleList.map(({ card, status, color }) => { const done = card.checklist.filter((item) => item.completed).length; const key = `CC-${card.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`; return <button className="issue-list-row" key={card.id} type="button" onClick={() => setOpenCardId(card.id)}><span className="issue-list-main"><b>{key}</b><strong>{card.title}</strong><small>{card.tags.length ? card.tags.map((tag) => `#${tag}`).join("  ") : "No tags"}</small></span><span className="issue-status"><i style={{ background: color }} />{status}</span><span className={`issue-priority ${card.priority}`}>{card.priority}</span><span className={card.dueDate && new Date(`${card.dueDate}T23:59:59`) < new Date() ? "overdue" : ""}>{card.dueDate ? <><CalendarDays size={13} />{new Date(`${card.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</> : "—"}</span><span>{card.checklist.length ? <><CheckCircle2 size={13} />{done}/{card.checklist.length}</> : "—"}</span></button>; })}{visibleList.length === 0 && <div className="list-empty">No issues match the current filters.</div>}</section>}
      </div>
    </main>
    <MobileNav onAdd={() => openAddTask()} onSettings={() => window.alert("Settings will be expanded in the next phase.")} />
    <TaskDrawer card={openCard} onClose={() => setOpenCardId(null)} onSave={saveCard} onDelete={deleteCard} />
    <AddTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} onCreate={createTask} defaultColumnId={addTaskColumn} columns={board.columns} />
    <input id="backup-input" type="file" accept="application/json,.json" hidden onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { setData(await importData(file)); window.alert("Backup imported successfully."); } catch (error) { window.alert(error instanceof Error ? error.message : "Import failed."); } finally { event.target.value = ""; } }} />
    <button className="floating-add" type="button" onClick={() => openAddTask()} aria-label="Add issue"><Plus size={23} /></button>
  </div>;
}
export default App;
