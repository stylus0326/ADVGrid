import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import {
  getThemeClass,
  SURFACE_THEMES,
  type GridTheme as SurfaceTheme,
} from './themes';
import {
  type AuthSession,
  getAuthSession,
  logoutAccount,
  subscribeAuthSession,
} from './services/b2bAuth';
import { PageShell } from './components/shared/PageShell';
import { ListPagePanel } from './components/shared/ListPagePanel';
import { LiquidGlassBackdrop } from './components/shared/LiquidGlassBackdrop';
import { AdvButton } from './components/ui/AdvButton';
import {
  BUTTON_FOCUS_VISIBLE_CLASS,
} from './components/ui/controlFocus';

const LoginPanel = lazy(() =>
  import('./components/b2b/LoginPanel').then((m) => ({ default: m.LoginPanel }))
);

const CountriesPage = lazy(() =>
  import('./pages/CountriesPage').then((m) => ({ default: m.CountriesPage }))
);
const AirportsPage = lazy(() =>
  import('./pages/AirportsPage').then((m) => ({ default: m.AirportsPage }))
);
const PartnersPage = lazy(() =>
  import('./pages/PartnersPage').then((m) => ({ default: m.PartnersPage }))
);
const BookingsPage = lazy(() =>
  import('./pages/BookingsPage').then((m) => ({ default: m.BookingsPage }))
);
const UiPrimitivesPage = lazy(() =>
  import('./pages/UiPrimitivesPage').then((m) => ({ default: m.UiPrimitivesPage }))
);

type ActivePageKey = 'countries' | 'airports' | 'partners' | 'bookings' | 'ui-test';

const PAGE_TABS: { key: ActivePageKey; label: string }[] = [
  { key: 'countries', label: 'Quốc gia' },
  { key: 'airports', label: 'Sân bay' },
  { key: 'partners', label: 'Đại lý' },
  { key: 'bookings', label: 'Đặt chỗ' },
  { key: 'ui-test', label: 'Thử nghiệm UI' },
];

const THEME_STORAGE_KEY = 'agv_b2b_surface_theme';
const COLOR_SCHEME_STORAGE_KEY = 'agv_color_scheme';
const VISUAL_MODE_STORAGE_KEY = 'agv_b2b_visual_mode';
const ACTIVE_PAGE_STORAGE_KEY = 'agv_b2b_active_page';

function isActivePageKey(value: string | null): value is ActivePageKey {
  return (
    value === 'countries' ||
    value === 'airports' ||
    value === 'partners' ||
    value === 'bookings' ||
    value === 'ui-test'
  );
}

function parseHashPageKey(): ActivePageKey | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash
    .replace(/^#\/?/, '')
    .split('?')[0]
    .replace(/\/+$/, '')
    .toLowerCase();
  return isActivePageKey(hash) ? hash : null;
}

function readInitialPage(): ActivePageKey {
  const hashPage = parseHashPageKey();
  if (hashPage) {
    return hashPage;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY);
      if (isActivePageKey(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
  }
  return 'countries';
}

function readInitialDarkMode(): boolean {
  try {
    const savedScheme = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (savedScheme === 'dark' || savedScheme === 'light') {
      return savedScheme === 'dark';
    }
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' || savedTheme === 'liquid-dark';
  } catch {
    return false;
  }
}

function readInitialLiquidMode(): boolean {
  try {
    const savedVisual = localStorage.getItem(VISUAL_MODE_STORAGE_KEY);
    if (savedVisual === 'flat') return false;
    if (savedVisual === 'liquid') return true;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

export function App() {
  const [activePage, setActivePage] = useState<ActivePageKey>(readInitialPage);
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());
  const [isDark, setIsDark] = useState<boolean>(readInitialDarkMode);
  const [isLiquid, setIsLiquid] = useState<boolean>(readInitialLiquidMode);

  const surfaceTheme: SurfaceTheme = isLiquid
    ? isDark
      ? SURFACE_THEMES.LIQUID_DARK
      : SURFACE_THEMES.LIQUID_LIGHT
    : isDark
    ? SURFACE_THEMES.DARK
    : SURFACE_THEMES.LIGHT;

  useEffect(() => {
    return subscribeAuthSession(() => {
      setSession(getAuthSession());
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hashPage = parseHashPageKey();
      if (hashPage) {
        setActivePage(hashPage);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPage = useCallback((nextPage: ActivePageKey) => {
    setActivePage(nextPage);
    try {
      localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, nextPage);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `/${nextPage}`;
    }
  }, []);

  const handleToggleColorScheme = useCallback(
    (dark: boolean) => {
      setIsDark(dark);
      try {
        localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, dark ? 'dark' : 'light');
        const nextTheme = isLiquid
          ? dark
            ? SURFACE_THEMES.LIQUID_DARK
            : SURFACE_THEMES.LIQUID_LIGHT
          : dark
          ? SURFACE_THEMES.DARK
          : SURFACE_THEMES.LIGHT;
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // ignore
      }
    },
    [isLiquid]
  );

  const handleToggleLiquidMode = useCallback(
    (liquid: boolean) => {
      setIsLiquid(liquid);
      try {
        localStorage.setItem(VISUAL_MODE_STORAGE_KEY, liquid ? 'liquid' : 'flat');
        const nextTheme = liquid
          ? isDark
            ? SURFACE_THEMES.LIQUID_DARK
            : SURFACE_THEMES.LIQUID_LIGHT
          : isDark
          ? SURFACE_THEMES.DARK
          : SURFACE_THEMES.LIGHT;
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // ignore
      }
    },
    [isDark]
  );

  // Đồng bộ class `.dark`, `.agv-liquid` và `data-theme` lên `html` & `body` cho toàn bộ ứng dụng và Portal
  useEffect(() => {
    const rootEl = document.documentElement;
    const bodyEl = document.body;

    rootEl.setAttribute('data-theme', surfaceTheme);
    if (bodyEl) bodyEl.setAttribute('data-theme', surfaceTheme);

    const legacyClasses = [
      'agv-light',
      'agv-dark',
      'agv-bezier-arthouse',
      'agv-e-ink',
    ];
    legacyClasses.forEach((cls) => {
      rootEl.classList.remove(cls);
      if (bodyEl) bodyEl.classList.remove(cls);
    });

    if (isDark) {
      rootEl.classList.add('dark');
      if (bodyEl) bodyEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
      if (bodyEl) bodyEl.classList.remove('dark');
    }

    if (isLiquid) {
      rootEl.classList.add('agv-liquid');
      if (bodyEl) bodyEl.classList.add('agv-liquid');
    } else {
      rootEl.classList.remove('agv-liquid');
      if (bodyEl) bodyEl.classList.remove('agv-liquid');
    }
  }, [isDark, isLiquid, surfaceTheme]);

  const themeClass = getThemeClass(surfaceTheme);
  const displayUser =
    session?.UserInfo?.FullName ||
    session?.UserInfo?.UserFullname ||
    session?.UserInfo?.UserCode ||
    'Đã kết nối';

  return (
    <div
      className={`agv-app-container relative isolate h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground ${themeClass}`}
      data-theme={surfaceTheme}
    >
      {isLiquid ? <LiquidGlassBackdrop isDark={isDark} /> : null}

      {/* Top Navigation & Connection Bar (PNT B2B AppHeaderFrame + Gold active underline) */}
      <header className="agv-app-header relative z-shell shrink-0 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85 text-card-foreground px-4 h-12 flex items-center justify-between gap-4 select-none">
        <nav className="flex items-center gap-1 h-full overflow-x-auto overflow-y-hidden" aria-label="Điều hướng danh mục">
          {PAGE_TABS.map((tab) => {
            const isActive = activePage === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectPage(tab.key)}
                className={`h-full min-h-[28px] inline-flex items-center px-3.5 text-label whitespace-nowrap border-b-2 transition-colors cursor-pointer ${BUTTON_FOCUS_VISIBLE_CLASS} ${
                  isActive
                    ? 'border-brand-gold text-brand-gold-on-light font-semibold'
                    : 'border-transparent text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-xs shrink-0">
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground hidden sm:inline">
                Kết nối:{' '}
                <strong className="font-semibold text-foreground">{displayUser}</strong>
              </span>
              <AdvButton
                variant="outline"
                size="sm"
                onClick={() => void logoutAccount()}
                className="h-8"
              >
                Đăng xuất
              </AdvButton>
            </div>
          ) : (
            <span className="text-muted-foreground">Chưa đăng nhập</span>
          )}

          <AdvButton
            variant="outline"
            size="sm"
            active={isLiquid}
            onClick={() => handleToggleLiquidMode(!isLiquid)}
            aria-pressed={isLiquid}
            className="h-8"
          >
            Liquid Glass
          </AdvButton>

          <AdvButton
            variant="outline"
            size="sm"
            onClick={() => handleToggleColorScheme(!isDark)}
            aria-pressed={isDark}
            className="h-8"
          >
            {isDark ? 'Tối' : 'Sáng'}
          </AdvButton>
        </div>
      </header>

      {/* Main Workspace */}
      {!session && activePage !== 'ui-test' ? (
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
              Đang tải...
            </div>
          }
        >
          <LoginPanel onSuccess={setSession} />
        </Suspense>
      ) : (
        <PageShell>
          <ListPagePanel>
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                  Đang tải...
                </div>
              }
            >
              {activePage === 'ui-test' ? (
                <UiPrimitivesPage surfaceTheme={surfaceTheme} />
              ) : activePage === 'countries' ? (
                <CountriesPage surfaceTheme={surfaceTheme} />
              ) : activePage === 'airports' ? (
                <AirportsPage surfaceTheme={surfaceTheme} />
              ) : activePage === 'partners' ? (
                <PartnersPage surfaceTheme={surfaceTheme} />
              ) : (
                <BookingsPage surfaceTheme={surfaceTheme} />
              )}
            </Suspense>
          </ListPagePanel>
        </PageShell>
      )}
    </div>
  );
}

export default App;
