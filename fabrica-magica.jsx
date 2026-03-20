import { useState, useEffect, useRef, useCallback } from "react";

const POLL_INTERVAL = 1400;

// ─── AVATARS ────────────────────────────────────────────
const AVATARS = [
  { id: "a1", label: "Luna", gender: "F", color: "#FF7EB3", bg: "#FFF0F5", emoji: "👧🏽", badge: "🌙" },
  { id: "a2", label: "Léo", gender: "M", color: "#5DADE2", bg: "#E8F8FF", emoji: "👦🏻", badge: "⭐" },
  { id: "a3", label: "Maya", gender: "F", color: "#F39C12", bg: "#FFF8E7", emoji: "👧🏿", badge: "🌸" },
  { id: "a4", label: "Kai", gender: "M", color: "#2ECC71", bg: "#EAFFF2", emoji: "👦🏾", badge: "🍀" },
  { id: "a5", label: "Sofia", gender: "F", color: "#E74C8B", bg: "#FFE8F5", emoji: "👧🏼", badge: "🦋" },
  { id: "a6", label: "Davi", gender: "M", color: "#8E44AD", bg: "#F5EAFF", emoji: "👦🏽", badge: "🚀" },
  { id: "a7", label: "Bia", gender: "F", color: "#E67E22", bg: "#FFF3E0", emoji: "👧🏻", badge: "🌈" },
  { id: "a8", label: "Ravi", gender: "M", color: "#1ABC9C", bg: "#E0FFF8", emoji: "👦🏿", badge: "🎵" },
];

// ─── REACTIONS ───────────────────────────────────────────
const REACTIONS = ["Que legal! 🤩", "Boa! 💪", "Uhuu! 🎉", "Incrível! ✨", "Arrasou! 🌟", "Vamos lá! 🚀", "Show! 🎪", "Top! 👏"];
const randomReaction = () => REACTIONS[Math.floor(Math.random() * REACTIONS.length)];

// ─── FACTORY PROJECTS ───────────────────────────────────
const PROJECTS = {
  teddy: {
    name: "Fábrica de Ursinhos",
    icon: "🧸",
    color: "#D4A574",
    accent: "#FF7EB3",
    bgMain: "#FFF5EB",
    bgGrad: "linear-gradient(160deg, #FFECD2 0%, #FCB69F 50%, #FF9A9E 100%)",
    cardBg: "linear-gradient(135deg, #FFECD2, #FFF5EB)",
    desc: "Monte um ursinho fofinho!",
    pieces: [
      { id: "body",    name: "Barriguinha",    icon: "🟤", order: 1, slot: { x:35, y:38, w:30, h:28 }, svg: "bear-body" },
      { id: "head",    name: "Cabecinha",      icon: "🐻", order: 2, slot: { x:38, y:10, w:24, h:30 }, svg: "bear-head" },
      { id: "arm_l",   name: "Bracinho Esq.",  icon: "🤎", order: 3, slot: { x:20, y:38, w:16, h:20 }, svg: "bear-arm" },
      { id: "arm_r",   name: "Bracinho Dir.",  icon: "🤎", order: 4, slot: { x:64, y:38, w:16, h:20 }, svg: "bear-arm" },
      { id: "leg_l",   name: "Perninha Esq.",  icon: "🦶", order: 5, slot: { x:30, y:64, w:16, h:20 }, svg: "bear-leg" },
      { id: "leg_r",   name: "Perninha Dir.",  icon: "🦶", order: 6, slot: { x:54, y:64, w:16, h:20 }, svg: "bear-leg" },
      { id: "eyes",    name: "Olhinhos",       icon: "👀", order: 7, slot: { x:40, y:18, w:20, h:8 },  svg: "bear-eyes" },
      { id: "nose",    name: "Focinho",        icon: "🔵", order: 8, slot: { x:45, y:26, w:10, h:8 },  svg: "bear-nose" },
      { id: "bow",     name: "Gravata Borboleta", icon: "🎀", order: 9, slot: { x:42, y:36, w:16, h:8 }, svg: "bear-bow" },
      { id: "heart",   name: "Coração",        icon: "❤️", order: 10, slot: { x:42, y:46, w:16, h:12 }, svg: "bear-heart" },
    ],
  },
  cake: {
    name: "Fábrica de Bolos",
    icon: "🎂",
    color: "#E74C8B",
    accent: "#FFD93D",
    bgMain: "#FFF0F5",
    bgGrad: "linear-gradient(160deg, #FFDEE9 0%, #B5FFFC 50%, #FFF1EB 100%)",
    cardBg: "linear-gradient(135deg, #FFDEE9, #FFF0F5)",
    desc: "Decore um bolo delicioso!",
    pieces: [
      { id: "base",       name: "Base do Bolo",     icon: "🟫", order: 1, slot: { x:25, y:65, w:50, h:14 }, svg: "cake-base" },
      { id: "layer1",     name: "1ª Camada",        icon: "🍰", order: 2, slot: { x:28, y:52, w:44, h:15 }, svg: "cake-layer1" },
      { id: "layer2",     name: "2ª Camada",        icon: "🎂", order: 3, slot: { x:32, y:40, w:36, h:14 }, svg: "cake-layer2" },
      { id: "layer3",     name: "3ª Camada",        icon: "🧁", order: 4, slot: { x:36, y:28, w:28, h:14 }, svg: "cake-layer3" },
      { id: "frosting",   name: "Cobertura",        icon: "🍦", order: 5, slot: { x:30, y:24, w:40, h:10 }, svg: "cake-frost" },
      { id: "sprinkles",  name: "Confeitos",        icon: "🌈", order: 6, slot: { x:28, y:35, w:44, h:34 }, svg: "cake-sprinkles" },
      { id: "cherry",     name: "Cerejinha",        icon: "🍒", order: 7, slot: { x:44, y:16, w:12, h:14 }, svg: "cake-cherry" },
      { id: "candles",    name: "Velinhas",         icon: "🕯️", order: 8, slot: { x:32, y:8, w:36, h:22 }, svg: "cake-candles" },
      { id: "ribbon",     name: "Fita Decorativa",  icon: "🎗️", order: 9, slot: { x:26, y:58, w:48, h:8 },  svg: "cake-ribbon" },
      { id: "plate",      name: "Prato Bonito",     icon: "🍽️", order: 10, slot: { x:18, y:78, w:64, h:10 }, svg: "cake-plate" },
    ],
  },
};

// ─── SVG PIECE RENDERERS ─────────────────────────────────
function PieceSVG({ type, slot, animate }) {
  const s = { position: "absolute", left: slot.x + "%", top: slot.y + "%", width: slot.w + "%", height: slot.h + "%", transition: "all 0.4s ease" };
  const anim = animate ? { animation: "piecePlace 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" } : {};

  const svgRenderers = {
    "bear-body": () => (
      <svg viewBox="0 0 100 80" style={{ ...s, ...anim }}>
        <ellipse cx="50" cy="42" rx="42" ry="38" fill="#D4A574" />
        <ellipse cx="50" cy="48" rx="32" ry="28" fill="#E8C9A0" />
      </svg>
    ),
    "bear-head": () => (
      <svg viewBox="0 0 100 100" style={{ ...s, ...anim }}>
        <circle cx="18" cy="18" r="16" fill="#D4A574" />
        <circle cx="82" cy="18" r="16" fill="#D4A574" />
        <circle cx="18" cy="18" r="10" fill="#E8C9A0" />
        <circle cx="82" cy="18" r="10" fill="#E8C9A0" />
        <circle cx="50" cy="52" r="40" fill="#D4A574" />
        <ellipse cx="50" cy="58" rx="28" ry="24" fill="#E8C9A0" />
      </svg>
    ),
    "bear-arm": () => (
      <svg viewBox="0 0 60 80" style={{ ...s, ...anim }}>
        <ellipse cx="30" cy="40" rx="22" ry="36" fill="#D4A574" />
        <ellipse cx="30" cy="60" rx="14" ry="14" fill="#C49560" />
      </svg>
    ),
    "bear-leg": () => (
      <svg viewBox="0 0 60 80" style={{ ...s, ...anim }}>
        <ellipse cx="30" cy="36" rx="24" ry="34" fill="#D4A574" />
        <ellipse cx="30" cy="56" rx="18" ry="16" fill="#C49560" />
      </svg>
    ),
    "bear-eyes": () => (
      <svg viewBox="0 0 100 40" style={{ ...s, ...anim }}>
        <circle cx="32" cy="20" r="10" fill="#2C1810" />
        <circle cx="68" cy="20" r="10" fill="#2C1810" />
        <circle cx="36" cy="16" r="4" fill="white" />
        <circle cx="72" cy="16" r="4" fill="white" />
      </svg>
    ),
    "bear-nose": () => (
      <svg viewBox="0 0 60 50" style={{ ...s, ...anim }}>
        <ellipse cx="30" cy="16" rx="14" ry="10" fill="#2C1810" />
        <path d="M30 26 Q20 40 14 38 Q20 34 30 26Z" fill="#2C1810" opacity="0.6" />
        <path d="M30 26 Q40 40 46 38 Q40 34 30 26Z" fill="#2C1810" opacity="0.6" />
        <ellipse cx="30" cy="13" rx="5" ry="3" fill="#5C3D2E" />
      </svg>
    ),
    "bear-bow": () => (
      <svg viewBox="0 0 80 40" style={{ ...s, ...anim }}>
        <ellipse cx="24" cy="20" rx="20" ry="14" fill="#FF7EB3" />
        <ellipse cx="56" cy="20" rx="20" ry="14" fill="#FF7EB3" />
        <circle cx="40" cy="20" r="8" fill="#E74C8B" />
        <ellipse cx="24" cy="20" rx="12" ry="8" fill="#FF9EC7" opacity="0.5" />
        <ellipse cx="56" cy="20" rx="12" ry="8" fill="#FF9EC7" opacity="0.5" />
      </svg>
    ),
    "bear-heart": () => (
      <svg viewBox="0 0 60 50" style={{ ...s, ...anim }}>
        <path d="M30 44 C10 28 0 14 14 6 C22 2 30 12 30 12 C30 12 38 2 46 6 C60 14 50 28 30 44Z" fill="#FF4D6D">
          <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M30 38 C16 26 10 16 18 10 C22 8 28 14 30 14" fill="#FF7A93" opacity="0.4" />
      </svg>
    ),
    "cake-base": () => (
      <svg viewBox="0 0 100 30" style={{ ...s, ...anim }}>
        <rect x="2" y="2" width="96" height="24" rx="6" fill="#8B6914" />
        <rect x="2" y="2" width="96" height="18" rx="6" fill="#A67C2E" />
        <rect x="6" y="6" width="88" height="10" rx="4" fill="#C49A3C" opacity="0.4" />
      </svg>
    ),
    "cake-layer1": () => (
      <svg viewBox="0 0 100 30" style={{ ...s, ...anim }}>
        <rect x="2" y="4" width="96" height="24" rx="8" fill="#FF9EAA" />
        <rect x="2" y="4" width="96" height="16" rx="8" fill="#FFB3C1" />
        <rect x="8" y="8" width="84" height="8" rx="4" fill="#FFC8D2" opacity="0.5" />
      </svg>
    ),
    "cake-layer2": () => (
      <svg viewBox="0 0 100 30" style={{ ...s, ...anim }}>
        <rect x="4" y="4" width="92" height="24" rx="8" fill="#FFD93D" />
        <rect x="4" y="4" width="92" height="16" rx="8" fill="#FFE566" />
        <rect x="10" y="8" width="80" height="8" rx="4" fill="#FFF099" opacity="0.5" />
      </svg>
    ),
    "cake-layer3": () => (
      <svg viewBox="0 0 100 30" style={{ ...s, ...anim }}>
        <rect x="6" y="4" width="88" height="24" rx="8" fill="#B5DEFF" />
        <rect x="6" y="4" width="88" height="16" rx="8" fill="#CCE8FF" />
        <rect x="12" y="8" width="76" height="8" rx="4" fill="#E0F0FF" opacity="0.5" />
      </svg>
    ),
    "cake-frost": () => (
      <svg viewBox="0 0 100 30" style={{ ...s, ...anim }}>
        <path d="M5 28 Q10 4 20 10 Q28 16 35 6 Q42 0 50 8 Q58 16 65 4 Q72 -2 80 8 Q88 16 95 28Z" fill="white" />
        <path d="M10 28 Q15 10 24 14 Q32 18 38 10 Q44 4 50 12 Q56 18 62 8 Q68 2 76 12 Q84 18 90 28Z" fill="#FFF5F5" opacity="0.6" />
      </svg>
    ),
    "cake-sprinkles": () => {
      const colors = ["#FF6B9D", "#FFD93D", "#4ECDC4", "#A77BCA", "#FF8A5B", "#45B7D1"];
      const sprinkles = Array.from({ length: 20 }, (_, i) => ({
        x: 10 + Math.random() * 80, y: 8 + Math.random() * 80,
        r: Math.random() * 40, c: colors[i % colors.length], w: 3 + Math.random() * 3
      }));
      return (
        <svg viewBox="0 0 100 100" style={{ ...s, ...anim }}>
          {sprinkles.map((sp, i) => (
            <rect key={i} x={sp.x} y={sp.y} width={sp.w} height="8" rx="2" fill={sp.c} transform={`rotate(${sp.r} ${sp.x + 2} ${sp.y + 4})`} />
          ))}
        </svg>
      );
    },
    "cake-cherry": () => (
      <svg viewBox="0 0 60 60" style={{ ...s, ...anim }}>
        <path d="M30 10 Q35 0 38 8" stroke="#2D8B2D" strokeWidth="3" fill="none" />
        <circle cx="30" cy="34" r="20" fill="#DC143C" />
        <circle cx="24" cy="28" r="6" fill="#FF4D6D" opacity="0.6" />
        <ellipse cx="30" cy="18" rx="8" ry="4" fill="#228B22" />
      </svg>
    ),
    "cake-candles": () => (
      <svg viewBox="0 0 100 60" style={{ ...s, ...anim }}>
        {[20, 40, 60, 80].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 3} y="20" width="6" height="30" rx="2" fill={["#FF7EB3", "#FFD93D", "#4ECDC4", "#A77BCA"][i]} />
            <ellipse cx={cx} cy="16" rx="6" ry="8" fill="#FFD700" opacity="0.9">
              <animate attributeName="ry" values="8;10;8" dur="0.8s" repeatCount="indefinite" begin={i * 0.2 + "s"} />
            </ellipse>
            <ellipse cx={cx} cy="14" rx="3" ry="5" fill="#FFF3B0" opacity="0.7">
              <animate attributeName="ry" values="5;6;5" dur="0.6s" repeatCount="indefinite" begin={i * 0.15 + "s"} />
            </ellipse>
          </g>
        ))}
      </svg>
    ),
    "cake-ribbon": () => (
      <svg viewBox="0 0 100 20" style={{ ...s, ...anim }}>
        <path d="M2 10 Q15 2 25 10 Q35 18 50 10 Q65 2 75 10 Q85 18 98 10" stroke="#E74C8B" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M2 10 Q15 2 25 10 Q35 18 50 10 Q65 2 75 10 Q85 18 98 10" stroke="#FF9EC7" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    "cake-plate": () => (
      <svg viewBox="0 0 100 20" style={{ ...s, ...anim }}>
        <ellipse cx="50" cy="10" rx="48" ry="9" fill="#E8E8E8" />
        <ellipse cx="50" cy="8" rx="48" ry="7" fill="#F5F5F5" />
        <ellipse cx="50" cy="8" rx="40" ry="5" fill="white" opacity="0.5" />
        <ellipse cx="50" cy="10" rx="48" ry="2" fill="#D0D0D0" opacity="0.3" />
      </svg>
    ),
  };

  const renderer = svgRenderers[type];
  return renderer ? renderer() : null;
}

// ─── FLOATING DECORATIONS ────────────────────────────────
function FloatingDeco({ items }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          position: "absolute",
          left: item.x + "%",
          top: item.y + "%",
          fontSize: item.size + "rem",
          opacity: item.op,
          animation: `floatDeco ${item.dur}s ease-in-out infinite`,
          animationDelay: item.delay + "s",
        }}>{item.emoji}</div>
      ))}
    </div>
  );
}

const DECO_ITEMS = [
  { emoji: "⭐", x: 5, y: 10, size: 1.5, op: 0.2, dur: 6, delay: 0 },
  { emoji: "🌸", x: 90, y: 15, size: 1.2, op: 0.15, dur: 8, delay: 1 },
  { emoji: "☁️", x: 15, y: 5, size: 2, op: 0.1, dur: 10, delay: 2 },
  { emoji: "✨", x: 80, y: 80, size: 1.3, op: 0.2, dur: 5, delay: 0.5 },
  { emoji: "🌈", x: 50, y: 3, size: 1.8, op: 0.12, dur: 12, delay: 3 },
  { emoji: "💫", x: 70, y: 60, size: 1, op: 0.18, dur: 7, delay: 1.5 },
  { emoji: "🎈", x: 8, y: 70, size: 1.4, op: 0.15, dur: 9, delay: 2.5 },
  { emoji: "🦋", x: 92, y: 50, size: 1.1, op: 0.15, dur: 7.5, delay: 0.8 },
];

// ─── STORAGE HELPERS ────────────────────────────────────
async function getRoom(rid) {
  try { const r = await window.storage.get(`fab:${rid}`, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function setRoom(rid, data) {
  try { await window.storage.set(`fab:${rid}`, JSON.stringify(data), true); } catch (e) { console.error(e); }
}
async function listRooms() {
  try {
    const res = await window.storage.list("fab:", true);
    if (!res?.keys?.length) return [];
    const rooms = [];
    for (const k of res.keys.slice(0, 20)) {
      try { const r = await window.storage.get(k, true); if (r) rooms.push(JSON.parse(r.value)); } catch {}
    }
    return rooms.filter(r => r && Date.now() - r.updatedAt < 3600000);
  } catch { return []; }
}

function uid() { return Math.random().toString(36).slice(2, 10); }

// ─── STYLES ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Quicksand:wght@400;500;600;700&display=swap');

  :root {
    --pink: #FF7EB3;
    --mint: #4ECDC4;
    --yellow: #FFD93D;
    --lavender: #C3AED6;
    --cream: #FFF8F0;
    --peach: #FFECD2;
    --coral: #FF8A80;
    --sky: #B5DEFF;
    --text-dark: #3D2C2E;
    --text-mid: #7A6568;
    --shadow-soft: 0 8px 30px rgba(0,0,0,0.08);
    --shadow-pop: 0 12px 40px rgba(255,126,179,0.2);
    --radius: 24px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    font-family: 'Quicksand', sans-serif;
    background: var(--cream);
    color: var(--text-dark);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    position: relative;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(255,126,179,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 80%, rgba(78,205,196,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 50%, rgba(255,217,61,0.05) 0%, transparent 60%),
      var(--cream);
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
    z-index: 1;
    animation: pageIn 0.5s ease;
  }

  @keyframes pageIn { from { opacity:0; transform: translateY(24px) scale(0.98); } to { opacity:1; transform: none; } }
  @keyframes popIn { from { opacity:0; transform: scale(0.6); } to { opacity:1; transform: scale(1); } }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
  @keyframes floatDeco { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(6deg); } }
  @keyframes piecePlace { from { opacity:0; transform: scale(0.3) rotate(-10deg); } to { opacity:1; transform: scale(1) rotate(0deg); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes pulse { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.2); opacity:0.7; } }
  @keyframes confettiDrop { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-250px) rotate(720deg); opacity:0; } }
  @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: none; } }
  @keyframes sparkle { 0%,100% { opacity:0; transform:scale(0); } 50% { opacity:1; transform:scale(1); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(255,126,179,0.3); } 50% { box-shadow: 0 0 24px rgba(255,126,179,0.6); } }
  @keyframes factorySmoke { 0% { opacity:0.6; transform: translateY(0) scale(1); } 100% { opacity:0; transform: translateY(-40px) scale(1.8); } }

  .title-main {
    font-family: 'Bubblegum Sans', cursive;
    font-size: clamp(2.8rem, 9vw, 5rem);
    background: linear-gradient(135deg, var(--pink), var(--yellow), var(--mint), var(--lavender));
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 5s ease infinite;
    text-align: center;
    line-height: 1.1;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.1));
  }

  .title-sm {
    font-family: 'Bubblegum Sans', cursive;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    color: var(--text-dark);
    text-align: center;
  }

  .subtitle {
    font-size: clamp(0.95rem, 2.5vw, 1.2rem);
    color: var(--text-mid);
    text-align: center;
    font-weight: 600;
    margin-top: 6px;
  }

  .card {
    background: white;
    border-radius: var(--radius);
    padding: 28px;
    box-shadow: var(--shadow-soft);
    border: 3px solid rgba(255,126,179,0.12);
    width: 100%;
    max-width: 520px;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--pink), var(--yellow), var(--mint));
    border-radius: var(--radius) var(--radius) 0 0;
  }

  .btn {
    font-family: 'Bubblegum Sans', cursive;
    font-size: 1.15rem;
    padding: 14px 36px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
  }

  .btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
  .btn:active { transform: translateY(-1px) scale(0.98); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  .btn-pink { background: linear-gradient(135deg, var(--pink), #FF9EC7); color: white; }
  .btn-mint { background: linear-gradient(135deg, var(--mint), #7EDDD6); color: white; }
  .btn-yellow { background: linear-gradient(135deg, #FFB347, var(--yellow)); color: var(--text-dark); }
  .btn-sm { font-size: 0.95rem; padding: 10px 22px; }

  .input-field {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 15px 22px;
    border: 3px solid rgba(255,126,179,0.2);
    border-radius: 50px;
    background: rgba(255,248,240,0.8);
    color: var(--text-dark);
    width: 100%;
    outline: none;
    transition: all 0.3s;
  }

  .input-field:focus { border-color: var(--pink); box-shadow: 0 0 20px rgba(255,126,179,0.15); background: white; }
  .input-field::placeholder { color: #C8B0B4; }

  .label {
    font-family: 'Bubblegum Sans', cursive;
    font-size: 0.9rem;
    color: var(--text-mid);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
  }

  .divider {
    width: 60px;
    height: 5px;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--pink), var(--mint));
    margin: 10px auto;
  }

  /* ─── AVATARS ───── */
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 18px 0;
  }

  .avatar-card {
    border: 3px solid transparent;
    border-radius: 20px;
    padding: 14px 6px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
  }

  .avatar-card:hover { transform: translateY(-4px) scale(1.05); }
  .avatar-card.sel { border-color: var(--pink); transform: scale(1.08); animation: glow 2s infinite; }
  .avatar-card .av-emoji { font-size: 2.4rem; display: block; }
  .avatar-card .av-badge { position: absolute; top: -4px; right: -4px; font-size: 1rem; }
  .avatar-card .av-name { font-family: 'Bubblegum Sans', cursive; font-size: 0.8rem; margin-top: 4px; display: block; }

  /* ─── FACTORY CARDS ───── */
  .factory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 24px 0;
    width: 100%;
    max-width: 560px;
  }

  .factory-card {
    border-radius: 28px;
    padding: 32px 20px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 4px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .factory-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 6px;
    background: rgba(0,0,0,0.1);
    border-radius: 0 0 24px 24px;
  }

  .factory-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
  .factory-card.sel { border-color: white; box-shadow: var(--shadow-pop); transform: scale(1.05); }
  .factory-card .f-icon { font-size: 4rem; display: block; margin-bottom: 12px; animation: bounce 2.5s ease-in-out infinite; }
  .factory-card .f-name { font-family: 'Bubblegum Sans', cursive; font-size: 1.4rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
  .factory-card .f-desc { font-size: 0.85rem; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 600; }

  /* ─── SMOKE EFFECT ───── */
  .smoke-container { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); pointer-events: none; }
  .smoke-puff {
    width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,0.5);
    position: absolute; animation: factorySmoke 2s ease infinite;
  }

  /* ─── ROOM LIST ───── */
  .room-item {
    background: white;
    border: 3px solid rgba(255,126,179,0.1);
    border-radius: 18px;
    padding: 14px 18px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s;
    cursor: pointer;
  }

  .room-item:hover { border-color: var(--pink); transform: translateX(4px); box-shadow: var(--shadow-pop); }

  /* ─── GAME SCREEN ───── */
  .game-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    max-width: 950px;
  }

  @media (min-width: 768px) { .game-layout { grid-template-columns: 200px 1fr; } }

  .pieces-panel {
    background: white;
    border-radius: var(--radius);
    padding: 16px;
    border: 3px solid rgba(255,126,179,0.1);
    box-shadow: var(--shadow-soft);
    max-height: 55vh;
    overflow-y: auto;
  }

  .pieces-panel::-webkit-scrollbar { width: 6px; }
  .pieces-panel::-webkit-scrollbar-thumb { background: var(--pink); border-radius: 3px; }

  .piece-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 11px 12px;
    margin-bottom: 6px;
    border: 2px solid rgba(0,0,0,0.05);
    border-radius: 14px;
    background: var(--cream);
    color: var(--text-dark);
    font-family: 'Quicksand', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
  }

  .piece-btn:hover:not(.done) { border-color: var(--pink); background: #FFF0F5; transform: translateX(4px); }
  .piece-btn.done { opacity: 0.45; cursor: default; background: #E8FFE8; border-color: #A8E6CF; }
  .piece-btn.done::after { content: ' ✅'; }
  .piece-icon { font-size: 1.2rem; }

  .assembly-canvas {
    border-radius: var(--radius);
    position: relative;
    min-height: 380px;
    overflow: hidden;
    border: 4px solid rgba(255,255,255,0.5);
    box-shadow: var(--shadow-soft), inset 0 0 60px rgba(0,0,0,0.03);
    transition: all 0.3s;
  }

  .progress-wrap {
    width: 100%;
    height: 18px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 3px solid rgba(255,126,179,0.15);
    box-shadow: var(--shadow-soft);
  }

  .progress-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: linear-gradient(90deg, var(--pink), var(--yellow), var(--mint));
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
    position: relative;
  }

  .players-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px 0;
  }

  .player-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    background: white;
    border-radius: 50px;
    padding: 6px 14px 6px 8px;
    font-size: 0.85rem;
    font-weight: 700;
    border: 2px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    animation: popIn 0.4s ease;
  }

  .player-tag .p-emoji { font-size: 1.3rem; }
  .online-dot { width: 8px; height: 8px; border-radius: 50%; background: #2ECC71; animation: pulse 2s infinite; }

  /* ─── CHAT ───── */
  .chat-box {
    background: white;
    border-radius: var(--radius);
    border: 3px solid rgba(255,126,179,0.1);
    padding: 16px;
    margin-top: 16px;
    width: 100%;
    max-width: 950px;
    box-shadow: var(--shadow-soft);
  }

  .chat-msgs {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 6px;
  }

  .chat-msgs::-webkit-scrollbar { width: 5px; }
  .chat-msgs::-webkit-scrollbar-thumb { background: var(--lavender); border-radius: 3px; }

  .chat-msg { display: flex; align-items: flex-start; gap: 10px; animation: slideUp 0.3s ease; }

  .chat-av {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
    border: 2px solid rgba(0,0,0,0.06);
  }

  .chat-bubble {
    background: var(--cream);
    border-radius: 16px 16px 16px 4px;
    padding: 10px 14px;
    max-width: 80%;
  }

  .chat-bubble .c-name { font-family: 'Bubblegum Sans', cursive; font-size: 0.8rem; }
  .chat-bubble .c-text { font-size: 0.9rem; line-height: 1.4; word-break: break-word; font-weight: 500; }

  .chat-bubble.sys {
    background: linear-gradient(135deg, rgba(255,126,179,0.08), rgba(78,205,196,0.08));
    border: 2px dashed rgba(255,126,179,0.2);
    border-radius: 16px;
    text-align: center;
    font-style: normal;
    color: var(--text-mid);
    font-size: 0.85rem;
    font-weight: 700;
    max-width: 100%;
  }

  .chat-input-row {
    display: flex;
    gap: 10px;
  }

  .chat-input-row input {
    flex: 1;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 12px 18px;
    border: 3px solid rgba(255,126,179,0.15);
    border-radius: 50px;
    background: var(--cream);
    color: var(--text-dark);
    outline: none;
  }

  .chat-input-row input:focus { border-color: var(--pink); }

  .send-btn {
    width: 48px; height: 48px;
    border-radius: 50%; border: none;
    background: linear-gradient(135deg, var(--pink), var(--coral));
    color: white; font-size: 1.3rem;
    cursor: pointer; transition: transform 0.2s;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(255,126,179,0.3);
  }

  .send-btn:hover { transform: scale(1.12); }

  .back-btn {
    background: none; border: none;
    color: var(--text-mid);
    font-family: 'Quicksand', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    padding: 8px 0;
    transition: color 0.2s;
  }
  .back-btn:hover { color: var(--pink); }

  /* ─── CELEBRATION ───── */
  .celeb-overlay {
    position: fixed; inset: 0;
    background: rgba(255,248,240,0.92);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    animation: pageIn 0.4s;
  }

  .celeb-card { text-align: center; animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .celeb-emoji { font-size: 6rem; animation: bounce 1s infinite; }
  .celeb-title { font-family: 'Bubblegum Sans', cursive; font-size: 2.8rem; margin: 16px 0 8px; }

  .confetti-p {
    position: fixed;
    width: 14px; height: 14px;
    border-radius: 3px;
    animation: confettiDrop 2.5s ease forwards;
    z-index: 1001;
  }

  /* ─── GHOST SLOT ───── */
  .ghost-slot {
    position: absolute;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
  }

  .ghost-slot.empty {
    border: 3px dashed rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.15);
  }

  .ghost-slot .ghost-label {
    font-size: clamp(0.5rem, 1.5vw, 0.7rem);
    color: rgba(0,0,0,0.15);
    text-align: center;
    font-weight: 700;
    padding: 2px;
  }

  .sparkle-effect {
    position: absolute;
    pointer-events: none;
    font-size: 1.2rem;
    animation: sparkle 0.8s ease forwards;
  }

  @media (max-width: 480px) {
    .card { padding: 20px 16px; }
    .avatar-grid { grid-template-columns: repeat(2, 1fr); }
    .factory-grid { grid-template-columns: 1fr; }
    .pieces-panel { max-height: 28vh; }
    .assembly-canvas { min-height: 280px; }
    .chat-msgs { max-height: 140px; }
  }
`;

// ─── SPARKLE EFFECT COMPONENT ────────────────────────────
function Sparkles({ active }) {
  const [sparks, setSparks] = useState([]);
  useEffect(() => {
    if (!active) return;
    const s = Array.from({ length: 5 }, () => ({
      id: uid(),
      x: 30 + Math.random() * 40 + "%",
      y: 20 + Math.random() * 60 + "%",
      emoji: ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.5,
    }));
    setSparks(s);
    const t = setTimeout(() => setSparks([]), 1200);
    return () => clearTimeout(t);
  }, [active]);

  return sparks.map(s => (
    <div key={s.id} className="sparkle-effect" style={{ left: s.x, top: s.y, animationDelay: s.delay + "s" }}>
      {s.emoji}
    </div>
  ));
}

// ─── CONFETTI ────────────────────────────────────────────
function Confetti() {
  const colors = ["#FF7EB3", "#FFD93D", "#4ECDC4", "#C3AED6", "#FF8A80", "#A8E6CF", "#B5DEFF", "#FFECD2"];
  return Array.from({ length: 50 }, (_, i) => (
    <div key={i} className="confetti-p" style={{
      left: Math.random() * 100 + "%",
      top: 50 + Math.random() * 50 + "%",
      background: colors[i % colors.length],
      animationDelay: Math.random() * 2 + "s",
      animationDuration: 2 + Math.random() * 1.5 + "s",
      borderRadius: Math.random() > 0.5 ? "50%" : "3px",
      width: 8 + Math.random() * 10,
      height: 8 + Math.random() * 10,
    }} />
  ));
}

// ─── WELCOME ─────────────────────────────────────────────
function WelcomeScreen({ onNext }) {
  const [name, setName] = useState("");

  return (
    <div className="page">
      <FloatingDeco items={DECO_ITEMS} />
      <div style={{ marginTop: "10vh", marginBottom: 24 }}>
        <div className="title-main">Fábrica Mágica</div>
        <p className="subtitle">Construa ursinhos e bolos com seus amigos!</p>
        <div className="divider" />
      </div>

      <div style={{ fontSize: "4.5rem", marginBottom: 20, animation: "wiggle 2s ease-in-out infinite" }}>🏭</div>

      <div className="card" style={{ textAlign: "center" }}>
        <p className="label">Como você se chama?</p>
        <input
          className="input-field"
          placeholder="Seu nome aqui... 🌟"
          maxLength={14}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onNext(name.trim())}
          autoFocus
        />
        <div style={{ marginTop: 22 }}>
          <button className="btn btn-pink" disabled={!name.trim()} onClick={() => onNext(name.trim())}>
            Entrar na Fábrica 🚪✨
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 16, fontSize: "2.2rem", animation: "bounce 3s ease-in-out infinite" }}>
        <span>🧸</span><span>🎂</span><span>🌈</span>
      </div>
      <p style={{ marginTop: 10, color: "var(--text-mid)", fontSize: "0.85rem" }}>Para crianças de 8 a 12 anos</p>
    </div>
  );
}

// ─── AVATAR SELECT ───────────────────────────────────────
function AvatarSelect({ onSelect }) {
  const [sel, setSel] = useState(null);

  return (
    <div className="page">
      <FloatingDeco items={DECO_ITEMS} />
      <div style={{ marginTop: "5vh", marginBottom: 10 }}>
        <div className="title-sm">Escolha seu personagem! 🎭</div>
        <div className="divider" />
      </div>
      <div className="card">
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <div
              key={a.id}
              className={`avatar-card ${sel === a.id ? "sel" : ""}`}
              style={{ background: a.bg }}
              onClick={() => setSel(a.id)}
            >
              <span className="av-badge">{a.badge}</span>
              <span className="av-emoji">{a.emoji}</span>
              <span className="av-name" style={{ color: a.color }}>{a.label}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            className="btn btn-pink"
            disabled={!sel}
            onClick={() => onSelect(AVATARS.find((a) => a.id === sel))}
          >
            Esse sou eu! 🙋
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOBBY ───────────────────────────────────────────────
function Lobby({ player, onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [roomName, setRoomName] = useState("");

  const load = useCallback(async () => {
    setRooms(await listRooms());
    setLoading(false);
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 3000); return () => clearInterval(iv); }, [load]);

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    const id = uid();
    const room = {
      id, name: roomName.trim(),
      players: [{ ...player, joinedAt: Date.now() }],
      project: null, pieces: {},
      chat: [{ sys: true, text: `${player.avatar.emoji} ${player.name} criou a fábrica! Vamos produzir!`, ts: Date.now() }],
      createdAt: Date.now(), updatedAt: Date.now(), completed: false,
    };
    await setRoom(id, room);
    onJoinRoom(id);
  };

  return (
    <div className="page">
      <FloatingDeco items={DECO_ITEMS} />
      <div style={{ marginTop: "3vh", marginBottom: 14 }}>
        <div className="title-sm">🏭 Fábricas Mágicas</div>
        <p className="subtitle">Crie uma fábrica ou entre em uma!</p>
        <div className="divider" />
      </div>

      <div className="players-bar">
        <div className="player-tag" style={{ borderColor: player.avatar.color + "33" }}>
          <span className="p-emoji">{player.avatar.emoji}</span>
          <span>{player.name}</span>
          <span>{player.avatar.badge}</span>
          <span className="online-dot" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="label">🔨 Criar Fábrica Nova</p>
        {!creating ? (
          <button className="btn btn-yellow" style={{ width: "100%" }} onClick={() => setCreating(true)}>
            + Nova Fábrica 🏗️
          </button>
        ) : (
          <div>
            <input className="input-field" placeholder="Nome da fábrica..." maxLength={24}
              value={roomName} onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()} autoFocus
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn btn-mint btn-sm" onClick={handleCreate} disabled={!roomName.trim()}>Criar 🎉</button>
              <button className="btn btn-sm" style={{ background: "#f0f0f0", color: "var(--text-mid)" }} onClick={() => setCreating(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <p className="label">📋 Fábricas Abertas</p>
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-mid)", padding: 20 }}>Procurando fábricas... 🔍</p>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: "3rem", marginBottom: 10 }}>🏭</div>
            <p style={{ color: "var(--text-mid)", fontWeight: 600 }}>Nenhuma fábrica ainda...<br />Crie a primeira!</p>
          </div>
        ) : (
          rooms.map((r) => (
            <div key={r.id} className="room-item" onClick={() => onJoinRoom(r.id)}>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "'Bubblegum Sans', cursive", fontSize: "1.05rem" }}>{r.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-mid)", fontWeight: 600 }}>
                  {r.players?.length || 0} operário(s) {r.project ? `• ${PROJECTS[r.project]?.icon} ${PROJECTS[r.project]?.name}` : ""}
                </div>
              </div>
              <div style={{ fontSize: "1.5rem", color: "var(--pink)" }}>→</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── PROJECT SELECT ──────────────────────────────────────
function ProjectSelect({ player, roomId, onBack, onSelected }) {
  const [sel, setSel] = useState(null);

  const confirm = async () => {
    if (!sel) return;
    const r = await getRoom(roomId);
    if (!r) return;
    r.project = sel;
    r.pieces = {};
    r.chat.push({ sys: true, text: `${player.avatar.emoji} ${player.name} abriu a ${PROJECTS[sel].name}! ${PROJECTS[sel].icon}`, ts: Date.now() });
    r.updatedAt = Date.now();
    await setRoom(roomId, r);
    onSelected(sel);
  };

  return (
    <div className="page">
      <FloatingDeco items={DECO_ITEMS} />
      <button className="back-btn" onClick={onBack}>← Voltar</button>
      <div style={{ marginTop: "2vh", marginBottom: 16 }}>
        <div className="title-sm">O que vamos fabricar? 🤔</div>
        <div className="divider" />
      </div>

      <div className="factory-grid">
        {Object.entries(PROJECTS).map(([key, proj]) => (
          <div
            key={key}
            className={`factory-card ${sel === key ? "sel" : ""}`}
            style={{ background: proj.bgGrad }}
            onClick={() => setSel(key)}
          >
            <div className="smoke-container">
              {[0, 1, 2].map(i => (
                <div key={i} className="smoke-puff" style={{ left: (-10 + i * 15) + "px", animationDelay: i * 0.6 + "s" }} />
              ))}
            </div>
            <span className="f-icon">{proj.icon}</span>
            <span className="f-name">{proj.name}</span>
            <span className="f-desc">{proj.desc}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-pink" disabled={!sel} onClick={confirm} style={{ marginTop: 10 }}>
        Abrir a Fábrica! 🏭✨
      </button>
    </div>
  );
}

// ─── GAME SCREEN ─────────────────────────────────────────
function GameScreen({ roomId, player, onBack }) {
  const [room, setRoomState] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [lastPlaced, setLastPlaced] = useState(null);
  const chatRef = useRef(null);
  const celebratedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const r = await getRoom(roomId);
      if (r && active) {
        setRoomState(r);
        if (r.project && !celebratedRef.current) {
          const total = PROJECTS[r.project].pieces.length;
          if (Object.keys(r.pieces || {}).length >= total) {
            celebratedRef.current = true;
            setCelebrate(true);
          }
        }
      }
    };
    poll();
    const iv = setInterval(poll, POLL_INTERVAL);
    return () => { active = false; clearInterval(iv); };
  }, [roomId]);

  useEffect(() => {
    (async () => {
      const r = await getRoom(roomId);
      if (!r) return;
      if (!r.players.some(p => p.id === player.id)) {
        r.players.push({ ...player, joinedAt: Date.now() });
        r.chat.push({ sys: true, text: `${player.avatar.emoji} ${player.name} entrou na fábrica!`, ts: Date.now() });
        r.updatedAt = Date.now();
        await setRoom(roomId, r);
      }
    })();
  }, [roomId, player]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [room?.chat?.length]);

  const placePiece = async (pid) => {
    const r = await getRoom(roomId);
    if (!r || r.pieces[pid]) return;
    r.pieces[pid] = { by: player.name, av: player.avatar.emoji, at: Date.now() };
    const piece = PROJECTS[r.project].pieces.find(p => p.id === pid);
    r.chat.push({ sys: true, text: `${player.avatar.emoji} ${player.name} encaixou: ${piece.name} ${piece.icon} — ${randomReaction()}`, ts: Date.now() });
    r.updatedAt = Date.now();
    await setRoom(roomId, r);
    setLastPlaced(pid);
    setTimeout(() => setLastPlaced(null), 1000);
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const r = await getRoom(roomId);
    if (!r) return;
    r.chat.push({ sender: player.name, av: player.avatar.emoji, avColor: player.avatar.color, text: chatMsg.trim(), ts: Date.now() });
    r.updatedAt = Date.now();
    await setRoom(roomId, r);
    setChatMsg("");
  };

  if (!room) return <div className="page"><p style={{ marginTop: "30vh", fontSize: "1.3rem" }}>Entrando na fábrica... 🏭</p></div>;
  if (!room.project) return <ProjectSelect player={player} roomId={roomId} onBack={onBack} onSelected={() => {}} />;

  const proj = PROJECTS[room.project];
  const total = proj.pieces.length;
  const done = Object.keys(room.pieces || {}).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="page" style={{ paddingTop: 10 }}>
      <FloatingDeco items={DECO_ITEMS.slice(0, 4)} />

      {celebrate && (
        <div className="celeb-overlay" onClick={() => setCelebrate(false)}>
          <Confetti />
          <div className="celeb-card">
            <div className="celeb-emoji">{proj.icon}</div>
            <div className="celeb-title" style={{ color: proj.color }}>
              {proj.name === "Fábrica de Ursinhos" ? "Ursinho Pronto!" : "Bolo Pronto!"}
            </div>
            <p style={{ color: "var(--text-mid)", marginBottom: 20, fontSize: "1.1rem", fontWeight: 600 }}>
              Parabéns equipe! Vocês fabricaram juntos! 🎉
            </p>
            <button className="btn btn-pink" onClick={() => setCelebrate(false)}>
              Que demais! 🥳
            </button>
          </div>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 950, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
        <button className="back-btn" onClick={onBack}>← Sair</button>
        <div style={{ fontFamily: "'Bubblegum Sans', cursive", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ animation: "wiggle 2s infinite" }}>{proj.icon}</span> {proj.name}
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-mid)", fontWeight: 700, background: "white", padding: "4px 14px", borderRadius: 50, border: "2px solid rgba(0,0,0,0.05)" }}>
          🏭 {room.name}
        </div>
      </div>

      <div className="players-bar">
        {(room.players || []).map((p, i) => (
          <div key={i} className="player-tag" style={{ borderColor: (p.avatar?.color || "#ddd") + "33" }}>
            <span className="p-emoji">{p.avatar?.emoji}</span>
            <span>{p.name}</span>
            <span className="online-dot" />
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 950, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-mid)", marginBottom: 6 }}>
          <span>⚙️ Linha de produção</span>
          <span>{done}/{total} peças ({pct}%)</span>
        </div>
        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: pct + "%" }} />
        </div>
      </div>

      <div className="game-layout">
        <div className="pieces-panel">
          <p className="label" style={{ fontSize: "0.75rem" }}>📦 Peças</p>
          {proj.pieces.map((piece) => {
            const isDone = !!room.pieces[piece.id];
            return (
              <button key={piece.id} className={`piece-btn ${isDone ? "done" : ""}`}
                onClick={() => !isDone && placePiece(piece.id)} disabled={isDone}
              >
                <span className="piece-icon">{piece.icon}</span>
                <span>{piece.name}</span>
              </button>
            );
          })}
        </div>

        <div className="assembly-canvas" style={{ background: proj.bgGrad }}>
          <Sparkles active={!!lastPlaced} />

          {proj.pieces.map((piece) => {
            const isDone = !!room.pieces[piece.id];
            return (
              <div key={piece.id}>
                {isDone ? (
                  <PieceSVG type={piece.svg} slot={piece.slot} animate={lastPlaced === piece.id} />
                ) : (
                  <div className="ghost-slot empty" style={{
                    left: piece.slot.x + "%", top: piece.slot.y + "%",
                    width: piece.slot.w + "%", height: piece.slot.h + "%",
                  }}>
                    <span className="ghost-label">{piece.name}</span>
                  </div>
                )}
              </div>
            );
          })}

          {pct === 100 && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.3)", borderRadius: "var(--radius)",
            }}>
              <div style={{ textAlign: "center", animation: "bounce 1s infinite" }}>
                <div style={{ fontSize: "4.5rem" }}>{proj.icon}</div>
                <div style={{ fontFamily: "'Bubblegum Sans', cursive", fontSize: "1.6rem", color: proj.color }}>Pronto! 🎉</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-box">
        <p className="label" style={{ fontSize: "0.75rem" }}>💬 Chat da Equipe</p>
        <div className="chat-msgs" ref={chatRef}>
          {(room.chat || []).slice(-60).map((msg, i) =>
            msg.sys ? (
              <div key={i} className="chat-msg" style={{ justifyContent: "center" }}>
                <div className="chat-bubble sys">{msg.text}</div>
              </div>
            ) : (
              <div key={i} className="chat-msg">
                <div className="chat-av" style={{ background: (msg.avColor || "var(--pink)") + "20", border: `2px solid ${msg.avColor || "var(--pink)"}33` }}>
                  {msg.av}
                </div>
                <div className="chat-bubble">
                  <div className="c-name" style={{ color: msg.avColor || "var(--pink)" }}>{msg.sender}</div>
                  <div className="c-text">{msg.text}</div>
                </div>
              </div>
            )
          )}
        </div>
        <div className="chat-input-row">
          <input placeholder="Fale com a equipe... 💬" maxLength={120}
            value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
          <button className="send-btn" onClick={sendChat}>✉️</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [player, setPlayer] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const handleName = (name) => { setPlayer({ id: uid(), name }); setScreen("avatar"); };
  const handleAvatar = (avatar) => { setPlayer(p => ({ ...p, avatar })); setScreen("lobby"); };

  const handleJoinRoom = async (id) => {
    const r = await getRoom(id);
    if (r && !r.players.some(p => p.id === player.id)) {
      r.players.push({ ...player, joinedAt: Date.now() });
      r.chat.push({ sys: true, text: `${player.avatar.emoji} ${player.name} entrou na fábrica!`, ts: Date.now() });
      r.updatedAt = Date.now();
      await setRoom(id, r);
    }
    setRoomId(id);
    setScreen("game");
  };

  return (
    <div className="app">
      <style>{css}</style>
      {screen === "welcome" && <WelcomeScreen onNext={handleName} />}
      {screen === "avatar" && <AvatarSelect onSelect={handleAvatar} />}
      {screen === "lobby" && <Lobby player={player} onJoinRoom={handleJoinRoom} />}
      {screen === "game" && roomId && <GameScreen roomId={roomId} player={player} onBack={() => { setRoomId(null); setScreen("lobby"); }} />}
    </div>
  );
}
