import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import IconButton from "./IconButton";

interface Props {
  boardTitle: string;
  search: string;
  setSearch: (value: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onMenu: () => void;
}

export default function Topbar({
  boardTitle,
  search,
  setSearch,
  theme,
  onToggleTheme,
  onMenu,
}: Props) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <button className="mobile-menu" type="button" onClick={onMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <strong>{boardTitle}</strong>
      </div>

      <div className="search-box">
        <Search size={17} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
        {search && <button onClick={() => setSearch("")} type="button">Esc</button>}
      </div>

      <div className="top-actions">
        <IconButton label="Notifications">
          <Bell size={18} />
        </IconButton>
        <IconButton label={theme === "light" ? "Use dark mode" : "Use light mode"} onClick={onToggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </IconButton>
        <div className="avatar">ME</div>
      </div>
    </header>
  );
}