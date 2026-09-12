import Skeleton from './Skeleton'
import EmptyState from './EmptyState'
import './DataTable.css'

export default function DataTable({
  columns,
  data,
  loading,
  error,
  getRowKey = (row) => row.id,
  empty,
  skeletonRows = 5,
}) {
  if (error) {
    return (
      <div className="data-table__state data-table__state--error">
        <p>{error}</p>
      </div>
    )
  }

  if (!loading && data.length === 0) {
    return <div className="data-table__state">{empty || <EmptyState title="Nenhum item encontrado." />}</div>
  }

  return (
    <div className="data-table__scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
