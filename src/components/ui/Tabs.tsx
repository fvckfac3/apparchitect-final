/**
 * Animated Tabs - Tabbed navigation with sliding indicator
 */

import { motion } from 'framer-motion';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { easing, duration } from './motion';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md'
}: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTabEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (activeTabEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width
      });
    }
  }, [activeTab, tabs]);

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-[11px]'
  };

  const variants = {
    default: {
      container: 'bg-surface border border-border rounded-lg p-1',
      tab: 'rounded-md',
      indicator: 'bg-panel border border-border rounded-md'
    },
    pills: {
      container: 'bg-transparent gap-2',
      tab: 'rounded-full',
      indicator: 'bg-cyan/10 border border-cyan/30 rounded-full'
    },
    underline: {
      container: 'border-b border-border',
      tab: '',
      indicator: 'h-0.5 bg-cyan bottom-0 rounded-full'
    }
  };

  return (
    <div data-ev-id="ev_af8d246395"
    ref={containerRef}
    className={`relative flex ${variants[variant].container}`}>

			{/* Sliding indicator */}
			<motion.div
        className={`absolute ${variant === 'underline' ? '' : 'inset-y-1'} ${variants[variant].indicator}`}
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width
        }}
        transition={{ duration: duration.normal, ease: easing.outQuint }} />


			{/* Tabs */}
			{tabs.map((tab) =>
      <button data-ev-id="ev_a753fdedc9"
      key={tab.id}
      ref={(el) => {
        if (el) tabRefs.current.set(tab.id, el);
      }}
      className={`
						relative z-10 
						font-mono font-bold uppercase tracking-[2px]
						transition-colors duration-150
						flex items-center gap-2
						${sizes[size]}
						${variants[variant].tab}
						${activeTab === tab.id ?
      'text-cyan' :
      'text-text-slate hover:text-text-light'}
					`
      }
      onClick={() => onChange(tab.id)}>

					{tab.icon}
					{tab.label}
				</button>
      )}
		</div>);

}