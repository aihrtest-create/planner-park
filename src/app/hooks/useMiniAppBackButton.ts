import { useEffect } from 'react';
import { detectPlatform, showBackButton, hideBackButton, hapticFeedback } from '../../lib/miniapp';

/**
 * Hook: синхронизирует нативную кнопку «Назад» в Telegram с навигацией визарда.
 * На первом шаге кнопка скрыта, на остальных — показана и вызывает goBack().
 */
export function useMiniAppBackButton(step: number, goBack: () => void) {
  useEffect(() => {
    if (detectPlatform() !== 'telegram') return;

    if (step <= 1) {
      hideBackButton();
    } else {
      showBackButton(() => {
        hapticFeedback('light');
        goBack();
      });
    }

    return () => {
      hideBackButton();
    };
  }, [step, goBack]);
}
