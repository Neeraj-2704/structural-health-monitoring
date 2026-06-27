import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-BYb12Exw.mjs";
import "../_libs/firebase.mjs";
import { g as getDatabase } from "../_libs/firebase__database.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { i as initializeApp } from "../_libs/firebase__app.mjs";
function PageHeader({
  eyebrow,
  title,
  description,
  action
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-mono uppercase tracking-[0.2em] text-primary/80", children: eyebrow }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-2xl sm:text-3xl font-bold tracking-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: title }) }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground max-w-2xl", children: description })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: action })
      ]
    }
  );
}
function Panel({
  title,
  subtitle,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-xl border border-border bg-[var(--gradient-card)] p-4 sm:p-5 shadow-[var(--shadow-elegant)]",
        className
      ),
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold tracking-wide", children: title }),
          subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
        ] }) }),
        children
      ]
    }
  );
}
const firebaseConfig = {
  apiKey: "AIzaSyAbd-G3EVnvOr8AKCr9JnReI7t4-RJh6nM",
  authDomain: "building-health-monitoring.firebaseapp.com",
  databaseURL: "https://building-health-monitoring-default-rtdb.firebaseio.com",
  projectId: "building-health-monitoring",
  storageBucket: "building-health-monitoring.firebasestorage.app",
  messagingSenderId: "951910488145",
  appId: "1:951910488145:web:68e758c86771e667188070"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export {
  PageHeader as P,
  Panel as a,
  db as d
};
