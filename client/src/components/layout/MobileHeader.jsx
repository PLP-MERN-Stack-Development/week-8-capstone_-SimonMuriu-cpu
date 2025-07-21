import { Link } from 'react-router-dom'
import { Bell, MessageCircle } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

const MobileHeader = () => {
  const { unreadNotifications } = useSocket()

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold gradient-text">
          SocialApp
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/notifications" 
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell className="h-6 w-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Link>
          
          <Link 
            to="/messages" 
            className="text-gray-600 hover:text-gray-900"
          >
            <MessageCircle className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader