import React, { useState, useEffect, useId, useMemo, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { SurfaceTheme } from '../components/grid/types';
import { formatGridNumber } from '../components/grid/gridUtils';
import { getThemeClass } from '../themes';
import { getPortalThemeVars } from '../components/ui/enterpriseEditorUtils';

export interface TwelveMonthChartProps {
  values: number[];
  minIdx: number;
  maxIdx: number;
  minVal: number;
  maxVal: number;
  avgVal?: number;
  surfaceTheme?: SurfaceTheme;
  width?: number;
  height?: number;
}

/**
 * Tạo đường cong mềm Catmull-Rom cubic bezier spline đi qua các điểm dữ liệu
 * Giúp biểu đồ sóng mượt mà chuẩn AG Grid thay vì dạng gấp khúc
 */
function getSmoothSplinePath(
  pts: { x: number; y: number }[],
  height: number,
  padTop: number,
  padBottom: number = 5
): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let path = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    // Control point 1
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    let cp1y = p1.y + (p2.y - p0.y) / 6;

    // Control point 2
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    let cp2y = p2.y - (p3.y - p1.y) / 6;

    // Giới hạn an toàn đỉnh/đáy trong khung SVG
    cp1y = Math.max(padTop, Math.min(height - padBottom, cp1y));
    cp2y = Math.max(padTop, Math.min(height - padBottom, cp2y));

    path += ` C ${Math.round(cp1x * 10) / 10} ${Math.round(cp1y * 10) / 10}, ${Math.round(
      cp2x * 10
    ) / 10} ${Math.round(cp2y * 10) / 10}, ${Math.round(p2.x * 10) / 10} ${Math.round(
      p2.y * 10
    ) / 10}`;
  }

  return path;
}

export const TwelveMonthChartCell = memo(
  ({ values, minIdx, maxIdx, minVal, maxVal, avgVal, width, height, surfaceTheme }: TwelveMonthChartProps) => {
    const gradientId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [anchorCoords, setAnchorCoords] = useState<{ x: number; y: number } | null>(null);
    const hoveredIdxRef = useRef<number | null>(null);
    const svgRectRef = useRef<DOMRect | null>(null);

    // Tự động đo kích thước container thực tế khi không có width cố định
    // Giúp viewBox và render pixel khớp 1:1, triệt tiêu 100% hiện tượng elip méo mó của chấm tròn cực trị
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const updateW = () => {
        const w = el.clientWidth;
        if (w > 0) {
          setMeasuredWidth((prev) => (prev !== w ? w : prev));
        }
      };
      updateW();
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(updateW);
        ro.observe(el);
        return () => ro.disconnect();
      }
    }, [width]);

    // Kích thước chuẩn hóa của vector canvas khớp 1:1 với độ rộng thực tế của ô
    const effectiveWidth = measuredWidth || width || 150;
    const baseWidth = Math.max(60, effectiveWidth - 4);
    const baseHeight = height || 24;
    const padX = 6;
    const padTop = 6;
    const padBottom = 6;
    const innerW = baseWidth - padX * 2;
    const innerH = baseHeight - padTop - padBottom;

    const range = Math.max(1, maxVal - minVal);
    const calculatedAvg = avgVal !== undefined ? avgVal : (values.reduce((s, v) => s + v, 0) / (values.length || 1));

    // Tính toán tọa độ 12 điểm và đường cong SVG Spline
    const { points, linePath, areaPath, avgY } = useMemo(() => {
      if (!values || values.length === 0) {
        return { points: [], linePath: '', areaPath: '', avgY: baseHeight / 2 };
      }

      const pts = values.map((val, idx) => {
        const x = padX + (idx / Math.max(1, values.length - 1)) * innerW;
        const norm = (val - minVal) / range;
        const y = padTop + (1 - norm) * innerH;
        return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, val };
      });

      const lPath = getSmoothSplinePath(pts, baseHeight, padTop, padBottom);
      const aPath =
        pts.length > 0
          ? `${lPath} L ${pts[pts.length - 1].x} ${baseHeight} L ${pts[0].x} ${baseHeight} Z`
          : '';

      const avgNorm = (calculatedAvg - minVal) / range;
      const aY = padTop + (1 - avgNorm) * innerH;

      return {
        points: pts,
        linePath: lPath,
        areaPath: aPath,
        avgY: Math.max(padTop, Math.min(baseHeight - padBottom, Math.round(aY * 10) / 10)),
      };
    }, [values, minVal, range, innerW, innerH, calculatedAvg]);

    // Xử lý rê chuột (Pointer Scrubbing) theo tỉ lệ ô và định vị Tooltip (Chỉ re-render khi nhảy sang tháng mới)
    const handlePointerEnter = (e: React.PointerEvent<SVGSVGElement>) => {
      svgRectRef.current = e.currentTarget.getBoundingClientRect();
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      const rect = svgRectRef.current || e.currentTarget.getBoundingClientRect();
      svgRectRef.current = rect;
      const mouseX = e.clientX - rect.left;
      const actualW = Math.max(1, rect.width);
      const ratio = Math.max(0, Math.min(1, mouseX / actualW));
      const idx = Math.round(ratio * (values.length - 1));

      if (hoveredIdxRef.current === idx) return;
      hoveredIdxRef.current = idx;
      setHoveredIdx(idx);

      const pt = points[idx];
      if (pt) {
        const scaleX = rect.width / baseWidth;
        const scaleY = rect.height / baseHeight;
        const screenX = rect.left + pt.x * scaleX;
        const screenY = rect.top + pt.y * scaleY;
        setAnchorCoords({ x: screenX, y: screenY });
      }
    };

    const handlePointerLeave = () => {
      if (hoveredIdxRef.current === null) return;
      hoveredIdxRef.current = null;
      svgRectRef.current = null;
      setHoveredIdx(null);
      setAnchorCoords(null);
    };

    // Tự động đóng tooltip khi người dùng lăn chuột hoặc cuộn trang để tránh trôi lệch tọa độ
    useEffect(() => {
      if (hoveredIdx === null) return;
      const handleScroll = () => {
        hoveredIdxRef.current = null;
        svgRectRef.current = null;
        setHoveredIdx(null);
        setAnchorCoords(null);
      };
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      return () => {
        window.removeEventListener('scroll', handleScroll, { capture: true });
      };
    }, [hoveredIdx]);

    if (!values || values.length === 0) {
      return <div className="w-full h-full flex items-center justify-center text-xs opacity-40">-</div>;
    }

    const hoveredVal = hoveredIdx !== null ? values[hoveredIdx] : null;
    const isAboveAvg = hoveredVal !== null && hoveredVal >= calculatedAvg;
    const isHoveredMax = hoveredIdx !== null && maxVal > minVal && (hoveredIdx === maxIdx || hoveredVal === maxVal);
    const isHoveredMin = hoveredIdx !== null && maxVal > minVal && (hoveredIdx === minIdx || hoveredVal === minVal);

    const valColor = isHoveredMax
      ? 'var(--agv-trend-up)'
      : isHoveredMin
      ? 'var(--agv-trend-down)'
      : 'var(--agv-text-main)';

    const activeColor = isHoveredMax
      ? 'var(--agv-trend-up)'
      : isHoveredMin
      ? 'var(--agv-trend-down)'
      : isAboveAvg
      ? 'var(--agv-trend-up)'
      : 'var(--agv-trend-down)';

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden select-none px-0"
        onMouseLeave={handlePointerLeave}
      >
        <svg
          width="100%"
          height={baseHeight}
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible block shrink-0 cursor-crosshair"
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--agv-accent)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--agv-accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Đường mốc Trung bình (Benchmark Dotted Line) */}
          <line
            x1={padX}
            y1={avgY}
            x2={baseWidth - padX}
            y2={avgY}
            stroke="var(--agv-border)"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeOpacity="0.8"
          />

          {/* Vùng gradient sóng mềm khép kín */}
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}

          {/* Đường sóng Catmull-Rom cubic bezier chính */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--agv-accent)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Điểm Cực đại (Max - Xanh lá theo mẫu AdvSparkline với viền nổi theo nền theme) */}
          {maxIdx !== -1 && points[maxIdx] && (
            <circle
              cx={Math.max(padX, Math.min(baseWidth - padX, points[maxIdx].x))}
              cy={Math.max(padTop, Math.min(baseHeight - padBottom, points[maxIdx].y))}
              r={hoveredIdx === maxIdx ? 4.2 : 3.2}
              fill="var(--agv-trend-up)"
              stroke="var(--agv-bg-surface)"
              strokeWidth={1.4}
              className="pointer-events-none transition-all"
            />
          )}

          {/* Điểm Cực tiểu (Min - Đỏ theo mẫu AdvSparkline với viền nổi theo nền theme) */}
          {minIdx !== -1 && points[minIdx] && (
            <circle
              cx={Math.max(padX, Math.min(baseWidth - padX, points[minIdx].x))}
              cy={Math.max(padTop, Math.min(baseHeight - padBottom, points[minIdx].y))}
              r={hoveredIdx === minIdx ? 4.2 : 3.2}
              fill="var(--agv-trend-down)"
              stroke="var(--agv-bg-surface)"
              strokeWidth={1.4}
              className="pointer-events-none transition-all"
            />
          )}

          {/* Chỉ báo tương tác khi rê chuột: Đường dóng dọc & điểm tròn active */}
          {hoveredIdx !== null && points[hoveredIdx] && (
            <g className="pointer-events-none">
              <line
                x1={points[hoveredIdx].x}
                y1={padTop}
                x2={points[hoveredIdx].x}
                y2={baseHeight}
                stroke={activeColor}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={points[hoveredIdx].x}
                cy={points[hoveredIdx].y}
                r={3.8}
                fill="var(--agv-bg-surface)"
                stroke={activeColor}
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* Animate UI Spring Tooltip Portal */}
        {hoveredIdx !== null && anchorCoords && typeof document !== 'undefined' && createPortal(
          <div
            className={`fixed pointer-events-none z-[999999] ${getThemeClass(surfaceTheme)}`}
            data-theme={surfaceTheme}
            style={{
              ...getPortalThemeVars(surfaceTheme),
              left: `${anchorCoords && typeof window !== 'undefined' ? Math.max(80, Math.min(window.innerWidth - 80, anchorCoords.x)) : (anchorCoords?.x ?? 0)}px`,
              top: (anchorCoords.y < 65) ? `${anchorCoords.y + 12}px` : `${anchorCoords.y - 8}px`,
              transition: 'left 120ms cubic-bezier(0.2, 0.9, 0.3, 1), top 120ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            <div
              className={`relative flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-sans shadow-lg select-none ${
                (anchorCoords.y < 65) ? 'agv-tooltip-spring-down' : 'agv-tooltip-spring-up'
              }`}
              style={{
                backgroundColor: 'var(--agv-bg-popup)',
                color: 'var(--agv-text-main)',
                border: '1px solid var(--agv-border-popup)',
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.22), 0 2px 6px -1px rgba(0,0,0,0.1)',
              }}
            >
              {/* Mũi tên định vị Tooltip Arrow */}
              <div
                className={`absolute left-1/2 flex items-center justify-center pointer-events-none ${
                  (anchorCoords.y < 65) ? '-top-[5px]' : '-bottom-[5px]'
                }`}
                style={{
                  transform: `translateX(calc(-50% + ${anchorCoords.x - (typeof window !== 'undefined' ? Math.max(80, Math.min(window.innerWidth - 80, anchorCoords.x)) : anchorCoords.x)}px))`,
                }}
              >
                <svg width="10" height="5" viewBox="0 0 10 5" className="block">
                  {anchorCoords.y < 65 ? (
                    <path
                      d="M 0 5 L 5 0 L 10 5"
                      fill="var(--agv-bg-popup)"
                      stroke="var(--agv-border-popup)"
                      strokeWidth="1"
                    />
                  ) : (
                    <path
                      d="M 0 0 L 5 5 L 10 0"
                      fill="var(--agv-bg-popup)"
                      stroke="var(--agv-border-popup)"
                      strokeWidth="1"
                    />
                  )}
                </svg>
              </div>

              {/* Thông tin Tháng & Số liệu */}
              <span className="font-medium text-[11px] text-[var(--agv-text-muted)] tracking-tight">
                {`Tháng ${String(hoveredIdx + 1).padStart(2, '0')}`}
              </span>

              <span className="text-[var(--agv-text-muted)] opacity-50 text-[11px] leading-none">•</span>

              <span
                className="font-bold tabular-nums text-xs"
                style={{ color: valColor }}
              >
                {formatGridNumber(hoveredVal, 1)}
              </span>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }
);
