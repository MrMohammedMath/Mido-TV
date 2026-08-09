import { useEffect, useRef } from 'react';

/**
 * TV Remote control listener hook optimized for TV performance.
 * Maps TV Numpad (Digit0-9, Numpad0-9), Arrow keys, Enter/OK, PageUp/PageDown, A/B keys.
 */
export function useTvRemote(onKeyPress) {
  const handlerRef = useRef(onKeyPress);

  useEffect(() => {
    handlerRef.current = onKeyPress;
  }, [onKeyPress]);

  useEffect(() => {
    function handleKeyDown(event) {
      const code = event.code;
      const key = event.key;

      let action = null;

      // Numpad 0-9
      if (code === 'Digit1' || code === 'Numpad1' || key === '1') action = 'NUM_1';
      else if (code === 'Digit2' || code === 'Numpad2' || key === '2') action = 'NUM_2';
      else if (code === 'Digit3' || code === 'Numpad3' || key === '3') action = 'NUM_3';
      else if (code === 'Digit4' || code === 'Numpad4' || key === '4') action = 'NUM_4';
      else if (code === 'Digit5' || code === 'Numpad5' || key === '5') action = 'NUM_5';
      else if (code === 'Digit6' || code === 'Numpad6' || key === '6') action = 'NUM_6';
      else if (code === 'Digit7' || code === 'Numpad7' || key === '7') action = 'NUM_7';
      else if (code === 'Digit8' || code === 'Numpad8' || key === '8') action = 'NUM_8';
      else if (code === 'Digit9' || code === 'Numpad9' || key === '9') action = 'NUM_9';
      else if (code === 'Digit0' || code === 'Numpad0' || key === '0' || key === 'Backspace' || key === 'Escape') action = 'NUM_0';
      
      // D-Pad / Navigation
      else if (code === 'ArrowUp' || key === 'ArrowUp') action = 'UP';
      else if (code === 'ArrowDown' || key === 'ArrowDown') action = 'DOWN';
      else if (code === 'ArrowLeft' || key === 'ArrowLeft') action = 'LEFT';
      else if (code === 'ArrowRight' || key === 'ArrowRight') action = 'RIGHT';
      else if (code === 'Enter' || key === 'Enter' || key === ' ') action = 'OK';
      
      // Remote Color Buttons A, B, C, D (Mapped to F1, F2, F3, F4 on standard TV remotes & keyboards)
      // A / F1: Page Up / Previous Page
      else if (code === 'F1' || key === 'F1' || code === 'KeyA' || key === 'a' || key === 'A' || code === 'PageUp' || key === 'PageUp' || key === 'ChannelUp') action = 'PAGE_UP';
      // B / F2: Page Down / Next Page
      else if (code === 'F2' || key === 'F2' || code === 'KeyB' || key === 'b' || key === 'B' || code === 'PageDown' || key === 'PageDown' || key === 'ChannelDown') action = 'PAGE_DOWN';
      // C / F3: Fullscreen toggle
      else if (code === 'F3' || key === 'F3' || code === 'KeyC' || key === 'c' || key === 'C') action = 'FULLSCREEN';
      // D / F4: Auxiliary action (Home / Refresh)
      else if (code === 'F4' || key === 'F4' || code === 'KeyD' || key === 'd' || key === 'D') action = 'KEY_D';

      if (action && handlerRef.current) {
        event.preventDefault();
        handlerRef.current(action, { key, code });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

