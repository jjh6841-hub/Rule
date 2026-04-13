import { useState } from 'react'
import LawCard from '../components/LawCard'
import { mockLaws } from '../data/mockLaws'

const CATEGORIES = ['전체', '주거', '청년', '창업·사업', '의료·건강', '육아·가족']

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockLaws.filter((law) => {
    const matchCategory = selectedCategory === '전체' || law.category === selectedCategory
    const matchSearch =
      law.title.includes(searchQuery) ||
      law.summary.includes(searchQuery) ||
      law.tags.some((t) => t.includes(searchQuery))
    return matchCategory && matchSearch
  })

  const newCount = mockLaws.filter((l) => l.status === '신규').length
  const changedCount = mockLaws.filter((l) => l.status === '변경').length

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 히어로 섹션 */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-[#1a3c6e] to-[#2563eb] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          {/* 배경 장식 */}
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
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <p className="text-xs text-blue-200 mb-0.5">신규 법령</p>
                <p className="text-2xl font-bold">{newCount}<span className="text-sm font-normal ml-1">건</span></p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <p className="text-xs text-blue-200 mb-0.5">변경 법령</p>
                <p className="text-2xl font-bold">{changedCount}<span className="text-sm font-normal ml-1">건</span></p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <p className="text-xs text-blue-200 mb-0.5">총 법령</p>
                <p className="text-2xl font-bold">{mockLaws.length}<span className="text-sm font-normal ml-1">건</span></p>
              </div>
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
            placeholder="법령명, 혜택, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 text-sm
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 focus:border-[#1a3c6e]
              shadow-sm transition-all"
          />
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                ${selectedCategory === cat
                  ? 'bg-[#1a3c6e] text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1a3c6e]/30 hover:text-[#1a3c6e]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 법령 카드 그리드 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            최신 법령 피드
            <span className="ml-2 text-sm font-normal text-gray-400">
              {filtered.length}건
            </span>
          </h2>
          <button className="text-xs text-[#1a3c6e] font-medium hover:underline">
            정렬 기준
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((law) => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        ) : (
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
