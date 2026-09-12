import Card from '../../../components/ui/Card'
import './FechamentoResumo.css'

export default function FechamentoResumo({ totalRegistros, totalCompras, totalFaltas }) {
  return (
    <Card className="fechamento-resumo">
      <p className="fechamento-resumo__title">Fechamento concluído</p>
      <div className="fechamento-resumo__grid">
        <div>
          <p className="fechamento-resumo__value">{totalRegistros}</p>
          <p className="fechamento-resumo__label">ingredientes registrados</p>
        </div>
        <div>
          <p className="fechamento-resumo__value">{totalCompras}</p>
          <p className="fechamento-resumo__label">itens para repor</p>
        </div>
        <div>
          <p className="fechamento-resumo__value" style={{ color: 'var(--color-danger)' }}>
            {totalFaltas}
          </p>
          <p className="fechamento-resumo__label">itens em falta</p>
        </div>
      </div>
    </Card>
  )
}
