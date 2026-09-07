import { Bell, Command, Menu, Moon, Search, Sun } from "lucide-react";
import IconButton from "./IconButton";

interface Props {
  boardTitle: string;
  search: string;
  setSearch: (value: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onMenu: () => void;
}

export default function Topbar({ boardTitle, search, setSearch, theme, onToggleTheme, onMenu }: Props) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <button className="mobile-menu" type="button" onClick={onMenu} aria-label="Open menu">
          <Menu size={19} />
        </button>
        <strong>{boardTitle}</strong>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks, tags or descriptions..."
          aria-label="Search tasks"
        />
        <span className="search-shortcut"><Command size={11} /> K</span>
        {search && <button onClick={() => setSearch("")} type="button">Clear</button>}
      </div>

      <div className="top-actions">
        <IconButton label="Notifications">
          <Bell size={17} />
        </IconButton>
        <IconButton label={theme === "light" ? "Use dark mode" : "Use light mode"} onClick={onToggleTheme}>
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </IconButton>
        <div className="avatar" aria-label="Your profile">ME</div>
      </div>
    </header>
  );
}
