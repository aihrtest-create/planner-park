/**
 * Mini App Platform Abstraction Layer
 * 
 * Определяет, в какой среде запущено приложение (Telegram, Max или браузер),
 * и предоставляет единый API для работы с платформой.
 */

// ─── Types ───────────────────────────────────────────
export type Platform = 'telegram' | 'max' | 'browser';

export interface PlatformUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface PlatformTheme {
  bgColor: string;
  textColor: string;
  hintColor: string;
  buttonColor: string;
  buttonTextColor: string;
  secondaryBgColor: string;
  isDark: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  expand: () => void;
  close: () => void;
  ready: () => void;
  sendData: (data: string) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    setText: (text: string) => void;
    setParams: (params: Record<string, unknown>) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
    // Max WebApp SDK (similar structure)
    MaxWebApp?: {
      initData: string;
      initDataUnsafe: {
        user?: {
          user_id: number;
          name?: string;
          username?: string;
        };
        start_param?: string;
      };
      colorScheme: 'light' | 'dark';
      close: () => void;
      ready: () => void;
      sendData: (data: string) => void;
      expand: () => void;
    };
  }
}

// ─── Platform Detection ──────────────────────────────
let _platform: Platform | null = null;

export function detectPlatform(): Platform {
  if (_platform) return _platform;

  if (window.Telegram?.WebApp?.initData) {
    _platform = 'telegram';
  } else if (window.MaxWebApp?.initData) {
    _platform = 'max';
  } else {
    _platform = 'browser';
  }

  console.log(`[MiniApp] Platform detected: ${_platform}`);
  return _platform;
}

// ─── Initialization ──────────────────────────────────
export function initMiniApp(): void {
  const platform = detectPlatform();

  if (platform === 'telegram') {
    const tg = window.Telegram!.WebApp;
    tg.ready();
    tg.expand();
    // Set dark theme header
    try {
      tg.setHeaderColor('#0A0A0C');
      tg.setBackgroundColor('#0A0A0C');
    } catch { /* older versions may not support */ }
    // Prevent accidental close during configuration
    try {
      tg.enableClosingConfirmation();
    } catch { /* ignore */ }
    console.log(`[MiniApp] Telegram WebApp v${tg.version}, platform: ${tg.platform}`);
  } else if (platform === 'max') {
    const max = window.MaxWebApp!;
    max.ready();
    try { max.expand(); } catch { /* ignore */ }
    console.log(`[MiniApp] Max WebApp initialized`);
  }
}

// ─── Get Start Param (lead ID) ───────────────────────
/**
 * Получить leadId из startParam Mini App или из URL.
 * Приоритет: startParam > URL ?lead= параметр
 */
export function getLeadId(): string | null {
  const platform = detectPlatform();

  // Try Mini App start_param first
  if (platform === 'telegram') {
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (startParam) {
      // startParam может быть "lead_ABC123" или просто "ABC123"
      const leadId = startParam.replace('lead_', '');
      console.log(`[MiniApp] Lead ID from Telegram startParam: ${leadId}`);
      return leadId;
    }
  } else if (platform === 'max') {
    const startParam = window.MaxWebApp?.initDataUnsafe?.start_param;
    if (startParam) {
      const leadId = startParam.replace('lead_', '');
      console.log(`[MiniApp] Lead ID from Max startParam: ${leadId}`);
      return leadId;
    }
  }

  // Fallback: URL parameter
  const params = new URLSearchParams(window.location.search);
  const urlLead = params.get('lead');
  if (urlLead) {
    console.log(`[MiniApp] Lead ID from URL: ${urlLead}`);
  }
  return urlLead;
}

// ─── Get Init Data (for server validation) ───────────
export function getInitData(): string | null {
  const platform = detectPlatform();
  if (platform === 'telegram') return window.Telegram?.WebApp?.initData || null;
  if (platform === 'max') return window.MaxWebApp?.initData || null;
  return null;
}

// ─── Get User ────────────────────────────────────────
export function getUser(): PlatformUser | null {
  const platform = detectPlatform();

  if (platform === 'telegram') {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (u) {
      return {
        id: String(u.id),
        firstName: u.first_name,
        lastName: u.last_name,
        username: u.username,
      };
    }
  } else if (platform === 'max') {
    const u = window.MaxWebApp?.initDataUnsafe?.user;
    if (u) {
      return {
        id: String(u.user_id),
        firstName: u.name,
        username: u.username,
      };
    }
  }

  return null;
}

// ─── Theme ───────────────────────────────────────────
export function getTheme(): PlatformTheme {
  const platform = detectPlatform();

  // Default dark theme (our app's native theme)
  const defaults: PlatformTheme = {
    bgColor: '#0A0A0C',
    textColor: '#E4E4E7',
    hintColor: '#71717A',
    buttonColor: '#FF6022',
    buttonTextColor: '#FFFFFF',
    secondaryBgColor: '#18181B',
    isDark: true,
  };

  if (platform === 'telegram') {
    const tp = window.Telegram?.WebApp?.themeParams;
    if (tp) {
      return {
        bgColor: tp.bg_color || defaults.bgColor,
        textColor: tp.text_color || defaults.textColor,
        hintColor: tp.hint_color || defaults.hintColor,
        buttonColor: tp.button_color || defaults.buttonColor,
        buttonTextColor: tp.button_text_color || defaults.buttonTextColor,
        secondaryBgColor: tp.secondary_bg_color || defaults.secondaryBgColor,
        isDark: window.Telegram?.WebApp?.colorScheme === 'dark',
      };
    }
  }

  return defaults;
}

// ─── Haptic Feedback ─────────────────────────────────
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection'): void {
  if (detectPlatform() !== 'telegram') return;
  const hf = window.Telegram?.WebApp?.HapticFeedback;
  if (!hf) return;

  switch (type) {
    case 'light':
    case 'medium':
    case 'heavy':
      hf.impactOccurred(type);
      break;
    case 'success':
    case 'error':
      hf.notificationOccurred(type);
      break;
    case 'selection':
      hf.selectionChanged();
      break;
  }
}

// ─── Main Button ─────────────────────────────────────
export function showMainButton(text: string, onClick: () => void): void {
  if (detectPlatform() !== 'telegram') return;
  const mb = window.Telegram?.WebApp?.MainButton;
  if (!mb) return;

  mb.setText(text);
  mb.onClick(onClick);
  mb.show();
}

export function hideMainButton(): void {
  if (detectPlatform() !== 'telegram') return;
  window.Telegram?.WebApp?.MainButton?.hide();
}

export function setMainButtonLoading(loading: boolean): void {
  if (detectPlatform() !== 'telegram') return;
  const mb = window.Telegram?.WebApp?.MainButton;
  if (!mb) return;
  if (loading) {
    mb.showProgress(true);
    mb.disable();
  } else {
    mb.hideProgress();
    mb.enable();
  }
}

// ─── Back Button ─────────────────────────────────────
export function showBackButton(onClick: () => void): void {
  if (detectPlatform() !== 'telegram') return;
  const bb = window.Telegram?.WebApp?.BackButton;
  if (!bb) return;
  bb.onClick(onClick);
  bb.show();
}

export function hideBackButton(): void {
  if (detectPlatform() !== 'telegram') return;
  window.Telegram?.WebApp?.BackButton?.hide();
}

// ─── Close App ───────────────────────────────────────
export function closeMiniApp(): void {
  const platform = detectPlatform();
  if (platform === 'telegram') {
    window.Telegram?.WebApp?.close();
  } else if (platform === 'max') {
    window.MaxWebApp?.close();
  }
}

// ─── Is Mini App ─────────────────────────────────────
export function isMiniApp(): boolean {
  return detectPlatform() !== 'browser';
}
