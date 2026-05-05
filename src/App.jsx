import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  surface: "#141414",
  card: "#1a1a1a",
  border: "#2a2a2a",
  borderLight: "#333",
  text: "#f0f0f0",
  textMuted: "#666",
  textDim: "#444",
  accent: "#c8f135",       // neon lime — primary action
  accentDim: "#c8f13520",
  accentMuted: "#c8f13540",
  push: "#ff6b35",
  pull: "#4fc3f7",
  legs: "#a78bfa",
  red: "#ff4444",
  green: "#4ade80",
};

// ─── PLAN DATA ────────────────────────────────────────────────────────────────
const PLAN = {
  "PUSH 1": {
    tag: "PUSH", day: 1,
    exercises: [
      { id: "bench", name: "Wyciskanie sztangi (płaska)", muscle: "Klatka", sets: 4, reps: "6–8", weight: 45, icon: "🏋️" },
      { id: "incline_db", name: "Wyciskanie hantli (skośna)", muscle: "Klatka górna", sets: 3, reps: "8–10", weight: 14, icon: "💪" },
      { id: "pec_deck", name: "Rozpiętki na maszynie", muscle: "Klatka", sets: 3, reps: "12–15", weight: 25, icon: "🔄" },
      { id: "ohp_db", name: "Wyciskanie hantli nad głowę", muscle: "Barki", sets: 3, reps: "8–10", weight: 12, icon: "⬆️" },
      { id: "lat_raise", name: "Unoszenie hantli bokiem", muscle: "Barki boczne", sets: 3, reps: "12–15", weight: 8, icon: "↔️" },
      { id: "tricep_push", name: "Prostowanie ramion (wyciąg)", muscle: "Triceps", sets: 3, reps: "10–15", weight: 20, icon: "📏" },
      { id: "cable_crunch", name: "Spięcia na wyciągu", muscle: "Brzuch", sets: 3, reps: "12–15", weight: 25, icon: "🔻" },
      { id: "plank", name: "Plank", muscle: "Core", sets: 3, reps: "max", weight: 0, icon: "⏱️" },
    ]
  },
  "PULL 1": {
    tag: "PULL", day: 2,
    exercises: [
      { id: "pullup", name: "Podciąganie", muscle: "Plecy / Biceps", sets: 5, reps: "4", weight: 0, icon: "⬆️" },
      { id: "barbell_row", name: "Wiosłowanie sztangą", muscle: "Plecy środek", sets: 4, reps: "8–10", weight: 35, icon: "🏋️" },
      { id: "machine_row", name: "Wiosłowanie na maszynie", muscle: "Plecy", sets: 3, reps: "10–12", weight: 35, icon: "🔄" },
      { id: "face_pull1", name: "Face Pull", muscle: "Tylne barki", sets: 3, reps: "12–15", weight: 15, icon: "🎯" },
      { id: "curl_db", name: "Uginanie hantli stojąc", muscle: "Biceps", sets: 3, reps: "10–12", weight: 12, icon: "💪" },
      { id: "preacher", name: "Uginanie na modlitewniku", muscle: "Biceps", sets: 3, reps: "12–15", weight: 20, icon: "📐" },
    ]
  },
  "LEGS 1": {
    tag: "LEGS", day: 3,
    exercises: [
      { id: "squat", name: "Przysiady ze sztangą", muscle: "Kwadriceps / Pośladki", sets: 4, reps: "6–8", weight: 45, icon: "🏋️" },
      { id: "lunge", name: "Wykroki z hantlami", muscle: "Kwadriceps", sets: 3, reps: "10/noga", weight: 12, icon: "🦵" },
      { id: "hack_squat", name: "Hack Squat / Leg Press", muscle: "Kwadriceps", sets: 3, reps: "8–12", weight: 60, icon: "⬇️" },
      { id: "leg_curl_l", name: "Uginanie nóg leżąc", muscle: "Dwugłowy uda", sets: 3, reps: "12–15", weight: 25, icon: "🔄" },
      { id: "leg_ext_l", name: "Prostowanie nóg", muscle: "Kwadriceps", sets: 3, reps: "12–15", weight: 25, icon: "📏" },
      { id: "calf1", name: "Wspięcia na palce", muscle: "Łydki", sets: 4, reps: "12–20", weight: 30, icon: "👟" },
    ]
  },
  "PUSH 2": {
    tag: "PUSH", day: 4,
    exercises: [
      { id: "chest_press_m", name: "Wyciskanie na maszynie", muscle: "Klatka", sets: 4, reps: "6–8", weight: 45, icon: "🔄" },
      { id: "dips", name: "Dipy / Wyciskanie francuskie", muscle: "Triceps / Klatka", sets: 3, reps: "8–10", weight: 0, icon: "⬇️" },
      { id: "cable_fly", name: "Rozpiętki na bramie", muscle: "Klatka", sets: 3, reps: "12–15", weight: 20, icon: "↔️" },
      { id: "face_pull2", name: "Face Pull", muscle: "Tylne barki", sets: 3, reps: "12–15", weight: 15, icon: "🎯" },
      { id: "rear_delt", name: "Unoszenie hantli w opadzie", muscle: "Tylne barki", sets: 3, reps: "12–15", weight: 8, icon: "📐" },
      { id: "tricep_rope", name: "Prostowanie ramion linką", muscle: "Triceps", sets: 3, reps: "12–15", weight: 15, icon: "📏" },
      { id: "leg_raise", name: "Unoszenie nóg w zwisie", muscle: "Brzuch dolny", sets: 3, reps: "8–12", weight: 0, icon: "⬆️" },
      { id: "russian", name: "Russian Twist z ciężarem", muscle: "Core", sets: 3, reps: "15", weight: 5, icon: "🔄" },
    ]
  },
  "PULL 2": {
    tag: "PULL", day: 5,
    exercises: [
      { id: "pullup2", name: "Podciąganie (progresja)", muscle: "Plecy / Biceps", sets: 4, reps: "6–8", weight: 0, icon: "⬆️" },
      { id: "rdl", name: "Martwy ciąg RDL", muscle: "Dwugłowy / Plecy", sets: 4, reps: "6–8", weight: 45, icon: "🏋️" },
      { id: "lat_pull_close", name: "Ściąganie drążka (wąski nachwyt)", muscle: "Plecy", sets: 3, reps: "8–10", weight: 35, icon: "⬇️" },
      { id: "db_row", name: "Wiosłowanie jednorącz", muscle: "Plecy", sets: 3, reps: "10–12", weight: 20, icon: "💪" },
      { id: "hammer", name: "Uginanie młotkowe", muscle: "Biceps / Ramię", sets: 3, reps: "10–12", weight: 12, icon: "🔨" },
      { id: "cable_curl", name: "Uginanie na linkach", muscle: "Biceps", sets: 3, reps: "12–15", weight: 12, icon: "📐" },
    ]
  },
  "LEGS 2": {
    tag: "LEGS", day: 6,
    exercises: [
      { id: "hip_thrust", name: "Hip Thrust", muscle: "Pośladki", sets: 4, reps: "8–10", weight: 50, icon: "🍑" },
      { id: "leg_press", name: "Suwnica (Leg Press)", muscle: "Kwadriceps", sets: 4, reps: "8–12", weight: 65, icon: "⬇️" },
      { id: "bulgarian", name: "Przysiady bułgarskie", muscle: "Kwadriceps / Pośladki", sets: 3, reps: "10/noga", weight: 12, icon: "🦵" },
      { id: "leg_curl_s", name: "Uginanie nóg siedzące", muscle: "Dwugłowy uda", sets: 3, reps: "12–15", weight: 25, icon: "🔄" },
      { id: "leg_ext2", name: "Prostowanie nóg", muscle: "Kwadriceps", sets: 3, reps: "12–15", weight: 25, icon: "📏" },
      { id: "calf2", name: "Łydki", muscle: "Łydki", sets: 4, reps: "12–20", weight: 30, icon: "👟" },
      { id: "weighted_sit", name: "Brzuszki z talerzem", muscle: "Brzuch", sets: 3, reps: "12–15", weight: 5, icon: "🔻" },
      { id: "hollow", name: "Hollow Body Hold", muscle: "Core", sets: 3, reps: "max", weight: 0, icon: "⏱️" },
    ]
  },
};

const TAG_COLOR = { PUSH: T.push, PULL: T.pull, LEGS: T.legs };

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const KEY = "gymlogpro_v2";
const loadDb = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveDb = d => localStorage.setItem(KEY, JSON.stringify(d));

// ─── UTILS ────────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("pl-PL", { day: "2-digit", month: "short" });
const fmtDateLong = d => new Date(d + "T12:00:00").toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body { background: ${T.bg}; color: ${T.text}; font-family: 'Outfit', 'DM Sans', sans-serif; }
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
    input[type=number] { -moz-appearance: textfield; }
    ::-webkit-scrollbar { width: 0; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    .fadeUp { animation: fadeUp 0.3s ease forwards; }
    .pop { animation: pop 0.25s ease; }
  `}</style>
);

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Tag = ({ label, small }) => (
  <span style={{
    background: TAG_COLOR[label] + "22",
    color: TAG_COLOR[label],
    border: `1px solid ${TAG_COLOR[label]}44`,
    borderRadius: 6,
    padding: small ? "2px 7px" : "3px 10px",
    fontSize: small ? 10 : 11,
    fontWeight: 800,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  }}>{label}</span>
);

const Pill = ({ children, active, color, onClick }) => (
  <button onClick={onClick} style={{
    flexShrink: 0,
    padding: "6px 14px",
    borderRadius: 20,
    border: active ? `1.5px solid ${color || T.accent}` : `1.5px solid ${T.border}`,
    background: active ? (color || T.accent) + "18" : "transparent",
    color: active ? (color || T.accent) : T.textMuted,
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", transition: "all 0.15s",
    letterSpacing: 0.3,
  }}>{children}</button>
);

function NumberInput({ value, onChange, placeholder, suffix }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 10px",
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, color: T.text, fontSize: 16, fontWeight: 600,
          outline: "none", fontFamily: "inherit", textAlign: "center",
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.border}
      />
      {suffix && (
        <span style={{ position: "absolute", right: 8, fontSize: 11, color: T.textMuted, pointerEvents: "none" }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

// ─── PROGRESSION ALERT ────────────────────────────────────────────────────────
function ProgressionAlert({ exercise, onClose }) {
  const isCompound = exercise.reps === "6–8" || exercise.reps === "4";
  const increment = isCompound ? "2,5–5 kg" : "1–2,5 kg";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000dd", backdropFilter: "blur(10px)",
      zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 20px", animation: "fadeUp 0.25s ease",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: T.card, borderRadius: 24, padding: "32px 24px",
        width: "100%", maxWidth: 400, border: `1px solid ${T.accent}44`,
        textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: T.accent + "20",
          border: `2px solid ${T.accent}44`, margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
        }}>🚀</div>

        <div style={{ fontSize: 11, color: T.accent, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
          CZAS NA PROGRESJĘ
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
          {exercise.name}
        </div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
          Osiągnąłeś górną granicę powtórzeń we wszystkich seriach.<br />
          Na następnym treningu zwiększ ciężar o
        </div>

        <div style={{
          background: T.accent + "18", border: `1.5px solid ${T.accent}44`,
          borderRadius: 14, padding: "14px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>⬆️</span>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T.accent, letterSpacing: -1 }}>
              +{increment}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
              {isCompound ? "ćwiczenie bazowe" : "izolacja / maszyna"}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20, lineHeight: 1.5 }}>
          💡 Pamiętaj — forma jest ważniejsza niż ciężar.
        </div>

        <button onClick={onClose} style={{
          width: "100%", padding: 14, borderRadius: 14, border: "none",
          background: T.accent, color: "#000", fontSize: 15, fontWeight: 800,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Rozumiem, dzięki! 💪
        </button>
      </div>
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ onClose, autoStart = true, defaultTime = 90 }) {
  const [customTime, setCustomTime] = useState(defaultTime);
  const [seconds, setSeconds] = useState(defaultTime);
  const [running, setRunning] = useState(autoStart);
  const [finished, setFinished] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  function reset(t) {
    clearInterval(ref.current);
    setCustomTime(t);
    setSeconds(t);
    setFinished(false);
    setRunning(true);
  }

  const pct = seconds / customTime;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const presets = [60, 90, 120, 180];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000cc", backdropFilter: "blur(8px)",
      zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeUp 0.2s ease",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: T.card, borderRadius: "28px 28px 0 0",
        padding: "28px 24px 44px", width: "100%", maxWidth: 480,
        border: `1px solid ${T.border}`,
      }}>
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Odpoczynek</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
              {finished ? "🟢 Czas ruszać!" : running ? "⏳ Odpoczywa..." : "⏸ Pauza"}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted,
            borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13,
            fontFamily: "inherit", fontWeight: 600,
          }}>Zamknij</button>
        </div>

        {/* Big circle timer */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ position: "relative" }}>
            <svg width={140} height={140}>
              <circle cx={70} cy={70} r={r} fill="none" stroke={T.surface} strokeWidth={8} />
              <circle cx={70} cy={70} r={r} fill="none"
                stroke={finished ? T.green : running ? T.accent : T.textMuted}
                strokeWidth={8}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                fontSize: 32, fontWeight: 900, letterSpacing: -2,
                color: finished ? T.green : T.text,
                fontVariantNumeric: "tabular-nums",
              }}>
                {mins}:{secs.toString().padStart(2, "0")}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 1, marginTop: 2 }}>
                {Math.round(pct * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          {presets.map(p => (
            <button key={p} onClick={() => reset(p)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 12,
              border: `1.5px solid ${customTime === p && !finished ? T.accent : T.border}`,
              background: customTime === p && !finished ? T.accentDim : T.surface,
              color: customTime === p && !finished ? T.accent : T.textMuted,
              cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit",
              transition: "all 0.15s",
            }}>
              {p < 60 ? `${p}s` : `${p / 60}m`}
            </button>
          ))}
        </div>

        {/* Main action button */}
        <button
          onClick={() => {
            if (finished) { onClose(); return; }
            setRunning(r => !r);
          }}
          style={{
            width: "100%", padding: 16, borderRadius: 16, border: "none",
            background: finished ? T.green : running ? T.surface : T.accent,
            border: `1.5px solid ${finished ? T.green : running ? T.border : T.accent}`,
            color: finished ? "#000" : running ? T.textMuted : "#000",
            fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.25s",
          }}
        >
          {finished ? "✅ Idziemy! Zamknij" : running ? "⏸  Pauza" : "▶  Wznów"}
        </button>
      </div>
    </div>
  );
}

// ─── SET ROW ──────────────────────────────────────────────────────────────────
function SetRow({ setNum, prev, value, onChange, onComplete, isCompleted }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "28px 1fr 16px 1fr 40px",
      alignItems: "center", gap: 8, padding: "8px 0",
      borderBottom: `1px solid ${T.border}`,
      opacity: isCompleted ? 0.6 : 1,
      transition: "opacity 0.2s",
    }}>
      <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 700, textAlign: "center" }}>{setNum}</span>
      <NumberInput
        value={value?.weight ?? ""}
        onChange={v => onChange({ ...value, weight: v })}
        placeholder={prev?.weight || "—"}
        suffix="kg"
      />
      <span style={{ color: T.textDim, textAlign: "center", fontSize: 14 }}>×</span>
      <NumberInput
        value={value?.reps ?? ""}
        onChange={v => onChange({ ...value, reps: v })}
        placeholder={prev?.reps || "—"}
        suffix="rep"
      />
      <button
        onClick={onComplete}
        style={{
          width: 36, height: 36, borderRadius: 10, border: "none",
          background: isCompleted ? T.accent : T.surface,
          color: isCompleted ? "#000" : T.textMuted,
          fontSize: 16, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", flexShrink: 0,
        }}
      >{isCompleted ? "✓" : "○"}</button>
    </div>
  );
}

// ─── HELPERS: progression detection ──────────────────────────────────────────
function parseUpperRep(repsStr) {
  if (!repsStr) return null;
  const m = repsStr.match(/(\d+)\s*(?:–|-)\s*(\d+)/);
  if (m) return parseInt(m[2]);
  const single = repsStr.match(/^(\d+)$/);
  if (single) return parseInt(single[1]);
  return null;
}

function checkProgression(exercise, setsData) {
  const upper = parseUpperRep(exercise.reps);
  if (!upper || exercise.reps === "max") return false;
  const sets = Array.from({ length: exercise.sets }, (_, i) => i + 1);
  return sets.every(s => {
    const rep = parseInt(setsData?.[s]?.reps);
    return setsData?.[s]?.done && rep >= upper;
  });
}

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, data, prevData, onChange, onTimerStart, onProgressionAlert, style: cardStyle }) {
  const [open, setOpen] = useState(false);
  const sets = Array.from({ length: exercise.sets }, (_, i) => i + 1);
  const completed = sets.filter(s => data?.sets?.[s]?.done).length;
  const done = completed === exercise.sets;

  const bestWeight = prevData
    ? Math.max(...Object.values(prevData?.sets || {}).map(s => parseFloat(s?.weight) || 0))
    : null;

  // Progression badge: all sets hit upper rep AND done
  const shouldProgress = done && checkProgression(exercise, data?.sets);

  return (
    <div style={{
      background: T.card,
      borderRadius: 16,
      overflow: "hidden",
      border: `1px solid ${done ? (shouldProgress ? T.accent : T.accent + "40") : T.border}`,
      transition: "all 0.25s",
      ...cardStyle,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: done ? T.accent + "22" : T.surface,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0, border: `1px solid ${done ? T.accent + "40" : T.border}`,
          transition: "all 0.2s",
        }}>
          {done ? <span style={{ color: T.accent, fontSize: 18 }}>✓</span> : exercise.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{exercise.name}</span>
            {shouldProgress && (
              <span style={{
                background: T.accent + "22", color: T.accent,
                border: `1px solid ${T.accent}44`, borderRadius: 6,
                fontSize: 9, fontWeight: 800, padding: "2px 6px", letterSpacing: 0.5,
              }}>↑ PROGRESJA</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, display: "flex", gap: 8, alignItems: "center" }}>
            <span>{exercise.sets} serie · {exercise.reps} rep</span>
            {bestWeight > 0 && <span style={{ color: T.accent + "99" }}>prev {bestWeight}kg</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!done && completed > 0 && (
            <span style={{
              background: T.surface, borderRadius: 20, padding: "3px 8px",
              fontSize: 11, color: T.textMuted, fontWeight: 700,
            }}>{completed}/{exercise.sets}</span>
          )}
          <span style={{
            color: T.textMuted, fontSize: 11, display: "inline-block",
            transform: open ? "rotate(180deg)" : "none", transition: "0.2s",
          }}>▾</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", animation: "fadeUp 0.2s ease" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "28px 1fr 16px 1fr 40px",
            gap: 8, marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${T.border}`,
          }}>
            <span />
            <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, textAlign: "center" }}>KG</span>
            <span />
            <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, textAlign: "center" }}>REP</span>
            <span />
          </div>
          {sets.map(s => (
            <SetRow
              key={s}
              setNum={s}
              value={data?.sets?.[s]}
              prev={prevData?.sets?.[s]}
              isCompleted={data?.sets?.[s]?.done}
              onChange={val => onChange(s, val)}
              onComplete={() => {
                const cur = data?.sets?.[s];
                const isDone = !cur?.done;
                const updated = { ...cur, done: isDone };
                onChange(s, updated);
                if (isDone) {
                  // Always start rest timer
                  onTimerStart();
                  // Check if this completing the last set triggers progression
                  const newSetsData = { ...(data?.sets || {}), [s]: updated };
                  const allDone = sets.every(ss => newSetsData[ss]?.done);
                  if (allDone && checkProgression(exercise, newSetsData)) {
                    // Delay progression alert to after timer appears
                    setTimeout(() => onProgressionAlert(exercise), 100);
                  }
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WORKOUT TAB ──────────────────────────────────────────────────────────────
function WorkoutTab({ db, setDb }) {
  const days = Object.keys(PLAN);
  const [activeDay, setActiveDay] = useState(days[0]);
  const [showTimer, setShowTimer] = useState(false);
  const [progressionEx, setProgressionEx] = useState(null); // exercise to show alert for
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef();
  const date = todayStr();

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const plan = PLAN[activeDay];
  const dayData = db?.[date]?.[activeDay] || {};

  function getPrevData(exerciseId) {
    const dates = Object.keys(db).filter(d => d !== date).sort((a, b) => b.localeCompare(a));
    for (const d of dates) {
      if (db[d]?.[activeDay]?.[exerciseId]) return db[d][activeDay][exerciseId];
    }
    return null;
  }

  function handleChange(exerciseId, setNum, val) {
    setDb(prev => {
      const next = structuredClone(prev);
      if (!next[date]) next[date] = {};
      if (!next[date][activeDay]) next[date][activeDay] = {};
      if (!next[date][activeDay][exerciseId]) next[date][activeDay][exerciseId] = { sets: {} };
      next[date][activeDay][exerciseId].sets[setNum] = val;
      saveDb(next);
      return next;
    });
    if (!timerActive) setTimerActive(true);
  }

  const totalSets = plan.exercises.reduce((a, ex) => a + ex.sets, 0);
  const completedSets = plan.exercises.reduce((a, ex) => {
    return a + Object.values(dayData[ex.id]?.sets || {}).filter(s => s?.done).length;
  }, 0);
  const pct = totalSets > 0 ? completedSets / totalSets : 0;

  const elMins = Math.floor(elapsed / 60);
  const elSecs = elapsed % 60;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Auto rest timer — appears immediately after ✓ */}
      {showTimer && (
        <RestTimer
          autoStart={true}
          defaultTime={90}
          onClose={() => setShowTimer(false)}
        />
      )}

      {/* Progression alert — shown after last set if all reps hit upper */}
      {progressionEx && !showTimer && (
        <ProgressionAlert
          exercise={progressionEx}
          onClose={() => setProgressionEx(null)}
        />
      )}

      {/* Day pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
        {days.map(d => (
          <Pill key={d} active={d === activeDay} color={TAG_COLOR[PLAN[d].tag]}
            onClick={() => setActiveDay(d)}>
            {d}
          </Pill>
        ))}
      </div>

      {/* Workout header card */}
      <div style={{
        background: T.card, borderRadius: 20, padding: "18px 20px",
        border: `1px solid ${T.border}`, marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Tag label={plan.tag} />
              <span style={{ fontSize: 11, color: T.textMuted }}>{fmtDate(date)}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>{activeDay}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            {timerActive && (
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>
                ⏱ {elMins}:{elSecs.toString().padStart(2, "0")}
              </div>
            )}
            <div style={{ fontSize: 28, fontWeight: 900, color: pct === 1 ? T.accent : T.text, letterSpacing: -1 }}>
              {completedSets}<span style={{ fontSize: 14, color: T.textMuted, fontWeight: 400 }}>/{totalSets}</span>
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 0.5 }}>SERII</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: T.surface, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct * 100}%`,
            background: pct === 1
              ? `linear-gradient(90deg, ${T.accent}, ${T.green})`
              : `linear-gradient(90deg, ${TAG_COLOR[plan.tag]}, ${TAG_COLOR[plan.tag]}cc)`,
            borderRadius: 3, transition: "width 0.5s ease",
          }} />
        </div>

        {pct === 1 && (
          <div style={{ textAlign: "center", marginTop: 10, color: T.accent, fontSize: 13, fontWeight: 700 }}>
            🎉 Trening ukończony!
          </div>
        )}
      </div>

      {/* Manual timer trigger */}
      <button onClick={() => setShowTimer(true)} style={{
        width: "100%", padding: "11px", borderRadius: 12, marginBottom: 16,
        border: `1px solid ${T.border}`, background: T.surface,
        color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        ⏱ Timer odpoczynku (ręczny)
      </button>

      {/* Exercise cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            data={dayData[ex.id]}
            prevData={getPrevData(ex.id)}
            onChange={(s, val) => handleChange(ex.id, s, val)}
            onTimerStart={() => setShowTimer(true)}
            onProgressionAlert={ex => {
              // Show after timer closes
              setProgressionEx(ex);
            }}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
function ProgressTab({ db }) {
  const allExercises = Object.values(PLAN).flatMap(d => d.exercises);
  const unique = [...new Map(allExercises.map(e => [e.id, e])).values()];

  const [selId, setSelId] = useState(unique[0]?.id || "");
  const [filterTag, setFilterTag] = useState("ALL");

  const filtered = filterTag === "ALL" ? unique :
    unique.filter(e => {
      const dayKey = Object.keys(PLAN).find(k => PLAN[k].exercises.some(ex => ex.id === e.id));
      return dayKey && PLAN[dayKey].tag === filterTag;
    });

  const selEx = unique.find(e => e.id === selId) || unique[0];

  // Build chart data
  const chartData = [];
  Object.entries(db).sort(([a], [b]) => a.localeCompare(b)).forEach(([date, days]) => {
    Object.values(days).forEach(exercises => {
      if (typeof exercises !== "object" || !exercises[selId]) return;
      const sets = Object.values(exercises[selId]?.sets || {});
      const maxWeight = Math.max(...sets.map(s => parseFloat(s?.weight) || 0));
      const vol = sets.reduce((a, s) => a + (parseFloat(s?.weight) || 0) * (parseFloat(s?.reps) || 0), 0);
      if (maxWeight > 0) chartData.push({ date: fmtDate(date), maxWeight, volume: Math.round(vol) });
    });
  });

  const latest = chartData[chartData.length - 1];
  const prev = chartData[chartData.length - 2];
  const diff = latest && prev ? (latest.maxWeight - prev.maxWeight).toFixed(1) : null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ fontSize: 14, fontWeight: 700, color: p.color }}>
            {p.value} {p.dataKey === "maxWeight" ? "kg" : "vol"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, letterSpacing: -0.5 }}>Postęp</div>

      {/* Tag filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["ALL", "PUSH", "PULL", "LEGS"].map(t => (
          <Pill key={t} active={filterTag === t} color={t === "ALL" ? T.accent : TAG_COLOR[t]}
            onClick={() => { setFilterTag(t); setSelId(filtered[0]?.id || selId); }}>
            {t}
          </Pill>
        ))}
      </div>

      {/* Exercise selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 20 }}>
        {filtered.map((ex, i) => (
          <button key={ex.id} onClick={() => setSelId(ex.id)} style={{
            padding: "12px 16px", background: selId === ex.id ? T.accent + "14" : "none",
            border: "none", borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 10,
            color: selId === ex.id ? T.accent : T.text,
          }}>
            <span style={{ fontSize: 18 }}>{ex.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: selId === ex.id ? 700 : 500 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{ex.muscle}</div>
            </div>
            {selId === ex.id && <span style={{ marginLeft: "auto", color: T.accent, fontSize: 14 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      {chartData.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>MAKS CIĘŻAR</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.accent, letterSpacing: -1 }}>
                {latest?.maxWeight}<span style={{ fontSize: 14, fontWeight: 400, color: T.textMuted }}> kg</span>
              </div>
              {diff !== null && (
                <div style={{ fontSize: 12, color: parseFloat(diff) >= 0 ? T.green : T.red, marginTop: 4, fontWeight: 600 }}>
                  {parseFloat(diff) >= 0 ? "↑" : "↓"} {Math.abs(diff)} kg od ostatniego
                </div>
              )}
            </div>
            <div style={{ background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>WOLUMEN</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.pull, letterSpacing: -1 }}>
                {latest?.volume}<span style={{ fontSize: 14, fontWeight: 400, color: T.textMuted }}> kg</span>
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{chartData.length} sesji</div>
            </div>
          </div>

          {/* Max weight chart */}
          <div style={{ background: T.card, borderRadius: 16, padding: "16px 12px 8px", marginBottom: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, paddingLeft: 4, marginBottom: 12 }}>PROGRESJA CIĘŻARU</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} width={28} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="maxWeight" stroke={T.accent} strokeWidth={2.5}
                  fill="url(#wGrad)" dot={{ r: 4, fill: T.accent, strokeWidth: 0 }} name="maxWeight" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Volume chart */}
          <div style={{ background: T.card, borderRadius: 16, padding: "16px 12px 8px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, paddingLeft: 4, marginBottom: 12 }}>WOLUMEN (kg × rep)</div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.pull} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={T.pull} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} width={36} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="volume" stroke={T.pull} strokeWidth={2.5}
                  fill="url(#vGrad)" dot={{ r: 4, fill: T.pull, strokeWidth: 0 }} name="volume" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {chartData.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: T.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Brak danych</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Zapisz pierwsze ćwiczenie, żeby zobaczyć postęp.</div>
        </div>
      )}
    </div>
  );
}

// ─── BODY TAB ─────────────────────────────────────────────────────────────────
function BodyTab({ db, setDb }) {
  const date = todayStr();
  const existing = db?.[date]?._body || {};
  const [fields, setFields] = useState({ weight: "", chest: "", waist: "", arm: "", hips: "", ...existing });
  const [saved, setSaved] = useState(false);

  const FIELDS = [
    { key: "weight", label: "Waga ciała", unit: "kg", emoji: "⚖️" },
    { key: "chest", label: "Klatka piersiowa", unit: "cm", emoji: "📏" },
    { key: "arm", label: "Biceps (napiętym)", unit: "cm", emoji: "💪" },
    { key: "waist", label: "Talia", unit: "cm", emoji: "↔️" },
    { key: "hips", label: "Biodra", unit: "cm", emoji: "📐" },
  ];

  const history = Object.entries(db)
    .filter(([, v]) => v?._body?.weight)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, v]) => ({ ...v._body, label: fmtDate(d) }));

  function handleSave() {
    if (!Object.values(fields).some(Boolean)) return;
    setDb(prev => {
      const next = structuredClone(prev);
      if (!next[date]) next[date] = {};
      next[date]._body = { ...fields, date };
      saveDb(next);
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Pomiary ciała</div>
        <span style={{ fontSize: 11, color: T.textMuted }}>{fmtDate(date)}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {FIELDS.map(f => (
          <div key={f.key} style={{
            background: T.card, borderRadius: 14, padding: "12px 16px",
            border: `1px solid ${T.border}`,
            display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 24, textAlign: "center" }}>{f.emoji}</div>
            <div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{f.label}</div>
              <NumberInput
                value={fields[f.key]}
                onChange={v => setFields(p => ({ ...p, [f.key]: v }))}
                placeholder="—"
              />
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, minWidth: 24 }}>{f.unit}</div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} style={{
        width: "100%", padding: 15, borderRadius: 14, border: "none",
        background: saved ? T.green : T.accent,
        color: "#000", fontSize: 15, fontWeight: 800,
        cursor: "pointer", fontFamily: "inherit", transition: "background 0.3s",
        letterSpacing: 0.3,
      }}>
        {saved ? "✓ Zapisano!" : "Zapisz pomiary"}
      </button>

      {/* Weight chart */}
      {history.length > 1 && (
        <div style={{ background: T.card, borderRadius: 16, padding: "16px 12px 8px", marginTop: 24, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, paddingLeft: 4, marginBottom: 12 }}>WAGA CIAŁA (kg)</div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={history.map(h => ({ date: h.label, value: parseFloat(h.weight) }))}>
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.push} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.push} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} width={28} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12, fontFamily: "inherit" }} />
              <Area type="monotone" dataKey="value" stroke={T.push} strokeWidth={2.5}
                fill="url(#bGrad)" dot={{ r: 4, fill: T.push, strokeWidth: 0 }} name="kg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History rows */}
      {history.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, marginBottom: 10 }}>HISTORIA POMIARÓW</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...history].reverse().slice(0, 10).map((h, i) => (
              <div key={i} style={{
                background: T.card, borderRadius: 12, padding: "12px 16px",
                border: `1px solid ${T.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, color: T.textMuted }}>{h.label}</span>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {h.weight && <span style={{ fontWeight: 800, color: T.text }}>{h.weight} <span style={{ color: T.textMuted, fontSize: 11, fontWeight: 400 }}>kg</span></span>}
                  {h.arm && <span style={{ fontSize: 12, color: T.textMuted }}>💪 {h.arm}cm</span>}
                  {h.chest && <span style={{ fontSize: 12, color: T.textMuted }}>📏 {h.chest}cm</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab({ db }) {
  const entries = Object.entries(db)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 60);

  if (entries.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", color: T.textMuted }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Brak historii</div>
        <div style={{ fontSize: 13 }}>Zacznij trening, żeby zobaczyć historię.</div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, letterSpacing: -0.5 }}>Historia</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map(([date, days]) => {
          const workouts = Object.entries(days).filter(([k]) => k !== "_body");
          const body = days._body;
          return (
            <div key={date}>
              {workouts.map(([dayKey, exercises]) => {
                const plan = PLAN[dayKey];
                if (!plan) return null;
                const totalSets = Object.values(exercises).reduce((a, ex) =>
                  a + Object.values(ex?.sets || {}).filter(s => s?.done).length, 0);
                const maxWeights = Object.entries(exercises).map(([exId, exData]) => {
                  const ex = plan.exercises.find(e => e.id === exId);
                  const max = Math.max(...Object.values(exData?.sets || {}).map(s => parseFloat(s?.weight) || 0));
                  return ex && max > 0 ? `${ex.name.split(" ")[0]} ${max}kg` : null;
                }).filter(Boolean).slice(0, 3);

                return (
                  <div key={dayKey} style={{
                    background: T.card, borderRadius: 16, padding: "16px",
                    border: `1px solid ${T.border}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                          <Tag label={plan.tag} small />
                          <span style={{ fontSize: 12, color: T.textMuted }}>{fmtDateLong(date)}</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{dayKey}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 24, fontWeight: 900, color: T.accent, letterSpacing: -1 }}>{totalSets}</div>
                        <div style={{ fontSize: 10, color: T.textMuted }}>serii</div>
                      </div>
                    </div>
                    {maxWeights.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {maxWeights.map((w, i) => (
                          <span key={i} style={{
                            background: T.surface, borderRadius: 8, padding: "4px 10px",
                            fontSize: 11, color: T.textMuted, border: `1px solid ${T.border}`,
                          }}>{w}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {body?.weight && workouts.length === 0 && (
                <div style={{
                  background: T.card, borderRadius: 14, padding: "12px 16px",
                  border: `1px solid ${T.border}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{fmtDate(date)}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>⚖️ Pomiar ciała</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{body.weight} kg</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PLAN TAB ─────────────────────────────────────────────────────────────────
function PlanTab() {
  const [openDay, setOpenDay] = useState(null);

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>Twój plan</div>
        <div style={{ fontSize: 13, color: T.textMuted }}>PPL × 2 · 6 dni · 78kg / 187cm / 17 lat</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(PLAN).map(([dayKey, plan]) => (
          <div key={dayKey} style={{
            background: T.card, borderRadius: 16,
            border: `1px solid ${openDay === dayKey ? TAG_COLOR[plan.tag] + "44" : T.border}`,
            overflow: "hidden", transition: "border-color 0.2s",
          }}>
            <button onClick={() => setOpenDay(openDay === dayKey ? null : dayKey)} style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              fontFamily: "inherit",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: TAG_COLOR[plan.tag] + "22",
                border: `1px solid ${TAG_COLOR[plan.tag]}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: TAG_COLOR[plan.tag], letterSpacing: 1,
              }}>{plan.tag}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 3 }}>{dayKey}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{plan.exercises.length} ćwiczeń · Dzień {plan.day}</div>
              </div>
              <span style={{ color: T.textMuted, transition: "0.2s", transform: openDay === dayKey ? "rotate(180deg)" : "none" }}>▾</span>
            </button>

            {openDay === dayKey && (
              <div style={{ padding: "0 18px 16px", animation: "fadeUp 0.2s ease" }}>
                <div style={{ width: "100%", height: 1, background: T.border, marginBottom: 12 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.exercises.map(ex => (
                    <div key={ex.id} style={{
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{ex.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>{ex.muscle}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{ex.sets} × {ex.reps}</div>
                        {ex.weight > 0 && <div style={{ fontSize: 11, color: T.textMuted }}>{ex.weight} kg start</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: 14, padding: "10px 14px", background: T.surface, borderRadius: 10,
                  border: `1px solid ${T.border}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>ZASADA PROGRESJI</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                    Osiągnij górną granicę powtórzeń →{" "}
                    <span style={{ color: T.accent, fontWeight: 700 }}>
                      {plan.tag === "LEGS" || plan.exercises.some(e => e.sets >= 4 && e.reps === "6–8") ? "+2,5–5 kg" : "+1–2,5 kg"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: T.card, borderRadius: 16, padding: "16px 18px", border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📅 Harmonogram tygodnia</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((d, i) => {
            const plan = Object.values(PLAN)[i];
            return (
              <div key={d} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}>{d}</div>
                <div style={{
                  height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: plan ? TAG_COLOR[plan.tag] + "22" : T.surface,
                  border: `1px solid ${plan ? TAG_COLOR[plan.tag] + "44" : T.border}`,
                  fontSize: plan ? 10 : 8, fontWeight: 800,
                  color: plan ? TAG_COLOR[plan.tag] : T.textDim,
                  letterSpacing: 0.5,
                }}>
                  {plan ? plan.tag : "OFF"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { key: "workout", icon: "🏋️", label: "Trening" },
    { key: "progress", icon: "📈", label: "Postęp" },
    { key: "body", icon: "⚖️", label: "Ciało" },
    { key: "plan", icon: "📋", label: "Plan" },
    { key: "history", icon: "📖", label: "Historia" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: T.surface + "ee", backdropFilter: "blur(20px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "8px 0 16px",
      zIndex: 50,
      maxWidth: 480, margin: "0 auto",
    }}>
      {items.map(item => (
        <button key={item.key} onClick={() => setTab(item.key)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          background: "none", border: "none", cursor: "pointer", padding: "6px 12px",
          fontFamily: "inherit", position: "relative",
        }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: tab === item.key ? 800 : 500,
            color: tab === item.key ? T.accent : T.textMuted,
            transition: "color 0.15s",
          }}>{item.label}</span>
          {tab === item.key && (
            <span style={{
              position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)",
              width: 20, height: 3, borderRadius: 2, background: T.accent,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("workout");
  const [db, setDb] = useState(loadDb);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>
      <GlobalStyle />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: T.accent, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16,
              }}>⚡</div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.8, color: T.text }}>
                Gym<span style={{ color: T.accent }}>Log</span>
              </span>
            </div>
            <div style={{
              background: T.surface, borderRadius: 20, padding: "5px 12px",
              fontSize: 12, color: T.textMuted, border: `1px solid ${T.border}`,
              fontWeight: 600,
            }}>
              {new Date().toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "20px 16px", paddingBottom: 90, overflowY: "auto" }}>
          {tab === "workout" && <WorkoutTab db={db} setDb={setDb} />}
          {tab === "progress" && <ProgressTab db={db} />}
          {tab === "body" && <BodyTab db={db} setDb={setDb} />}
          {tab === "plan" && <PlanTab />}
          {tab === "history" && <HistoryTab db={db} />}
        </div>

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
