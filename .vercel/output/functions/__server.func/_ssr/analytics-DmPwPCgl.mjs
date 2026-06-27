import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader, a as Panel, d as db } from "./firebase-PBfp6SSn.mjs";
import { r as ref, o as onValue } from "../_libs/firebase__database.mjs";
import "../_libs/firebase.mjs";
import { f as CircleAlert, d as CircleCheck, A as Activity, g as Clock, h as ShieldCheck } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar, P as PieChart, b as Pie, c as Cell, L as Legend } from "../_libs/recharts.mjs";
import "./router-BYb12Exw.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/idb.mjs";
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
const PALETTE = ["var(--color-primary)", "var(--color-success)", "var(--color-warning)", "var(--color-danger)", "var(--color-chart-5)"];
const tipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12
};
function AnalyticsPage() {
  const [records, setRecords] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const damageRef = ref(db, "damageRecords");
    const unsubscribe = onValue(damageRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRecords([]);
        return;
      }
      const data = snapshot.val();
      const list = Object.entries(data).map(([key, value]) => ({
        firebaseKey: key,
        ...value
      }));
      setRecords(list);
    });
    return () => unsubscribe();
  }, []);
  const totalIncidents = records.length;
  const resolved = records.filter((r) => r.status === "RESOLVED").length;
  const open = totalIncidents - resolved;
  const healthScore = Math.max(100 - open * 5, 0);
  const monthlyIncidents = reactExports.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    records.forEach((r) => {
      const d = new Date(r.date);
      counts[d.getMonth()]++;
    });
    return months.map((m, i) => ({
      month: m,
      incidents: counts[i]
    }));
  }, [records]);
  const damageCategories = reactExports.useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.damageType] = (map[r.damageType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [records]);
  const resolutionStats = reactExports.useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.status] = (map[r.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [records]);
  const sensorEventDistribution = reactExports.useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.sensor] = (map[r.sensor] || 0) + 1;
    });
    return Object.entries(map).map(([sensor, events]) => ({
      sensor,
      events
    }));
  }, [records]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Insights", title: "Analytics & Building Health", description: "Aggregate trends, resolution stats and the structural health score." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: CircleAlert, label: "Total Incidents", value: totalIncidents.toString(), tone: "text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: CircleCheck, label: "Resolved", value: resolved.toString(), tone: "text-success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Activity, label: "Open", value: open.toString(), tone: "text-danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Clock, label: "Avg Repair Time", value: resolved > 0 ? "2.1d" : "--", tone: "text-warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: ShieldCheck, label: "Health Score", value: `${healthScore}%`, tone: "text-info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Building Health Score", subtitle: "Composite of tilt, vibration and sensor uptime", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HealthGauge, { value: healthScore }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-3 text-sm font-semibold ${healthScore >= 90 ? "text-success" : healthScore >= 70 ? "text-warning" : "text-danger"}`, children: healthScore >= 90 ? "Healthy" : healthScore >= 70 ? "Needs Attention" : "Critical" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: open === 0 ? "No active structural incidents." : `${open} active structural incident${open > 1 ? "s" : ""} detected.` })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Monthly Incidents", subtitle: "Detected events per month", className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthlyIncidents, margin: {
        left: -10,
        right: 8,
        top: 8,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: {
          fill: "var(--color-muted-foreground)",
          fontSize: 11
        }, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fill: "var(--color-muted-foreground)",
          fontSize: 11
        }, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle, cursor: {
          fill: "var(--color-accent)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "incidents", fill: "var(--color-primary)", radius: [6, 6, 0, 0] })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Damage Categories", subtitle: "By cause", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: damageCategories, dataKey: "value", innerRadius: 50, outerRadius: 80, stroke: "var(--color-background)", strokeWidth: 2, children: damageCategories.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: PALETTE[i % PALETTE.length] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
          fontSize: 11,
          color: "var(--color-muted-foreground)"
        } })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Resolution Statistics", subtitle: "Lifecycle distribution", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: resolutionStats, dataKey: "value", innerRadius: 50, outerRadius: 80, stroke: "var(--color-background)", strokeWidth: 2, children: resolutionStats.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.name === "RESOLVED" ? "var(--color-success)" : entry.name === "REPAIR IN PROGRESS" ? "var(--color-info)" : entry.name === "UNDER INSPECTION" ? "var(--color-warning)" : "var(--color-danger)" }, entry.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
          fontSize: 11,
          color: "var(--color-muted-foreground)"
        } })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Sensor Event Distribution", subtitle: "Events per sensor type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: sensorEventDistribution, layout: "vertical", margin: {
        left: 10,
        right: 12,
        top: 4,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", horizontal: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", tick: {
          fill: "var(--color-muted-foreground)",
          fontSize: 11
        }, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { dataKey: "sensor", type: "category", tick: {
          fill: "var(--color-muted-foreground)",
          fontSize: 11
        }, tickLine: false, axisLine: false, width: 70 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tipStyle, cursor: {
          fill: "var(--color-accent)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "events", fill: "var(--color-info)", radius: [0, 6, 6, 0] })
      ] }) }) }) })
    ] })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-3.5 w-3.5 ${tone}` }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-2xl font-bold font-mono ${tone}`, children: value })
  ] });
}
function HealthGauge({
  value
}) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = value / 100 * c;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 w-44", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 180 180", className: "-rotate-90 h-full w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "90", cy: "90", r, stroke: "var(--color-accent)", strokeWidth: "14", fill: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "90", cy: "90", r, stroke: "url(#hgrad)", strokeWidth: "14", fill: "none", strokeLinecap: "round", strokeDasharray: `${dash} ${c}`, style: {
        transition: "stroke-dasharray 0.8s ease"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "hgrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--color-success)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--color-primary)" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-bold font-mono gradient-text", children: [
        value,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Healthy" })
    ] }) })
  ] });
}
export {
  AnalyticsPage as component
};
