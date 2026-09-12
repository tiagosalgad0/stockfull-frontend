import { useEffect, useState } from 'react'
import * as ingredienteService from '../services/ingredienteService'
import * as fechamentoService from '../services/fechamentoService'

// Reúne, num só lugar, os três dados que Dashboard, Estoque e Compras precisam cruzar:
// os ingredientes cadastrados, o fechamento mais recente e os registros desse fechamento.
// Cada tela decide o que fazer com isso; aqui só buscamos e organizamos.
export function useEstoqueAtual() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [ingredientes, setIngredientes] = useState([])
  const [fechamento, setFechamento] = useState(null)
  const [registros, setRegistros] = useState([])
  const [listaCompras, setListaCompras] = useState([])
  const [recarregarContador, setRecarregarContador] = useState(0)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setLoading(true)
      setErro('')
      try {
        const [listaIngredientes, listaFechamentos] = await Promise.all([
          ingredienteService.listarIngredientes(),
          fechamentoService.listarFechamentos(),
        ])
        if (cancelado) return
        setIngredientes(listaIngredientes)

        const atual = listaFechamentos[0] || null
        setFechamento(atual)

        if (atual) {
          const [regs, compras] = await Promise.all([
            fechamentoService.listarRegistros(atual.id),
            fechamentoService.listaCompras(atual.id),
          ])
          if (cancelado) return
          setRegistros(regs)
          setListaCompras(compras)
        } else {
          setRegistros([])
          setListaCompras([])
        }
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os dados do estoque.')
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [recarregarContador])

  // Mapa rápido de ingredienteId -> meta, já que o registro não traz a meta junto.
  const metaPorIngrediente = Object.fromEntries(ingredientes.map((i) => [i.id, i.meta]))
  const registroPorIngrediente = Object.fromEntries(registros.map((r) => [r.ingrediente, r]))

  return {
    loading,
    erro,
    ingredientes,
    fechamento,
    registros,
    listaCompras,
    metaPorIngrediente,
    registroPorIngrediente,
    recarregar: () => setRecarregarContador((c) => c + 1),
  }
}
