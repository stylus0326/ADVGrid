import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import {
  DATA_TYPES,
  PIN_POSITIONS,
  SURFACE_THEMES,
  type SurfaceTheme,
} from '../components/grid/types';
import type { GridColumnDef } from '../components/grid/columns';
import { DataGrid } from '../components/grid/DataGrid';
import {
  AdvDatePicker,
  AdvDateRangePicker,
  formatDateToYMD,
  formatDisplayDate,
  getPresetLabel,
} from '../components/ui/AdvDatePicker';
import { AdvFormField, type FormFieldLabelPosition } from '../components/ui/AdvFormField';
import { AdvHoverCard } from '../components/ui/AdvHoverCard';
import { AdvInput } from '../components/ui/AdvInput';
import { AdvPopover } from '../components/ui/AdvPopover';
import { AdvSelect } from '../components/ui/AdvSelect';
import { AdvComboBoxEdit } from '../components/ui/AdvComboBoxEdit';
import { AdvSearchLookUpEdit } from '../components/ui/AdvSearchLookUpEdit';
import { AdvTooltip } from '../components/ui/AdvTooltip';
import { MorphCheckbox } from '../components/ui/MorphCheckbox';
import { AdvButton } from '../components/ui/AdvButton';
import { type ControlVariant } from '../components/ui/controlFocus';
import { GridTableV2FeaturesDemo } from './GridTableV2FeaturesDemo';

export interface UiPrimitivesPageProps {
  surfaceTheme: SurfaceTheme;
}

type DatePickerDemoMode = 'single' | 'range';
type DatePickerDemoSize = 'sm' | 'md';

const REGION_OPTIONS = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];
const AIRLINE_OPTIONS = [
  'Vietnam Airlines',
  'VietJet Air',
  'Bamboo Airways',
  'Pacific Airlines',
];
const FIELD_COUNTRY_ROWS = [
  { code: 'VN', name: 'Việt Nam', group: 'Đông Nam Á' },
  { code: 'JP', name: 'Nhật Bản', group: 'Đông Á' },
  { code: 'KR', name: 'Hàn Quốc', group: 'Đông Á' },
  { code: 'US', name: 'Hoa Kỳ', group: 'Bắc Mỹ' },
];
const FIELD_COUNTRY_COLS = [
  { key: 'code', title: 'Mã', width: 72 },
  { key: 'name', title: 'Tên quốc gia', width: 180 },
  { key: 'group', title: 'Khu vực', width: 132 },
];
const VARIANT_OPTIONS: Array<{ value: ControlVariant; label: string }> = [
  { value: 'auth', label: 'Auth 48px' },
  { value: 'default', label: 'Chuẩn 36px' },
];
const LABEL_POS_OPTIONS: Array<{ value: FormFieldLabelPosition; label: string }> = [
  { value: 'border', label: 'Cắt viền' },
  { value: 'top', label: 'Nhãn trên' },
];

const MODE_OPTIONS: Array<{ value: DatePickerDemoMode; label: string }> = [
  { value: 'single', label: 'Một ngày' },
  { value: 'range', label: 'Dải ngày' },
];

const SIZE_OPTIONS: Array<{ value: DatePickerDemoSize; label: string }> = [
  { value: 'sm', label: 'Nhỏ' },
  { value: 'md', label: 'Vừa' },
];

interface DemoCardProps {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}

const DemoCard: React.FC<DemoCardProps> = ({
  title,
  description,
  className = '',
  children,
}) => (
  <section
    className={`agv-demo-card rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card)] p-4 flex flex-col gap-3 ${className}`.trim()}
  >
    <div className="space-y-1">
      <h2 className="text-sm font-semibold text-[var(--agv-text-main)]">{title}</h2>
      <p className="text-xs text-[var(--agv-text-muted)] leading-relaxed">{description}</p>
    </div>
    <div className="pt-1 w-full flex flex-col items-start gap-2.5">{children}</div>
  </section>
);

interface SegmentedToggleProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

/**
 * Thanh chọn phân đoạn chuẩn chiều cao tối thiểu 28px và màu nhấn theo theme.
 */
function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedToggleProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--agv-text-muted)]">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="grid grid-cols-2 rounded border border-[var(--agv-border)] overflow-hidden"
      >
        {options.map((opt, idx) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(opt.value)}
              className={`h-7 min-h-[28px] px-3 text-xs font-medium cursor-pointer transition-colors ${
                idx > 0 ? 'border-l' : ''
              }`}
              style={{
                borderColor: idx > 0 ? 'var(--agv-border)' : undefined,
                backgroundColor: isActive ? 'var(--agv-accent)' : 'var(--agv-bg-card)',
                color: isActive ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface OptionToggleRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

/**
 * Dòng tùy chọn bật/tắt dùng MorphCheckbox đồng nhất chiều cao 28px trên lưới 4px.
 */
const OptionToggleRow: React.FC<OptionToggleRowProps> = ({ label, checked, onToggle }) => (
  <div
    role="presentation"
    onClick={onToggle}
    className="h-7 min-h-[28px] flex items-center gap-2 cursor-pointer select-none"
  >
    <MorphCheckbox checked={checked} size={16} spring="snappy" />
    <span className="text-xs text-[var(--agv-text-main)]">{label}</span>
  </div>
);

export const UiPrimitivesPage: React.FC<UiPrimitivesPageProps> = ({ surfaceTheme }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Miền Bắc');

  // State thử nghiệm Trường nhập nhãn cắt viền (Border-Label Inputs)
  const [fieldVariant, setFieldVariant] = useState<ControlVariant>('auth');
  const [fieldLabelPos, setFieldLabelPos] = useState<FormFieldLabelPosition>('border');
  const [simulateFieldError, setSimulateFieldError] = useState<boolean>(false);
  const [usernameVal, setUsernameVal] = useState<string>('tttt');
  const [passwordVal, setPasswordVal] = useState<string>('123456');
  const [showFieldPassword, setShowFieldPassword] = useState<boolean>(false);
  const [fieldRegion, setFieldRegion] = useState<string>('Miền Nam');
  const [fieldAirline, setFieldAirline] = useState<string>('Vietnam Airlines');
  const [fieldCountry, setFieldCountry] = useState<string>('VN');
  const [fieldDate, setFieldDate] = useState<string>('2026-11-16');
  const [fieldRange, setFieldRange] = useState<{ from: string; to: string; preset: string }>({
    from: '2026-11-01',
    to: '2026-11-16',
    preset: '',
  });
  const [fieldNote, setFieldNote] = useState<string>('Phương Nam Travel');

  // Dữ liệu 10.000 mục thử nghiệm ảo hóa danh sách và thanh cuộn nổi
  const largeSelectOptions = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => {
        const num = String(i + 1).padStart(5, '0');
        return {
          value: `item-${num}`,
          label: `Mục #${num} - Tùy chọn dữ liệu mẫu`,
        };
      }),
    []
  );

  const largeLookupRows = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => {
        const num = String(i + 1).padStart(5, '0');
        return {
          code: `MA-${num}`,
          name: `Mục dữ liệu #${num}`,
          group: ['Khối Vận hành', 'Khối Kinh doanh', 'Khối Kỹ thuật', 'Khối Tài chính'][i % 4],
        };
      }),
    []
  );

  const largeLookupColumns = useMemo(
    () => [
      { key: 'code', title: 'Mã', width: 100 },
      { key: 'name', title: 'Tên danh mục', width: 220 },
      { key: 'group', title: 'Nhóm', width: 140 },
    ],
    []
  );

  const [largeSelectVal, setLargeSelectVal] = useState<string>('item-00001');
  const [largeComboVal, setLargeComboVal] = useState<string>('item-00001');
  const [largeLookupVal, setLargeLookupVal] = useState<string>('MA-00001');

  const largeSelectDisplay = useMemo(
    () => largeSelectOptions.find((o) => o.value === largeSelectVal)?.label || '(Chưa chọn)',
    [largeSelectOptions, largeSelectVal]
  );

  const largeComboDisplay = useMemo(
    () =>
      largeSelectOptions.find((o) => o.value === largeComboVal)?.label ||
      largeComboVal ||
      '(Chưa chọn)',
    [largeSelectOptions, largeComboVal]
  );

  const largeLookupDisplay = useMemo(() => {
    const matched = largeLookupRows.find((r) => r.code === largeLookupVal);
    return matched ? `${matched.code} - ${matched.name}` : '(Chưa chọn)';
  }, [largeLookupRows, largeLookupVal]);

  // Thử nghiệm DataGrid 10.000 dòng: Row-level virtualization + Thanh cuộn nổi + Dòng cao động PC
  const [gridDynamicHeight, setGridDynamicHeight] = useState<boolean>(true);
  const [gridScrollbarAlwaysOn, setGridScrollbarAlwaysOn] = useState<boolean>(false);

  const largeGridRows = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => {
        const num = String(i + 1).padStart(5, '0');
        const variant = i % 4;
        const note =
          variant === 0
            ? 'Ghi chú ngắn 1 dòng.'
            : variant === 1
            ? 'Mô tả 2 dòng có nội dung tự động xuống dòng theo độ rộng cột đang kéo trên PC.'
            : variant === 2
            ? 'Thông tin chi tiết nhiều dòng để kiểm chứng các cột ghim trái, ghim phải và nội dung giữa tự giãn bằng nhau đồng bộ trên lưới 4px khi cuộn nhanh qua 10.000 dòng.'
            : 'Kiểm tra cuộn mượt và bù neo chống giật.';
        return {
          id: `row_${i + 1}`,
          code: `DH-${num}`,
          title: `Đơn hàng vận hành #${num}`,
          note,
          group: ['Vận hành', 'Kinh doanh', 'Kỹ thuật', 'Tài chính'][i % 4],
          owner: ['Nguyễn Minh Anh', 'Trần Quốc Bảo', 'Lê Thu Hà', 'Phạm Đức Mạnh'][i % 4],
          region: REGION_OPTIONS[i % 3],
          amount: (i + 1) * 125000 + (i % 7) * 45000,
          status: i % 5 === 0 ? 'Chờ duyệt' : i % 3 === 0 ? 'Đang xử lý' : 'Hoàn tất',
        };
      }),
    []
  );

  const largeGridColumns = useMemo<GridColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã đơn',
        size: 112,
        pinned: PIN_POSITIONS.LEFT,
      },
      {
        accessorKey: 'title',
        header: 'Tiêu đề',
        size: 196,
      },
      {
        accessorKey: 'note',
        header: 'Ghi chú (xuống dòng)',
        size: 260,
        wrapText: true,
      },
      {
        accessorKey: 'group',
        header: 'Bộ phận',
        size: 140,
      },
      {
        accessorKey: 'owner',
        header: 'Phụ trách',
        size: 160,
      },
      {
        accessorKey: 'region',
        header: 'Khu vực',
        size: 140,
      },
      {
        accessorKey: 'amount',
        header: 'Giá trị (VND)',
        size: 150,
        pinned: PIN_POSITIONS.RIGHT,
        meta: {
          dataType: DATA_TYPES.NUMBER,
          align: 'right',
        },
      },
    ],
    []
  );

  // Trạng thái thử nghiệm Bộ chọn ngày & giờ
  const [pickerMode, setPickerMode] = useState<DatePickerDemoMode>('single');
  const [pickerSize, setPickerSize] = useState<DatePickerDemoSize>('md');
  const [showTime, setShowTime] = useState<boolean>(true);
  const [showPreset, setShowPreset] = useState<boolean>(true);
  const [allowClear, setAllowClear] = useState<boolean>(true);
  const [hasBounds, setHasBounds] = useState<boolean>(false);
  const [showCalendarIcon, setShowCalendarIcon] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [dualMonth, setDualMonth] = useState<boolean>(true);

  const monthBounds = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      min: formatDateToYMD(firstDay, false),
      max: formatDateToYMD(lastDay, false),
      initialSingle: formatDateToYMD(now, true),
      initialFrom: `${formatDateToYMD(now, false)} 08:00`,
      initialTo: `${formatDateToYMD(now, false)} 17:30`,
    };
  }, []);

  const [singleValue, setSingleValue] = useState<string>(() => monthBounds.initialSingle);
  const [rangeValue, setRangeValue] = useState<{ from: string; to: string; preset: string }>(
    () => ({
      from: monthBounds.initialFrom,
      to: monthBounds.initialTo,
      preset: '',
    })
  );

  const featureItems = useMemo(() => {
    const common = [
      { key: 'showTime', label: 'Chọn giờ', checked: showTime, onToggle: () => setShowTime((v) => !v) },
      { key: 'allowClear', label: 'Nút xóa', checked: allowClear, onToggle: () => setAllowClear((v) => !v) },
      { key: 'hasBounds', label: 'Giới hạn', checked: hasBounds, onToggle: () => setHasBounds((v) => !v) },
    ];
    if (pickerMode === 'single') {
      return [
        ...common,
        {
          key: 'showCalendarIcon',
          label: 'Icon lịch',
          checked: showCalendarIcon,
          onToggle: () => setShowCalendarIcon((v) => !v),
        },
        {
          key: 'disabled',
          label: 'Khóa nhập',
          checked: disabled,
          onToggle: () => setDisabled((v) => !v),
        },
      ];
    }
    return [
      common[0],
      { key: 'showPreset', label: 'Mốc thời gian', checked: showPreset, onToggle: () => setShowPreset((v) => !v) },
      ...common.slice(1),
      {
        key: 'dualMonth',
        label: 'Lịch đôi',
        checked: dualMonth,
        onToggle: () => setDualMonth((v) => !v),
      },
    ];
  }, [pickerMode, showTime, showPreset, allowClear, hasBounds, showCalendarIcon, disabled, dualMonth]);

  const effectiveMin = hasBounds ? monthBounds.min : '';
  const effectiveMax = hasBounds ? monthBounds.max : '';

  const selectedSummary = useMemo(() => {
    if (pickerMode === 'single') {
      return singleValue ? formatDisplayDate(singleValue, false, showTime) : 'Chưa chọn';
    }
    if (!rangeValue.from && !rangeValue.to && !rangeValue.preset) {
      return 'Chưa chọn';
    }
    const formattedFrom = rangeValue.from
      ? formatDisplayDate(rangeValue.from, false, showTime)
      : '...';
    const formattedTo = rangeValue.to
      ? formatDisplayDate(rangeValue.to, false, showTime)
      : '...';
    const rangeText = `${formattedFrom} – ${formattedTo}`;
    return rangeValue.preset ? `${getPresetLabel(rangeValue.preset)} (${rangeText})` : rangeText;
  }, [pickerMode, singleValue, rangeValue, showTime]);

  const handleResetDateDemo = () => {
    if (pickerMode === 'single') {
      setSingleValue('');
      return;
    }
    setRangeValue({ from: '', to: '', preset: '' });
  };

  return (
    <div className="agv-ui-page-scroll h-full w-full overflow-y-auto bg-[var(--agv-bg-card)] text-[var(--agv-text-main)]">
      <div className="p-4 sm:p-5 space-y-4">
        <header className="pb-3 border-b border-[var(--agv-border)] space-y-1">
          <h1 className="text-base font-semibold text-[var(--agv-text-main)]">
            Thử nghiệm thành phần giao diện
          </h1>
          <p className="text-xs text-[var(--agv-text-muted)]">
            Kiểm tra hoạt động trực tiếp của các thành phần giao diện dùng chung theo chế độ Sáng/Tối.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DemoCard
            title="Trường nhập nhãn cắt viền (Border-Label Inputs — đồng bộ b2b-pnt)"
            description="Thử nghiệm AdvFormField kết hợp AdvInput và toàn bộ control chọn/ngày sẵn có ở 2 dáng Auth (48px) và Chuẩn (36px) đồng bộ bo 8px, cùng trạng thái Focus & Lỗi theo theme Sáng/Tối."
            className="md:col-span-2"
          >
            <div className="flex flex-wrap items-end gap-4 w-full">
              <SegmentedToggle
                label="Kiểu dáng control"
                value={fieldVariant}
                options={VARIANT_OPTIONS}
                onChange={setFieldVariant}
              />
              <SegmentedToggle
                label="Vị trí nhãn"
                value={fieldLabelPos}
                options={LABEL_POS_OPTIONS}
                onChange={setFieldLabelPos}
              />
              <OptionToggleRow
                label="Mô phỏng trạng thái lỗi"
                checked={simulateFieldError}
                onToggle={() => setSimulateFieldError((v) => !v)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <AdvFormField
                label="Tên đăng nhập/email"
                labelPosition={fieldLabelPos}
                required
                theme={surfaceTheme}
                error={simulateFieldError ? 'Vui lòng nhập tên đăng nhập.' : undefined}
              >
                <AdvInput
                  value={usernameVal}
                  onChange={(e) => setUsernameVal(e.target.value)}
                  placeholder="Nhập tài khoản hoặc email..."
                  variant={fieldVariant}
                  size="md"
                  leadingIcon={<User className="size-4" />}
                />
              </AdvFormField>

              <AdvFormField
                label="Mật khẩu"
                labelPosition={fieldLabelPos}
                required
                theme={surfaceTheme}
                error={simulateFieldError ? 'Mật khẩu chưa đúng định dạng.' : undefined}
              >
                <AdvInput
                  type={showFieldPassword ? 'text' : 'password'}
                  value={passwordVal}
                  onChange={(e) => setPasswordVal(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  variant={fieldVariant}
                  size="md"
                  leadingIcon={<Lock className="size-4" />}
                  endAdornment={
                    <AdvButton
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowFieldPassword((v) => !v)}
                      aria-label={showFieldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showFieldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </AdvButton>
                  }
                />
              </AdvFormField>

              <AdvFormField
                label="Tên công ty (không icon)"
                labelPosition={fieldLabelPos}
                theme={surfaceTheme}
                error={simulateFieldError ? 'Không được để trống tên công ty.' : undefined}
              >
                <AdvInput
                  value={fieldNote}
                  onChange={(e) => setFieldNote(e.target.value)}
                  placeholder="Nhập tên công ty..."
                  variant={fieldVariant}
                  size="md"
                />
              </AdvFormField>

              <AdvFormField
                label="Khu vực (AdvSelect)"
                labelPosition={fieldLabelPos}
                required
                theme={surfaceTheme}
                error={simulateFieldError ? 'Vui lòng chọn khu vực.' : undefined}
              >
                <AdvSelect
                  value={fieldRegion}
                  onChange={setFieldRegion}
                  options={REGION_OPTIONS}
                  placeholder="Chọn khu vực..."
                  variant={fieldVariant}
                  size="md"
                  theme={surfaceTheme}
                  width="100%"
                />
              </AdvFormField>

              <AdvFormField
                label="Hãng bay (AdvComboBoxEdit)"
                labelPosition={fieldLabelPos}
                theme={surfaceTheme}
                error={simulateFieldError ? 'Hãng bay không hợp lệ.' : undefined}
              >
                <AdvComboBoxEdit
                  value={fieldAirline}
                  onChange={setFieldAirline}
                  options={AIRLINE_OPTIONS}
                  placeholder="Chọn hoặc nhập hãng..."
                  variant={fieldVariant}
                  size="md"
                  theme={surfaceTheme}
                />
              </AdvFormField>

              <AdvFormField
                label="Quốc gia (AdvSearchLookUpEdit)"
                labelPosition={fieldLabelPos}
                theme={surfaceTheme}
                error={simulateFieldError ? 'Chưa chọn quốc gia.' : undefined}
              >
                <AdvSearchLookUpEdit
                  value={fieldCountry}
                  onChange={(val) => setFieldCountry(val ?? '')}
                  dataSource={FIELD_COUNTRY_ROWS}
                  valueMember="code"
                  displayMember="name"
                  columns={FIELD_COUNTRY_COLS}
                  searchFields={['code', 'name', 'group']}
                  placeholder="Tìm kiếm quốc gia..."
                  variant={fieldVariant}
                  size="md"
                  theme={surfaceTheme}
                />
              </AdvFormField>

              <AdvFormField
                label="Ngày khởi hành (AdvDatePicker)"
                labelPosition={fieldLabelPos}
                required
                theme={surfaceTheme}
                error={simulateFieldError ? 'Ngày khởi hành không hợp lệ.' : undefined}
              >
                <AdvDatePicker
                  value={fieldDate}
                  onChange={(val) => setFieldDate(val)}
                  variant={fieldVariant}
                  size="md"
                  theme={surfaceTheme}
                />
              </AdvFormField>

              <AdvFormField
                label="Khoảng thời gian (AdvDateRangePicker)"
                labelPosition={fieldLabelPos}
                theme={surfaceTheme}
                className="md:col-span-2 lg:col-span-2"
                error={simulateFieldError ? 'Vui lòng chọn khoảng ngày hợp lệ.' : undefined}
              >
                <AdvDateRangePicker
                  from={fieldRange.from}
                  to={fieldRange.to}
                  preset={fieldRange.preset}
                  onChange={(next) =>
                    setFieldRange({
                      from: next.from || '',
                      to: next.to || '',
                      preset: next.preset || '',
                    })
                  }
                  variant={fieldVariant}
                  size="md"
                  theme={surfaceTheme}
                />
              </AdvFormField>
            </div>
          </DemoCard>

          <DemoCard
            title="Hộp thoại nổi"
            description="Nhấn nút để mở khung nổi và kiểm tra tự đóng khi nhấn ra ngoài."
          >
            <AdvPopover
              theme={surfaceTheme}
              width={280}
              trigger={
                <AdvButton variant="outline" size="sm">
                  Mở hộp thoại nổi
                </AdvButton>
              }
              content={({ close }) => (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-[var(--agv-text-main)]">
                      Chọn khu vực
                    </div>
                    <AdvSelect
                      options={REGION_OPTIONS}
                      value={selectedRegion}
                      onChange={setSelectedRegion}
                      theme={surfaceTheme}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <AdvButton variant="outline" size="sm" onClick={close}>
                      Đóng
                    </AdvButton>
                  </div>
                </div>
              )}
            />
          </DemoCard>

          <DemoCard
            title="Thẻ thông tin khi rê chuột"
            description="Rê chuột vào mục bên dưới để mở thẻ thông tin chi tiết."
          >
            <AdvHoverCard
              theme={surfaceTheme}
              width={260}
              trigger={
                <AdvButton variant="outline" size="sm">
                  Đại lý Phương Nam Travel
                </AdvButton>
              }
              content={
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[var(--agv-text-main)]">
                    Đại lý Phương Nam Travel
                  </div>
                  <div className="text-[var(--agv-text-muted)]">
                    Khu vực: TP. Hồ Chí Minh
                  </div>
                  <div className="text-[var(--agv-text-muted)]">
                    Trạng thái: Đang hoạt động
                  </div>
                </div>
              }
            />
          </DemoCard>

          <DemoCard
            title="Chú thích nổi"
            description="Rê chuột vào từng nút để kiểm tra chú thích hiển thị phía trên và phía dưới."
          >
            <AdvTooltip
              placement="top"
              content="Chú thích hiển thị phía trên"
              theme={surfaceTheme}
            >
              <AdvButton variant="outline" size="sm">
                Chú thích phía trên
              </AdvButton>
            </AdvTooltip>
            <AdvTooltip
              placement="bottom"
              content="Chú thích hiển thị phía dưới"
              theme={surfaceTheme}
            >
              <AdvButton variant="outline" size="sm">
                Chú thích phía dưới
              </AdvButton>
            </AdvTooltip>
          </DemoCard>

          <DemoCard
            className="md:col-span-2"
            title="Bộ chọn ngày & giờ"
            description="Tùy chỉnh các tùy chọn hiển thị và kiểm tra chọn ngày/giờ trực tiếp."
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-root)] p-3 flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-[var(--agv-text-main)]">
                  Tùy chọn cấu hình
                </h3>

                <SegmentedToggle
                  label="Kiểu chọn"
                  value={pickerMode}
                  options={MODE_OPTIONS}
                  onChange={setPickerMode}
                />

                <SegmentedToggle
                  label="Kích thước"
                  value={pickerSize}
                  options={SIZE_OPTIONS}
                  onChange={setPickerSize}
                />

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--agv-text-muted)]">
                    Tính năng
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {featureItems.map((item) => (
                      <OptionToggleRow
                        key={item.key}
                        label={item.label}
                        checked={item.checked}
                        onToggle={item.onToggle}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-root)] p-3 flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-[var(--agv-text-main)]">
                  Khu vực thử nghiệm
                </h3>

                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs font-medium text-[var(--agv-text-muted)]">
                    {showTime ? 'Ngày & giờ' : 'Ngày'}
                  </span>
                  {pickerMode === 'single' ? (
                    <AdvDatePicker
                      value={singleValue}
                      onChange={(val) => setSingleValue(val)}
                      min={effectiveMin}
                      max={effectiveMax}
                      placeholder={showTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'}
                      disabled={disabled}
                      theme={surfaceTheme}
                      size={pickerSize}
                      showPreset={false}
                      showTime={showTime}
                      showCalendarIcon={showCalendarIcon}
                      allowClear={allowClear}
                    />
                  ) : (
                    <AdvDateRangePicker
                      from={rangeValue.from}
                      to={rangeValue.to}
                      preset={rangeValue.preset}
                      onChange={(next) =>
                        setRangeValue({
                          from: next.from || '',
                          to: next.to || '',
                          preset: next.preset || '',
                        })
                      }
                      min={effectiveMin}
                      max={effectiveMax}
                      theme={surfaceTheme}
                      size={pickerSize}
                      showPreset={showPreset}
                      dualMonth={dualMonth}
                      showTime={showTime}
                      allowClear={allowClear}
                    />
                  )}
                </div>

                <div className="mt-auto rounded border border-[var(--agv-border)] bg-[var(--agv-bg-card)] p-3 flex flex-col gap-2">
                  <div className="text-xs text-[var(--agv-text-main)]">
                    Đang chọn:{' '}
                    <span className="font-semibold tabular-nums">{selectedSummary}</span>
                  </div>
                  <div className="flex justify-end">
                    <AdvButton
                      variant="outline"
                      size="sm"
                      onClick={handleResetDateDemo}
                    >
                      Đặt lại
                    </AdvButton>
                  </div>
                </div>
              </div>
            </div>
          </DemoCard>

          <DemoCard
            title="Danh sách dữ liệu lớn (10.000 mục)"
            description="Kiểm tra hiệu năng ảo hóa danh sách và thanh cuộn nổi chỉ hiện khi rê chuột."
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col gap-2 min-w-0">
                <span className="text-xs leading-4 font-medium text-[var(--agv-text-muted)]">
                  Select (10.000 mục)
                </span>
                <AdvSelect
                  value={largeSelectVal}
                  onChange={setLargeSelectVal}
                  options={largeSelectOptions}
                  placeholder="Chọn một mục..."
                  theme={surfaceTheme}
                  size="sm"
                  width="100%"
                />
                <span className="text-xs leading-4 text-[var(--agv-text-muted)] truncate">
                  Đang chọn:{' '}
                  <strong className="text-[var(--agv-text-main)]">{largeSelectDisplay}</strong>
                </span>
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <span className="text-xs leading-4 font-medium text-[var(--agv-text-muted)]">
                  ComboBox (10.000 mục)
                </span>
                <AdvComboBoxEdit
                  value={largeComboVal}
                  onChange={setLargeComboVal}
                  options={largeSelectOptions}
                  placeholder="Nhập hoặc chọn..."
                  theme={surfaceTheme}
                  size="sm"
                  className="w-full"
                />
                <span className="text-xs leading-4 text-[var(--agv-text-muted)] truncate">
                  Đang chọn:{' '}
                  <strong className="text-[var(--agv-text-main)]">{largeComboDisplay}</strong>
                </span>
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <span className="text-xs leading-4 font-medium text-[var(--agv-text-muted)]">
                  LookUp nhiều cột (10.000)
                </span>
                <AdvSearchLookUpEdit
                  value={largeLookupVal}
                  onChange={(val) => setLargeLookupVal(val ?? '')}
                  dataSource={largeLookupRows}
                  valueMember="code"
                  displayMember="name"
                  columns={largeLookupColumns}
                  searchFields={['code', 'name', 'group']}
                  placeholder="Tìm kiếm hoặc chọn..."
                  theme={surfaceTheme}
                  size="sm"
                  showFilterRow={true}
                  className="w-full"
                />
                <span className="text-xs leading-4 text-[var(--agv-text-muted)] truncate">
                  Đang chọn:{' '}
                  <strong className="text-[var(--agv-text-main)]">{largeLookupDisplay}</strong>
                </span>
              </div>
            </div>
          </DemoCard>

          <DemoCard
            title="Bảng dữ liệu 10.000 dòng (Row-level, Thanh cuộn nổi, Dòng cao động PC)"
            description="Ảo hóa cố định ~28–32 thẻ dòng khi cuộn 10.000 dòng, thanh cuộn nổi chỉ hiện khi rê chuột/cuộn dưới tiêu đề cột và tự giãn dòng cột ghi chú."
            className="md:col-span-2"
          >
            <div className="flex flex-wrap items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setGridDynamicHeight((v) => !v)}
                className="h-7 min-h-[28px] px-3 rounded-md border text-xs leading-4 font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: gridDynamicHeight ? 'var(--agv-accent)' : 'var(--agv-bg-root)',
                  color: gridDynamicHeight ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
                  borderColor: gridDynamicHeight ? 'var(--agv-accent)' : 'var(--agv-border)',
                }}
              >
                Dòng cao động PC: {gridDynamicHeight ? 'Bật' : 'Tắt'}
              </button>
              <button
                type="button"
                onClick={() => setGridScrollbarAlwaysOn((v) => !v)}
                className="h-7 min-h-[28px] px-3 rounded-md border text-xs leading-4 font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: gridScrollbarAlwaysOn ? 'var(--agv-accent)' : 'var(--agv-bg-root)',
                  color: gridScrollbarAlwaysOn ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
                  borderColor: gridScrollbarAlwaysOn ? 'var(--agv-accent)' : 'var(--agv-border)',
                }}
              >
                Luôn hiện thanh cuộn: {gridScrollbarAlwaysOn ? 'Có' : 'Chỉ khi hover/cuộn'}
              </button>
            </div>

            <div
              className="w-full h-[360px] rounded-lg border overflow-hidden flex flex-col"
              style={{ borderColor: 'var(--agv-border)' }}
            >
              <DataGrid
                gridId="ui-test-large-grid-10k"
                rows={largeGridRows}
                columns={largeGridColumns}
                surfaceTheme={surfaceTheme || SURFACE_THEMES.LIGHT}
                pagination={false}
                enableStatusBar={false}
                enableFloatingToolbar={false}
                enableColumnResize={true}
                enableColumnPinning={true}
                dynamicRowHeight={gridDynamicHeight}
                scrollbarAlwaysOn={gridScrollbarAlwaysOn}
              />
            </div>
          </DemoCard>

          <DemoCard
            title="Tính năng nâng cao Table-V2 — Cross Hover, Cell Span, Tree Data & Detail View"
            description="4 module mở rộng theo Element Plus el-table-v2: CrossHoverModule, CellSpanModule (Colspan / Rowspan / Gộp 2×2), TreeDataModule và RowDetailModule"
            className="md:col-span-2"
          >
            <GridTableV2FeaturesDemo surfaceTheme={surfaceTheme || SURFACE_THEMES.LIGHT} />
          </DemoCard>
        </div>
      </div>
    </div>
  );
};
