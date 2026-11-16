import React from 'react';

export interface MorphCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: number;
  className?: string;
  spring?: 'bouncy' | 'snappy' | 'smooth';
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

type CheckboxVisualState = 'unchecked' | 'checked' | 'indeterminate';

export const MorphCheckbox: React.FC<MorphCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  onClick,
  size = 16,
  className = '',
  disabled = false,
  title,
  style,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isSelected = checked && !indeterminate;
  const visualState: CheckboxVisualState = indeterminate
    ? 'indeterminate'
    : isSelected
    ? 'checked'
    : 'unchecked';

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const visualBoxSize = size === 16 ? 18 : Math.max(14, size);
  const hitTargetSize = Math.max(28, visualBoxSize);
  const boxRadius = Math.max(4, Math.round(visualBoxSize * 0.25));
  const svgWidth = +(visualBoxSize * 0.58).toFixed(1);
  const svgHeight = +(svgWidth * (10 / 13)).toFixed(1);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <div
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
      aria-checked={indeterminate ? 'mixed' : isSelected}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={title}
      className={`agv-morph-checkbox relative inline-flex items-center justify-center border-none bg-transparent p-0 select-none outline-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
      style={{
        minWidth: `${hitTargetSize}px`,
        minHeight: `${hitTargetSize}px`,
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={isSelected}
        disabled={disabled}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        className="pointer-events-none absolute m-0 h-0 w-0 opacity-0"
      />
      <span
        data-cb="check-box"
        data-state={visualState}
        className="agv-cb-morph-box relative inline-flex shrink-0 items-center justify-center box-border"
        style={{
          width: `${visualBoxSize}px`,
          height: `${visualBoxSize}px`,
          borderRadius: `${boxRadius}px`,
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 13 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 1.5 5 L 5 8.5 L 11.5 1.5"
            pathLength={1}
            className="agv-cb-check-path"
          />
          <path
            d="M 2.5 5 L 10.5 5"
            pathLength={1}
            className="agv-cb-indeterminate-path"
          />
        </svg>
      </span>
    </div>
  );
};
