import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useEstoqueAtual } from '../../hooks/useEstoqueAtual'
import { situacaoRegistro } from '../../utils/situacaoEstoque'
import './Dashboard.css'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function Dashboard() {
  const { user } = useAuth()
  const { loading, ingredientes, fechamento, registros, listaCompras, metaPorIngrediente } =
    useEstoqueAtual()

  const calculado = registros.some((r) => r.estoque_final !== null && r.estoque_final !== undefined)

  // Cada registro que precisa de atenção ganha uma situação (falta/atenção) e vira uma
  // linha de alerta — os mais graves (falta) sempre aparecem primeiro.
  const alertas = registros
    .map((r) => ({ registro: r, situacao: situacaoRegistro(r, metaPorIngrediente[r.ingrediente]) }))
    .filter((a) => a.situacao !== 'normal')
    .sort((a, b) => (a.situacao === b.situacao ? 0 : a.situacao === 'falta' ? -1 : 1))

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Olá, ${user?.username || ''}. Aqui está um resumo do seu estoque.`}
      />

      <div className="dashboard__stats">
        {loading ? (
          <>
            <Skeleton height={96} />
            <Skeleton height={96} />
            <Skeleton height={96} />
            <Skeleton height={96} />
          </>
        ) : (
          <>
            <StatCard
              title="Ingredientes cadastrados"
              value={ingredientes.length}
              hint={`${ingredientes.filter((i) => i.ativo).length} ativos`}
            />
            <StatCard
              title="Abaixo da meta"
              value={calculado ? alertas.filter((a) => a.situacao === 'atencao').length : '—'}
              tone={calculado && alertas.some((a) => a.situacao === 'atencao') ? 'warning' : 'neutral'}
              hint={calculado ? 'no período atual' : 'calcule o fechamento para ver'}
            />
            <StatCard
              title="Em falta"
              value={fechamento ? alertas.filter((a) => a.situacao === 'falta').length : '—'}
              tone={fechamento && alertas.some((a) => a.situacao === 'falta') ? 'danger' : 'neutral'}
              hint={fechamento ? 'no período atual' : 'sem período aberto'}
            />
            <StatCard
              title="Para comprar"
              value={fechamento ? listaCompras.length : '—'}
              hint={fechamento ? 'itens no período atual' : 'sem período aberto'}
            />
          </>
        )}
      </div>

      <Card className="dashboard__periodo">
        <p className="dashboard__section-title">Último fechamento</p>
        {fechamento ? (
          <div className="dashboard__periodo-row">
            <p>
              Período: <strong>{MESES[fechamento.mes - 1]}/{fechamento.ano}</strong>{' '}
              <StatusBadge status={fechamento.status === 'FECHADO' ? 'concluido' : 'aberto'} />
            </p>
            <Link to={`/historico/${fechamento.id}`}>Ver detalhes</Link>
          </div>
        ) : (
          <p className="dashboard__periodo-row">
            Nenhum fechamento em andamento.{' '}
            <Link to="/fechamento">Abrir um novo período</Link>
          </p>
        )}
      </Card>

      <p className="dashboard__section-title" style={{ marginTop: 24 }}>Alertas</p>
      {loading ? (
        <Card>
          <Skeleton height={20} style={{ marginBottom: 12 }} />
          <Skeleton height={20} style={{ marginBottom: 12 }} />
          <Skeleton height={20} />
        </Card>
      ) : alertas.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum alerta no momento."
            description={
              !fechamento
                ? 'Abra um fechamento para acompanhar a situação do estoque.'
                : 'Todos os ingredientes estão dentro da meta.'
            }
            action={
              !fechamento && (
                <Link to="/fechamento">
                  <Button>Abrir fechamento</Button>
                </Link>
              )
            }
          />
        </Card>
      ) : (
        <Card padded={false}>
          <ul className="dashboard__alerts">
            {alertas.map(({ registro, situacao }) => (
              <li key={registro.id} className="dashboard__alert-item">
                <StatusBadge status={situacao} />
                <span className="dashboard__alert-nome">{registro.ingrediente_nome}</span>
                <span className="dashboard__alert-detalhe">
                  {situacao === 'falta'
                    ? 'Falta registrada no período'
                    : `Estoque final: ${Number(registro.estoque_final).toLocaleString('pt-BR')} de ${Number(
                        metaPorIngrediente[registro.ingrediente]
                      ).toLocaleString('pt-BR')} (meta)`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
