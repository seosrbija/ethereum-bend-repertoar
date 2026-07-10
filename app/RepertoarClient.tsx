"use client";

import React, { useMemo, useState } from "react";

export type BlockColor = "zeleni" | "purple" | "narandzasti" | "crveni" | "plavi";
export type Song = { id:string; block:BlockColor; artist:string; song:string; ton:string; sax:boolean|null; saxNote:string; synth:boolean|null; synthNote:string; bpm:string; yt:string; notes:string };

const BLOCK_ORDER: BlockColor[] = ["zeleni", "purple", "narandzasti", "crveni", "plavi"];
const BLOCK_META: Record<BlockColor, { accent: string; bg: string }> = {
  zeleni: { accent: "#22c55e", bg: "#0d2b0d" },
  purple: { accent: "#a855f7", bg: "#1e0d2b" },
  narandzasti: { accent: "#f97316", bg: "#2b1a0d" },
  crveni: { accent: "#ef4444", bg: "#2b0d0d" },
  plavi: { accent: "#3b82f6", bg: "#0d1a2b" },
};

type View = { name: "home" } | { name: "block"; block: BlockColor } | { name: "song"; id: string };

function indicatorColor(v: boolean | null) { return v === true ? "#22c55e" : v === false ? "#ef4444" : "#333355"; }

export default function RepertoarClient({ songs }: { songs: Song[] }) {
  const [view, setView] = useState<View>({ name: "home" });
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return songs.filter(s => s.song.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)).slice(0, 8);
  }, [query, songs]);

  if (view.name === "song") {
    const song = songs.find(s => s.id === view.id);
    if (!song) return <main className="app"><button className="back" onClick={() => setView({name:"home"})}>← Nazad</button><p className="empty">Pesma nije pronađena.</p></main>;
    return <SongPage song={song} onBack={() => setView({name:"block", block:song.block})} />;
  }

  if (view.name === "block") {
    const blockSongs = songs.filter(s => s.block === view.block);
    const meta = BLOCK_META[view.block];
    return <main className="app">
      <button className="back" onClick={() => setView({name:"home"})}>← Nazad</button>
      <div className="blockRow">{BLOCK_ORDER.map(b => <button key={b} className="colorTab" onClick={() => setView({name:"block", block:b})} style={{borderColor: b===view.block ? BLOCK_META[b].accent : "#333348"}}><span className="colorDot" style={{background:BLOCK_META[b].accent, color:BLOCK_META[b].accent}} /></button>)}</div>
      <section className="list">{blockSongs.map(song => <SongCard key={song.id} song={song} accent={meta.accent} onClick={() => setView({name:"song", id:song.id})} />)}</section>
    </main>;
  }

  return <main className="app">
    <header className="homeHeader"><div className="logo">ETHEREUM</div><div className="logoSub">REPERTOAR</div></header>
    <section className="search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pretraži pesme ili autore…" />
      {suggestions.length > 0 && <div className="suggest">{suggestions.map(s => <button key={s.id} onClick={() => { setQuery(""); setView({name:"song", id:s.id}); }}><span>{s.song}</span><span className="artist">{s.artist}</span></button>)}</div>}
    </section>
    <div className="blockRow">{BLOCK_ORDER.map(b => <button key={b} className="colorTab" onClick={() => setView({name:"block", block:b})}><span className="colorDot" style={{background:BLOCK_META[b].accent, color:BLOCK_META[b].accent}} /></button>)}</div>
    <section className="list">{songs.slice(0, 8).map(song => <SongCard key={song.id} song={song} accent={BLOCK_META[song.block].accent} onClick={() => setView({name:"song", id:song.id})} />)}</section>
  </main>;
}

function SongCard({ song, accent, onClick }: { song: Song; accent: string; onClick: () => void }) {
  return <button className="songCard" onClick={onClick}>
    <div><div className="songTitle">{song.song || "Bez naziva"}</div><span className="artistTag">#{song.artist || "Nepoznat autor"}</span></div>
    {song.ton && <span className="keyBadge" style={{color:accent}}>{song.ton}</span>}
  </button>;
}

function SongPage({ song, onBack }: { song: Song; onBack: () => void }) {
  const [tab, setTab] = useState<"ton"|"sax"|"synth"|"notes"|"yt">("ton");
  const meta = BLOCK_META[song.block];
  return <main className="app">
    <button className="back" onClick={onBack}>← Nazad</button>
    <section className="hero" style={{background: meta.bg, borderBottomColor: meta.accent}}>
      <h1>{song.song || "Bez naziva"}</h1><span className="artistTag" style={{borderColor: meta.accent, color: meta.accent}}>#{song.artist || "Nepoznat autor"}</span>
    </section>
    <nav className="tabbar">
      <Tab active={tab==="ton"} onClick={() => setTab("ton")} accent={meta.accent}>🎵</Tab>
      <Tab active={tab==="sax"} onClick={() => setTab("sax")} accent={meta.accent}><span className="iconBadge">🎷<i className="lamp" style={{background:indicatorColor(song.sax)}} /></span></Tab>
      <Tab active={tab==="synth"} onClick={() => setTab("synth")} accent={meta.accent}><span className="iconBadge">🎹<i className="lamp" style={{background:indicatorColor(song.synth)}} /></span></Tab>
      <Tab active={tab==="notes"} onClick={() => setTab("notes")} accent={meta.accent}>📝</Tab>
      <Tab active={tab==="yt"} onClick={() => setTab("yt")} accent={meta.accent}>▶</Tab>
    </nav>
    <section className="panel">
      {tab === "ton" && (song.ton || song.bpm ? <>
        {song.ton ? <><div className="ton" style={{color:meta.accent}}>{song.ton}</div><p className="muted">{song.ton === song.ton.toLowerCase() ? "mol" : "dur"}</p></> : <p className="empty">Tonalitet nije unesen.</p>}
        {song.bpm && <div style={{marginTop: 20, fontSize: 20, fontWeight: 600, color: meta.accent, opacity: 0.85}}>♩ {song.bpm} BPM</div>}
      </> : <p className="empty">Tonalitet nije unesen.</p>)}
      {tab === "sax" && <Note note={song.saxNote} empty="Nema napomene za sax." />}
      {tab === "synth" && <Note note={song.synthNote} empty="Nema napomene za synth." />}
      {tab === "notes" && <NotesView notes={song.notes} accent={meta.accent} />}
      {tab === "yt" && (song.yt ? <><a className="yt" href={song.yt} target="_blank">▶ Otvori YouTube</a><p className="muted" style={{wordBreak:"break-all", fontSize:12, marginTop:12}}>{song.yt}</p></> : <p className="empty">YouTube nije unesen.</p>)}
    </section>
  </main>;
}

function NotesView({ notes, accent }: { notes: string; accent: string }) {
  if (!notes || !notes.trim()) return <p className="empty">Za ovu pesmu nema napomena.</p>;
  const lines = notes.replace(/\r\n/g, "\n").split("\n");
  return <div style={{textAlign:"left", maxWidth:560, margin:"0 auto", lineHeight:1.65, fontSize:15}}>
    {lines.map((line, i) => {
      const t = line.trim();
      if (/^\[.*\]$/.test(t)) {
        // [Verse], [Chorus]... — sekcije strukture
        return <div key={i} style={{color:accent, fontWeight:700, marginTop: i === 0 ? 0 : 10}}>{t}</div>;
      }
      if (/^[A-ZŠĐČĆŽ0-9 \-]+:\s*$/.test(t) && t.length > 2) {
        // HARMONIJE:, STRUKTURA:, NAPOMENE:... — naslovi celina
        return <div key={i} style={{fontWeight:700, fontSize:16, marginTop: i === 0 ? 0 : 22, marginBottom:4, letterSpacing:0.5, borderBottom:`1px solid ${accent}44`, paddingBottom:4}}>{t}</div>;
      }
      if (t === "") return <div key={i} style={{height:10}} />;
      return <div key={i} style={{whiteSpace:"pre-wrap", opacity:0.92}}>{line}</div>;
    })}
  </div>;
}

function Tab({active,onClick,accent,children}:{active:boolean;onClick:()=>void;accent:string;children:React.ReactNode}){return <button className={`tab ${active ? "active" : ""}`} style={{borderBottomColor: active ? accent : "transparent", color: active ? accent : undefined}} onClick={onClick}>{children}</button>}
function Note({note, empty}:{note:string; empty:string}){return note ? <p className="note">{note}</p> : <p className="empty">{empty}</p>}
