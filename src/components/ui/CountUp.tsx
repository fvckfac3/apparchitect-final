/**
 * CountUp - Animated number counter
 * 
 * Following delight skill pattern for animated counters
 */

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface CountUpProps {
	value: number;
	duration?: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	className?: string;
	triggerOnView?: boolean;
}

export function CountUp({ 
	value, 
	duration = 1.5,
	decimals = 0,
	prefix = '',
	suffix = '',
	className = '',
	triggerOnView = true,
}: CountUpProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });
	
	const spring = useSpring(0, {
		duration: duration * 1000,
		bounce: 0,
	});

	const display = useTransform(spring, (current) => 
		`${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`
	);

	useEffect(() => {
		if (!triggerOnView || isInView) {
			spring.set(value);
		}
	}, [spring, value, isInView, triggerOnView]);

	return (
		<motion.span ref={ref} className={`tabular-nums ${className}`}>
			{display}
		</motion.span>
	);
}
