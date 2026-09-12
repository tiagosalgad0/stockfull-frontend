import Card from './Card'
import './StatCard.css'

export default function StatCard({ title, value, hint, tone = 'neutral' }) {
  return (
    <Card className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </Card>
  )
}
