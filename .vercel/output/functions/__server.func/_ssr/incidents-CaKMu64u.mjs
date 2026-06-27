import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader, a as Panel, d as db } from "./firebase-PBfp6SSn.mjs";
import { S as StatusPill, c as cn } from "./router-BYb12Exw.mjs";
import { r as ref, o as onValue } from "../_libs/firebase__database.mjs";
import "../_libs/firebase.mjs";
import { S as Search, F as Funnel, e as ArrowUpDown } from "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
const STATUSES = ["ALL", "OPEN", "UNDER INSPECTION", "REPAIR IN PROGRESS", "RESOLVED"];
function IncidentsPage() {
  const [query, setQuery] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("ALL");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [incidentsData, setIncidentsData] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const incidentsRef = ref(db, "damageRecords");
    const unsubscribe = onValue(incidentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const records = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setIncidentsData(records);
      } else {
        setIncidentsData([]);
      }
    });
    return () => unsubscribe();
  }, []);
  const rows = reactExports.useMemo(() => {
    let r = [...incidentsData];
    if (status !== "ALL") r = r.filter((i) => i.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((i) => i.id.toLowerCase().includes(q) || i.damageType.toLowerCase().includes(q) || i.sensor.toLowerCase().includes(q));
    }
    r.sort((a, b) => sortDir === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return r;
  }, [incidentsData, query, status, sortDir]);
  const statusClass = {
    OPEN: "bg-danger/15 text-danger border-danger/30",
    "UNDER INSPECTION": "bg-warning/15 text-warning border-warning/30",
    "REPAIR IN PROGRESS": "bg-info/15 text-info border-info/30",
    RESOLVED: "bg-success/15 text-success border-success/30"
  };
  const sortedRows = [...rows].sort((a, b) => {
    const dateA = (/* @__PURE__ */ new Date(`${a.date} ${a.time}`)).getTime();
    const dateB = (/* @__PURE__ */ new Date(`${b.date} ${b.time}`)).getTime();
    return dateB - dateA;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "History", title: "Damage Incident Records", description: "Searchable archive of all detected structural events." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by ID, damage type, sensor…", className: "w-full bg-accent/40 border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "bg-accent/40 border border-border rounded-md px-3 py-2 text-sm", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSortDir((d) => d === "desc" ? "asc" : "desc"), className: "inline-flex items-center gap-2 bg-accent/40 border border-border rounded-md px-3 py-2 text-sm hover:bg-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" }),
          " Date ",
          sortDir === "desc" ? "↓" : "↑"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-4 sm:mx-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[760px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Incident ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Damage Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Sensor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          sortedRows.map((i, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 hover:bg-accent/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-mono text-primary", children: `DR${String(index + 1).padStart(3, "0")}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-mono text-muted-foreground", children: i.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-mono text-muted-foreground", children: i.time }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-medium", children: i.damageType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-muted-foreground", children: i.sensor }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: i.severity }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider", statusClass[i.status]), children: i.status }) })
          ] }, `DR${String(index + 1).padStart(3, "0")}`)),
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "text-center py-10 text-muted-foreground text-sm", children: "No damage incidents recorded." }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  IncidentsPage as component
};
