import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { statusStyles } from '../data/mockLaws'

function CardContent({ law, status }) {
  return (
    <>
      {/* 헤더: 카테고리 + 상태 배지 */}
      <div className="flex items-center justify-between mb-3">
        <CategoryTag category={law.category} />
        <div className="flex items-center gap-1.5">
          {law.isExternal && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            {law.status}
          </span>
        </div>
      </div>

      {/* 법령 제목 */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1a3c6e] transition-colors line-clamp-2">
        {law.title}
      </h3>

      {/* 요약 */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
        {law.summary}
      </p>

      {/* 혜택 박스 */}
      {law.benefit && (
        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-[#1a3c6e] mb-1 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {law.isExternal ? '법령 안내' : '받을 수 있는 혜택'}
          </p>
          <p className="text-xs text-blue-700 leading-relaxed line-clamp-2">{law.benefit}</p>
        </div>
      )}

      {/* 태그 + 시행일 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(law.tags ?? []).map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>
        {law.effectDate && (
          <span className="text-xs text-gray-400 shrink-0 ml-2">
            {law.effectDate} 시행
          </span>
        )}
      </div>
    </>
  )
}

const BASE_CLASS = `group block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm
  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`

export default function LawCard({ law }) {
  const status = statusStyles[law.status] ?? { bg: 'bg-gray-400', text: 'text-white' }

  // 법제처 API 데이터 → 외부 링크
  if (law.isExternal && law.detailUrl) {
    return (
      <a
        href={law.detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={BASE_CLASS}
      >
        <CardContent law={law} status={status} />
      </a>
    )
  }

  // 내부 목데이터 → 내부 라우터 링크
  return (
    <Link to={`/law/${law.id}`} className={BASE_CLASS}>
      <CardContent law={law} status={status} />
    </Link>
  )
}
