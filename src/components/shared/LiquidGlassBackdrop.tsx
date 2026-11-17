import React, { useEffect, useState } from 'react';

export interface LiquidGlassBackdropProps {
  isDark: boolean;
}

interface AerialViewportConfig {
  viewBox: string;
  aircraftTransform: string;
}

function resolveAerialConfig(width: number): AerialViewportConfig {
  if (width < 768) {
    return {
      viewBox: '0 0 382 620',
      aircraftTransform: 'translate(-32, -26) scale(0.84)',
    };
  }
  if (width < 1024) {
    return {
      viewBox: '-140 20 820 560',
      aircraftTransform: 'translate(10, -32) scale(0.96)',
    };
  }
  return {
    viewBox: '-340 15 1180 560',
    aircraftTransform: 'translate(35, -36) scale(1.06)',
  };
}

/**
 * Phông nền bầu trời tầng bình lưu, biển mây Stratocumulus và tàu bay Quad-Jet 747-8
 * cho chế độ giao diện Liquid Glass (Ngày & Đêm).
 */
export const LiquidGlassBackdrop: React.FC<LiquidGlassBackdropProps> = React.memo(({ isDark }) => {
  const [sceneConfig, setSceneConfig] = useState<AerialViewportConfig>(() =>
    resolveAerialConfig(typeof window !== 'undefined' ? window.innerWidth : 1280)
  );

  useEffect(() => {
    const syncScene = () => {
      const next = resolveAerialConfig(window.innerWidth);
      setSceneConfig((prev) =>
        prev.viewBox === next.viewBox && prev.aircraftTransform === next.aircraftTransform
          ? prev
          : next
      );
    };
    window.addEventListener('resize', syncScene);
    return () => window.removeEventListener('resize', syncScene);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <svg
        viewBox={sceneConfig.viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="agvLiquidOceanDayGrad" x1="15%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#023E68" />
            <stop offset="28%" stopColor="#05649B" />
            <stop offset="55%" stopColor="#0E8ECF" />
            <stop offset="76%" stopColor="#38BDF8" />
            <stop offset="88%" stopColor="#BAE6FD" />
            <stop offset="96%" stopColor="#F0F9FF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          <linearGradient id="agvLiquidOceanNightGrad" x1="15%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#030E14" />
            <stop offset="28%" stopColor="#05161F" />
            <stop offset="54%" stopColor="#071C24" />
            <stop offset="74%" stopColor="#0C3240" />
            <stop offset="86%" stopColor="#0F5266" />
            <stop offset="94%" stopColor="#12313B" />
            <stop offset="100%" stopColor="#071C24" />
          </linearGradient>

          <linearGradient id="agvLiquidSandDayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F1F8FE" />
            <stop offset="100%" stopColor="#DCEEFF" />
          </linearGradient>

          <linearGradient id="agvLiquidSandNightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12313B" />
            <stop offset="55%" stopColor="#0D2731" />
            <stop offset="100%" stopColor="#071C24" />
          </linearGradient>

          <radialGradient id="agvLiquidGlow" cx="38%" cy="52%" r="58%">
            <stop offset="0%" stopColor={isDark ? '#70BDD2' : '#7DD3FC'} stopOpacity={isDark ? '0.28' : '0.45'} />
            <stop offset="65%" stopColor={isDark ? '#0F5266' : '#0284C7'} stopOpacity="0.12" />
            <stop offset="100%" stopColor={isDark ? '#071C24' : '#034975'} stopOpacity="0" />
          </radialGradient>

          <linearGradient id="agvLiquidContrailGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="48%" stopColor="#E0F2FE" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="agvLiquidWindCoreGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#F0F9FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="agvLiquidFuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="28%" stopColor="#F8FAFC" />
            <stop offset="52%" stopColor="#FFFFFF" />
            <stop offset="78%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="agvLiquidWingLeftGrad" x1="100%" y1="0%" x2="0%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="agvLiquidWingRightGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="agvLiquidTailFinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          <filter id="agvLiquidPlaneCloudShadow" x="-45%" y="-35%" width="190%" height="180%">
            <feDropShadow dx="18" dy="10" stdDeviation="8" floodColor="#02233C" floodOpacity="0.36" />
          </filter>
        </defs>

        <rect
          x="-1000"
          y="-400"
          width="3600"
          height="2000"
          fill={isDark ? 'url(#agvLiquidOceanNightGrad)' : 'url(#agvLiquidOceanDayGrad)'}
        />
        <rect x="-1000" y="-400" width="3600" height="2000" fill="url(#agvLiquidGlow)" />

        <g opacity={isDark ? 0.92 : 0.22}>
          <circle cx="-240" cy="88" r="1.4" fill="#FFFFFF" />
          <circle cx="-90" cy="62" r="1.6" fill="#BAE6FD" />
          <circle cx="42" cy="78" r="1.2" fill="#FFFFFF" />
          <circle cx="118" cy="54" r="1.5" fill="#E0F2FE" />
          <circle cx="188" cy="88" r="1.1" fill="#FFFFFF" />
          <circle cx="336" cy="64" r="1.6" fill="#BAE6FD" />
          <circle cx="312" cy="118" r="1.1" fill="#FFFFFF" />
          <circle cx="74" cy="272" r="1.3" fill="#E0F2FE" />
          <circle cx="152" cy="248" r="1.0" fill="#FFFFFF" />
          <circle cx="480" cy="70" r="1.5" fill="#FFFFFF" />
          <circle cx="640" cy="110" r="1.3" fill="#BAE6FD" />
          <circle cx="820" cy="65" r="1.6" fill="#E0F2FE" />
          <circle cx="1040" cy="95" r="1.4" fill="#FFFFFF" />
          <circle cx="1220" cy="75" r="1.5" fill="#BAE6FD" />
        </g>

        <path
          d="M-800 265 Q -250 220, 205 305 T 1100 320 T 2000 340 L 2000 900 L -800 900 Z"
          fill={isDark ? '#173D49' : '#BAE6FD'}
          opacity={isDark ? 0.36 : 0.28}
        />
        <path
          d="M-800 315 Q -180 285, 235 365 T 1150 370 T 2000 395 L 2000 900 L -800 900 Z"
          fill={isDark ? '#12313B' : '#E0F2FE'}
          opacity={isDark ? 0.48 : 0.45}
        />

        <path
          className="agv-liquid-cloud"
          d="M -800 390
             C -580 345, -360 360, -180 388
             C -85 355, -20 358, 15 372
             C 55 352, 82 358, 102 384
             C 134 362, 192 368, 224 398
             C 262 376, 326 382, 398 414
             C 490 378, 610 382, 720 412
             C 840 376, 980 384, 1120 416
             C 1280 382, 1520 390, 2000 420
             L 2000 1000 L -800 1000 Z"
          fill={isDark ? '#1C424F' : '#FFFFFF'}
          opacity={isDark ? 0.78 : 0.86}
        />

        <path
          d="M -800 418
             C -540 378, -320 392, -140 418
             C -60 392, -10 390, 22 402
             C 58 384, 88 392, 118 416
             C 158 392, 218 400, 256 428
             C 296 406, 348 412, 398 438
             C 510 404, 640 410, 760 438
             C 890 408, 1040 414, 1180 442
             C 1350 412, 1600 418, 2000 448
             L 2000 1000 L -800 1000 Z"
          fill={isDark ? '#0F2B36' : '#E2F1FC'}
          opacity="0.90"
        />

        <path
          d="M -800 446
             C -510 408, -290 422, -110 446
             C -40 422, 0 416, 30 428
             C 68 406, 98 416, 134 440
             C 178 418, 236 426, 282 452
             C 322 432, 362 438, 398 458
             C 520 428, 660 436, 790 462
             C 930 432, 1090 440, 1240 466
             C 1420 438, 1680 444, 2000 472
             L 2000 1000 L -800 1000 Z"
          fill={isDark ? 'url(#agvLiquidSandNightGrad)' : 'url(#agvLiquidSandDayGrad)'}
        />

        <g transform={sceneConfig.aircraftTransform}>
          <g className="agv-liquid-plane">
            <g transform="rotate(90 258 245)">
              <g className="agv-liquid-contrail">
                <path
                  d="M 172 268 L 158 820 L 182 820 L 180 268 Z"
                  fill="url(#agvLiquidContrailGrad)"
                />
                <path
                  d="M 176 266 L 170 790"
                  stroke="url(#agvLiquidWindCoreGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                <path
                  d="M 212 242 L 200 840 L 226 840 L 220 242 Z"
                  fill="url(#agvLiquidContrailGrad)"
                />
                <path
                  d="M 216 240 L 213 810"
                  stroke="url(#agvLiquidWindCoreGrad)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                <path
                  d="M 296 242 L 290 840 L 316 840 L 304 242 Z"
                  fill="url(#agvLiquidContrailGrad)"
                />
                <path
                  d="M 300 240 L 303 810"
                  stroke="url(#agvLiquidWindCoreGrad)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                <path
                  d="M 336 268 L 334 820 L 358 820 L 344 268 Z"
                  fill="url(#agvLiquidContrailGrad)"
                />
                <path
                  d="M 340 266 L 346 790"
                  stroke="url(#agvLiquidWindCoreGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>

              <g filter="url(#agvLiquidPlaneCloudShadow)">
                <g>
                  <rect x="174.5" y="238" width="3" height="10" rx="1" fill="#94A3B8" />
                  <path
                    d="M 170 236 C 170 231, 182 231, 182 236 L 181 264 C 181 268, 171 268, 171 264 Z"
                    fill="url(#agvLiquidFuselageGrad)"
                  />
                  <ellipse cx="176" cy="235.5" rx="5.2" ry="1.8" fill="#0F172A" />

                  <rect x="214.5" y="210" width="3" height="10" rx="1" fill="#94A3B8" />
                  <path
                    d="M 209.5 208 C 209.5 202.5, 222.5 202.5, 222.5 208 L 221.5 239 C 221.5 243, 210.5 243, 210.5 239 Z"
                    fill="url(#agvLiquidFuselageGrad)"
                  />
                  <ellipse cx="216" cy="207.5" rx="5.8" ry="2" fill="#0F172A" />

                  <rect x="298.5" y="210" width="3" height="10" rx="1" fill="#94A3B8" />
                  <path
                    d="M 293.5 208 C 293.5 202.5, 306.5 202.5, 306.5 208 L 305.5 239 C 305.5 243, 294.5 243, 294.5 239 Z"
                    fill="url(#agvLiquidFuselageGrad)"
                  />
                  <ellipse cx="300" cy="207.5" rx="5.8" ry="2" fill="#0F172A" />

                  <rect x="338.5" y="238" width="3" height="10" rx="1" fill="#94A3B8" />
                  <path
                    d="M 334 236 C 334 231, 346 231, 346 236 L 345 264 C 345 268, 335 268, 335 264 Z"
                    fill="url(#agvLiquidFuselageGrad)"
                  />
                  <ellipse cx="340" cy="235.5" rx="5.2" ry="1.8" fill="#0F172A" />
                </g>

                <path
                  d="M 245 172
                     C 218 198, 168 244, 138 275
                     C 132 281, 130 290, 131 297
                     C 136 297, 144 293, 154 287
                     L 246 250 Z"
                  fill="url(#agvLiquidWingLeftGrad)"
                />
                <path
                  d="M 271 172
                     C 298 198, 348 244, 378 275
                     C 384 281, 386 290, 385 297
                     C 380 297, 372 293, 362 287
                     L 270 250 Z"
                  fill="url(#agvLiquidWingRightGrad)"
                />

                <path
                  d="M 251 344
                     C 235 358, 212 375, 198 388
                     C 195 391, 196 396, 200 396
                     L 254 378 Z"
                  fill="url(#agvLiquidWingLeftGrad)"
                />
                <path
                  d="M 265 344
                     C 281 358, 304 375, 318 388
                     C 321 391, 320 396, 316 396
                     L 262 378 Z"
                  fill="url(#agvLiquidWingRightGrad)"
                />

                <ellipse cx="258" cy="218" rx="16.5" ry="48" fill="#E2E8F0" opacity="0.6" />

                <path
                  d="M 258 88
                     C 265 88, 272 116, 273 158
                     L 273 294
                     C 273 338, 265 378, 258 402
                     C 251 378, 243 338, 243 294
                     L 243 158
                     C 244 116, 251 88, 258 88 Z"
                  fill="url(#agvLiquidFuselageGrad)"
                />

                <path
                  d="M 258 98
                     C 262 98, 265 120, 265 154
                     C 265 182, 262.5 204, 261.5 225
                     L 261.5 310
                     C 261.5 342, 260 368, 258 384
                     C 256 368, 254.5 342, 254.5 310
                     L 254.5 225
                     C 253.5 204, 251 182, 251 154
                     C 251 120, 254 98, 258 98 Z"
                  fill="#FFFFFF"
                  opacity="0.72"
                />

                <path
                  d="M 249.5 114
                     C 253.5 107.5, 262.5 107.5, 266.5 114
                     L 268.2 121.5
                     C 263 116.5, 253 116.5, 247.8 121.5 Z"
                  fill="#0F172A"
                />

                <path
                  d="M 258 334
                     C 260.4 348, 261.6 370, 261 394
                     L 258 403
                     L 255 394
                     C 254.4 370, 255.6 348, 258 334 Z"
                  fill="url(#agvLiquidTailFinGrad)"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
});

LiquidGlassBackdrop.displayName = 'LiquidGlassBackdrop';
