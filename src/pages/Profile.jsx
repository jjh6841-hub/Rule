export default function Profile() {
  return (
    <main className="max-w-[800px] mx-auto px-6 py-8 pb-24 md:pb-8">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">내 정보 설정</h2>
        <p className="text-sm text-gray-400">곧 오픈됩니다. 나이, 직업, 주거형태 등을 입력하면 맞춤 법령을 추천받을 수 있어요.</p>
      </div>
    </main>
  )
}
