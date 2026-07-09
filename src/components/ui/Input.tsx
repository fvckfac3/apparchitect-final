import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
{ label, error, className = '', ...props },
ref)
{
  return (
    <div data-ev-id="ev_cea2d065cb" className="flex flex-col gap-2">
			{label && <label data-ev-id="ev_f7b36f0701" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-light">{label}</label>}
			<input data-ev-id="ev_d893f54e3e"
      ref={ref}
      className={`w-full bg-surface border border-border rounded-sm px-4 py-3 font-mono text-[13px] text-text-white placeholder:text-text-slate focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors ${error ? 'border-signal-red' : ''} ${className}`}
      {...props} />

			{error && <span data-ev-id="ev_117a615b15" className="font-mono text-[11px] text-signal-red">{error}</span>}
		</div>);

});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
{ label, error, className = '', ...props },
ref)
{
  return (
    <div data-ev-id="ev_5735a33d69" className="flex flex-col gap-2">
			{label && <label data-ev-id="ev_fb4769737b" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-light">{label}</label>}
			<textarea data-ev-id="ev_87a2ff5a92"
      ref={ref}
      className={`w-full bg-surface border border-border rounded-sm px-4 py-3 font-mono text-[13px] text-text-white placeholder:text-text-slate focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors resize-none min-h-[100px] ${error ? 'border-signal-red' : ''} ${className}`}
      {...props} />

			{error && <span data-ev-id="ev_ee5b5020e1" className="font-mono text-[11px] text-signal-red">{error}</span>}
		</div>);

});