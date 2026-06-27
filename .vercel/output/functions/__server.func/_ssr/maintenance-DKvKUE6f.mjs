import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader, a as Panel, d as db } from "./firebase-PBfp6SSn.mjs";
import { c as cn } from "./router-BYb12Exw.mjs";
import { r as ref, o as onValue, u as update, a as remove } from "../_libs/firebase__database.mjs";
import "../_libs/firebase.mjs";
import { c as ClipboardPen, U as UserCog, W as Wrench, d as CircleCheck } from "../_libs/lucide-react.mjs";
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
const STATUSES = ["OPEN", "UNDER INSPECTION", "REPAIR IN PROGRESS", "RESOLVED"];
function MaintenancePage() {
  const [list, setList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const maintenanceRef = ref(db, "maintenanceRecords");
    const unsubscribe = onValue(maintenanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const records = Object.keys(data).map((key) => ({
          firebaseKey: key,
          ...data[key]
        }));
        setList(records);
      } else {
        setList([]);
      }
    });
    return () => unsubscribe();
  }, []);
  const setStatus = async (firebaseKey, status) => {
    await update(ref(db, `damageRecords/${firebaseKey}`), {
      status,
      repairCompletionDate: status === "RESOLVED" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
    });
    if (status === "RESOLVED") {
      await remove(ref(db, `maintenanceRecords/${firebaseKey}`));
    } else {
      await update(ref(db, `maintenanceRecords/${firebaseKey}`), {
        status,
        repairCompletionDate: null
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Workflow", title: "Maintenance & Repair", description: "Track inspection, repair progress and engineer assignments per incident." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: list.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-mono text-primary", children: i.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold truncate", children: i.damageType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: i.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: i.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: ClipboardPen, label: "Detected", value: `${i.date}  ${i.time}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: UserCog, label: "Assigned", value: i.assignedEngineer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: Wrench, label: "Repair status", value: i.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: CircleCheck, label: "Completed", value: i.repairCompletionDate ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md bg-accent/40 border border-border px-3 py-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Engineer notes:" }),
        " ",
        i.engineerNotes
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-1.5", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(i.firebaseKey, s), className: cn("px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border transition-colors", i.status === s ? "bg-primary/15 text-primary border-primary/40" : "bg-accent/30 text-muted-foreground border-border hover:text-foreground hover:bg-accent"), children: s }, s)) })
    ] }, i.id)) })
  ] });
}
function Meta({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md bg-accent/30 px-2.5 py-2 border border-border/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 mt-0.5 text-primary shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium truncate", children: value })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  const map = {
    OPEN: "bg-danger/15 text-danger border-danger/30",
    "UNDER INSPECTION": "bg-warning/15 text-warning border-warning/30",
    "REPAIR IN PROGRESS": "bg-info/15 text-info border-info/30",
    RESOLVED: "bg-success/15 text-success border-success/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 inline-flex px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider", map[status]), children: status });
}
export {
  MaintenancePage as component
};
