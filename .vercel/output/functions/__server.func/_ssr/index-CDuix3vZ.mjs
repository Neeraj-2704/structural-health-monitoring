import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader, a as Panel, d as db } from "./firebase-PBfp6SSn.mjs";
import { c as cn } from "./router-BYb12Exw.mjs";
import { r as ref, o as onValue, b as get, p as push, s as set, u as update } from "../_libs/firebase__database.mjs";
import "../_libs/firebase.mjs";
import { i as ThermometerSun, D as Droplets, j as Move3d, R as RotateCw, k as Waves, O as OctagonAlert, X, E as Eye, h as ShieldCheck } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { R as ResponsiveContainer, A as AreaChart, d as Area, e as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, f as Line } from "../_libs/recharts.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/idb.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/faye-websocket.mjs";
import "net";
import "tls";
import "../_libs/websocket-driver.mjs";
import "events";
import "url";
import "../_libs/safe-buffer.mjs";
import "buffer";
import "../_libs/http-parser-js.mjs";
import "../_libs/websocket-extensions.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const statusColors = {
  SAFE: {
    text: "text-success",
    dot: "bg-success",
    stroke: "var(--color-success)",
    border: "border-success/30"
  },
  WARNING: {
    text: "text-warning",
    dot: "bg-warning",
    stroke: "var(--color-warning)",
    border: "border-warning/30"
  },
  DANGER: {
    text: "text-danger",
    dot: "bg-danger",
    stroke: "var(--color-danger)",
    border: "border-danger/30"
  }
};
function SensorCard({ icon: Icon, label, value, unit, status, trend }) {
  const c = statusColors[status];
  const data = trend.map((v, i) => ({ i, v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -2 },
      transition: { duration: 0.25 },
      className: cn(
        "relative overflow-hidden rounded-xl border bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-elegant)]",
        c.border
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-9 w-9 grid place-items-center rounded-lg bg-accent shrink-0"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4.5 w-4.5", c.text) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground font-medium", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/70 font-mono truncate", children: "Live" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase",
                c.text
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "h-1.5 w-1.5 rounded-full",
                      c.dot,
                      status === "DANGER" && "pulse-dot-danger"
                    )
                  }
                ),
                status
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold font-mono tracking-tight tabular-nums", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-mono", children: unit })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-12 -mx-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `g-${label}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: c.stroke, stopOpacity: 0.4 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: c.stroke, stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Area,
            {
              type: "monotone",
              dataKey: "v",
              stroke: c.stroke,
              strokeWidth: 1.6,
              fill: `url(#g-${label})`
            }
          )
        ] }) }) })
      ]
    }
  );
}
function AlertBanner({ active }) {
  if (!active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-danger/40 flash-danger text-white px-5 py-4 flex items-center gap-3 shadow-[var(--shadow-danger)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-6 w-6 shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-base font-bold tracking-wide uppercase", children: "🚨 Structural Damage Detected 🚨" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/85", children: "Critical reading exceeded safe operating threshold. Emergency protocol active." })
    ] })
  ] });
}
function AlertModal({ alert, open, onAcknowledge, onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && alert && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[60] grid place-items-center p-4",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: onClose }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.92, y: 16, opacity: 0 },
            animate: { scale: 1, y: 0, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            transition: { type: "spring", damping: 22, stiffness: 240 },
            className: "relative w-full max-w-lg rounded-2xl border border-danger/40 bg-card p-6 shadow-[var(--shadow-danger)]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "absolute top-3 right-3 p-1.5 rounded-md hover:bg-accent text-muted-foreground",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-danger/15 grid place-items-center border border-danger/30 pulse-dot-danger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-6 w-6 text-danger" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-danger", children: "Emergency Alert" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: alert.title })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-5 grid grid-cols-2 gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Alert Time", value: alert.time }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Severity", value: alert.severity, accent: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sensor Responsible", value: alert.sensor }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Reading", value: alert.reading, mono: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: onClose,
                    className: "px-4 py-2 rounded-md text-sm border border-border hover:bg-accent inline-flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
                      " View Details"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: onAcknowledge,
                    className: "px-4 py-2 rounded-md text-sm font-semibold bg-gradient-to-r from-primary to-info text-primary-foreground inline-flex items-center justify-center gap-2 shadow-[var(--shadow-glow)]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
                      " Acknowledge Alert"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
function Field({
  label,
  value,
  mono,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-accent/40 border border-border px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "dd",
      {
        className: `mt-0.5 text-sm font-semibold ${mono ? "font-mono" : ""} ${accent ? "text-danger" : ""}`,
        children: value
      }
    )
  ] });
}
const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
function generateLiveReadings(points = 24) {
  const now = Date.now();
  return Array.from({ length: points }).map((_, i) => {
    const t = new Date(now - (points - 1 - i) * 6e4);
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temperature: rand(24, 31),
      humidity: rand(45, 65),
      tiltX: rand(-0.6, 0.6),
      tiltY: rand(-0.5, 0.5),
      tiltZ: rand(-0.3, 0.3),
      vibration: rand(0.05, 0.45)
    };
  });
}
const initialAlerts = [
  {
    id: "ALT-7781",
    title: "Excessive Tilt Detected",
    time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    sensor: "MPU6050 — Floor 7",
    reading: "Tilt X = 2.41°  (threshold 1.5°)",
    severity: "DANGER",
    acknowledged: false
  }
];
function DashboardPage() {
  const [data, setData] = reactExports.useState(generateLiveReadings(1));
  const [alerts, setAlerts] = reactExports.useState([]);
  const [alertStatus, setAlertStatus] = reactExports.useState("SAFE");
  const [previousStatus, setPreviousStatus] = reactExports.useState("SAFE");
  const [currentSeverity, setCurrentSeverity] = reactExports.useState("SAFE");
  const previousSystemStatus = reactExports.useRef("SAFE");
  const [maintenanceCreated, setMaintenanceCreated] = reactExports.useState(false);
  const [modalAlert, setModalAlert] = reactExports.useState(initialAlerts[0] ?? null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  reactExports.useRef(false);
  const [activeAlerts, setActiveAlerts] = reactExports.useState(0);
  const activeIncidentKey = reactExports.useRef(null);
  const creatingIncident = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const sensorRef = ref(db, "sensorData");
    const unsubscribe = onValue(sensorRef, async (snapshot) => {
      const sensor = snapshot.val();
      if (!sensor) {
        return;
      }
      setAlertStatus(sensor.alertStatus || "SAFE");
      const currentStatus = sensor.temperature > 45 || sensor.humidity > 85 || Math.abs(sensor.tiltX) > 0.4 || Math.abs(sensor.tiltY) > 0.4 || sensor.vibration > 2 ? "DANGER" : sensor.temperature > 35 || sensor.humidity > 70 || Math.abs(sensor.tiltX) > 0.2 || Math.abs(sensor.tiltY) > 0.2 || sensor.vibration > 1 ? "WARNING" : "SAFE";
      const damageType = Math.abs(sensor.tiltX) > 0.2 || Math.abs(sensor.tiltY) > 0.2 ? "High Tilt" : sensor.temperature > 35 ? "High Temperature" : sensor.humidity > 70 ? "High Humidity" : sensor.vibration > 1 ? "High Vibration" : "Structural Anomaly";
      const sensorName = sensor.temperature > 35 || sensor.humidity > 70 ? "DHT22" : "MPU6050";
      if (previousSystemStatus.current === "SAFE" && (currentStatus === "WARNING" || currentStatus === "DANGER") && !creatingIncident.current) {
        creatingIncident.current = true;
        const damageRoot = ref(db, "damageRecords");
        const snapshot2 = await get(damageRoot);
        const nextNumber = snapshot2.exists() ? Object.keys(snapshot2.val()).length + 1 : 1;
        const displayId = `DR${String(nextNumber).padStart(3, "0")}`;
        const damageRef = push(damageRoot);
        const record = {
          id: displayId,
          date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          damageType,
          sensor: sensorName,
          severity: currentStatus,
          status: "OPEN"
        };
        await set(damageRef, record);
        const maintenanceRef = ref(db, `maintenanceRecords/${damageRef.key}`);
        await set(maintenanceRef, record);
        activeIncidentKey.current = damageRef.key;
        previousSystemStatus.current = currentStatus;
        creatingIncident.current = false;
      }
      if (activeIncidentKey.current && previousSystemStatus.current !== "SAFE" && currentStatus !== "SAFE") {
        await update(ref(db, `damageRecords/${activeIncidentKey.current}`), {
          severity: currentStatus,
          damageType,
          sensor: sensorName
        });
        await update(ref(db, `maintenanceRecords/${activeIncidentKey.current}`), {
          severity: currentStatus,
          damageType,
          sensor: sensorName
        });
      }
      if (currentStatus === "SAFE") {
        activeIncidentKey.current = null;
        creatingIncident.current = false;
      }
      previousSystemStatus.current = currentStatus;
      if (previousSystemStatus.current === "WARNING" && currentStatus === "DANGER" && activeIncidentKey.current) {
        await update(ref(db, `damageRecords/${activeIncidentKey.current}`), {
          severity: "DANGER"
        });
        await update(ref(db, `maintenanceRecords/${activeIncidentKey.current}`), {
          severity: "DANGER"
        });
      }
      setData((prev) => {
        const newPoint = {
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          temperature: sensor.temperature,
          humidity: sensor.humidity,
          tiltX: sensor.tiltX,
          tiltY: sensor.tiltY,
          tiltZ: 0,
          vibration: sensor.vibration
        };
        return [...prev.slice(-19), newPoint];
      });
    });
    return () => unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    const maintenanceRef = ref(db, "maintenanceRecords");
    const unsubscribe = onValue(maintenanceRef, (snapshot) => {
      if (!snapshot.exists()) {
        setActiveAlerts(0);
        return;
      }
      const data2 = snapshot.val();
      const count = Object.values(data2).filter((record) => record.status !== "RESOLVED").length;
      setActiveAlerts(count);
    });
    return () => unsubscribe();
  }, []);
  const latest = reactExports.useMemo(() => data[data.length - 1] ?? {
    time: "Now",
    temperature: 0,
    humidity: 0,
    tiltX: 0,
    tiltY: 0,
    tiltZ: 0,
    vibration: 0
  }, [data]);
  const systemStatus = latest.temperature > 45 || latest.humidity > 85 || Math.abs(latest.tiltX) > 0.4 || Math.abs(latest.tiltY) > 0.4 || latest.vibration > 2 ? "DANGER" : latest.temperature > 35 || latest.humidity > 70 || Math.abs(latest.tiltX) > 0.2 || Math.abs(latest.tiltY) > 0.2 || latest.vibration > 1 ? "WARNING" : "SAFE";
  reactExports.useEffect(() => {
    if (previousSystemStatus.current === systemStatus) {
      return;
    }
    previousSystemStatus.current = systemStatus;
  }, [systemStatus]);
  const sensorList = reactExports.useMemo(() => [{
    icon: ThermometerSun,
    label: "Temperature",
    value: latest.temperature.toFixed(1),
    unit: "°C",
    status: latest.temperature > 45 ? "DANGER" : latest.temperature > 35 ? "WARNING" : "SAFE",
    trend: data.map((d) => d.temperature)
  }, {
    icon: Droplets,
    label: "Humidity",
    value: latest.humidity.toFixed(0),
    unit: "%",
    status: latest.humidity > 85 ? "DANGER" : latest.humidity > 70 ? "WARNING" : "SAFE",
    trend: data.map((d) => d.humidity)
  }, {
    icon: Move3d,
    label: "Tilt X",
    value: latest.tiltX.toFixed(2),
    unit: "°",
    status: Math.abs(latest.tiltX) > 0.4 ? "DANGER" : Math.abs(latest.tiltX) > 0.2 ? "WARNING" : "SAFE",
    trend: data.map((d) => d.tiltX)
  }, {
    icon: RotateCw,
    label: "Tilt Y",
    value: latest.tiltY.toFixed(2),
    unit: "°",
    status: Math.abs(latest.tiltY) > 0.4 ? "DANGER" : Math.abs(latest.tiltY) > 0.2 ? "WARNING" : "SAFE",
    trend: data.map((d) => d.tiltY)
  }, {
    icon: Waves,
    label: "Vibration",
    value: latest.vibration.toFixed(2),
    unit: "g",
    status: latest.vibration > 2 ? "DANGER" : latest.vibration > 1 ? "WARNING" : "SAFE",
    trend: data.map((d) => d.vibration)
  }], [data, latest]);
  const acknowledge = () => {
    setAlerts((a) => a.map((x) => ({
      ...x,
      acknowledged: true
    })));
    setModalOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Live Telemetry", title: "Operational Overview", description: "Aggregate readings from MPU6050, DHT22 and vibration sensors across the structure." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBanner, { active: alertStatus === "DANGER" }),
    alertStatus === "WARNING" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-yellow-500 bg-yellow-500/10 p-4 text-yellow-500 font-semibold", children: "⚠️ WARNING: Sensor values have crossed warning thresholds." }),
    alertStatus === "DANGER" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-500 font-semibold animate-pulse", children: "🚨 DANGER: Structural damage suspected. Immediate inspection required." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusHero, { status: systemStatus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Active Alerts", value: activeAlerts.toString(), hint: "Active maintenance cases", tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Sensors Online", value: "1 / 1", hint: "ESP32 Connected", tone: "info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: sensorList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SensorCard, { ...s }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPanel, { title: "Temperature vs Time", data, dataKey: "temperature", unit: "°C", color: "var(--color-warning)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPanel, { title: "Humidity vs Time", data, dataKey: "humidity", unit: "%", color: "var(--color-info)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPanel, { title: "Tilt vs Time", data, multi: true, color: "var(--color-primary)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPanel, { title: "Vibration vs Time", data, dataKey: "vibration", unit: "g", color: "var(--color-danger)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertModal, { alert: modalAlert, open: modalOpen && !!modalAlert, onAcknowledge: acknowledge, onClose: () => setModalOpen(false) })
  ] });
}
function StatusHero({
  status
}) {
  const map = {
    SAFE: {
      label: "All Systems Safe",
      color: "text-success",
      bg: "from-success/20",
      dot: "bg-success",
      ring: "pulse-dot-safe",
      desc: "Structure operating within nominal envelope."
    },
    WARNING: {
      label: "Warning Threshold",
      color: "text-warning",
      bg: "from-warning/20",
      dot: "bg-warning",
      ring: "",
      desc: "Elevated readings detected. Monitoring closely."
    },
    DANGER: {
      label: "Critical — Danger",
      color: "text-danger",
      bg: "from-danger/25",
      dot: "bg-danger",
      ring: "pulse-dot-danger",
      desc: "Structural damage suspected. Emergency protocol active."
    }
  };
  const s = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0,
    scale: 0.98
  }, animate: {
    opacity: 1,
    scale: 1
  }, className: `relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${s.bg} to-card p-5 shadow-[var(--shadow-elegant)]`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative h-14 w-14 rounded-full ${s.dot}/15 grid place-items-center border border-current/30 ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-3 w-3 rounded-full ${s.dot} ${s.ring}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono", children: "System Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold ${s.color}`, children: s.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: s.desc })
    ] })
  ] }) });
}
function KpiCard({
  label,
  value,
  hint,
  tone
}) {
  const color = tone === "danger" ? "text-danger" : "text-info";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-3xl font-bold font-mono ${color}`, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: hint })
  ] });
}
function ChartPanel({
  title,
  data,
  dataKey,
  unit,
  color,
  multi
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title, subtitle: unit ? `Unit: ${unit}` : "Tilt X / Y / Z (°)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: multi ? /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data, margin: {
    left: -10,
    right: 8,
    top: 8,
    bottom: 0
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", vertical: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "time", tick: {
      fill: "var(--color-muted-foreground)",
      fontSize: 10
    }, tickLine: false, axisLine: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
      fill: "var(--color-muted-foreground)",
      fontSize: 10
    }, tickLine: false, axisLine: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "tiltX", stroke: "var(--color-primary)", dot: false, strokeWidth: 1.8 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "tiltY", stroke: "var(--color-success)", dot: false, strokeWidth: 1.8 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "tiltZ", stroke: "var(--color-warning)", dot: false, strokeWidth: 1.8 })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data, margin: {
    left: -10,
    right: 8,
    top: 8,
    bottom: 0
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `fill-${title}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: 0.4 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", vertical: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "time", tick: {
      fill: "var(--color-muted-foreground)",
      fontSize: 10
    }, tickLine: false, axisLine: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
      fill: "var(--color-muted-foreground)",
      fontSize: 10
    }, tickLine: false, axisLine: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey, stroke: color, strokeWidth: 2, fill: `url(#fill-${title})` })
  ] }) }) }) });
}
const tipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-foreground)"
};
export {
  DashboardPage as component
};
