'use client';

import { useId, useState } from 'react';
import { WHEEL_COUNT_BASIC, WHEEL_COUNT_MORE } from '@/constants/reservation';

/**
 * Výběr počtu kol jako „pneumatiky“: tmavá guma s dezénem a ráfek s číslem.
 * 1–4 se vybírá přímo, „5+“ rozbalí řadu 5–10 a zvolené číslo pak nahradí „5+“.
 */
export default function WheelCountPicker({
  value,
  onChange,
  labelId,
}: {
  value: string;
  onChange: (value: string) => void;
  labelId: string;
}) {
  const moreId = useId();
  const isMore = WHEEL_COUNT_MORE.includes(value);
  const [open, setOpen] = useState(false);

  const pick = (count: string) => {
    onChange(count);
    setOpen(false);
  };

  return (
    <div>
      <div className="tire-picker" role="radiogroup" aria-labelledby={labelId}>
        {WHEEL_COUNT_BASIC.map((count) => (
          <button
            key={count}
            type="button"
            role="radio"
            aria-checked={value === count}
            className="tire-option"
            onClick={() => pick(count)}
          >
            <span className="tire-rim">{count}</span>
          </button>
        ))}
        <button
          type="button"
          role="radio"
          aria-checked={isMore}
          aria-controls={moreId}
          aria-label={isMore ? `${value} kol, změnit počet` : 'Více než 4 kola, vybrat počet'}
          className="tire-option"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="tire-rim">{isMore ? value : '5+'}</span>
        </button>
      </div>

      {open && (
        <div id={moreId} className="tire-more" role="group" aria-label="Kolik kol?">
          <span className="tire-more-label">Kolik kol?</span>
          <div className="tire-more-options">
            {WHEEL_COUNT_MORE.map((count) => (
              <button
                key={count}
                type="button"
                role="radio"
                aria-checked={value === count}
                className="tire-option is-small"
                onClick={() => pick(count)}
              >
                <span className="tire-rim">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
