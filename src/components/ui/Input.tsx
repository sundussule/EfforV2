import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface FieldWrapperProps {
  label?: string
  error?: string
  hint?: string
  id: string
}

type InputProps = FieldWrapperProps & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950 ${
          error ? 'border-red-400' : 'border-ink-200'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-500">{hint}</span>
      ) : null}
    </div>
  ),
)
Input.displayName = 'Input'

type TextareaProps = FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950 ${
          error ? 'border-red-400' : 'border-ink-200'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-500">{hint}</span>
      ) : null}
    </div>
  ),
)
Textarea.displayName = 'Textarea'
