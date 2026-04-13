import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const JOBS = ['직장인', '자영업자', '프리랜서', '학생', '무직', '의료 종사자']
const HOUSINGS = ['자가', '전세', '월세', '기숙사/기타']
const FAMILIES = ['1인가구', '부부', '자녀있음']
const VEHICLES = ['있음', '없음']
const CATEGORIES = ['주거', '청년', '창업·사업', '의료·건강', '육아·가족']

const EMPTY_PROFILE = {
  age: '',
  job: '',
  housing: '',
  family: '',
  vehicle: '',
  categories: [],
}

function SectionCard({ title, description, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px]">{title}</h3>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function ChoiceButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150
        ${active
          ? 'bg-[#1a3c6e] text-white border-[#1a3c6e] shadow-sm'
          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1a3c6e]/40 hover:text-[#1a3c6e]'
        }`}
    >
      {label}
    </button>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('lawping_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  const set = (key, value) => setProfile((p) => ({ ...p, [key]: value }))

  const toggleCategory = (cat) => {
    setProfile((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }))
  }

  const handleSave = () => {
    localStorage.setItem('lawping_profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => navigate('/my-laws'), 600)
  }

  const isComplete =
    profile.age !== '' &&
    profile.job !== '' &&
    profile.housing !== '' &&
    profile.family !== '' &&
    profile.vehicle !== ''

  return (
    <main className="max-w-[680px] mx-auto px-6 py-8 pb-24 md:pb-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">내 정보 설정</h1>
        <p className="text-sm text-gray-400">
          입력한 정보를 바탕으로 나에게 맞는 법령과 혜택을 추천해드려요.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 나이 */}
        <SectionCard
          title="나이"
          description="만 나이 기준으로 입력해주세요"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20v-2a6 6 0 0112 0v2" />
            </svg>
          }
        >
          <div className="relative w-40">
            <input
              type="number"
              min={1}
              max={100}
              placeholder="예) 29"
              value={profile.age}
              onChange={(e) => set('age', e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm
                text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-[#1a3c6e]/20 focus:border-[#1a3c6e] transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">세</span>
          </div>
        </SectionCard>

        {/* 직업 */}
        <SectionCard
          title="직업"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="12" strokeWidth="3" />
              <path d="M2 12h20" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {JOBS.map((j) => (
              <ChoiceButton key={j} label={j} active={profile.job === j} onClick={() => set('job', j)} />
            ))}
          </div>
        </SectionCard>

        {/* 주거형태 */}
        <SectionCard
          title="주거형태"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {HOUSINGS.map((h) => (
              <ChoiceButton key={h} label={h} active={profile.housing === h} onClick={() => set('housing', h)} />
            ))}
          </div>
        </SectionCard>

        {/* 가족구성 */}
        <SectionCard
          title="가족구성"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map((f) => (
              <ChoiceButton key={f} label={f} active={profile.family === f} onClick={() => set('family', f)} />
            ))}
          </div>
        </SectionCard>

        {/* 차량 유무 */}
        <SectionCard
          title="차량 유무"
          description="일부 지원 사업의 재산 기준에 활용돼요"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {VEHICLES.map((v) => (
              <ChoiceButton key={v} label={v} active={profile.vehicle === v} onClick={() => set('vehicle', v)} />
            ))}
          </div>
        </SectionCard>

        {/* 관심 카테고리 */}
        <SectionCard
          title="관심 카테고리"
          description="복수 선택 가능 — 선택한 분야 법령을 우선 노출해드려요"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <ChoiceButton
                key={cat}
                label={cat}
                active={profile.categories.includes(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>
          {profile.categories.length > 0 && (
            <p className="mt-3 text-xs text-[#1a3c6e] font-medium">
              {profile.categories.length}개 선택됨
            </p>
          )}
        </SectionCard>

        {/* 저장 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isComplete || saved}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm
            ${saved
              ? 'bg-green-500 text-white'
              : isComplete
                ? 'bg-[#1a3c6e] text-white hover:bg-[#15306b] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              저장 완료! 내 법령으로 이동 중...
            </span>
          ) : (
            '저장하고 내 맞춤 법령 보기 →'
          )}
        </button>

        {!isComplete && (
          <p className="text-center text-xs text-gray-400">
            나이, 직업, 주거형태, 가족구성, 차량 유무를 모두 선택해주세요
          </p>
        )}
      </div>
    </main>
  )
}
