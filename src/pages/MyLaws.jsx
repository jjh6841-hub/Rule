export default function MyLaws() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 pb-24 md:pb-8">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">내 맞춤 법령</h2>
        <p className="text-sm text-gray-400">내 정보를 입력하면 나에게 해당하는 법령과 혜택을 모아드려요.</p>
      </div>
    </main>
  )
}
