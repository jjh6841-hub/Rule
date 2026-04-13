import { useParams, Link } from 'react-router-dom'
import { mockLaws } from '../data/mockLaws'
import CategoryTag from '../components/CategoryTag'
import { statusStyles } from '../data/mockLaws'

export default function LawDetail() {
  const { id } = useParams()
  const law = mockLaws.find((l) => l.id === Number(id))

  if (!law) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center text-gray-400">
        <p>법령 정보를 찾을 수 없습니다.</p>
        <Link to="/" className="mt-4 inline-block text-[#1a3c6e] font-medium hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const status = statusStyles[law.status] ?? { bg: 'bg-gray-400', text: 'text-white' }

  return (
    <main className="max-w-[800px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 뒤로가기 */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a3c6e] mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        목록으로
      </Link>

      {/* 법령 헤더 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-4">
          <CategoryTag category={law.category} />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            {law.status}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">
          {law.title}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{law.summary}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          시행일: <span className="font-medium text-gray-600">{law.effectDate}</span>
        </div>
      </div>

      {/* 혜택 안내 */}
      <div className="bg-gradient-to-br from-[#1a3c6e] to-[#2563eb] rounded-3xl p-6 md:p-8 text-white mb-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          받을 수 있는 혜택
        </h2>
        <p className="text-sm text-blue-100 leading-relaxed">{law.benefit}</p>
      </div>

      {/* 태그 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">관련 키워드</h3>
        <div className="flex flex-wrap gap-2">
          {law.tags.map((tag) => (
            <span key={tag} className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 신청 버튼 */}
      <a
        href={law.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#1a3c6e] text-white text-center font-semibold py-4 rounded-2xl
          hover:bg-[#15306b] active:scale-[0.98] transition-all shadow-sm"
      >
        공식 사이트에서 신청하기 →
      </a>
    </main>
  )
}
