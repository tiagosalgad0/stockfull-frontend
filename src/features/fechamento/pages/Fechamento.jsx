// Página em que o estoque é registrado, calculado e finalmente encerrado.
import { useEffect, useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import RegistroEstoqueRow from '../components/RegistroEstoqueRow'
import FechamentoResumo from '../components/FechamentoResumo'
import { useToast } from '../../../app/providers/ToastProvider'
import * as ingredienteService from '../../ingredientes/services/ingredienteService'
import * as fechamentoService from '../services/fechamentoService'

const MES_ATUAL = new Date().getMonth() + 1
const ANO_ATUAL = new Date().getFullYear()

// Cuida da tela de abertura, registro e encerramento do período.
export default function Fechamento() {
  const toast = useToast()
  const [carregando, setCarregando] = useState(true)
  const [ingredientes, setIngredientes] = useState([])
  const [fechamento, setFechamento] = useState(null)
  const [registros, setRegistros] = useState({})

  const [ano, setAno] = useState(ANO_ATUAL)
  const [mes, setMes] = useState(MES_ATUAL)
  const [abrindo, setAbrindo] = useState(false)

  const [calculando, setCalculando] = useState(false)
  const [encerrando, setEncerrando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [sugestoes, setSugestoes] = useState([])

  // Busca os dados necessários para preencher a tela de fechamento.
  async function carregarTudo() {
    setCarregando(true)
    try {
      const [listaIngredientes, listaFechamentos] = await Promise.all([
        ingredienteService.listarIngredientes(),
        fechamentoService.listarFechamentos(),
      ])
      setIngredientes(listaIngredientes.filter((i) => i.ativo))

      const atual = listaFechamentos[0] || null
      setFechamento(atual)

      if (atual) {
        const regs = await fechamentoService.listarRegistros(atual.id)
        setRegistros(Object.fromEntries(regs.map((r) => [r.ingrediente, r])))

        if (atual.status === 'FECHADO') {
          const [compras, sugs] = await Promise.all([
            fechamentoService.listaCompras(atual.id),
            fechamentoService.sugestoesMetas(atual.id),
          ])
          setResultado({
            totalRegistros: regs.length,
            totalCompras: compras.length,
            totalFaltas: regs.filter((r) => r.faltou).length,
          })
          setSugestoes(sugs)
        }
      }
    } catch {
      toast.error('Não foi possível carregar os dados do fechamento.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTudo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cria um novo período usando o ano e o mês informados.
  async function abrirPeriodo(e) {
    e.preventDefault()
    setAbrindo(true)
    try {
      const novo = await fechamentoService.criarFechamento(Number(ano), Number(mes))
      toast.success('Período de fechamento aberto.')
      setFechamento(novo)
      setRegistros({})
    } catch (err) {
      toast.error(err.message || 'Não foi possível abrir o período.')
    } finally {
      setAbrindo(false)
    }
  }

  // Guarda uma linha de estoque e atualiza a lista exibida.
  async function salvarRegistro(dados) {
    const existente = registros[dados.ingrediente]
    const salvo = existente
      ? await fechamentoService.atualizarRegistro(fechamento.id, existente.id, dados)
      : await fechamentoService.registrarEstoque(fechamento.id, dados)
    setRegistros((r) => ({ ...r, [dados.ingrediente]: salvo }))
  }

  // Pede o cálculo do fechamento com os registros já informados.
  async function calcular() {
    setCalculando(true)
    try {
      const regs = await fechamentoService.calcularFechamento(fechamento.id)
      setRegistros(Object.fromEntries(regs.map((r) => [r.ingrediente, r])))
      toast.success('Cálculo atualizado.')
    } catch (err) {
      toast.error(err.message || 'Não foi possível calcular o fechamento.')
    } finally {
      setCalculando(false)
    }
  }

  // Finaliza o período depois de apresentar o resultado.
  async function encerrar() {
    setEncerrando(true)
    try {
      const atualizado = await fechamentoService.encerrarFechamento(fechamento.id)
      setFechamento(atualizado)
      toast.success('Fechamento realizado com sucesso.')
      await carregarTudo()
    } catch (err) {
      toast.error(err.message || 'Não foi possível finalizar o fechamento.')
    } finally {
      setEncerrando(false)
    }
  }

  // Confirma a nova meta sugerida para um ingrediente.
  async function confirmarMeta(sugestao) {
    try {
      await ingredienteService.confirmarNovaMeta(sugestao.ingrediente_id, sugestao.nova_meta_sugerida)
      toast.success(`Nova meta confirmada para ${sugestao.ingrediente}.`)
      setSugestoes((s) => s.filter((x) => x.ingrediente_id !== sugestao.ingrediente_id))
    } catch (err) {
      toast.error(err.message || 'Não foi possível atualizar a meta.')
    }
  }

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!fechamento) {
    return (
      <div>
        <PageHeader
          title="Fechamento de estoque"
          description="Abra um novo período para registrar o estoque disponível."
        />
        <Card style={{ maxWidth: 420 }}>
          <form onSubmit={abrirPeriodo} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Ano" type="number" value={ano} onChange={(e) => setAno(e.target.value)} />
            <Input label="Mês (1-12)" type="number" min="1" max="12" value={mes} onChange={(e) => setMes(e.target.value)} />
            <Button type="submit" loading={abrindo}>
              {abrindo ? 'Abrindo...' : 'Abrir período'}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  const readOnly = fechamento.status === 'FECHADO'

  return (
    <div>
      <PageHeader
        title="Fechamento de estoque"
        description={`Período: ${String(fechamento.mes).padStart(2, '0')}/${fechamento.ano} — ${
          readOnly ? 'Encerrado' : 'Registre o estoque disponível para iniciar o próximo período.'
        }`}
        action={
          !readOnly && (
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" onClick={calcular} loading={calculando}>
                Calcular
              </Button>
              <Button onClick={encerrar} loading={encerrando}>
                Finalizar fechamento
              </Button>
            </div>
          )
        }
      />

      {resultado && (
        <div style={{ marginBottom: 24 }}>
          <FechamentoResumo {...resultado} />
        </div>
      )}

      {ingredientes.length === 0 ? (
        <EmptyState
          title="Nenhum ingrediente ativo cadastrado."
          description="Cadastre ingredientes antes de registrar um fechamento."
        />
      ) : (
        <div className="data-table__scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Unidade</th>
                <th>Meta</th>
                <th>Estoque inicial</th>
                <th>Consumo</th>
                <th>Falta</th>
                <th>Data da falta</th>
                <th>Vencimento</th>
                <th>Estoque final</th>
                <th>Compra sugerida</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ingrediente) => (
                <RegistroEstoqueRow
                  key={ingrediente.id}
                  ingrediente={ingrediente}
                  registro={registros[ingrediente.id]}
                  readOnly={readOnly}
                  onSave={salvarRegistro}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sugestoes.length > 0 && (
        <Card style={{ marginTop: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Sugestões de nova meta</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sugestoes.map((s) => (
              <div
                key={s.ingrediente_id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <span>
                  {s.ingrediente}: meta atual {Number(s.meta_atual).toLocaleString('pt-BR')} → sugerida{' '}
                  <strong>{Number(s.nova_meta_sugerida).toLocaleString('pt-BR')}</strong>
                </span>
                <Button variant="secondary" onClick={() => confirmarMeta(s)}>
                  Confirmar nova meta
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
