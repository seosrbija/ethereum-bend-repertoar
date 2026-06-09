"use client";

import React, { useMemo, useState } from "react";

type BlockColor = "zeleni" | "purple" | "narandzasti" | "crveni" | "plavi";
type Song = { id:string; block:BlockColor; artist:string; song:string; ton:string; sax:boolean|null; saxNote:string; synth:boolean|null; synthNote:string; bpm:string; yt:string };

const BLOCK_ORDER: BlockColor[] = ["zeleni", "purple", "narandzasti", "crveni", "plavi"];
const BLOCK_META: Record<BlockColor, { accent: string; bg: string }> = {
  zeleni: { accent: "#22c55e", bg: "#0d2b0d" },
  purple: { accent: "#a855f7", bg: "#1e0d2b" },
  narandzasti: { accent: "#f97316", bg: "#2b1a0d" },
  crveni: { accent: "#ef4444", bg: "#2b0d0d" },
  plavi: { accent: "#3b82f6", bg: "#0d1a2b" },
};

const SONGS: Song[] = [
  {
    "id": "play-that-funky-music",
    "block": "zeleni",
    "artist": "Wild Cherry",
    "song": "Play That Funky Music",
    "ton": "E",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "109",
    "yt": "https://youtu.be/JTvlujbJ5vg?si=X4Iz4xCXawErbHfP"
  },
  {
    "id": "glory-box",
    "block": "zeleni",
    "artist": "Portishead",
    "song": "Glory Box",
    "ton": "d",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "violina",
    "bpm": "118",
    "yt": "https://youtu.be/4qQyUi4zfDs?si=PSeYbtfpXp2cDYHB"
  },
  {
    "id": "owner-of-a-lonely-heart",
    "block": "zeleni",
    "artist": "Yes",
    "song": "Owner of a Lonely Heart",
    "ton": "a",
    "sax": true,
    "saxNote": "treba glumiti trubače tamo gde ih ima",
    "synth": true,
    "synthNote": "Synth Brass 2:24 ključno da sredimo",
    "bpm": "126",
    "yt": "https://youtu.be/vpIduDaggVA?si=FBKeWUjXPTIUKx-M"
  },
  {
    "id": "freed-from-desire",
    "block": "zeleni",
    "artist": "GALA (Cover)",
    "song": "Freed From Desire",
    "ton": "d",
    "sax": true,
    "saxNote": "\"Na-na-na-na-na\" deo obavezno ostalo u pozadini",
    "synth": true,
    "synthNote": "Eurodance Lead ili Trance Pluck",
    "bpm": "128",
    "yt": "https://youtu.be/a8wrOF0xuU4?si=lH67JU_y7JgDvhgJ"
  },
  {
    "id": "lonely-boy",
    "block": "zeleni",
    "artist": "The Black Keys",
    "song": "Lonely Boy",
    "ton": "E",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Hammond u pozadini isto gitarska stvar",
    "bpm": "166",
    "yt": "https://youtu.be/a_426RiwST8?si=Hz_Bm1KloQdOzBOX"
  },
  {
    "id": "ti-mi-se-tako-svidjas",
    "block": "zeleni",
    "artist": "Sevdahbaby",
    "song": "Ti mi se tako sviđaš",
    "ton": "D",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "128",
    "yt": "https://youtu.be/gMDZobzWekY?si=NnDEiLjgUFjap7ew"
  },
  {
    "id": "higher-ground",
    "block": "zeleni",
    "artist": "Stevie Wonder",
    "song": "Higher Ground",
    "ton": "e",
    "sax": true,
    "saxNote": "samo ako ćemo https://youtu.be/Skm7Bjxcnlo?list=RDSkm7Bjxcnlo ovu verziju raditi",
    "synth": true,
    "synthNote": "\"Clavinet D6\" model iz Piano sekcije",
    "bpm": "122",
    "yt": "https://youtu.be/zGSxvH5i6XQ?si=ALBjf9_MUyhEaoZ6"
  },
  {
    "id": "sutra",
    "block": "zeleni",
    "artist": "Nipple People",
    "song": "Sutra",
    "ton": "F",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "125",
    "yt": "https://youtu.be/0LrP6WiaeEI?si=7kSkuz1RG40C73Yd"
  },
  {
    "id": "crni-ples",
    "block": "zeleni",
    "artist": "Oktobar 1864",
    "song": "Crni ples",
    "ton": "e",
    "sax": true,
    "saxNote": "na 1:31 skinuti obavezno svirati sa sax",
    "synth": true,
    "synthNote": "Za rifove: Sample Synth -> \"Synth Brass\" (80s Brass / Power Horns). strofa:Sample Synth -> \"String Pad\" ili \"Analog Synth Pad\"",
    "bpm": "125",
    "yt": "https://www.youtube.com/watch?v=kv6CKNKemuU"
  },
  {
    "id": "bad-girls",
    "block": "zeleni",
    "artist": "Jamiroquai",
    "song": "Bad Girls",
    "ton": "cis#",
    "sax": true,
    "saxNote": "ne melodiju nego poslušati trubače",
    "synth": true,
    "synthNote": "Clavinet (D6) + strings",
    "bpm": "121",
    "yt": "https://youtu.be/rMcEwaGz_64?si=MYN5UD_EgmzJa-IE"
  },
  {
    "id": "blood-like-lemonade",
    "block": "zeleni",
    "artist": "Morcheeba",
    "song": "Blood Like Lemonade",
    "ton": "d",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "168",
    "yt": "https://youtu.be/W7WDUB3ZojE?si=8EVEXI_1_XbgUF2Q"
  },
  {
    "id": "psycho-killer",
    "block": "zeleni",
    "artist": "Talking Heads",
    "song": "Psycho killer",
    "ton": "A",
    "sax": false,
    "saxNote": "",
    "synth": false,
    "synthNote": "Hammond u pozadini isto gitarska stvar",
    "bpm": "121",
    "yt": "https://youtu.be/REuoiWUZqXU?si=3rGb6inTm221Iflp"
  },
  {
    "id": "smooth-operator",
    "block": "purple",
    "artist": "Sade",
    "song": "Smooth Operator",
    "ton": "d",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "119",
    "yt": "https://youtu.be/4TYv2PhG89A?si=aqZSkvtuYU_hJinJ"
  },
  {
    "id": "sledge-hammer",
    "block": "purple",
    "artist": "Peter Gabriel",
    "song": "Sledge Hammer",
    "ton": "E",
    "sax": true,
    "saxNote": "pratiti temu dok se ne peva i duvače uz pevanje",
    "synth": true,
    "synthNote": "Shakuhachi (ili pan flute) za početak, posle Synth Brass",
    "bpm": "96",
    "yt": "https://youtu.be/OJWJE0x7T4Q?si=JvbZSQk9-m5onkBf"
  },
  {
    "id": "the-sea",
    "block": "purple",
    "artist": "Morcheeba",
    "song": "The Sea",
    "ton": "e",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "70",
    "yt": "https://youtu.be/zWHXPz6qF7g?si=q05qHysHj2mn6qNq"
  },
  {
    "id": "dance-with-somebody",
    "block": "purple",
    "artist": "Mando Diao",
    "song": "Dance with Somebody",
    "ton": "f#",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "synth karakteristican zvuk",
    "bpm": "140",
    "yt": "https://youtu.be/q44e2GFDVkQ?si=Yqeyts9EofPoMDzd"
  },
  {
    "id": "frka",
    "block": "purple",
    "artist": "Nipplepeople",
    "song": "Frka",
    "ton": "d",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Sample Synth -> \"Analog Pad\" ili \"String Pad\". Obavezno: Chorus (Effect 1) na max! * solo Sample Synth -> \"Saw Lead\" ili \"Analog Lead\". Obavezno: Delay (Effect 2) + malo Drive-a.",
    "bpm": "120",
    "yt": "https://youtu.be/2pfLE5YJ1Fo?si=4d0sfmba_6WEHNcj"
  },
  {
    "id": "i-want-to-break-free",
    "block": "purple",
    "artist": "Queen",
    "song": "I Want To Break Free",
    "ton": "E",
    "sax": true,
    "saxNote": "u pozadini ali tiho, dugačke, stabilne note koje prate harmoni",
    "synth": true,
    "synthNote": "Sample Synth sekcija -> \"Synth Brass\" ili \"Analog Poly Synth\" popunjavanje pratnja",
    "bpm": "110",
    "yt": "youtube.com/watch?v=kBFGQ_Khc3Q&feature=youtu.be"
  },
  {
    "id": "ljubi-me-brzo",
    "block": "purple",
    "artist": "Sevdahbaby",
    "song": "Ljubi me brzo",
    "ton": "E",
    "sax": true,
    "saxNote": "na 1:!9 ima jedan ukras koji nam fali, takve upade treba da praviš stalno ostalo ništa ili jako tiho",
    "synth": true,
    "synthNote": "Synth Brass (iz Sample sekcije) + Drive.",
    "bpm": "125",
    "yt": "https://youtu.be/h3DH0C4lVjA?si=meHbGgg1FD2KtcRw"
  },
  {
    "id": "disko-klub",
    "block": "purple",
    "artist": "DLM",
    "song": "DIsko Klub",
    "ton": "c",
    "sax": true,
    "saxNote": "staccato tiho uz strofu, temu pratiš sa gitarom",
    "synth": true,
    "synthNote": "Sample Synth -> \"Brass Section\" (traži u Nord Library * Podešavanje: Ključ je Compressor (Effect 2) / Organ sekcija (B3)",
    "bpm": "128",
    "yt": "https://youtu.be/9CQJhRv6Fqg?si=-1ze25gpkdMI_ihm"
  },
  {
    "id": "the-chain",
    "block": "purple",
    "artist": "Fleetwood Mac",
    "song": "The Chain",
    "ton": "e",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Hammond B3 (Organ)",
    "bpm": "168",
    "yt": "https://youtu.be/kBYHwH1Vb-c?si=MExl3W7MGXvFq6cV"
  },
  {
    "id": "run-to-you",
    "block": "purple",
    "artist": "Bryan Adams",
    "song": "Run To You",
    "ton": "f#",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "na 2:20 skinuti donju tercu illi šta je već na synth",
    "bpm": "127",
    "yt": "https://youtu.be/nCBASt507WA?si=8oQy07L9oipC3icx"
  },
  {
    "id": "this-world",
    "block": "purple",
    "artist": "Selah Sue",
    "song": "This World",
    "ton": "d",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "136",
    "yt": ""
  },
  {
    "id": "footloose",
    "block": "purple",
    "artist": "Kenny Loggins",
    "song": "Footloose",
    "ton": "A",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "174",
    "yt": "https://youtu.be/ltrMfT4Qz5Y?si=InPpkQ6zD94VWYKG"
  },
  {
    "id": "messy",
    "block": "narandzasti",
    "artist": "Lola Young",
    "song": "Messy",
    "ton": "E",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "111",
    "yt": "https://youtu.be/k-k2_Liofy8?si=twYgKqhNvAaBc1jC"
  },
  {
    "id": "crazy",
    "block": "narandzasti",
    "artist": "Teddy Swims",
    "song": "Crazy",
    "ton": "a",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Wurli ili Rhodes",
    "bpm": "87",
    "yt": "https://youtu.be/BaH0u7_Py00?si=URNFC6Rru64f5f6N"
  },
  {
    "id": "superstition",
    "block": "narandzasti",
    "artist": "Stevie Wonder",
    "song": "Superstition",
    "ton": "E",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "101",
    "yt": "https://youtu.be/O1QV0b-Yy5M?si=pxBeFMmEXvpA4j84"
  },
  {
    "id": "caribbean-queen",
    "block": "narandzasti",
    "artist": "Billy Ocean",
    "song": "Caribbean Queen",
    "ton": "d",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "114",
    "yt": "https://youtu.be/uxX2gA18grk?si=HYuRiV9o6pBQnCFC"
  },
  {
    "id": "e-7-9-tri-boje-zvuka",
    "block": "narandzasti",
    "artist": "Oktobar 1864",
    "song": "E 7/9 / Tri boje zvuka",
    "ton": "e",
    "sax": true,
    "saxNote": "trubacki delovi ostalo ništa",
    "synth": true,
    "synthNote": "rifovi: Sample Synth -> \"Brass Section\" ili \"Power Horns * akorde: Organ (B3) -> \"Percussive\" registracija (drawbars: 888 800 000 )",
    "bpm": "110",
    "yt": "https://youtu.be/lEm6x5FAofc?si=Fpl-UopbkFz5tA47"
  },
  {
    "id": "super-freak",
    "block": "narandzasti",
    "artist": "Rick James",
    "song": "Super Freak",
    "ton": "A",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "132",
    "yt": ""
  },
  {
    "id": "no-roots",
    "block": "narandzasti",
    "artist": "Alice Merton",
    "song": "No roots",
    "ton": "h",
    "sax": true,
    "saxNote": "na 3.00 minutu jako ostalo ništa",
    "synth": true,
    "synthNote": "sitno u pozadini, na 3.00 minutu jako",
    "bpm": "118",
    "yt": "https://youtu.be/PUdyuKaGQd4?si=LWtQNS_bkeR5hheu"
  },
  {
    "id": "too-sweet",
    "block": "narandzasti",
    "artist": "Hozier",
    "song": "Too Sweet",
    "ton": "A",
    "sax": true,
    "saxNote": "samo na refrenu ostalo ništa",
    "synth": true,
    "synthNote": "hammond + zvona?",
    "bpm": "116",
    "yt": "https://youtu.be/NTpbbQUBbuo?si=3aIFmstHD0QflIRX"
  },
  {
    "id": "not-that-kind",
    "block": "narandzasti",
    "artist": "Anastacia",
    "song": "Not That Kind",
    "ton": "fis",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Sample Synth sekcija -> \"Section Brass\" ili \"Power Horns\".",
    "bpm": "103",
    "yt": "https://youtu.be/DjUKxQYm0AI?si=9Q3lOgQSbh4-uWHS"
  },
  {
    "id": "everybody-wants-to-rule-the-world",
    "block": "narandzasti",
    "artist": "Tears For Fears",
    "song": "Everybody Wants To Rule The World",
    "ton": "D",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Sample Synth sekcija -> \"Synth Bell\" ili \"Digital Piano/E-Piano\" sa puno \"shimmer\" efekta.",
    "bpm": "112",
    "yt": "https://youtu.be/znDgBy2mHbc?si=ikK99oihCZMa0SSL"
  },
  {
    "id": "faith",
    "block": "narandzasti",
    "artist": "George Michael",
    "song": "Faith",
    "ton": "H",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "96",
    "yt": "https://youtu.be/6Cs3Pvmmv0E?si=C8MfHDgEzSEFDgx2"
  },
  {
    "id": "feel-it-still",
    "block": "narandzasti",
    "artist": "Portugal. The Man",
    "song": "Feel It Still",
    "ton": "cis",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "79",
    "yt": "https://youtu.be/UQHSK-kgONk?si=e3ap5sScSHdOpuky"
  },
  {
    "id": "long-train-runnin",
    "block": "crveni",
    "artist": "The Doobie Brothers",
    "song": "Long Train Runnin'",
    "ton": "g",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "117",
    "yt": "https://youtu.be/CVsLEI-hCXw?si=Gd8j5jtru3xnvDn9"
  },
  {
    "id": "part-time-lover",
    "block": "crveni",
    "artist": "Stevie Wonder",
    "song": "Part-Time Lover",
    "ton": "A",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "175",
    "yt": "https://youtu.be/DNG_1dERwVI?si=5V9BUjMF--3iHCjW"
  },
  {
    "id": "keep-on-walking",
    "block": "crveni",
    "artist": "Jon Allen",
    "song": "Keep On Walking",
    "ton": "h",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "86",
    "yt": "https://youtu.be/hnbAmAhrg7I?si=-c4yXhNi-q6YtjSj"
  },
  {
    "id": "you-shook-me-all-night-long",
    "block": "crveni",
    "artist": "Céline Dion, Anastacia",
    "song": "You Shook Me All Night Long",
    "ton": "G",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "samo tepih",
    "bpm": "121",
    "yt": "https://youtu.be/1niTEkP-6eo?si=RAIG8xBFOqIZ6PXp"
  },
  {
    "id": "divan-dan",
    "block": "crveni",
    "artist": "E-PLAY",
    "song": "Divan dan",
    "ton": "fis",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "nešto razmazano samo za pozadinu ovde je gitara primary.. eventualno te da skineš iza gluposti koje svira solo gitara jer sam ja busy sa riffovima",
    "bpm": "177",
    "yt": "https://youtu.be/kpznKoohEo0?si=aK64zPe3xb-Sz-u_"
  },
  {
    "id": "ready-to-go",
    "block": "crveni",
    "artist": "Republica",
    "song": "Ready To Go",
    "ton": "d",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "Sample Synth sekcija -> \"Saw Lead\"",
    "bpm": "125",
    "yt": "https://youtu.be/5aLfCslnRr4?si=jLtBHbuHzYSgD4w2"
  },
  {
    "id": "colors",
    "block": "crveni",
    "artist": "Black Pumas",
    "song": "Colors",
    "ton": "fis",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "90",
    "yt": "https://youtu.be/0G383538qzQ?si=6b-RJQuTGWnUdTe9"
  },
  {
    "id": "come-along",
    "block": "crveni",
    "artist": "Titiyo",
    "song": "Come Along",
    "ton": "f",
    "sax": false,
    "saxNote": "",
    "synth": true,
    "synthNote": "\"Bright E-Piano\" (kao DX7 ili čisti Rhodes) sa puno Compression-a.",
    "bpm": "125",
    "yt": "https://youtu.be/yLsVGwNWOA4?si=OdBbxLWr7WFX4Pjf"
  },
  {
    "id": "plesem-sama",
    "block": "crveni",
    "artist": "Detour",
    "song": "Plešem sama",
    "ton": "fis",
    "sax": true,
    "saxNote": "na 2:22 tvojih \"5 minuta\"",
    "synth": true,
    "synthNote": "Sample Synth -> \"Synth Pad\" + \"Saw Pluck\".",
    "bpm": "120",
    "yt": "https://youtu.be/gdvUKG18NbU?si=9247_vgGW-TeMnWC"
  },
  {
    "id": "just-the-two-of-us",
    "block": "crveni",
    "artist": "Bill Withers",
    "song": "Just the Two of Us",
    "ton": "f",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "95",
    "yt": "https://youtu.be/Uw5OLnN7UvM?si=bmHaqTzJcdVP7I2z"
  },
  {
    "id": "the-chamber",
    "block": "crveni",
    "artist": "Lenny Kravitz",
    "song": "The Chamber",
    "ton": "h",
    "sax": true,
    "saxNote": "BASS DOMINACIJA mi ostali smo u pozadini",
    "synth": true,
    "synthNote": "Strings pozadina",
    "bpm": "118",
    "yt": "https://youtu.be/RqgEqG2jaQY?si=2JTKiMEdEPvvo3e0"
  },
  {
    "id": "hard-to-handle",
    "block": "crveni",
    "artist": "The Black Crowes",
    "song": "Hard To Handle",
    "ton": "H",
    "sax": false,
    "saxNote": "full gitara nista osim neke sitne harmonije",
    "synth": false,
    "synthNote": "full gitara nista osim neke sitne harmonije",
    "bpm": "104",
    "yt": "https://youtu.be/BRcs_OzQb14?si=LVnwjUNvG2aZ9FfM"
  },
  {
    "id": "you-re-the-one-that-i-want",
    "block": "plavi",
    "artist": "John Travolta & Olivia Newton-John",
    "song": "You're the One That I Want",
    "ton": "a",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "107",
    "yt": ""
  },
  {
    "id": "the-one-i-love",
    "block": "plavi",
    "artist": "REM",
    "song": "The One I Love",
    "ton": "a",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "128",
    "yt": ""
  },
  {
    "id": "dream-on",
    "block": "plavi",
    "artist": "Aerosmith",
    "song": "Dream on",
    "ton": "f",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "",
    "yt": "https://youtu.be/qF9dCWmq3pM?si=OfyV2x4sdYtLhPyu"
  },
  {
    "id": "sunny",
    "block": "plavi",
    "artist": "",
    "song": "Sunny",
    "ton": "",
    "sax": null,
    "saxNote": "",
    "synth": null,
    "synthNote": "",
    "bpm": "",
    "yt": "https://youtu.be/mVhy7JPqM7A?si=aQhXjxyB4XAaXOf7"
  }
];

type View = { name: "home" } | { name: "block"; block: BlockColor } | { name: "song"; id: string };

function indicatorColor(v: boolean | null) { return v === true ? "#22c55e" : v === false ? "#ef4444" : "#333355"; }

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SONGS.filter(s => s.song.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  if (view.name === "song") {
    const song = SONGS.find(s => s.id === view.id);
    if (!song) return <main className="app"><button className="back" onClick={() => setView({name:"home"})}>← Nazad</button><p className="empty">Pesma nije pronađena.</p></main>;
    return <SongPage song={song} onBack={() => setView({name:"block", block:song.block})} />;
  }

  if (view.name === "block") {
    const songs = SONGS.filter(s => s.block === view.block);
    const meta = BLOCK_META[view.block];
    return <main className="app">
      <button className="back" onClick={() => setView({name:"home"})}>← Nazad</button>
      <div className="blockRow">{BLOCK_ORDER.map(b => <button key={b} className="colorTab" onClick={() => setView({name:"block", block:b})} style={{borderColor: b===view.block ? BLOCK_META[b].accent : "#333348"}}><span className="colorDot" style={{background:BLOCK_META[b].accent, color:BLOCK_META[b].accent}} /></button>)}</div>
      <section className="list">{songs.map(song => <SongCard key={song.id} song={song} accent={meta.accent} onClick={() => setView({name:"song", id:song.id})} />)}</section>
    </main>;
  }

  return <main className="app">
    <header className="homeHeader"><div className="logo">ETHEREUM</div><div className="logoSub">REPERTOAR</div></header>
    <section className="search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pretraži pesme ili autore…" />
      {suggestions.length > 0 && <div className="suggest">{suggestions.map(s => <button key={s.id} onClick={() => { setQuery(""); setView({name:"song", id:s.id}); }}><span>{s.song}</span><span className="artist">{s.artist}</span></button>)}</div>}
    </section>
    <div className="blockRow">{BLOCK_ORDER.map(b => <button key={b} className="colorTab" onClick={() => setView({name:"block", block:b})}><span className="colorDot" style={{background:BLOCK_META[b].accent, color:BLOCK_META[b].accent}} /></button>)}</div>
    <section className="list">{SONGS.slice(0, 8).map(song => <SongCard key={song.id} song={song} accent={BLOCK_META[song.block].accent} onClick={() => setView({name:"song", id:song.id})} />)}</section>
  </main>;
}

function SongCard({ song, accent, onClick }: { song: Song; accent: string; onClick: () => void }) {
  return <button className="songCard" onClick={onClick}>
    <div><div className="songTitle">{song.song || "Bez naziva"}</div><span className="artistTag">#{song.artist || "Nepoznat autor"}</span></div>
    {song.ton && <span className="keyBadge" style={{color:accent}}>{song.ton}</span>}
  </button>;
}

function SongPage({ song, onBack }: { song: Song; onBack: () => void }) {
  const [tab, setTab] = useState<"ton"|"sax"|"synth"|"bpm"|"yt">("ton");
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
      <Tab active={tab==="bpm"} onClick={() => setTab("bpm")} accent={meta.accent}>♩</Tab>
      <Tab active={tab==="yt"} onClick={() => setTab("yt")} accent={meta.accent}>▶</Tab>
    </nav>
    <section className="panel">
      {tab === "ton" && (song.ton ? <><div className="ton" style={{color:meta.accent}}>{song.ton}</div><p className="muted">{song.ton === song.ton.toLowerCase() ? "mol" : "dur"}</p></> : <p className="empty">Tonalitet nije unesen.</p>)}
      {tab === "sax" && <Note note={song.saxNote} empty="Nema napomene za sax." />}
      {tab === "synth" && <Note note={song.synthNote} empty="Nema napomene za synth." />}
      {tab === "bpm" && (song.bpm ? <><div className="bpm" style={{color:meta.accent}}>♩ {song.bpm} BPM</div></> : <p className="empty">BPM nije unesen.</p>)}
      {tab === "yt" && (song.yt ? <><a className="yt" href={song.yt} target="_blank">▶ Otvori YouTube</a><p className="muted" style={{wordBreak:"break-all", fontSize:12, marginTop:12}}>{song.yt}</p></> : <p className="empty">YouTube nije unesen.</p>)}
    </section>
  </main>;
}

function Tab({active,onClick,accent,children}:{active:boolean;onClick:()=>void;accent:string;children:React.ReactNode}){return <button className={`tab ${active ? "active" : ""}`} style={{borderBottomColor: active ? accent : "transparent", color: active ? accent : undefined}} onClick={onClick}>{children}</button>}
function Note({note, empty}:{note:string; empty:string}){return note ? <p className="note">{note}</p> : <p className="empty">{empty}</p>}
