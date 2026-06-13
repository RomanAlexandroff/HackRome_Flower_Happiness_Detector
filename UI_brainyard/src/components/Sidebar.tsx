import {
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  Map,
  Settings,
  Sprout,
} from "lucide-react";

export type NavigationKey =
  | "overview"
  | "plots"
  | "field-log"
  | "field-observations"
  | "studies"
  | "settings";

type SidebarProps = {
  activeView: NavigationKey;
  onNavigate: (view: NavigationKey) => void;
};

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "plots", label: "Plots", icon: Map },
  { id: "field-log", label: "Field Log", icon: ClipboardList },
  { id: "field-observations", label: "Field Observations", icon: ClipboardCheck },
  { id: "studies", label: "Studies", icon: FlaskConical },
  { id: "settings", label: "Settings", icon: Settings },
] satisfies Array<{
  id: NavigationKey;
  label: string;
  icon: typeof LayoutDashboard;
}>;

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <Sprout size={26} />
          </span>
          <div>
            <strong>Brainyard</strong>
            <span>Vineyard intelligence</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "is-active" : undefined}
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "is-active" : undefined}
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
