import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Tweakcn Live Preview Bridge: Lắng nghe sự kiện cập nhật giao diện trực tiếp từ tweakcn.com
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'TWEAKCN_THEME_UPDATE') {
      const state = event.data.payload?.themeState;
      if (state) {
        const mode = state.currentMode || 'light';
        const styles = state.styles?.[mode] || state.styles?.light || {};
        const root = document.documentElement;
        const containers = document.querySelectorAll<HTMLElement>('.agv-app-container, .agv-grid-root');

        const applyVar = (prop: string, val: string | undefined) => {
          if (!val) return;
          const cssVal = val.includes(' ') && !val.includes('(') ? `hsl(${val})` : val;
          root.style.setProperty(prop, cssVal);
          containers.forEach((c) => c.style.setProperty(prop, cssVal));
        };

        applyVar('--agv-accent', styles.primary);
        applyVar('--agv-accent-hover', styles.primary);
        applyVar('--agv-text-active', styles.primary);
        applyVar('--agv-bg-root', styles.background);
        applyVar('--agv-text-main', styles.foreground);
        applyVar('--agv-border', styles.border);
        applyVar('--agv-border-strong', styles.border);
        applyVar('--agv-bg-row-alt', styles.card || styles.muted);
        applyVar('--agv-bg-popup', styles.popover || styles.card);
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
