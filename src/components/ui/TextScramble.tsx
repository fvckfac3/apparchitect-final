/**
 * TextScramble - Letters randomize then resolve effect
 * 
 * Following delight skill pattern for text scramble
 */

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  chars?: string;
  triggerOnView?: boolean;
  onComplete?: () => void;
}

export function TextScramble({
  text,
  className = '',
  speed = 30,
  chars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
  triggerOnView = true,
  onComplete
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayText, setDisplayText] = useState(triggerOnView ? '' : text);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    if (triggerOnView && !isInView) return;

    let iteration = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        text.
        split('').
        map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration / 3) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).
        join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setHasAnimated(true);
        onComplete?.();
      }

      iteration++;
    }, speed);

    return () => clearInterval(interval);
  }, [text, chars, speed, isInView, triggerOnView, hasAnimated, onComplete]);

  return (
    <span data-ev-id="ev_0c893d8f08" ref={ref} className={className}>
			{displayText || '\u00A0'.repeat(text.length)}
		</span>);

}