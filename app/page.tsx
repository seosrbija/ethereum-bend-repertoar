import fs from "fs";
import path from "path";
import RepertoarClient, { Song, BlockColor } from "./RepertoarClient";

const VALID_BLOCKS: BlockColor[] = ["zeleni", "purple", "narandzasti", "crveni", "plavi"];

function slugify(text: string): string {
  const map: Record<string, string> = { đ: "dj", š: "s", č: "c", ć: "c", ž: "z", Đ: "dj", Š: "s", Č: "c", Ć: "c", Ž: "z" };
  return text
    .split("")
    .map(ch => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "pesma";
}

function parseBool(v: string): boolean | null {
  const t = v.trim().toLowerCase();
  if (t === "true") return true;
  if (t === "false") return false;
  return null;
}

function parseRepertoar(raw: string): Song[] {
  const text = raw.replace(/\r\n/g, "\n");
  const blocks = text.split(/\n---\s*(?:\n|$)/);
  const songs: Song[] = [];
  const usedIds = new Set<string>();

  for (const block of blocks) {
    const lines = block.split("\n");
    const s = { block: "zeleni" as BlockColor, artist: "", song: "", ton: "", sax: null as boolean | null, saxNote: "", synth: null as boolean | null, synthNote: "", bpm: "", yt: "", notes: "" };
    let hasData = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/^([A-Z_]+):\s?(.*)$/);
      if (!m) continue;
      const key = m[1];
      const value = m[2].trim();

      if (key === "NOTES") {
        // NOTES uzima sve do kraja bloka (višelinijski tekst)
        const rest = lines.slice(i + 1).join("\n");
        s.notes = (value ? value + "\n" : "") + rest;
        s.notes = s.notes.replace(/\s+$/, "");
        hasData = true;
        break;
      }

      switch (key) {
        case "BLOK": if (VALID_BLOCKS.includes(value as BlockColor)) s.block = value as BlockColor; hasData = true; break;
        case "ARTIST": s.artist = value; hasData = true; break;
        case "SONG": s.song = value; hasData = true; break;
        case "TON": s.ton = value; hasData = true; break;
        case "SAX": s.sax = parseBool(value); hasData = true; break;
        case "SAX_NOTE": s.saxNote = value; hasData = true; break;
        case "SYNTH": s.synth = parseBool(value); hasData = true; break;
        case "SYNTH_NOTE": s.synthNote = value; hasData = true; break;
        case "BPM": s.bpm = value; hasData = true; break;
        case "YT": s.yt = value; hasData = true; break;
      }
    }

    if (!hasData || (!s.song && !s.artist)) continue;

    let id = slugify(s.song || s.artist);
    let unique = id, n = 2;
    while (usedIds.has(unique)) unique = `${id}-${n++}`;
    usedIds.add(unique);

    songs.push({ id: unique, ...s });
  }

  return songs;
}

export default function Page() {
  let raw = "";
  try {
    raw = fs.readFileSync(path.join(process.cwd(), "repertoar.txt"), "utf8");
  } catch {
    raw = "";
  }
  const songs = parseRepertoar(raw);
  return <RepertoarClient songs={songs} />;
}
