const STORAGE_KEY = "pdfUsage";
const DAILY_PDF_LIMIT = 5;

const getToday = () => new Date().toISOString().slice(0, 10);

const safeLocalStorage = () => {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

export const getPdfUsage = () => {
  const storage = safeLocalStorage();
  const today = getToday();
  if (!storage) {
    return { date: today, count: 0, limit: DAILY_PDF_LIMIT };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { date: today, count: 0, limit: DAILY_PDF_LIMIT };
    }
    const parsed = JSON.parse(raw);
    if (parsed?.date !== today) {
      return { date: today, count: 0, limit: DAILY_PDF_LIMIT };
    }
    return {
      date: today,
      count: Number(parsed.count) || 0,
      limit: DAILY_PDF_LIMIT,
    };
  } catch {
    return { date: today, count: 0, limit: DAILY_PDF_LIMIT };
  }
};

export const getPdfRemaining = () => {
  const usage = getPdfUsage();
  return Math.max(usage.limit - usage.count, 0);
};

export const incrementPdfUsage = () => {
  const storage = safeLocalStorage();
  if (!storage) return getPdfUsage();

  const usage = getPdfUsage();
  const next = { ...usage, count: usage.count + 1 };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const getPdfLimit = () => DAILY_PDF_LIMIT;
