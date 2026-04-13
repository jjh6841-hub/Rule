import { categoryColors } from '../data/mockLaws'

export default function CategoryTag({ category }) {
  const style = categoryColors[category] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${style.bg} ${style.text} ${style.border}`}
    >
      {category}
    </span>
  )
}
