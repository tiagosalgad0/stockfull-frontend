// Lista os fechamentos anteriores para que seja fácil consultar cada período.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import StatusBadge from '../../../components/ui/StatusBadge'
import Button from '../../../components/ui/Button'
import * as fechamentoService from '../../fechamento/services/fechamentoService'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Lista os fechamentos anteriores para consulta.
export default function Historico() {
  const navigate = useNavigate()
  const [fechamentos, setFechamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fechamentoService
      .listarFechamentos()
      .then(setFechamentos)
      .catch(() => setError('Não foi possível carregar o histórico.'))
      .finally(() => setLoading(false))
  }, [])

  const colunas = [
    { key: 'periodo', header: 'Período', render: (row) => `${MESES[row.mes - 1]}/${row.ano}` },
    {
      key: 'data_fechamento',
      header: 'Data de encerramento',
      render: (row) => (row.data_fechamento ? new Date(row.data_fechamento).toLocaleDateString('pt-BR') : '—'),
    },
    {
      key: 'status',
      header: 'Situação',
      render: (row) => <StatusBadge status={row.status === 'FECHADO' ? 'concluido' : 'aberto'} />,
    },
    {
      key: 'acoes',
      header: '',
      render: (row) => (
        <Button variant="ghost" onClick={() => navigate(`/historico/${row.id}`)}>
          Ver detalhes
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Histórico"
        description="Acompanhe os fechamentos realizados anteriormente."
      />
      <DataTable columns={colunas} data={fechamentos} loading={loading} error={error} />
    </div>
  )
}
