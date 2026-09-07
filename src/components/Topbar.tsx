import { Bell, Command, HelpCircle, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { signOut } from "firebase/auth";
import IconButton from "./IconButton";
import { auth } from "../firebase";

interface Props { boardTitle: string; search: string; setSearch: (value: string) => void; theme: "light" | "dark"; onToggleTheme: () => void; onMenu: () => void; }

export default function Topbar({ boardTitle, search, setSearch, theme, onToggleTheme, onMenu }: Props) {
  const handleSignOut = async () => { if (auth) await signOut(auth); };
  return (
    <header className="topbar">
      <div className="mobile-brand"><button className="mobile-menu" type="button" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button><span className="mobile-brand-mark">C</span><strong>{boardTitle}</strong></div>
      <div className="topbar-breadcrumb"><span>Projects</span><b>/</b><strong>{boardTitle}</strong></div>
      <div className="global-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues" aria-label="Search issues" /><span className="search-shortcut"><Command size={10} /> K</span>{search && <button onClick={() => setSearch("")} type="button">Clear</button>}</div>
      <div className="top-actions"><IconButton label="Help"><HelpCircle size={16} /></IconButton><IconButton label="Notifications"><Bell size={16} /></IconButton><IconButton label={theme === "light" ? "Use dark mode" : "Use light mode"} onClick={onToggleTheme}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</IconButton><button className="avatar avatar-button" type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out"><LogOut size={14} /></button></div>
    </header>
  );
}
