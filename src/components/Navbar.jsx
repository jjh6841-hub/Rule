import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '홈', icon: HomeIcon },
  { path: '/my-laws', label: '내 법령', icon: BookIcon },
  { path: '/profile', label: '내 정보', icon: UserIcon },
]

const NOTIFICATIONS = [
  {
    id: 1,
    icon: '📋',
    title: '새 법령 업데이트',
    body: '육아휴직 급여 인상 및 사용 요건 완화 법령이 2025-05-01 시행됩니다.',
    time: '방금 전',
  },
  {
    id: 2,
    icon: '🏠',
    title: '주거 카테고리 법령 추가',
    body: '전세사기피해자 지원 특별법이 신규 등록되었습니다.',
    time: '1시간 전',
  },
  {
    id: 3,
    icon: '🔔',
    title: '시행일 D-30 알림',
    body: '국민건강보험법 실손보험 연계 개정안이 2025-07-01 시행 예정입니다.',
    time: '어제',
  },
]

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function BookIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

function UserIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const notifRef = useRef(null)

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = () => {
    const opening = !notifOpen
    setNotifOpen(opening)
    if (opening) setHasUnread(false) // 열면 읽음 처리
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#1a3c6e] rounded-lg flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1a3c6e] tracking-tight">
            Law<span className="text-blue-400">Ping</span>
          </span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-[#1a3c6e] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* 알림 버튼 + 드롭다운 */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleBellClick}
            className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors
              ${notifOpen ? 'bg-gray-100 text-[#1a3c6e]' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {/* 알림 드롭다운 패널 */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* 패널 헤더 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">알림</h3>
                <span className="text-xs text-gray-400">{NOTIFICATIONS.length}개</span>
              </div>

              {/* 알림 목록 */}
              <ul className="divide-y divide-gray-50">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-default">
                    <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 패널 푸터 */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-center text-gray-400">모든 알림을 확인했습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 하단 탭바 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <nav className="flex">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                  ${active ? 'text-[#1a3c6e]' : 'text-gray-400'}`}
              >
                <Icon active={active} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
