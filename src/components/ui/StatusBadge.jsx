import Badge from './Badge'

const STATUS_MAP = {
  normal: { tone: 'success', label: 'Normal' },
  atencao: { tone: 'warning', label: 'Atenção' },
  falta: { tone: 'danger', label: 'Em falta' },
  aberto: { tone: 'info', label: 'Aberto' },
  concluido: { tone: 'neutral', label: 'Concluído' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { tone: 'neutral', label: status }
  return <Badge tone={config.tone}>{config.label}</Badge>
}
