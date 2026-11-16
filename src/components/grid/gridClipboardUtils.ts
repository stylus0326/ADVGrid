/**
 * Tính toán tọa độ an toàn cho Menu ngữ cảnh, chống tràn ra ngoài khung nhìn (Boundary Clamping)
 */
export function computeContextMenuCoords(
  clickX: number,
  clickY: number,
  menuW = 210,
  menuH = 200,
  rootEl?: HTMLElement | null
): { top: number; left: number } {
  let left = clickX;
  let top = clickY;

  if (rootEl) {
    const gridRect = rootEl.getBoundingClientRect();
    if (left + menuW > gridRect.right - 8) {
      left = Math.max(gridRect.left + 8, gridRect.right - menuW - 8);
    }
    if (left < gridRect.left + 8) {
      left = gridRect.left + 8;
    }
    if (top + menuH > gridRect.bottom - 8) {
      top = Math.max(gridRect.top + 8, gridRect.bottom - menuH - 8);
    }
    if (top < gridRect.top + 8) {
      top = gridRect.top + 8;
    }
  } else if (typeof window !== 'undefined') {
    if (left + menuW > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuW - 8);
    }
    if (top + menuH > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - menuH - 8);
    }
  }

  return { top, left };
}

/**
 * Sao chép văn bản vào Clipboard an toàn (hỗ trợ cả navigator.clipboard lẫn execCommand fallback)
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback nếu trình duyệt chặn quyền clipboard
  }

  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    // im lặng nếu không sao chép được
  }
  return false;
}
