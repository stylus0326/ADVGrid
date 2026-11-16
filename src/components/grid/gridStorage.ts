/**
 * SSR-safe localStorage helpers & gridId-scoped storage keys
 */

export function readGridStorageRaw(key: string | null | undefined): string | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    if (!window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeGridStorageRaw(key: string | null | undefined, value: string): void {
  if (!key || typeof window === 'undefined') return;
  try {
    if (!window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    // Bỏ qua lỗi quota hoặc private mode
  }
}

export function readGridStorageJson<T>(key: string | null | undefined, fallback: T): T {
  const raw = readGridStorageRaw(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeGridStorageJson(key: string | null | undefined, value: unknown): void {
  try {
    writeGridStorageRaw(key, JSON.stringify(value));
  } catch {
    // Bỏ qua lỗi serialize
  }
}

export function normalizeGridId(gridId?: string): string {
  if (!gridId) return '';
  return gridId.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
}

export function getQueryPresetsStorageKey(gridId?: string): string {
  const id = normalizeGridId(gridId);
  return id ? `AGV_QUERY_PRESETS_V1_${id}` : 'AGV_QUERY_PRESETS_V1';
}

export function getFloatingToolbarTopKey(gridId?: string): string {
  const id = normalizeGridId(gridId);
  return id ? `AGV_FLOAT_TOOLBAR_TOP_V1_${id}` : 'AGV_FLOAT_TOOLBAR_TOP_V1';
}

export function getGridSettingsStorageKey(gridId?: string): string | null {
  const id = normalizeGridId(gridId);
  return id ? `AGV_GRID_SETTINGS_V1_${id}` : null;
}

export function getDataGridConfigStorageKey(gridId: string): string {
  const id = normalizeGridId(gridId) || 'default';
  return `AGV_DATAGRID_CFG_V1_${id}`;
}
