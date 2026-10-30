import { TWEAKCN_THEME_PRESETS } from './data';
import { ThemePreset, ThemeStyleProps } from './types';
import { convertPresetToGridTokens, generatePresetCssVariables } from './converter';
import { loadCustomPresets } from './customThemes';
import { GridThemeTokens } from '../common';

export * from './types';
export * from './data';
export * from './converter';
export * from './customThemes';

export const DEFAULT_PRESET_ID = 'modern-minimal';

/**
 * Trả về danh sách option chuẩn { value, label } phục vụ AdvComboBoxEdit (bao gồm 42 themes chuẩn và các theme tùy biến đã lưu)
 */
export function getAllPresetOptions(): { value: string; label: string }[] {
  const builtIn = Object.entries(TWEAKCN_THEME_PRESETS).map(([key, preset]) => ({
    value: key,
    label: preset.label,
  }));

  const custom = Object.entries(loadCustomPresets()).map(([key, preset]) => ({
    value: key,
    label: `${preset.label} (Custom)`,
  }));

  return [...custom, ...builtIn];
}

/**
 * Lấy ThemePreset theo ID, tra cứu cả bảng 42 presets lẫn các preset tùy biến từ localStorage
 */
export function getPresetById(id?: string | null): ThemePreset {
  if (id) {
    if (TWEAKCN_THEME_PRESETS[id]) {
      return TWEAKCN_THEME_PRESETS[id];
    }
    const customs = loadCustomPresets();
    if (customs[id]) {
      return customs[id];
    }
  }
  return TWEAKCN_THEME_PRESETS[DEFAULT_PRESET_ID];
}

/**
 * Lấy các tokens GridThemeTokens từ ID preset và chế độ light/dark
 */
export function getPresetTokens(
  id?: string | null,
  mode: 'light' | 'dark' = 'light'
): GridThemeTokens {
  const preset = getPresetById(id);
  const styles: ThemeStyleProps = mode === 'dark' ? preset.styles.dark : preset.styles.light;
  return convertPresetToGridTokens(styles, mode);
}
