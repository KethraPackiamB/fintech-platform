import { statusBadge } from "../../utils/format";

export default function DataTable({ columns, rows, empty = "No records" }) {
  if (!rows?.length) return <div className="text-center text-fin-muted py-5">{empty}</div>;
  return (
    <div className="table-responsive">
      <table className="fin-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}>
              {columns.map((c) => (
                <td key={c.key}>
                  {c.render ? (
                    c.render(r)
                  ) : c.type === "status" ? (
                    <span className={`fin-badge ${statusBadge(r[c.key])}`}>
                      {String(r[c.key]).replace("_", " ")}
                    </span>
                  ) : (
                    r[c.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
