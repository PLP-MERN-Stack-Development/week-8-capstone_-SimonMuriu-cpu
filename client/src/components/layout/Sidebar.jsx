import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  User,
  Video,
  LogOut,
  Settings
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { unreadNotifications } = useSocket()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { 
      path: '/notifications', 
      icon: Bell, 
      label: 'Notifications',
      badge: unreadNotifications > 0 ? unreadNotifications : null
    },
    { path: '/stream', icon: Video, label: 'Live Stream' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold gradient-text">
          SocialApp
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-3 mb-2 rounded-lg transition-colors duration-200 relative ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-6 w-6 mr-3" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile & Settings */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
            alt={user?.name}
            className="h-10 w-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <Settings className="h-5 w-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar