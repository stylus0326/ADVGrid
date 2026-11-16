export declare function readGridStorageRaw(key: string | null | undefined): string | null;
export declare function writeGridStorageRaw(key: string | null | undefined, value: string): void;
export declare function readGridStorageJson<T>(key: string | null | undefined, fallback: T): T;
export declare function writeGridStorageJson(key: string | null | undefined, value: unknown): void;
export declare function normalizeGridId(gridId?: string): string;
export declare function getQueryPresetsStorageKey(gridId?: string): string;
export declare function getFloatingToolbarTopKey(gridId?: string): string;
export declare function getGridSettingsStorageKey(gridId?: string): string | null;
export declare function getDataGridConfigStorageKey(gridId: string): string;
