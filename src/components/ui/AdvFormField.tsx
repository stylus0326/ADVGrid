import React, { createContext, useContext, useId, useLayoutEffect, useRef, useState } from 'react';
import { SurfaceTheme } from '../grid/types';

export type FormFieldLabelPosition = 'top' | 'border';

const FormFieldLabelPositionContext = createContext<FormFieldLabelPosition | undefined>(undefined);

export interface AdvFormFieldOverlayScopeProps {
  labelPosition?: FormFieldLabelPosition;
  children: React.ReactNode;
}

export function AdvFormFieldOverlayScope({
  labelPosition = 'border',
  children,
}: AdvFormFieldOverlayScopeProps) {
  return (
    <FormFieldLabelPositionContext.Provider value={labelPosition}>
      {children}
    </FormFieldLabelPositionContext.Provider>
  );
}

export interface AdvFormFieldProps {
  label: string;
  labelPosition?: FormFieldLabelPosition;
  required?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  labelBackground?: string;
  theme?: SurfaceTheme;
  className?: string;
  labelClassName?: string;
  children: React.ReactElement<any>;
}

function mergeIdRefs(...values: Array<string | undefined>): string | undefined {
  const parts = values.flatMap((v) => (v ? v.split(/\s+/).filter(Boolean) : []));
  return parts.length > 0 ? Array.from(new Set(parts)).join(' ') : undefined;
}

/**
 * Wrapper nhãn trường nhập liệu hỗ trợ nhãn phía trên (`top`) hoặc cắt ngang viền trên (`border`).
 */
export const AdvFormField: React.FC<AdvFormFieldProps> = ({
  label,
  labelPosition: explicitLabelPosition,
  required = false,
  error,
  hint,
  htmlFor,
  labelBackground,
  theme,
  className = '',
  labelClassName = '',
  children,
}) => {
  const scopedPosition = useContext(FormFieldLabelPositionContext);
  const labelPosition = explicitLabelPosition ?? scopedPosition ?? 'top';
  const generatedId = useId();
  const isChildElement = React.isValidElement<Record<string, any>>(children);
  const childProps: Record<string, any> = isChildElement ? children.props : {};

  const controlId = htmlFor || childProps.id || `${generatedId}-control`;
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const hasError = Boolean(error);
  const errorId = hasError ? `${generatedId}-error` : undefined;
  const describedBy = mergeIdRefs(childProps['aria-describedby'], hintId, errorId);
  const isInvalid = Boolean(hasError || childProps['aria-invalid'] || childProps.invalid);

  const enhancedChild = isChildElement
    ? React.cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-errormessage': mergeIdRefs(childProps['aria-errormessage'], errorId),
        'aria-invalid': isInvalid || undefined,
        ...(typeof children.type === 'string' && required
          ? { required: childProps.required ?? true }
          : {}),
      })
    : children;

  const isBorderLabel = labelPosition === 'border';
  const borderLabelRef = useRef<HTMLLabelElement>(null);
  const [notchWidth, setNotchWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (!isBorderLabel) {
      setNotchWidth(0);
      return;
    }
    const el = borderLabelRef.current;
    if (!el) return;

    const measure = () => {
      const nextWidth = Math.ceil(el.getBoundingClientRect().width);
      setNotchWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [isBorderLabel, label, required]);

  const hasNotch = isBorderLabel && notchWidth > 0;
  const borderScopeStyle: React.CSSProperties | undefined = isBorderLabel
    ? ({
        ...(labelBackground ? { '--form-field-label-background': labelBackground } : {}),
        ...(hasNotch ? { '--agv-notch-w': `${notchWidth}px` } : {}),
      } as React.CSSProperties)
    : undefined;

  const labelElement = (
    <label
      ref={isBorderLabel ? borderLabelRef : undefined}
      htmlFor={controlId}
      className={[
        'text-xs leading-4 font-medium select-none flex items-center gap-1 min-w-0',
        isBorderLabel
          ? 'agv-field-label absolute top-2 left-3 z-20 max-w-[calc(100%-24px)] -translate-y-1/2 bg-control-surface px-1 transition-colors'
          : '',
        isInvalid
          ? 'text-[var(--destructive)]'
          : isBorderLabel
          ? 'text-[var(--agv-text-main)]'
          : 'text-[var(--agv-text-muted)]',
        labelClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="min-w-0 truncate">{label}</span>
      {required ? (
        <span className="shrink-0 text-[var(--destructive)]" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );

  return (
    <div
      data-theme={theme || undefined}
      data-label-position={labelPosition}
      className={`min-w-0 space-y-1 ${className}`.trim()}
    >
      {isBorderLabel ? (
        <div
          style={borderScopeStyle}
          data-invalid={isInvalid ? 'true' : undefined}
          data-notch-ready={hasNotch ? 'true' : undefined}
          className="agv-field-border group/field relative min-w-0 pt-2"
        >
          {labelElement}
          {enhancedChild}
          <span aria-hidden="true" className="agv-field-notch-frame" />
        </div>
      ) : (
        <>
          {labelElement}
          {enhancedChild}
        </>
      )}

      {hint ? (
        <p id={hintId} className="text-xs leading-4 text-[var(--agv-text-muted)]">
          {hint}
        </p>
      ) : null}

      {hasError ? (
        <div
          id={errorId}
          role="alert"
          className="text-xs leading-4 text-[var(--destructive)]"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};

/** Alias tương thích với cấu trúc đặt tên b2b-pnt */
export const FormField = AdvFormField;
