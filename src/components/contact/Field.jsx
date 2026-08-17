import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const base =
  'peer w-full appearance-none rounded-none border-0 border-b border-line bg-transparent pt-2 pb-3.5 text-base text-chalk transition-colors duration-300 placeholder:text-smoke/70 focus:border-red focus:outline-none'

/**
 * Underline form field. Renders input / textarea / select from one component so
 * label wiring, error messaging and focus styling can never drift apart.
 */
export function Field({
  id,
  label,
  type = 'text',
  as = 'input',
  options,
  error,
  required,
  hint,
  className,
  ...props
}) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="label block text-smoke">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-bright">
            *
          </span>
        )}
      </label>

      <div className="relative mt-3">
        {as === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            rows={5}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
            className={cn(base, 'resize-y')}
            {...props}
          />
        ) : as === 'select' ? (
          <>
            <select
              id={id}
              name={id}
              required={required}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={describedBy || undefined}
              className={cn(base, 'cursor-pointer pr-8')}
              {...props}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.5}
              className="pointer-events-none absolute right-0 bottom-4 size-4 text-smoke peer-focus:text-red-bright"
            />
          </>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
            className={base}
            {...props}
          />
        )}

        {/* Focus underline that wipes in over the hairline. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)] peer-focus:scale-x-100"
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-2.5 text-xs text-smoke">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2.5 text-xs text-red-bright">
          {error}
        </p>
      )}
    </div>
  )
}
