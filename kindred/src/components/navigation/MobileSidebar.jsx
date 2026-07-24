import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'

function MobileSidebar({
  open,
  onClose,
  returnFocusRef,
  navigationItems,
  userProfile,
  role,
  onLogout,
  logoutLoading,
}) {
  const closeButtonRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const returnFocusElement = returnFocusRef.current
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), select, textarea, input',
      )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      returnFocusElement?.focus()
    }
  }, [open, onClose, returnFocusRef])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
        aria-label="Close dashboard navigation"
      />
      <section
        ref={drawerRef}
        className="relative h-full w-[min(20rem,85vw)] shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <h2 id="mobile-navigation-title" className="sr-only">
          Dashboard navigation
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-500 hover:bg-kindred-cream hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kindred-orange"
          aria-label="Close dashboard navigation"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <Sidebar
          mobile
          navigationItems={navigationItems}
          userProfile={userProfile}
          role={role}
          onLogout={onLogout}
          logoutLoading={logoutLoading}
          onNavigate={onClose}
        />
      </section>
    </div>
  )
}

export default MobileSidebar
