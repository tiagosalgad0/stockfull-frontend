// Título e descrição que apresentam cada página, com espaço opcional para uma ação
import './PageHeader.css'

// Apresenta o título, a explicação e a ação principal da página
export default function PageHeader({ title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <h2 className="page-header__title">{title}</h2>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  )
}
