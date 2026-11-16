import {
  type AuthUserInfo,
  type AuthSession,
  B2bApiError,
  subscribeAuthSession,
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  apiCall,
  loginAccount,
  verifyTwoFaCode,
  logoutAccount,
} from './b2bAuth';

export {
  type AuthUserInfo,
  type AuthSession,
  B2bApiError,
  subscribeAuthSession,
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  apiCall,
  loginAccount,
  verifyTwoFaCode,
  logoutAccount,
};

export interface NormalizedPage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CollectedResult<T> {
  items: T[];
  total: number;
  truncated: boolean;
}

export type CountryRow = {
  Id?: number | null;
  NameVi?: string | null;
  NameEn?: string | null;
  IsoAlpha2?: string | null;
  IsoAlpha3?: string | null;
  IsoNumeric?: number | null;
  ContinentCode?: string | null;
  RegionCode?: string | null;
  ContinentNameVi?: string | null;
  ContinentNameEn?: string | null;
  RegionNameVi?: string | null;
  RegionNameEn?: string | null;
};

export type GeographyName = {
  Code: string;
  NameVi: string;
  NameEn: string;
};

export type GeographyRegion = GeographyName & {
  ContinentCode: string;
};

export type GeographyCatalog = {
  Continents: GeographyName[];
  Regions: GeographyRegion[];
  Countries: {
    Id: number;
    IsoAlpha2: string;
    NameVi: string | null;
    NameEn: string | null;
    ContinentCode: string | null;
    RegionCode: string | null;
  }[];
};

export type CountryOption = {
  code: string;
  nameVi: string;
  nameEn: string;
};

export type AirportTerminalRule = {
  CarrierCode: string;
  TripScope: 'DOMESTIC' | 'INTERNATIONAL';
  Terminal: string;
  EffectiveFrom: string | null;
  EffectiveTo: string | null;
  IsActive: boolean;
};

export type AirportInfoRow = {
  TerminalRules?: AirportTerminalRule[];
  AirPortInfoId?: number | null;
  AirPortCode?: string | null;
  AirPortNameVi?: string | null;
  AirPortNameEn?: string | null;
  CityNameVi?: string | null;
  CityNameEn?: string | null;
  CountryCode?: string | null;
  GeoCountryId?: number | null;
  SortOrder?: number | null;
  IsActive?: boolean | null;
  IsInternational?: boolean | null;
  IsTopSearch?: boolean | null;
  ContinentCode?: string | null;
};

export type PartnerListStatus = 'all' | 'active' | 'inactive' | 'deleted';

export interface PartnerListItem {
  SalesUserId?: number | null;
  SalesUserCode?: string | null;
  SalesUserName?: string | null;
  DiscountPolicy?: string | null;
  CreditPolicy?: string | null;
  PartnerNote?: string | null;
  PartnerLogo?: string | null;
  PartnerId: number;
  PartnerKey?: string;
  PartnerCode?: string;
  ManagerUserCode?: string | null;
  PartnerName?: string;
  TradingName?: string;
  PartnerPhone?: string;
  PartnerEmail?: string;
  IsActive?: boolean;
  IsDelete?: boolean;
  IsUseCredit?: boolean;
  CreditSettingBalance?: number;
  CurrentBalance?: number;
  CreatedDate?: string;
  CreatedBy?: number | null;
  CreatedByCode?: string | null;
  CreatedByName?: string | null;
}

export type PartnerSalesUser = {
  UserId: number;
  UserCode: string;
  FullName: string | null;
};

// Core auth & HTTP fetch helpers moved to ./b2bAuth.ts and re-exported above.

export function normalizePaged<T>(raw: unknown): NormalizedPage<T> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new B2bApiError('Dữ liệu phân trang trả về không hợp lệ.');
  }
  const obj = raw as Record<string, unknown>;
  const pagination = (obj.pagination ?? {}) as Record<string, unknown>;
  const items = Array.isArray(obj.items) ? (obj.items as T[]) : null;
  const page = Number(pagination.page);
  const pageSize = Number(pagination.pageSize);
  const total = Number(pagination.totalItems);
  const totalPages = Number(pagination.totalPages);

  if (
    !items ||
    !Number.isInteger(page) ||
    !Number.isInteger(pageSize) ||
    !Number.isFinite(total) ||
    !Number.isFinite(totalPages)
  ) {
    throw new B2bApiError('Cấu trúc dữ liệu danh sách không đúng định dạng phân trang.');
  }

  return { items, total, page, pageSize, totalPages };
}

async function collectAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<NormalizedPage<T>>,
  options: { pageSize?: number; maxPages?: number; batchSize?: number } = {}
): Promise<CollectedResult<T>> {
  const pageSize = options.pageSize ?? 200;
  const maxPages = options.maxPages ?? 50;
  const batchSize = options.batchSize ?? 5;

  const first = await fetchPage(1, pageSize);
  if (first.items.length === 0 || first.totalPages <= 1) {
    return { items: first.items, total: first.total, truncated: false };
  }

  const limitPage = Math.min(maxPages, first.totalPages);
  const merged = [...first.items];

  for (let start = 2; start <= limitPage; start += batchSize) {
    const end = Math.min(limitPage, start + batchSize - 1);
    const pageNums: number[] = [];
    for (let p = start; p <= end; p++) pageNums.push(p);
    const results = await Promise.all(pageNums.map((p) => fetchPage(p, pageSize)));
    for (const res of results) {
      merged.push(...res.items);
    }
  }

  return {
    items: merged,
    total: Math.max(first.total, merged.length),
    truncated: first.totalPages > maxPages,
  };
}

// ==================== COUNTRIES API ====================

export function fetchGeographyDDL(signal?: AbortSignal): Promise<GeographyCatalog> {
  return apiCall<GeographyCatalog>('/api/DropDownList/GetGeographyDDL', {
    method: 'GET',
    signal,
  });
}

export interface CountrySearchFilters {
  search?: string;
  continent?: string;
  region?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchCountriesPage(
  filters: CountrySearchFilters,
  signal?: AbortSignal
): Promise<NormalizedPage<CountryRow>> {
  const raw = await apiCall<unknown>('/api/Country/SearchList', {
    method: 'POST',
    body: {
      ...(filters.search?.trim() ? { SearchText: filters.search.trim() } : {}),
      ...(filters.continent ? { ContinentCode: filters.continent } : {}),
      ...(filters.region ? { RegionCode: filters.region } : {}),
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 20,
    },
    signal,
  });
  return normalizePaged<CountryRow>(raw);
}

// ==================== AIRPORTS API ====================

export async function fetchCountryDDL(signal?: AbortSignal): Promise<CountryOption[]> {
  const raw = await apiCall<unknown>('/api/DropDownList/GetCountryDDL', {
    method: 'GET',
    signal,
  });
  const rows = Array.isArray(raw) ? raw : [];
  const map = new Map<string, CountryOption>();
  for (const item of rows) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const code = String(row.IsoAlpha2 ?? row.Code ?? row.code ?? '')
      .trim()
      .toUpperCase();
    if (code.length !== 2) continue;
    const nameVi = String(row.NameVi ?? row.Name ?? row.name ?? '').trim();
    const nameEn = String(row.NameEn ?? row.nameEn ?? '').trim() || nameVi;
    map.set(code, {
      code,
      nameVi: nameVi || nameEn || code,
      nameEn: nameEn || nameVi || code,
    });
  }
  return [...map.values()].sort((a, b) =>
    (a.nameVi || a.code).localeCompare(b.nameVi || b.code, 'vi')
  );
}

export interface AirportSearchFilters {
  search?: string;
  status?: '-1' | '0' | '1';
  country?: string;
  international?: '-1' | '0' | '1';
  topSearch?: '-1' | '0' | '1';
  continent?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchAirportsPage(
  filters: AirportSearchFilters,
  signal?: AbortSignal
): Promise<NormalizedPage<AirportInfoRow>> {
  const uniqueCountryCodes = [
    ...new Set(
      (filters.country ?? '')
        .split(',')
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];

  const fetchSingleCountryPage = async (
    countryCode: string | undefined,
    reqPage: number,
    reqPageSize: number
  ): Promise<NormalizedPage<AirportInfoRow>> => {
    const raw = await apiCall<unknown>('/api/AirPortInfo/SearchList', {
      method: 'POST',
      body: {
        IsActive: Number(filters.status ?? '-1'),
        ...(filters.search?.trim() ? { SearchText: filters.search.trim() } : {}),
        ...(countryCode ? { CountryCode: countryCode } : {}),
        ...(filters.international && filters.international !== '-1'
          ? { IsInternational: Number(filters.international) }
          : {}),
        ...(filters.topSearch && filters.topSearch !== '-1'
          ? { IsTopSearch: Number(filters.topSearch) }
          : {}),
        ...(filters.continent ? { ContinentCode: filters.continent } : {}),
        page: reqPage,
        pageSize: reqPageSize,
      },
      signal,
    });
    return normalizePaged<AirportInfoRow>(raw);
  };

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, filters.pageSize ?? 20);

  if (uniqueCountryCodes.length <= 1) {
    return fetchSingleCountryPage(uniqueCountryCodes[0], page, pageSize);
  }

  // Tạm thời bắn riêng từng request theo mỗi CountryCode song song cho tới khi API hỗ trợ lọc nhiều quốc gia
  const batchSize = 5;
  const collectedGroups: CollectedResult<AirportInfoRow>[] = [];
  for (let i = 0; i < uniqueCountryCodes.length; i += batchSize) {
    const chunk = uniqueCountryCodes.slice(i, i + batchSize);
    const chunkResults = await Promise.all(
      chunk.map((code) =>
        collectAllPages<AirportInfoRow>(
          (p, ps) => fetchSingleCountryPage(code, p, ps),
          { pageSize: 200, maxPages: 20, batchSize: 5 }
        )
      )
    );
    collectedGroups.push(...chunkResults);
  }

  const seenKeys = new Set<string>();
  const merged: AirportInfoRow[] = [];
  for (const group of collectedGroups) {
    for (const item of group.items) {
      const dedupeKey =
        item.AirPortInfoId != null
          ? `id:${item.AirPortInfoId}`
          : `${item.CountryCode ?? ''}:${item.AirPortCode ?? ''}`;
      if (!seenKeys.has(dedupeKey)) {
        seenKeys.add(dedupeKey);
        merged.push(item);
      }
    }
  }

  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;

  return {
    items: merged.slice(startIdx, startIdx + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function fetchAllAirports(
  filters: Omit<AirportSearchFilters, 'page' | 'pageSize'>,
  signal?: AbortSignal
): Promise<CollectedResult<AirportInfoRow>> {
  const uniqueCountryCodes = [
    ...new Set(
      (filters.country ?? '')
        .split(',')
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];

  if (uniqueCountryCodes.length <= 1) {
    return collectAllPages<AirportInfoRow>(
      (page, pageSize) =>
        fetchAirportsPage(
          {
            ...filters,
            country: uniqueCountryCodes[0] ?? '',
            page,
            pageSize,
          },
          signal
        ),
      { pageSize: 200, maxPages: 30, batchSize: 5 }
    );
  }

  const batchSize = 5;
  const collectedGroups: CollectedResult<AirportInfoRow>[] = [];
  for (let i = 0; i < uniqueCountryCodes.length; i += batchSize) {
    const chunk = uniqueCountryCodes.slice(i, i + batchSize);
    const chunkResults = await Promise.all(
      chunk.map((code) =>
        collectAllPages<AirportInfoRow>(
          (page, pageSize) =>
            fetchAirportsPage(
              {
                ...filters,
                country: code,
                page,
                pageSize,
              },
              signal
            ),
          { pageSize: 200, maxPages: 20, batchSize: 5 }
        )
      )
    );
    collectedGroups.push(...chunkResults);
  }

  const seenKeys = new Set<string>();
  const merged: AirportInfoRow[] = [];
  for (const group of collectedGroups) {
    for (const item of group.items) {
      const dedupeKey =
        item.AirPortInfoId != null
          ? `id:${item.AirPortInfoId}`
          : `${item.CountryCode ?? ''}:${item.AirPortCode ?? ''}`;
      if (!seenKeys.has(dedupeKey)) {
        seenKeys.add(dedupeKey);
        merged.push(item);
      }
    }
  }

  return {
    items: merged,
    total: merged.length,
    truncated: collectedGroups.some((group) => group.truncated),
  };
}

// ==================== PARTNERS API ====================

export function fetchPartnerSalesUsers(signal?: AbortSignal): Promise<PartnerSalesUser[]> {
  return apiCall<PartnerSalesUser[]>('/api/Partner/GetSalesUsers', {
    method: 'GET',
    signal,
  });
}

export interface PartnerSearchFilters {
  search?: string;
  status?: PartnerListStatus;
  salesUserId?: number | null;
  page?: number;
  pageSize?: number;
}

export async function fetchPartnersPage(
  filters: PartnerSearchFilters,
  signal?: AbortSignal
): Promise<NormalizedPage<PartnerListItem>> {
  const raw = await apiCall<unknown>('/api/Partner/GetList', {
    method: 'POST',
    body: {
      ...(filters.search?.trim() ? { SearchText: filters.search.trim() } : {}),
      ...(filters.status && filters.status !== 'all' ? { Status: filters.status } : {}),
      ...(filters.salesUserId ? { SalesUserId: filters.salesUserId } : {}),
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 20,
    },
    signal,
  });
  return normalizePaged<PartnerListItem>(raw);
}

// ==================== BOOKINGS API (READ-ONLY) ====================

export type BookingStatusFilterValue = '-1' | '100' | '300' | '400' | '500' | '600' | '200';

export interface BookingFlightItem {
  Origin?: string | null;
  Destination?: string | null;
  DepartureDate?: string | null;
  DepartureTime?: string | null;
  Segments?: unknown;
  [key: string]: unknown;
}

export interface BookingCustomerItem {
  PassengerTypeId?: number | null;
  FirstName?: string | null;
  LastName?: string | null;
  [key: string]: unknown;
}

export interface BookingListItem {
  BookingId?: number | null;
  BookingCode?: string | null;
  TransactionId?: string | null;
  BookingExpired?: string | null;
  BookingStatusId?: number | null;
  BookingStatusName?: string | null;
  SystemCode?: string | null;
  CarrierCode?: string | null;
  ContactName?: string | null;
  ContactPhone?: string | null;
  ContactEmail?: string | null;
  PartnerId?: number | null;
  PartnerCode?: string | null;
  PartnerName?: string | null;
  TotalAmount?: number | null;
  PaidAmount?: number | null;
  UnPaidAmount?: number | null;
  IsPaid?: boolean | null;
  CreatedDate?: string | null;
  CreatedBy?: number | null;
  CreatedByCode?: string | null;
  CreatedByName?: string | null;
  ItineraryId?: number | null;
  Origin?: string | null;
  Destination?: string | null;
  DepartCode?: string | null;
  ArrivalCode?: string | null;
  DepartureDate?: string | null;
  DepartureTime?: string | null;
  Flights?: BookingFlightItem[] | string | null;
  Customers?: BookingCustomerItem[] | string | null;
}

export interface BookingLookupOption {
  id: string;
  code: string;
  name: string;
  label: string;
}

function toLocalYmd(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function defaultBookingFromDate(now: Date = new Date()): string {
  const prev = new Date(now);
  prev.setDate(prev.getDate() - 6);
  return toLocalYmd(prev);
}

export function defaultBookingToDate(now: Date = new Date()): string {
  return toLocalYmd(now);
}

const YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Chuẩn hóa FromDate cho GET /api/Booking/SearchListBooking (MSSQL JSON_VALUE -> DATETIME).
 * Chỉ trả YYYY-MM-DD (không có `T` hoặc timezone offset).
 */
export function toBookingListFromDate(dateStr?: string | null): string | null {
  const ymd = String(dateStr ?? '').trim();
  if (!YMD_PATTERN.test(ymd)) return null;
  return ymd;
}

/**
 * Chuẩn hóa ToDate cho GET /api/Booking/SearchListBooking (MSSQL BETWEEN cuối ngày).
 * Trả `YYYY-MM-DD 23:59:59` (không có `T` hoặc timezone offset).
 */
export function toBookingListToDate(dateStr?: string | null): string | null {
  const ymd = String(dateStr ?? '').trim();
  if (!YMD_PATTERN.test(ymd)) return null;
  return `${ymd} 23:59:59`;
}

export function toCanonicalBookingSystemCode(value?: string | null): string {
  const code = String(value ?? '').trim().toUpperCase();
  if (code === '1G') return 'GALILEO';
  if (code === '1A') return 'AMADEUS';
  if (code === 'F1') return 'FLYONE';
  return code;
}

export function toShortBookingSystemCode(value?: string | null): string {
  const canonical = toCanonicalBookingSystemCode(value);
  if (canonical === 'GALILEO') return '1G';
  if (canonical === 'AMADEUS') return '1A';
  if (canonical === 'FLYONE') return 'LCC';
  return canonical;
}

function toBookingSystemLabel(value?: string | null, name?: string | null): string {
  const canonical = toCanonicalBookingSystemCode(value);
  if (canonical === 'GALILEO') return '1G — Galileo';
  if (canonical === 'AMADEUS') return '1A — Amadeus';
  if (canonical === 'FLYONE') return 'LCC — Hãng giá rẻ';
  const nameText = String(name ?? '').trim();
  if (canonical && nameText) return `${canonical} — ${nameText}`;
  return canonical || nameText;
}

export function parseBookingJsonArray(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object'
        );
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function getBookingRepresentativeCustomer(row: BookingListItem): string {
  const customers = parseBookingJsonArray(row.Customers) as BookingCustomerItem[];
  if (customers.length === 0) return '';
  const adult = customers.find((c) => Number(c.PassengerTypeId) === 1);
  const representative = adult ?? customers[0];
  const fullName = [representative.LastName, representative.FirstName]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(' ');
  const extraCount = customers.length - 1;
  if (!fullName) {
    return extraCount > 0 ? `+${extraCount} khách` : '';
  }
  return extraCount > 0 ? `${fullName} +${extraCount}` : fullName;
}

function formatShortDayMonth(value?: string | null): string {
  if (!value) return '';
  const text = String(value).trim();
  const ymdMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) return `${ymdMatch[3]}/${ymdMatch[2]}`;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return '';
  const dd = String(parsed.getDate()).padStart(2, '0');
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

function buildRouteThroughFlights(flights: BookingFlightItem[]): string {
  let route = '';
  let previousDest = '';
  for (const flight of flights) {
    const origin = String(flight.Origin ?? '').trim();
    const destination = String(flight.Destination ?? '').trim();
    const leg = [origin, destination].filter(Boolean).join('-');
    if (!leg) continue;
    if (!route) {
      route = leg;
    } else if (previousDest && destination && origin === previousDest) {
      route += `-${destination}`;
    } else {
      route += ` / ${leg}`;
    }
    previousDest = destination;
  }
  return route;
}

export function getBookingItineraryDisplay(row: BookingListItem): {
  route: string;
  dates: string;
} {
  const flights = parseBookingJsonArray(row.Flights) as BookingFlightItem[];
  if (flights.length === 0) {
    const origin = String(row.Origin ?? row.DepartCode ?? '').trim();
    const dest = String(row.Destination ?? row.ArrivalCode ?? '').trim();
    const route = origin && dest ? `${origin} - ${dest}` : origin || dest;
    const dates =
      formatShortDayMonth(row.DepartureDate) || formatShortDayMonth(row.DepartureTime);
    return { route, dates };
  }

  const itineraryId = row.ItineraryId != null ? Number(row.ItineraryId) : null;
  const first = flights[0];
  const last = flights[flights.length - 1];
  const origin = String(first.Origin ?? '').trim();
  const dest =
    itineraryId === 1 || itineraryId === 2
      ? String(first.Destination ?? '').trim()
      : String(last.Destination ?? first.Destination ?? '').trim();

  const route =
    itineraryId !== 1 && itineraryId !== 2 && flights.length > 2
      ? buildRouteThroughFlights(flights)
      : origin && dest
      ? `${origin} - ${dest}`
      : origin || dest || buildRouteThroughFlights(flights);

  const firstDate =
    formatShortDayMonth(first.DepartureDate) || formatShortDayMonth(first.DepartureTime);
  const lastDate =
    formatShortDayMonth(last.DepartureDate) || formatShortDayMonth(last.DepartureTime);

  let dates = '';
  if (itineraryId === 1 || !lastDate || lastDate === firstDate) {
    dates = firstDate;
  } else {
    dates = firstDate ? `${firstDate}-${lastDate}` : lastDate;
  }

  return { route, dates };
}

export type BookingStatusTone = 'warning' | 'success' | 'danger' | 'muted';

const BOOKING_STATUS_META: Record<number, { label: string; tone: BookingStatusTone }> = {
  100: { label: 'Chờ xác nhận', tone: 'warning' },
  200: { label: 'Đã hủy', tone: 'danger' },
  300: { label: 'Đã xuất vé', tone: 'success' },
  400: { label: 'Lỗi', tone: 'danger' },
  500: { label: 'Đã hoàn', tone: 'muted' },
  600: { label: 'Hủy vé', tone: 'danger' },
};

export function resolveBookingStatusMeta(
  statusId?: number | null,
  statusName?: string | null
): { label: string; tone: BookingStatusTone } {
  if (statusId != null && BOOKING_STATUS_META[statusId]) {
    return BOOKING_STATUS_META[statusId];
  }
  const normalized = String(statusName ?? '').trim().toLowerCase();
  if (!normalized) return { label: 'Không xác định', tone: 'muted' };
  if (normalized.includes('hủy') || normalized.includes('cancel') || normalized.includes('void')) {
    return { label: statusName?.trim() || 'Đã hủy', tone: 'danger' };
  }
  if (
    normalized.includes('xuất vé') ||
    normalized.includes('hoàn thành') ||
    normalized.includes('complete') ||
    normalized.includes('issue')
  ) {
    return { label: statusName?.trim() || 'Đã xuất vé', tone: 'success' };
  }
  if (normalized.includes('hoàn') || normalized.includes('refund')) {
    return { label: statusName?.trim() || 'Đã hoàn', tone: 'muted' };
  }
  if (
    normalized.includes('chờ') ||
    normalized.includes('giữ') ||
    normalized.includes('pending') ||
    normalized.includes('reserv')
  ) {
    return { label: statusName?.trim() || 'Chờ xác nhận', tone: 'warning' };
  }
  return { label: statusName?.trim() || 'Không xác định', tone: 'muted' };
}

function unwrapBookingDropdownList(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) {
    return raw.filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object');
  }
  if (!raw || typeof raw !== 'object') return [];
  const rec = raw as Record<string, unknown>;
  for (const key of ['Items', 'items', 'Data', 'data', 'List', 'list']) {
    if (Array.isArray(rec[key])) {
      return (rec[key] as unknown[]).filter(
        (x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object'
      );
    }
  }
  return [];
}

export async function fetchBookingCarriersDDL(
  signal?: AbortSignal
): Promise<BookingLookupOption[]> {
  const raw = await apiCall<unknown>('/api/DropDownList/GetCarrierDDL', {
    method: 'GET',
    signal,
  });
  const rows = unwrapBookingDropdownList(raw);
  const seen = new Set<string>();
  const options: BookingLookupOption[] = [];

  for (const row of rows) {
    const rawCode = String(row.Code ?? row.CarrierCode ?? row.SystemCode ?? row.Value ?? '')
      .trim()
      .toUpperCase();
    if (!rawCode) continue;
    const canonical = toCanonicalBookingSystemCode(rawCode);
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const name = String(row.Name ?? row.Text ?? '').trim();
    options.push({
      id: canonical,
      code: toShortBookingSystemCode(canonical),
      name,
      label: toBookingSystemLabel(canonical, name),
    });
  }
  return options;
}

export async function fetchBookingPartnersDDL(
  signal?: AbortSignal
): Promise<BookingLookupOption[]> {
  const raw = await apiCall<unknown>('/api/DropDownList/GetPartnerDDL?ScopeResource=BOOKING', {
    method: 'GET',
    signal,
  });
  const rows = unwrapBookingDropdownList(raw);
  const options: BookingLookupOption[] = [];
  for (const row of rows) {
    const rawId = row.PartnerId ?? row.Id ?? row.KeyId ?? row.Value;
    if (rawId === undefined || rawId === null || rawId === '') continue;
    const id = String(rawId).trim();
    const code = String(row.PartnerCode ?? row.Code ?? '').trim();
    const name = String(row.PartnerName ?? row.TradingName ?? row.Name ?? row.Text ?? '').trim();
    options.push({
      id,
      code: code || `#${id}`,
      name: name || code || `#${id}`,
      label: code && name ? `${code} — ${name}` : name || code || `#${id}`,
    });
  }
  return options;
}

export async function fetchBookingUsersDDL(
  partnerId?: number | null,
  signal?: AbortSignal
): Promise<BookingLookupOption[]> {
  const qs =
    partnerId != null && partnerId > 0
      ? `?partnerId=${encodeURIComponent(String(partnerId))}`
      : '';
  const raw = await apiCall<unknown>(`/api/DropDownList/GetAllUserDDL${qs}`, {
    method: 'GET',
    signal,
  });
  const rows = unwrapBookingDropdownList(raw);
  const options: BookingLookupOption[] = [];
  for (const row of rows) {
    const rawId = row.UserId ?? row.Id ?? row.KeyId ?? row.Value;
    if (rawId === undefined || rawId === null || rawId === '') continue;
    const id = String(rawId).trim();
    const code = String(row.UserCode ?? row.Code ?? '').trim();
    const name = String(row.UserFullname ?? row.FullName ?? row.Name ?? row.Text ?? '').trim();
    options.push({
      id,
      code: code || `#${id}`,
      name: name || code || `#${id}`,
      label: code && name ? `${code} — ${name}` : name || code || `#${id}`,
    });
  }
  return options;
}

export interface BookingSearchFilters {
  search?: string;
  status?: BookingStatusFilterValue;
  fromDate?: string;
  toDate?: string;
  systemCode?: string;
  partnerId?: number | null;
  createdBy?: number | null;
  page?: number;
  pageSize?: number;
}

export async function fetchBookingsPage(
  filters: BookingSearchFilters,
  signal?: AbortSignal
): Promise<NormalizedPage<BookingListItem>> {
  const qs = new URLSearchParams({
    page: String(filters.page ?? 1),
    pageSize: String(filters.pageSize ?? 20),
  });
  if (filters.search?.trim()) qs.set('SearchText', filters.search.trim());
  if (filters.status !== undefined) qs.set('Status', String(filters.status));
  const from = toBookingListFromDate(filters.fromDate);
  const to = toBookingListToDate(filters.toDate);
  if (from) qs.set('FromDate', from);
  if (to) qs.set('ToDate', to);
  if (filters.partnerId != null && filters.partnerId > 0) {
    qs.set('PartnerId', String(filters.partnerId));
  }
  if (filters.createdBy != null && filters.createdBy > 0) {
    qs.set('CreatedBy', String(filters.createdBy));
  }
  if (filters.systemCode?.trim()) {
    qs.set('SystemCode', toCanonicalBookingSystemCode(filters.systemCode));
  }

  const raw = await apiCall<unknown>(`/api/Booking/SearchListBooking?${qs.toString()}`, {
    method: 'GET',
    signal,
  });
  return normalizePaged<BookingListItem>(raw);
}

