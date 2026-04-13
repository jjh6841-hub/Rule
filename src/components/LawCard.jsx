import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { statusStyles } from '../data/mockLaws'

const BASE_CLASS = `group block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm
  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`

export default function LawCard({ law }) {
  const status = statusStyles[law.status] ?? { bg: 'bg-gray-400', text: 'text-white' }

  return (
    // state로 law 전체를 전달 → LawDetail에서 재사용
    <Link to={`/law/${law.id}`} state={law} className={BASE_CLASS}>
      {/* 헤더: 카테고리 + 상태 배지 */}
      <div className="flex items-center justify-between mb-3">
        <CategoryTag category={law.category} />
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
          {law.status}
        </span>
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
            받을 수 있는 혜택
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
    </Link>
  )
}
