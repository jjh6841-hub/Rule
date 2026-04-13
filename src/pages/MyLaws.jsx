import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LawCard from '../components/LawCard'
import { mockLaws } from '../data/mockLaws'

// ─── 혜택 도출 로직 ──────────────────────────────────────────────
function getPersonalizedBenefits(profile) {
  const benefits = []
  const age = Number(profile.age)

  if (profile.housing === '전세') {
    benefits.push({
      id: 'b-전세',
      icon: '🏠',
      title: '전세보증금 반환보증',
      desc: '전세 거주 중이라면 보증금 전액을 국가가 보장해드려요.',
      amount: '전세금 전액 보장',
      source: '주택도시보증공사(HUG)',
      lawId: 1,
    })
  }

  if (profile.housing === '월세' && age >= 19 && age <= 34) {
    benefits.push({
      id: 'b-청년월세',
      icon: '💸',
      title: '청년 월세 특별지원',
      desc: '만 19~34세 무주택 청년이라면 월세를 지원받을 수 있어요.',
      amount: '월 최대 20만원 × 12개월',
      source: '국토교통부',
      lawId: 2,
    })
  }

  if (age >= 19 && age <= 34 && profile.family === '1인가구') {
    benefits.push({
      id: 'b-청년1인',
      icon: '🎯',
      title: '청년 주거 우선 지원',
      desc: '청년 1인 가구는 주거 안정 지원 사업에 우선 선발 대상이에요.',
      amount: '지원 사업별 상이',
      source: '국토교통부',
      lawId: 2,
    })
  }

  if (profile.job === '자영업자' || profile.job === '프리랜서') {
    benefits.push({
      id: 'b-소상공인',
      icon: '🏪',
      title: '소상공인 폐업 지원금',
      desc: '폐업을 고려 중이라면 철거·재창업·재취업까지 지원받을 수 있어요.',
      amount: '최대 250만원 + 교육 수당',
      source: '소상공인시장진흥공단',
      lawId: 3,
    })
  }

  if (profile.family === '자녀있음' || profile.family === '부부') {
    benefits.push({
      id: 'b-육아',
      icon: '👶',
      title: '육아휴직 급여 인상',
      desc: '자녀가 있다면 첫 3개월 통상임금 100%를 받을 수 있어요.',
      amount: '첫 3개월 통상임금 100% (상한 250만원)',
      source: '고용노동부',
      lawId: 5,
    })
  }

  if (profile.job === '의료 종사자') {
    benefits.push({
      id: 'b-emr',
      icon: '🏥',
      title: 'EMR 클라우드 전환 지원',
      desc: '전자의무기록 클라우드 이관 절차가 명확해져 비용 절감이 가능해요.',
      amount: '이관 절차 간소화 혜택',
      source: '보건복지부',
      lawId: 8,
    })
  }

  return benefits
}

// ─── 하위 컴포넌트 ───────────────────────────────────────────────

function SectionHeader({ icon, title, count, color = 'text-gray-800' }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h2 className={`text-base font-bold ${color}`}>{title}</h2>
      {count !== undefined && (
        <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
          {count}건
        </span>
      )}
    </div>
  )
}

function BenefitCard({ benefit }) {
  return (
    <Link
      to={`/law/${benefit.lawId}`}
      className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl shrink-0">
        {benefit.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-gray-900 group-hover:text-[#1a3c6e] transition-colors mb-0.5">
          {benefit.title}
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mb-2">{benefit.desc}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
            {benefit.amount}
          </span>
          <span className="text-xs text-gray-400">{benefit.source}</span>
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a3c6e] shrink-0 mt-1 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  )
}

function ProfileChip({ label, value }) {
  return (
    <span className="bg-white/15 rounded-lg px-3 py-1 text-xs border border-white/20">
      <span className="text-blue-200">{label} </span>
      <span className="font-semibold">{value}</span>
    </span>
  )
}

function EmptyState({ message }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 py-8 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

// ─── 메인 ────────────────────────────────────────────────────────

export default function MyLaws() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('lawping_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  // 프로필 없음
  if (!profile) {
    return (
      <main className="max-w-[780px] mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">내 정보를 먼저 입력해주세요</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            나이, 직업, 주거형태 등을 입력하면<br />나에게 딱 맞는 혜택과 법령을 찾아드려요.
          </p>
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

  const benefits = getPersonalizedBenefits(profile)

  // 섹션 2: 내 관심 카테고리 기반 법령 (medicalWorkerOnly 제외)
  const generalLaws = mockLaws.filter((l) => !l.medicalWorkerOnly)
  const relatedLaws =
    profile.categories.length > 0
      ? generalLaws.filter((l) => profile.categories.includes(l.category))
      : generalLaws

  // 섹션 3: 의료 종사자 전용
  const isMedical = profile.job === '의료 종사자'
  const medicalLaws = mockLaws
    .filter((l) => l.medicalWorkerOnly)
    .sort((a, b) => new Date(b.effectDate) - new Date(a.effectDate))

  return (
    <main className="max-w-[780px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">내 맞춤 법령</h1>
        <p className="text-sm text-gray-400">내 정보 기반으로 혜택과 관련 법령을 정리했어요.</p>
      </div>

      {/* 프로필 요약 배너 */}
      <div className="bg-gradient-to-br from-[#1a3c6e] to-[#2563eb] rounded-2xl p-5 text-white mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-blue-100">현재 프로필</p>
          <Link
            to="/profile"
            className="text-xs text-blue-200 hover:text-white flex items-center gap-1 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            수정
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <ProfileChip label="나이" value={`${profile.age}세`} />
          <ProfileChip label="직업" value={profile.job} />
          <ProfileChip label="주거" value={profile.housing} />
          <ProfileChip label="가족" value={profile.family} />
          {profile.categories.length > 0 && (
            <ProfileChip label="관심" value={profile.categories.join(' · ')} />
          )}
        </div>
      </div>

      {/* ── 섹션 1: 받을 수 있는 혜택 ── */}
      <section className="mb-10">
        <SectionHeader icon="✅" title="받을 수 있는 혜택" count={benefits.length} color="text-gray-900" />
        {benefits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {benefits.map((b) => <BenefitCard key={b.id} benefit={b} />)}
          </div>
        ) : (
          <EmptyState message="현재 프로필에 맞는 혜택이 없습니다. 관심 카테고리를 추가하면 더 많은 혜택을 확인할 수 있어요." />
        )}
      </section>

      {/* ── 섹션 2: 관련 법안 ── */}
      <section className="mb-10">
        <SectionHeader
          icon="📋"
          title="관련 법안"
          count={relatedLaws.length}
          color="text-gray-900"
        />
        {profile.categories.length === 0 && (
          <p className="text-xs text-gray-400 mb-3">
            관심 카테고리를 설정하면 맞춤 법령만 볼 수 있어요. —{' '}
            <Link to="/profile" className="text-[#1a3c6e] font-medium hover:underline">카테고리 설정</Link>
          </p>
        )}
        {relatedLaws.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedLaws.map((law) => <LawCard key={law.id} law={law} />)}
          </div>
        ) : (
          <EmptyState message="선택한 카테고리에 해당하는 법령이 없습니다." />
        )}
      </section>

      {/* ── 섹션 3: 의료 종사자 법령 (조건부) ── */}
      {isMedical && (
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🩺</span>
            <h2 className="text-base font-bold text-gray-900">의료 종사자 전용 법령</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              {medicalLaws.length}건
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-7">의료직 종사자에게만 노출되는 법령입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicalLaws.map((law) => <LawCard key={law.id} law={law} />)}
          </div>
        </section>
      )}
    </main>
  )
}
