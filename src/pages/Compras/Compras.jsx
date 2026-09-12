import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
import { useEstoqueAtual } from '../../hooks/useEstoqueAtual'
import { UNIDADE_LABEL } from '../../services/ingredienteService'
import './Compras.css'

export default function Compras() {
  const { loading, fechamento, listaCompras, registroPorIngrediente } = useEstoqueAtual()

  const totalItens = listaCompras.length
  const itensCriticos = listaCompras.filter(
    (item) => registroPorIngrediente[item.ingrediente_id]?.faltou
  ).length

  const colunas = [
    { key: 'ingrediente', header: 'Ingrediente' },
    { key: 'unidade', header: 'Unidade', render: (row) => UNIDADE_LABEL[row.unidade] || row.unidade },
    {
      key: 'atual',
      header: 'Estoque atual',
      render: (row) => {
        const registro = registroPorIngrediente[row.ingrediente_id]
        const conhecido = registro && registro.estoque_final !== null && registro.estoque_final !== undefined
        return conhecido ? Number(registro.estoque_final).toLocaleString('pt-BR') : '—'
      },
    },
    {
      key: 'quantidade',
      header: 'Comprar',
      render: (row) => <strong>{Number(row.quantidade).toLocaleString('pt-BR')}</strong>,
    },
    {
      key: 'situacao',
      header: 'Situação',
      render: (row) => (
        <StatusBadge status={registroPorIngrediente[row.ingrediente_id]?.faltou ? 'falta' : 'atencao'} />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Compras"
        description="O que você precisa comprar para repor o estoque até a meta."
      />

      {!loading && fechamento && (
        <div className="compras__resumo">
          <Card className="compras__resumo-item">
            <p className="compras__resumo-valor">{totalItens}</p>
            <p className="compras__resumo-label">itens para comprar</p>
          </Card>
          <Card className="compras__resumo-item">
            <p className="compras__resumo-valor" style={{ color: itensCriticos > 0 ? 'var(--color-danger)' : undefined }}>
              {itensCriticos}
            </p>
            <p className="compras__resumo-label">itens críticos (em falta)</p>
          </Card>
          <Card className="compras__resumo-item">
            <p className="compras__resumo-label" style={{ marginBottom: 4 }}>Período</p>
            <p style={{ fontWeight: 600 }}>
              {String(fechamento.mes).padStart(2, '0')}/{fechamento.ano}
            </p>
          </Card>
        </div>
      )}

      {loading ? (
        <Skeleton height={200} />
      ) : !fechamento ? (
        <Card>
          <EmptyState
            title="Nenhum fechamento em andamento."
            description="Abra um fechamento e registre o estoque para ver o que precisa comprar."
            action={
              <Link to="/fechamento">
                <Button>Abrir fechamento</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <DataTable
          columns={colunas}
          data={listaCompras}
          loading={false}
          error=""
          getRowKey={(row) => row.ingrediente_id}
          empty={
            <EmptyState
              title="Nada para comprar no período atual."
              description="Todos os ingredientes registrados estão dentro da meta."
            />
          }
        />
      )}
    </div>
  )
}
