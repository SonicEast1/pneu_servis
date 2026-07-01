import {
  ADDITIONAL_SERVICES,
  formatPrice,
  SERVICE_PACKAGES,
  SIZE_COLUMNS,
  SUPPLEMENTARY_SERVICES,
  type SizedPriceRow,
} from '@/constants/pricing';

function SizedPriceTable({ rows }: { rows: SizedPriceRow[] }) {
  return (
    <div className="price-table-scroll">
      <table className="price-table-sized">
        <thead>
          <tr>
            <th className="price-col-name">Služba</th>
            <th className="price-col-desc">Popis</th>
            {SIZE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.key === 'van' || col.key === 'suv' ? 'price-col-wide' : 'price-col-size'}
              >
                {col.key === 'van' ? (
                  <>VAN/SUV<br />15&quot;–17&quot;</>
                ) : col.key === 'suv' ? (
                  <>SUV/Offroad<br />18&quot;+</>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="price-col-name">{row.name}</td>
              <td className="price-col-desc text-theme-secondary">{row.description ?? '—'}</td>
              {SIZE_COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={col.key === 'van' || col.key === 'suv' ? 'price-col-wide' : 'price-col-size'}
                >
                  {formatPrice(row.prices[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ServicePackagesTable() {
  return <SizedPriceTable rows={SERVICE_PACKAGES} />;
}

export function AdditionalServicesTable() {
  return <SizedPriceTable rows={ADDITIONAL_SERVICES} />;
}

export function SupplementaryServicesTable() {
  return (
    <div className="price-table-simple-wrap">
      <table className="price-table-simple">
        <thead>
          <tr>
            <th>Služba</th>
            <th>Měrná jednotka</th>
            <th>Poznámka</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {SUPPLEMENTARY_SERVICES.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td className="text-theme-secondary">{row.unit}</td>
              <td className="text-theme-secondary">{row.note ?? '—'}</td>
              <td className="price-table-simple-price">{formatPrice(row.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeCategoryChips() {
  return (
    <div className="size-category-grid">
      {SIZE_COLUMNS.map((col) => (
        <span key={col.key} className="size-category-chip">
          {col.label}
        </span>
      ))}
    </div>
  );
}
