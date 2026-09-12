import { useState } from 'react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import StatusBadge from '../ui/StatusBadge'
import { UNIDADE_LABEL } from '../../services/ingredienteService'
import { situacaoRegistro } from '../../utils/situacaoEstoque'

function paraForm(registro) {
  return {
    estoque_inicial: registro?.estoque_inicial ?? '',
    consumo: registro?.consumo ?? '',
    faltou: registro?.faltou ?? false,
    data_falta: registro?.data_falta ?? '',
    venceu: registro?.venceu ?? false,
  }
}

export default function RegistroEstoqueRow({ ingrediente, registro, readOnly, onSave }) {
  const [valores, setValores] = useState(paraForm(registro))
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  function set(campo, valor) {
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  async function salvar() {
    setErro('')
    if (valores.estoque_inicial === '' || valores.consumo === '') {
      setErro('Preencha estoque inicial e consumo.')
      return
    }
    if (valores.faltou && !valores.data_falta) {
      setErro('Informe a data da falta.')
      return
    }

    setSalvando(true)
    try {
      await onSave({
        ingrediente: ingrediente.id,
        estoque_inicial: String(valores.estoque_inicial),
        consumo: String(valores.consumo),
        faltou: valores.faltou,
        data_falta: valores.faltou ? valores.data_falta : null,
        venceu: valores.venceu,
      })
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar este registro.')
    } finally {
      setSalvando(false)
    }
  }

  const calculado = registro && registro.estoque_final !== null && registro.estoque_final !== undefined

  return (
    <tr>
      <td>{ingrediente.nome}</td>
      <td>{UNIDADE_LABEL[ingrediente.unidade] || ingrediente.unidade}</td>
      <td>{Number(ingrediente.meta).toLocaleString('pt-BR')}</td>
      <td style={{ minWidth: 96 }}>
        <input
          className="field__control"
          type="number"
          min="0"
          step="0.01"
          disabled={readOnly}
          value={valores.estoque_inicial}
          onChange={(e) => set('estoque_inicial', e.target.value)}
        />
      </td>
      <td style={{ minWidth: 96 }}>
        <input
          className="field__control"
          type="number"
          min="0"
          step="0.01"
          disabled={readOnly}
          value={valores.consumo}
          onChange={(e) => set('consumo', e.target.value)}
        />
      </td>
      <td>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={valores.faltou}
            onChange={(e) => set('faltou', e.target.checked)}
          />
          Faltou
        </label>
      </td>
      <td style={{ minWidth: 140 }}>
        {valores.faltou && (
          <input
            className="field__control"
            type="date"
            disabled={readOnly}
            value={valores.data_falta || ''}
            onChange={(e) => set('data_falta', e.target.value)}
          />
        )}
      </td>
      <td>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={valores.venceu}
            onChange={(e) => set('venceu', e.target.checked)}
          />
          Venceu
        </label>
      </td>
      <td>{calculado ? Number(registro.estoque_final).toLocaleString('pt-BR') : '—'}</td>
      <td>{calculado ? Number(registro.quantidade_compra).toLocaleString('pt-BR') : '—'}</td>
      <td>
        {calculado ? (
          <StatusBadge status={situacaoRegistro(registro, ingrediente.meta)} />
        ) : (
          <span style={{ color: 'var(--color-text-secondary)' }}>—</span>
        )}
      </td>
      <td>
        {!readOnly && (
          <Button variant="secondary" onClick={salvar} loading={salvando}>
            {registro ? 'Atualizar' : 'Salvar'}
          </Button>
        )}
        {registro && !erro && <Badge tone="success">Salvo</Badge>}
        {erro && (
          <span style={{ color: 'var(--color-danger)', fontSize: 12.5, display: 'block', marginTop: 4 }}>
            {erro}
          </span>
        )}
      </td>
    </tr>
  )
}
