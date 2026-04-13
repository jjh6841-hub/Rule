const OC = 'jjh68412026'
const BASE = '/law-api'

// ─── 유틸 ──────────────────────────────────────────────────────

/** "20250601" → "2025-06-01" */
function formatDate(raw) {
  const s = String(raw ?? '').trim()
  if (s.length !== 8) return s
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

/** 현행연혁코드 → 상태 배지 */
function mapStatus(code) {
  const map = {
    제정: '신규',
    '일부개정': '변경',
    '전부개정': '변경',
    '타법개정': '변경',
    현행: '현행',
    폐지: '폐지',
  }
  return map[code] ?? '현행'
}

/** 법령명 + 검색어로 카테고리 추론 */
const CATEGORY_RULES = [
  { kw: ['전세', '임대', '주거', '주택', '부동산', '임차', '분양'], cat: '주거' },
  { kw: ['청년', '대학생', '취업', '구직'], cat: '청년' },
  { kw: ['소상공인', '창업', '중소기업', '벤처', '자영업', '사업자'], cat: '창업·사업' },
  { kw: ['의료', '건강보험', '병원', '약사', '의사', '의약품', '간호'], cat: '의료·건강' },
  { kw: ['육아', '출산', '보육', '어린이', '아동', '가족', '유아'], cat: '육아·가족' },
]

function guessCategory(title = '', query = '') {
  const text = `${title} ${query}`
  for (const { kw, cat } of CATEGORY_RULES) {
    if (kw.some((k) => text.includes(k))) return cat
  }
  return '기타'
}

/** 법령명에서 태그 추출 */
const TAG_WORDS = ['전세', '임대', '청년', '소상공인', '의료', '육아', '창업', '주택', '건강보험', '출산', '사기', '보육', '아동']

function extractTags(title = '') {
  return TAG_WORDS.filter((w) => title.includes(w))
}

// ─── 변환 ──────────────────────────────────────────────────────

/**
 * 법제처 API 단건 응답 → mockLaws 포맷
 * isExternal: true 이면 LawCard가 외부 링크로 열어줌
 */
function transformLaw(raw, query = '') {
  const get = (k) => raw[k] ?? ''

  const title = get('법령명한글')
  const dept = get('소관부처명')
  const type = get('법령구분명')
  const statusCode = get('현행연혁코드')
  const detailUrl = get('법령상세링크')
  const id = get('법령일련번호') || String(Math.random())

  return {
    id: String(id),
    title,
    category: guessCategory(title, query),
    status: mapStatus(statusCode),
    summary: [dept, type].filter(Boolean).join(' · ') || '법제처 제공 법령',
    effectDate: formatDate(get('시행일자')),
    benefit: dept ? `${dept} 소관 법령. 상세 내용 및 신청은 법제처 사이트를 확인하세요.` : '법제처 원문에서 상세 내용을 확인하세요.',
    applyUrl: detailUrl || 'https://www.law.go.kr',
    tags: extractTags(title),
    detailUrl,
    isExternal: true,
  }
}

// ─── API 함수 ──────────────────────────────────────────────────

/**
 * 키워드로 법령 목록 검색
 * @param {string} query 검색어 (예: "전세 임대 주거")
 * @returns {Promise<Array>} mockLaws 포맷 배열
 */
export async function searchLaws(query) {
  const params = new URLSearchParams({
    OC,
    target: 'law',
    type: 'JSON',
    query,
    display: 20,
    page: 1,
  })

  const res = await fetch(`${BASE}/lawSearch.do?${params}`)
  if (!res.ok) throw new Error(`API 오류 (HTTP ${res.status})`)

  const data = await res.json()

  // 결과 없음
  const rawLaws = data?.LawSearch?.law
  if (!rawLaws) return []

  // 단건이면 객체, 복수면 배열로 옴
  const list = Array.isArray(rawLaws) ? rawLaws : [rawLaws]
  return list.map((l) => transformLaw(l, query))
}

/**
 * 법령 상세 조회
 * @param {string} lawId 법령일련번호
 */
export async function getLawDetail(lawId) {
  const params = new URLSearchParams({
    OC,
    target: 'law',
    type: 'JSON',
    ID: lawId,
  })

  const res = await fetch(`${BASE}/lawService.do?${params}`)
  if (!res.ok) throw new Error(`API 오류 (HTTP ${res.status})`)

  return res.json()
}
