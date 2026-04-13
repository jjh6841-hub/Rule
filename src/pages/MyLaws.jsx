import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LawCard from '../components/LawCard'
import { mockLaws } from '../data/mockLaws'

/** 프로필 기반 관련도 점수 계산 */
function getScore(law, profile) {
  let score = 0

  // 관심 카테고리 직접 매칭 (가장 높은 가중치)
  if (profile.categories.includes(law.category)) score += 4

  // 주거형태 매칭
  if (profile.housing === '전세') {
    if (law.tags.includes('전세') || law.tags.includes('주거지원')) score += 3
    if (law.category === '주거') score += 1
  }
  if (profile.housing === '월세') {
    if (law.tags.includes('월세') || law.tags.includes('주거지원')) score += 3
    if (law.category === '주거') score += 1
  }
  if (profile.housing === '기숙사/기타') {
    if (law.category === '주거' || law.category === '청년') score += 1
  }

  // 나이 기반 청년 매칭 (19~34세)
  const age = Number(profile.age)
  if (age >= 19 && age <= 34) {
    if (law.category === '청년') score += 3
    if (law.tags.includes('청년')) score += 1
  }

  // 직업 기반 매칭
  if (profile.job === '자영업자' || profile.job === '프리랜서') {
    if (law.category === '창업·사업') score += 3
    if (law.tags.includes('소상공인')) score += 1
  }
  if (profile.job === '직장인') {
    if (law.tags.includes('육아휴직') || law.tags.includes('워라밸')) score += 1
  }
  if (profile.job === '무직') {
    if (law.category === '창업·사업') score += 1
  }

  // 가족구성 기반 매칭
  if (profile.family === '자녀있음') {
    if (law.category === '육아·가족') score += 3
    if (law.tags.includes('육아휴직')) score += 1
  }
  if (profile.family === '부부') {
    if (law.category === '육아·가족') score += 2
    if (law.tags.includes('워라밸')) score += 1
  }
  if (profile.family === '1인가구') {
    if (law.category === '청년') score += 1
  }

  return score
}

function ProfileSummary({ profile, onEdit }) {
  const items = [
    { label: '나이', value: `${profile.age}세` },
    { label: '직업', value: profile.job },
    { label: '주거', value: profile.housing },
    { label: '가족', value: profile.family },
    { label: '차량', value: profile.vehicle },
  ]

  return (
    <div className="bg-gradient-to-br from-[#1a3c6e] to-[#2563eb] rounded-2xl p-5 text-white mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-blue-100">내 프로필 기준</p>
        <button
          onClick={onEdit}
          className="text-xs text-blue-200 hover:text-white flex items-center gap-1 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수정
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(({ label, value }) => (
          <span key={label} className="bg-white/15 rounded-lg px-3 py-1 text-xs border border-white/20">
            <span className="text-blue-200">{label} </span>
            <span className="font-semibold">{value}</span>
          </span>
        ))}
        {profile.categories.length > 0 && (
          <span className="bg-white/15 rounded-lg px-3 py-1 text-xs border border-white/20">
            <span className="text-blue-200">관심 </span>
            <span className="font-semibold">{profile.categories.join(' · ')}</span>
          </span>
        )}
      </div>
    </div>
  )
}

function MatchBadge({ score }) {
  if (score === 0) return null
  const label = score >= 6 ? '매우 적합' : score >= 3 ? '적합' : '관련있음'
  const style =
    score >= 6
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : score >= 3
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : 'bg-gray-100 text-gray-500 border-gray-200'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}

export default function MyLaws() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('lawping_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  // 프로필 없음
  if (!profile) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">내 정보를 먼저 입력해주세요</h2>
          <p className="text-sm text-gray-400 mb-6">나이, 직업, 주거형태 등을 입력하면<br />나에게 딱 맞는 법령과 혜택을 찾아드려요.</p>
          <Link
            to="/profile"
            className="inline-block bg-[#1a3c6e] text-white text-sm font-semibold px-6 py-3 rounded-xl
              hover:bg-[#15306b] transition-colors"
          >
            내 정보 입력하기 →
          </Link>
        </div>
      </main>
    )
  }

  // 점수 계산 후 정렬
  const scored = mockLaws
    .map((law) => ({ ...law, _score: getScore(law, profile) }))
    .sort((a, b) => b._score - a._score)

  const matched = scored.filter((l) => l._score > 0)
  const unmatched = scored.filter((l) => l._score === 0)

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 페이지 타이틀 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">내 맞춤 법령</h1>
        <p className="text-sm text-gray-400">프로필 기반으로 관련도 높은 법령 순서로 보여드려요.</p>
      </div>

      {/* 프로필 요약 */}
      <ProfileSummary profile={profile} onEdit={() => window.location.href = '/Rule/profile'} />

      {/* 맞춤 법령 */}
      {matched.length > 0 ? (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-gray-800">맞춤 법령</h2>
            <span className="bg-[#1a3c6e] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {matched.length}건
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {matched.map((law) => (
              <div key={law.id} className="relative">
                {/* 매칭 배지 */}
                <div className="absolute top-3 right-3 z-10">
                  <MatchBadge score={law._score} />
                </div>
                <LawCard law={law} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 mb-8 shadow-sm">
          <p className="text-sm">현재 프로필에 맞는 법령이 없습니다.</p>
          <Link to="/profile" className="mt-2 inline-block text-xs text-[#1a3c6e] font-medium hover:underline">
            프로필 수정하기
          </Link>
        </div>
      )}

      {/* 기타 법령 */}
      {unmatched.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-400 mb-4">
            기타 법령
            <span className="ml-2 text-sm font-normal">{unmatched.length}건</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-60">
            {unmatched.map((law) => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
