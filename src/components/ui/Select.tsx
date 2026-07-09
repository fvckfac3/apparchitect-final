import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
{ label, options, error, className = '', ...props },
ref)
{
  return (
    <div data-ev-id="ev_3c560e593d" className="flex flex-col gap-2">
			{label && <label data-ev-id="ev_b3bd743117" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-light">{label}</label>}
			<div data-ev-id="ev_b1ec1cf62c" className="relative">
				<select data-ev-id="ev_7786c095f5"
        ref={ref}
        className={`w-full appearance-none bg-surface border border-border rounded-sm px-4 py-3 pr-10 font-mono text-[13px] text-text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors cursor-pointer ${error ? 'border-signal-red' : ''} ${className}`}
        {...props}>

					<option data-ev-id="ev_4ce4a55a2a" value="">Select an option...</option>
					{options.map((option) =>
          <option data-ev-id="ev_1fc63b9882" key={option} value={option}>
							{option}
						</option>
          )}
				</select>
				<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-slate pointer-events-none" />
			</div>
			{error && <span data-ev-id="ev_c17070cbf8" className="font-mono text-[11px] text-signal-red">{error}</span>}
		</div>);

});