import { TWEAKCN_THEME_PRESETS } from './data';
import { ThemePreset, ThemeStyleProps } from './types';
import { convertPresetToGridTokens, generatePresetCssVariables } from './converter';
import { GridThemeTokens } from '../common';

export * from './types';
export * from './data';
export * from './converter';

export const DEFAULT_PRESET_ID = 'modern-minimal';

/**
 * Trả về danh sách option chuẩn { value, label } phục vụ AdvComboBoxEdit
 */
export function getAllPresetOptions(): { value: string; label: string }[] {
  return Object.entries(TWEAKCN_THEME_PRESETS).map(([key, preset]) => ({
    value: key,
    label: preset.label,
  }));
}

/**
 * Lấy ThemePreset theo ID, fallback về modern-minimal nếu không tồn tại
 */
export function getPresetById(id?: string | null): ThemePreset {
  if (id && TWEAKCN_THEME_PRESETS[id]) {
    return TWEAKCN_THEME_PRESETS[id];
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
