/**
 * Accordion - Expandable content sections
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { easing, duration } from './motion';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = []
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  function toggle(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div data-ev-id="ev_05f5451696" className="flex flex-col gap-2">
			{items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div data-ev-id="ev_c8bde82a62"
          key={item.id}
          className="bg-surface border border-border rounded-lg overflow-hidden">

						<button data-ev-id="ev_bd37ba70e7"
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-panel/50 transition-colors"
            onClick={() => toggle(item.id)}>

							{item.icon &&
              <span data-ev-id="ev_a7a80a8dda" className="text-cyan">{item.icon}</span>
              }
							<span data-ev-id="ev_bbbf2c87ae" className="flex-1 font-mono text-[13px] font-medium text-text-white">
								{item.title}
							</span>
							<motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: duration.fast, ease: easing.outQuart }}>

								<ChevronDown className="w-4 h-4 text-text-slate" />
							</motion.div>
						</button>
						
						<AnimatePresence initial={false}>
							{isOpen &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: duration.medium, ease: easing.outQuint }}>

									<div data-ev-id="ev_45e6712537" className="px-4 pb-4 pt-1">
										<div data-ev-id="ev_9dddbc019f" className="font-mono text-[13px] text-text-light leading-relaxed">
											{item.content}
										</div>
									</div>
								</motion.div>
              }
						</AnimatePresence>
					</div>);

      })}
		</div>);

}