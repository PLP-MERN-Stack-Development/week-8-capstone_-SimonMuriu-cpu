import { Link, useLocation } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext'
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  User
} from 'lucide-react'

const BottomNav = () => {
  const location = useLocation()
  const { unreadNotifications } = useSocket()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { 
      path: '/notifications', 
      icon: Bell, 
      label: 'Notifications',
      badge: unreadNotifications > 0
    },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 relative ${
              isActive(item.path)
                ? 'text-primary-600'
                : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <item.icon className="h-6 w-6" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BottomNav