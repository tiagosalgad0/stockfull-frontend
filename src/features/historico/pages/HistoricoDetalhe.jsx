// Exibe os ingredientes e resultados guardados em um fechamento escolhido.
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import StatusBadge from '../../../components/ui/StatusBadge'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import * as fechamentoService from '../../fechamento/services/fechamentoService'
import * as ingredienteService from '../../ingredientes/services/ingredienteService'
import { UNIDADE_LABEL } from '../../ingredientes/services/ingredienteService'
import { situacaoRegistro } from '../../../utils/situacaoEstoque'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Mostra o que aconteceu dentro de um fechamento escolhido.
export default function HistoricoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fechamento, setFechamento] = useState(null)
  const [registros, setRegistros] = useState([])
  const [metaPorIngrediente, setMetaPorIngrediente] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fechamentoService.obterFechamento(id),
      fechamentoService.listarRegistros(id),
      ingredienteService.listarIngredientes(),
    ])
      .then(([f, regs, ingredientes]) => {
        setFechamento(f)
        setRegistros(regs)
        setMetaPorIngrediente(Object.fromEntries(ingredientes.map((i) => [i.id, i.meta])))
      })
      .catch(() => setError('Não foi possível carregar este fechamento.'))
      .finally(() => setLoading(false))
  }, [id])

  const colunas = [
    { key: 'ingrediente_nome', header: 'Ingrediente' },
    { key: 'unidade', header: 'Unidade', render: (r) => UNIDADE_LABEL[r.unidade] || r.unidade },
    { key: 'estoque_inicial', header: 'Estoque inicial', render: (r) => Number(r.estoque_inicial).toLocaleString('pt-BR') },
    { key: 'consumo', header: 'Consumo', render: (r) => Number(r.consumo).toLocaleString('pt-BR') },
    {
      key: 'estoque_final',
      header: 'Estoque final',
      render: (r) => (r.estoque_final != null ? Number(r.estoque_final).toLocaleString('pt-BR') : '—'),
    },
    {
      key: 'quantidade_compra',
      header: 'Compra',
      render: (r) => (r.quantidade_compra != null ? Number(r.quantidade_compra).toLocaleString('pt-BR') : '—'),
    },
    {
      key: 'situacao',
      header: 'Situação',
      render: (r) => <StatusBadge status={situacaoRegistro(r, metaPorIngrediente[r.ingrediente])} />,
    },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !fechamento) {
    return <p style={{ color: 'var(--color-danger)' }}>{error || 'Fechamento não encontrado.'}</p>
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/historico')} style={{ marginBottom: 12 }}>
        ← Voltar ao histórico
      </Button>
      <PageHeader
        title={`Detalhes do fechamento — ${MESES[fechamento.mes - 1]}/${fechamento.ano}`}
        description={
          fechamento.data_fechamento
            ? `Encerrado em ${new Date(fechamento.data_fechamento).toLocaleDateString('pt-BR')}`
            : 'Período ainda aberto.'
        }
        action={<StatusBadge status={fechamento.status === 'FECHADO' ? 'concluido' : 'aberto'} />}
      />
      <DataTable columns={colunas} data={registros} loading={false} error="" />
    </div>
  )
}
