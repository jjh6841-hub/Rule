import { useState, useEffect } from 'react'
import LawCard from '../components/LawCard'
import { searchLaws } from '../api/lawApi'

const CATEGORIES = ['전체', '주거', '청년', '창업·사업', '의료·건강', '육아·가족']

const CATEGORY_QUERIES = {
  전체: '생활',
  주거: '전세 임대 주거',
  청년: '청년',
  '창업·사업': '소상공인 창업',
  '의료·건강': '의료 건강보험',
  '육아·가족': '육아 출산 가족',
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-9 h-9 border-[3px] border-blue-100 border-t-[#1a3c6e] rounded-full animate-spin" />
      <p className="text-sm text-gray-400">법령 정보를 불러오는 중...</p>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 mb-1">법령 정보를 불러오지 못했습니다</p>
        <p className="text-xs text-gray-400 mb-3">{message}</p>
        <button
          onClick={onRetry}
          className="text-xs bg-[#1a3c6e] text-white px-4 py-2 rounded-lg hover:bg-[#15306b] transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [laws, setLaws] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLaws = (category) => {
    let cancelled = false
    setLoading(true)
    setError(null)

    searchLaws(CATEGORY_QUERIES[category])
      .then((data) => { if (!cancelled) setLaws(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }

  useEffect(() => {
    return fetchLaws(selectedCategory)
  }, [selectedCategory])

  // 카테고리는 API가 처리 → 제목/태그 텍스트 검색만 클라이언트에서
  const filtered = [...laws]
    .sort((a, b) => new Date(b.effectDate) - new Date(a.effectDate))
    .filter((law) => {
      if (!searchQuery) return true
      return (
        law.title.includes(searchQuery) ||
        law.summary.includes(searchQuery) ||
        (law.tags ?? []).some((t) => t.includes(searchQuery))
      )
    })

  const newCount = laws.filter((l) => l.status === '신규' || l.status === '제정').length
  const changedCount = laws.filter((l) => l.status === '변경').length

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 히어로 섹션 */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-[#1a3c6e] to-[#2563eb] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium mb-2">내 상황에 맞는 법령 알리미</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
              나에게 딱 맞는<br />법령과 혜택을 찾아드려요
            </h1>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              복잡한 법령을 쉽게 이해하고,<br className="md:hidden" /> 내가 받을 수 있는 혜택을 놓치지 마세요.
            </p>

            {/* 통계 카드 */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: '신규·제정', value: loading ? '—' : newCount },
                { label: '변경', value: loading ? '—' : changedCount },
                { label: '검색 결과', value: loading ? '—' : laws.length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                  <p className="text-xs text-blue-200 mb-0.5">{label}</p>
                  <p className="text-2xl font-bold">
                    {value}<span className="text-sm font-normal ml-1">건</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 검색 */}
      <section className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="제목, 부처명, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 text-sm
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 focus:border-[#1a3c6e]
              shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSearchQuery('') }}
              disabled={loading}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                ${selectedCategory === cat
                  ? 'bg-[#1a3c6e] text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1a3c6e]/30 hover:text-[#1a3c6e]'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 법령 카드 영역 */}
      <section>
        {!loading && !error && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              법령 검색 결과
              <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length}건</span>
            </h2>
            <span className="text-xs text-gray-400">법제처 제공 · 실시간</span>
          </div>
        )}

        {loading && <Spinner />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => fetchLaws(selectedCategory)} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((law) => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  )
}
