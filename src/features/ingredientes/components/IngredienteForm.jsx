// Formulário usado tanto para incluir quanto para ajustar um ingrediente.
import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import { UNIDADES } from '../services/ingredienteService'

// Um ingrediente "em branco", usado como ponto de partida quando estamos criando um novo.
const VAZIO = { nome: '', unidade: '', meta: '', prazo_validade_dias: '', ativo: true }

// Este formulário serve tanto para cadastrar um ingrediente novo quanto para editar um
// que já existe. Se vier um "initialValues" preenchido, estamos editando; se não vier
// nada, começamos do zero com os campos vazios.
export default function IngredienteForm({ initialValues, onSubmit, onCancel, submitting }) {
  // Guarda o que a pessoa está digitando no formulário.
  const [values, setValues] = useState({ ...VAZIO, ...initialValues })
  // Guarda as mensagens de erro de cada campo, para mostrar embaixo do input certo.
  const [errors, setErrors] = useState({})

  // Pequeno atalho para atualizar só um campo do formulário sem apagar os outros.
  function set(campo, valor) {
    setValues((v) => ({ ...v, [campo]: valor }))
  }

  // Confere se o formulário pode ser enviado. Se algo estiver errado, guarda a mensagem
  // de erro correspondente e devolve "false" para avisar que não deve enviar ainda.
  function validar() {
    const proximosErros = {}
    if (!values.nome.trim()) proximosErros.nome = 'Informe o nome do ingrediente.'
    if (!values.unidade) proximosErros.unidade = 'Selecione a unidade.'
    if (!values.meta || Number(values.meta) <= 0) proximosErros.meta = 'A meta deve ser maior que zero.'
    if (!values.prazo_validade_dias || Number(values.prazo_validade_dias) < 1) {
      proximosErros.prazo_validade_dias = 'Informe um prazo de validade válido (em dias).'
    }
    setErrors(proximosErros)
    return Object.keys(proximosErros).length === 0
  }

  // Chamado quando a pessoa clica em "Cadastrar" ou "Salvar alterações".
  function handleSubmit(e) {
    e.preventDefault() // evita que a página recarregue sozinha, como formulários HTML fazem por padrão
    if (!validar()) return // se tiver erro, para por aqui e deixa as mensagens na tela

    // Só depois de validado é que avisamos o componente pai, já com os dados arrumados
    // no formato que a API espera (números como número, texto sem espaços sobrando etc.).
    onSubmit({
      nome: values.nome.trim(),
      unidade: values.unidade,
      meta: String(values.meta),
      prazo_validade_dias: Number(values.prazo_validade_dias),
      ativo: values.ativo,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Nome"
        value={values.nome}
        onChange={(e) => set('nome', e.target.value)}
        error={errors.nome}
        autoFocus
      />
      <Select
        label="Unidade"
        placeholder="Selecione a unidade"
        options={UNIDADES}
        value={values.unidade}
        onChange={(e) => set('unidade', e.target.value)}
        error={errors.unidade}
      />
      <Input
        label="Meta (quantidade desejada por período)"
        type="number"
        min="0.01"
        step="0.01"
        value={values.meta}
        onChange={(e) => set('meta', e.target.value)}
        error={errors.meta}
      />
      <Input
        label="Prazo de validade (dias)"
        type="number"
        min="1"
        step="1"
        value={values.prazo_validade_dias}
        onChange={(e) => set('prazo_validade_dias', e.target.value)}
        error={errors.prazo_validade_dias}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
        <input
          type="checkbox"
          checked={values.ativo}
          onChange={(e) => set('ativo', e.target.checked)}
        />
        Ingrediente ativo
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {/* O texto do botão muda conforme o momento: enviando, editando ou criando. */}
          {submitting
            ? initialValues ? 'Salvando...' : 'Cadastrando...'
            : initialValues ? 'Salvar alterações' : 'Cadastrar ingrediente'}
        </Button>
      </div>
    </form>
  )
}
