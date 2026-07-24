import {
  CirclePlus,
  ClipboardList,
  Gift,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Search,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ICONS = {
  'circle-plus': CirclePlus,
  'clipboard-list': ClipboardList,
  gift: Gift,
  'heart-handshake': HeartHandshake,
  inbox: Inbox,
  'layout-dashboard': LayoutDashboard,
  search: Search,
  'user-round': UserRound,
}

function NavItem({ item, onNavigate }) {
  const Icon = ICONS[item.icon] || LayoutDashboard

  return (
    <NavLink
      to={item.path}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kindred-orange ${
          isActive
            ? 'bg-kindred-cream font-semibold text-kindred-orange-dark'
            : 'text-slate-600 hover:bg-kindred-cream/70 hover:text-slate-950'
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
    </NavLink>
  )
}

export default NavItem
