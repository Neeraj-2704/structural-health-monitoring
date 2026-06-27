import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useRouterState, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { L as LayoutDashboard, C as ClipboardList, W as Wrench, a as ChartColumn, X, M as Menu, b as CircleGauge, A as Activity, T as TriangleAlert } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const appCss = "/assets/styles-BJlSLRBI.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incidents", label: "Damage Records", icon: ClipboardList },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/analytics", label: "Analytics", icon: ChartColumn }
];
function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [now, setNow] = reactExports.useState(() => /* @__PURE__ */ new Date());
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => setOpen(false), [pathname]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BrandHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { ...item, active: isActive(pathname, item.to) }, item.to)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SystemPing, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "fixed inset-0 z-50 lg:hidden",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
              onClick: () => setOpen(false)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.aside,
            {
              initial: { x: -280 },
              animate: { x: 0 },
              exit: { x: -280 },
              transition: { type: "spring", damping: 24, stiffness: 220 },
              className: "absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BrandHeader, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setOpen(false),
                      className: "mr-3 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground",
                      "aria-label": "Close menu",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { ...item, active: isActive(pathname, item.to) }, item.to)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SystemPing, {})
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8 h-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "lg:hidden p-2 rounded-md hover:bg-accent text-foreground shrink-0",
              onClick: () => setOpen(true),
              "aria-label": "Open menu",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-sm sm:text-base font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Structural Health Monitoring" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden sm:block text-[11px] text-muted-foreground font-mono", children: "ESP32 • MPU6050 • DHT22" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-success pulse-dot-safe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "System Online" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block text-right font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: now.toLocaleTimeString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: now.toLocaleDateString(void 0, {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric"
            }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
function isActive(pathname, to) {
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
}
function NavItem({
  to,
  label,
  icon: Icon,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--color-primary)]" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            className: cn(
              "h-4 w-4 shrink-0",
              active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-dot-safe" })
      ]
    }
  );
}
function BrandHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 h-16 border-b border-sidebar-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg grid place-items-center bg-gradient-to-br from-primary to-info shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleGauge, { className: "h-5 w-5 text-primary-foreground" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold leading-tight gradient-text", children: "SHM Console" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-wider", children: "v1.0 • Prototype" })
    ] })
  ] });
}
function SystemPing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-3 p-3 rounded-lg glass", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3.5 w-3.5 text-success" }),
      "Telemetry healthy"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] font-mono text-muted-foreground/80", children: "Last ping: just now" })
  ] });
}
function StatusPill({ status }) {
  const map = {
    SAFE: "bg-success/15 text-success border-success/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    DANGER: "bg-danger/15 text-danger border-danger/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide",
        map[status]
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
        status
      ]
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold gradient-text", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This sensor route doesn't exist on the dashboard." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        children: "Return to Dashboard"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong. Try again or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SHM Console — IoT Structural Health Monitoring" },
      {
        name: "description",
        content: "Real-time IoT-based structural health monitoring dashboard for buildings — sensor telemetry, damage alerts, and maintenance tracking."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "SHM Console — IoT Structural Health Monitoring" },
      {
        property: "og:description",
        content: "Real-time IoT-based structural health monitoring dashboard for buildings."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$4.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, {}) });
}
const $$splitComponentImporter$3 = () => import("./maintenance-DKvKUE6f.mjs");
const Route$3 = createFileRoute("/maintenance")({
  head: () => ({
    meta: [{
      title: "Maintenance & Repair — SHM Console"
    }, {
      name: "description",
      content: "Manage repair workflow, assigned engineers and incident notes."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./incidents-CaKMu64u.mjs");
const Route$2 = createFileRoute("/incidents")({
  head: () => ({
    meta: [{
      title: "Damage Incident Records — SHM Console"
    }, {
      name: "description",
      content: "Historical record of structural incidents with search, filter and sort."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./analytics-DmPwPCgl.mjs");
const Route$1 = createFileRoute("/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics — SHM Console"
    }, {
      name: "description",
      content: "Statistics, building health score and historical analytics for the structure."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CDuix3vZ.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Live Dashboard — SHM Console"
    }, {
      name: "description",
      content: "Real-time structural sensor telemetry, system status, and active alerts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const MaintenanceRoute = Route$3.update({
  id: "/maintenance",
  path: "/maintenance",
  getParentRoute: () => Route$4
});
const IncidentsRoute = Route$2.update({
  id: "/incidents",
  path: "/incidents",
  getParentRoute: () => Route$4
});
const AnalyticsRoute = Route$1.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  AnalyticsRoute,
  IncidentsRoute,
  MaintenanceRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  StatusPill as S,
  cn as c,
  router as r
};
