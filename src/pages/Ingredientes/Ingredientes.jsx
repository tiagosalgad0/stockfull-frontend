import { useMemo, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import IngredienteForm from '../../components/estoque/IngredienteForm'
import { useToast } from '../../hooks/useToast'
import { useEstoqueAtual } from '../../hooks/useEstoqueAtual'
import { situacaoRegistro } from '../../utils/situacaoEstoque'
import * as ingredienteService from '../../services/ingredienteService'
import { UNIDADE_LABEL } from '../../services/ingredienteService'

export default function Ingredientes() {
  const toast = useToast()
  const { loading, erro, ingredientes, registroPorIngrediente, recarregar } = useEstoqueAtual()
  const [busca, setBusca] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const [excluindo, setExcluindo] = useState(null)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return ingredientes
    return ingredientes.filter((i) => i.nome.toLowerCase().includes(termo))
  }, [busca, ingredientes])

  function abrirNovo() {
    setEditando(null)
    setModalAberto(true)
  }

  function abrirEdicao(ingrediente) {
    setEditando(ingrediente)
    setModalAberto(true)
  }

  async function handleSubmit(valores) {
    setSalvando(true)
    try {
      if (editando) {
        await ingredienteService.atualizarIngrediente(editando.id, valores)
        toast.success('Alterações salvas.')
      } else {
        await ingredienteService.criarIngrediente(valores)
        toast.success('Ingrediente cadastrado com sucesso.')
      }
      setModalAberto(false)
      recarregar()
    } catch (err) {
      toast.error(err.message || 'Não foi possível salvar o ingrediente.')
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    setConfirmandoExclusao(true)
    try {
      await ingredienteService.excluirIngrediente(excluindo.id)
      toast.success('Ingrediente excluído.')
      setExcluindo(null)
      recarregar()
    } catch (err) {
      const mensagem =
        err.status >= 500
          ? 'Não foi possível excluir: este ingrediente já possui histórico de estoque.'
          : err.message
      toast.error(mensagem || 'Não foi possível excluir o ingrediente.')
    } finally {
      setConfirmandoExclusao(false)
    }
  }

  const colunas = [
    { key: 'nome', header: 'Ingrediente' },
    { key: 'unidade', header: 'Unidade', render: (row) => UNIDADE_LABEL[row.unidade] || row.unidade },
    { key: 'meta', header: 'Meta', render: (row) => Number(row.meta).toLocaleString('pt-BR') },
    {
      key: 'atual',
      header: 'Estoque atual',
      render: (row) => {
        const registro = registroPorIngrediente[row.id]
        const conhecido = registro && registro.estoque_final !== null && registro.estoque_final !== undefined
        return conhecido ? Number(registro.estoque_final).toLocaleString('pt-BR') : '—'
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        if (!row.ativo) return <StatusBadge status="falta" />
        const registro = registroPorIngrediente[row.id]
        // Sem registro calculado no período atual, ainda não dá pra dizer a situação do estoque —
        // só mostramos se o ingrediente está ativo, sem inventar uma situação que não existe.
        if (!registro) return <span style={{ color: 'var(--color-text-secondary)' }}>Sem dados no período</span>
        return <StatusBadge status={situacaoRegistro(registro, row.meta)} />
      },
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" onClick={() => abrirEdicao(row)}>
            Editar
          </Button>
          <Button variant="ghost" onClick={() => setExcluindo(row)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Estoque"
        description="Gerencie os ingredientes e acompanhe suas quantidades."
        action={<Button onClick={abrirNovo}>+ Novo ingrediente</Button>}
      />

      <div style={{ marginBottom: 16, maxWidth: 320 }}>
        <Input
          placeholder="Buscar ingrediente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar ingrediente"
        />
      </div>

      <DataTable
        columns={colunas}
        data={filtrados}
        loading={loading}
        error={erro}
        empty={
          <EmptyState
            title={busca ? 'Nenhum ingrediente encontrado.' : 'Nenhum ingrediente cadastrado.'}
            description={
              busca
                ? 'Tente buscar por outro nome.'
                : 'Cadastre seu primeiro ingrediente para começar a controlar o estoque.'
            }
            action={!busca && <Button onClick={abrirNovo}>Adicionar ingrediente</Button>}
          />
        }
      />

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title={editando ? 'Editar ingrediente' : 'Novo ingrediente'}
      >
        <IngredienteForm
          initialValues={editando}
          onSubmit={handleSubmit}
          onCancel={() => setModalAberto(false)}
          submitting={salvando}
        />
      </Modal>

      <Modal
        open={Boolean(excluindo)}
        onClose={() => setExcluindo(null)}
        title="Excluir ingrediente?"
        width={400}
        footer={
          <>
            <Button variant="secondary" onClick={() => setExcluindo(null)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={confirmandoExclusao} onClick={confirmarExclusao}>
              Excluir
            </Button>
          </>
        }
      >
        <p>
          Tem certeza que deseja excluir <strong>{excluindo?.nome}</strong>? Essa ação não poderá
          ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
