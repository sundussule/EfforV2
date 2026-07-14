import { useToast } from '@/context/ToastContext'

const TONE_STYLES = {
  default: 'bg-ink-950 text-white',
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
}

export function ToastViewport() {
  const { toasts } = useToast()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up pointer-events-auto rounded-full px-5 py-3 text-sm font-medium shadow-lg ${TONE_STYLES[toast.tone]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
