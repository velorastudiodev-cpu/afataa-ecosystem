'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';

type FooterCalendarProps = {
  calLink: string;
};

const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const monthFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
});

function startOfCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function FooterCalendar({ calLink }: FooterCalendarProps) {
  const [month, setMonth] = useState(() => startOfCalendarMonth(new Date()));
  const calUrl = `https://cal.com/${calLink}`;

  const days = useMemo(() => {
    // Convert Sunday-first JS dates to a Monday-first editorial calendar.
    const firstWeekday = (month.getDay() + 6) % 7;
    const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), index - firstWeekday + 1);
      cells.push({ date, inMonth: false });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      cells.push({ date: new Date(month.getFullYear(), month.getMonth(), day), inMonth: true });
    }
    while (cells.length < 42) {
      const trailingIndex = cells.length - (firstWeekday + totalDays);
      const date = new Date(month.getFullYear(), month.getMonth(), totalDays + trailingIndex + 1);
      cells.push({ date, inMonth: false });
    }
    return cells;
  }, [month]);

  const today = dateKey(new Date());

  return (
    <div className="footer-calendar" aria-label="Kalender konsultasi Cal.com">
      <div className="footer-calendar-copy">
        <p className="mono">Kalender konsultasi terbuka</p>
        <h2>
          Pilih jadwal pertemuan yang <em>sesuai.</em>
        </h2>
        <p>
          Pilih tanggal yang sesuai dengan agenda Anda. Setiap tanggal terhubung langsung
          dengan halaman penjadwalan Cal.com yang menampilkan ketersediaan waktu terkini.
        </p>
        <a className="footer-calendar-link" href={calUrl} target="_blank" rel="noreferrer">
          Lihat Seluruh Jadwal Tersedia <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="calendar-shell">
        <div className="calendar-head">
          <div>
            <span className="calendar-kicker"><Clock3 size={13} /> Sesi konsultasi awal</span>
            <strong>{monthFormatter.format(month)}</strong>
          </div>
          <div className="calendar-nav" aria-label="Ganti bulan">
            <button
              type="button"
              className="icon-button bordered"
              aria-label="Previous month"
              onClick={() => setMonth((current) => addMonths(current, -1))}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="icon-button bordered"
              aria-label="Next month"
              onClick={() => setMonth((current) => addMonths(current, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="calendar-grid" role="grid" aria-label={`Kalender ${monthFormatter.format(month)}`}>
          {weekdays.map((weekday) => (
            <span className="calendar-weekday" role="columnheader" key={weekday}>
              {weekday}
            </span>
          ))}
          {days.map(({ date, inMonth }) => {
            const key = dateKey(date);
            return (
              <a
                className={`calendar-day ${inMonth ? '' : 'is-outside'} ${key === today ? 'is-today' : ''}`}
                href={`${calUrl}?date=${key}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Jadwalkan konsultasi pada ${date.toLocaleDateString('id-ID', { dateStyle: 'long' })}`}
                key={key}
              >
                <span>{date.getDate()}</span>
                {key === today && <i aria-hidden="true" />}
              </a>
            );
          })}
        </div>
        <p className="calendar-footnote">Waktu ditampilkan sesuai zona waktu lokal Anda · Terhubung ke Cal.com</p>
      </div>
    </div>
  );
}
