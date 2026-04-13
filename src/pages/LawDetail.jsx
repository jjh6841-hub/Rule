import { useParams, useLocation, Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { mockLaws, statusStyles } from '../data/mockLaws'
import CategoryTag from '../components/CategoryTag'

// ─── D-day 배너 ──────────────────────────────────────────────────
function DdayBanner({ effectDate }) {
  if (!effectDate) return null
  const effectObj = new Date(effectDate)
  if (isNaN(effectObj.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  effectObj.setHours(0, 0, 0, 0)
  const diff = Math.ceil((effectObj - today) / 86400000)

  const config =
    diff <= 0
      ? {
          label: '시행 중',
          sub: '현재 시행되고 있는 법령입니다',
          gradient: 'from-emerald-500 to-green-400',
        }
      : diff <= 30
        ? {
            label: `D-${diff}`,
            sub: `시행까지 ${diff}일 남았습니다 · 곧 시행됩니다`,
            gradient: 'from-orange-400 to-amber-400',
          }
        : {
            label: `D-${diff}`,
            sub: `${effectDate} 시행 예정`,
            gradient: 'from-[#1a3c6e] to-[#2563eb]',
          }

  return (
    <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6 text-white text-center shadow-sm`}>
      <p className="text-5xl font-black tracking-tight mb-1.5">{config.label}</p>
      <p className="text-sm opacity-80">{config.sub}</p>
    </div>
  )
}

// ─── 시행일 캘린더 ────────────────────────────────────────────────
function EffectCalendar({ effectDate }) {
  if (!effectDate) return null
  const effectObj = new Date(effectDate)
  if (isNaN(effectObj.getTime())) return null

  const startOfMonth = new Date(effectObj.getFullYear(), effectObj.getMonth(), 1)

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        시행일 캘린더
      </h3>

      <div className="lawping-calendar">
        <Calendar
          value={effectObj}
          activeStartDate={startOfMonth}
          maxDetail="month"
          minDetail="month"
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
          locale="ko"
          tileContent={({ date }) =>
            isSameDay(date, effectObj) ? (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
            ) : null
          }
        />
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-[#1a3c6e] inline-block" />
          시행일 ({effectDate})
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-blue-100 inline-block" />
          오늘
        </span>
      </div>
    </div>
  )
}

// ─── 섹션 카드 래퍼 ───────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {title && (
        <h2 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

// ─── 메인 페이지 ──────────────────────────────────────────────────
export default function LawDetail() {
  const { id } = useParams()
  const { state: passedLaw } = useLocation()

  // 1순위: React Router state (LawCard에서 전달)
  // 2순위: mockLaws 조회
  const law = passedLaw ?? mockLaws.find((l) => String(l.id) === id)

  if (!law) {
    return (
      <main className="max-w-[800px] mx-auto px-6 py-8 pb-24 md:pb-8 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <p className="text-gray-400 mb-4">법령 정보를 찾을 수 없습니다.</p>
          <Link to="/" className="text-sm text-[#1a3c6e] font-medium hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  const status = statusStyles[law.status] ?? { bg: 'bg-gray-400', text: 'text-white' }
  // summary 필드에서 "부처명 · 법령종류" 파싱
  const [dept, lawType] = law.summary?.split(' · ') ?? []

  return (
    <main className="max-w-[800px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 뒤로가기 */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a3c6e] mb-5 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        홈으로
      </Link>

      {/* ── 섹션 1: 헤더 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
        {/* 배지 줄 */}
        <div className="flex items-center gap-2 mb-3">
          <CategoryTag category={law.category} />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            {law.status}
          </span>
        </div>

        {/* 법령명 */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">
          {law.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          {dept && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="font-medium text-gray-700">{dept}</span>
            </span>
          )}
          {lawType && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {lawType}
            </span>
          )}
          {law.effectDate && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              시행일 <span className="font-medium text-gray-700">{law.effectDate}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── 섹션 2+3: D-day + 캘린더 ── */}
      {law.effectDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DdayBanner effectDate={law.effectDate} />
          <EffectCalendar effectDate={law.effectDate} />
        </div>
      )}

      {/* ── 섹션 4: 법령 요약 ── */}
      <SectionCard title="이 법은 무엇인가요?" icon="📋">
        <p className="text-sm text-gray-600 leading-relaxed">
          {law.benefit || law.summary || '법령 상세 내용은 법제처 원문을 확인해주세요.'}
        </p>
        {(law.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {law.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── 섹션 5: 받을 수 있는 혜택 ── */}
      {law.benefit && (
        <div className="mt-4">
          <SectionCard title="받을 수 있는 혜택" icon="✅">
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm text-blue-800 leading-relaxed">{law.benefit}</p>
            </div>

            {law.applyUrl && (
              <a
                href={law.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1a3c6e] text-white
                  font-semibold py-3.5 rounded-xl hover:bg-[#15306b] active:scale-[0.98]
                  transition-all text-sm"
              >
                신청하러 가기
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── 섹션 6: 관련 법령 링크 ── */}
      <div className="mt-4">
        <SectionCard title="관련 링크" icon="🔗">
          <div className="flex flex-col gap-2">
            {(law.detailUrl || law.applyUrl) && (
              <a
                href={law.detailUrl || law.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200
                  hover:bg-blue-50 hover:border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1a3c6e] rounded-lg flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1a3c6e] transition-colors">
                      법제처 원문 보기
                    </p>
                    <p className="text-xs text-gray-400">국가법령정보센터에서 전문 확인</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-[#1a3c6e] transition-colors">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}

            <a
              href="https://www.law.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200
                hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1a3c6e] transition-colors">
                    국가법령정보센터
                  </p>
                  <p className="text-xs text-gray-400">law.go.kr 전체 법령 검색</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-[#1a3c6e] transition-colors">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </SectionCard>
      </div>
    </main>
  )
}
