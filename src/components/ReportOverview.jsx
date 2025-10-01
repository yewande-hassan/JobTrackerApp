import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip)

function groupByWeekday(jobs = []) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const map = {
    Saved: Array(7).fill(0),
    Applied: Array(7).fill(0),
    Rejected: Array(7).fill(0)
  }

  jobs.forEach(job => {
    const raw = job.date; // can be string, number, or Firestore Timestamp
    if (!raw) return;

    let d;
    // Firestore Timestamp (has toDate)
    if (raw && typeof raw === 'object' && typeof raw.toDate === 'function') {
      d = raw.toDate();
    } else if (typeof raw === 'number') {
      d = new Date(raw);
    } else if (typeof raw === 'string') {
      // Try ISO or MM/DD/YYYY
      d = new Date(raw);
      // If that fails and looks like MM/DD/YYYY (e.g., 10/01/2025), try splitting
      if (isNaN(d)) {
        const parts = raw.split('/');
        if (parts.length === 3) {
          const [m, day, y] = parts.map(p => parseInt(p, 10));
          if (!isNaN(m) && !isNaN(day) && !isNaN(y)) d = new Date(y, m - 1, day);
        }
      }
    }
    if (!d || isNaN(d)) return;
    const idx = (d.getDay() + 6) % 7; // convert sunday=0 to index 6
    const status = job.status || 'Saved'
    if (status === 'Applied') map.Applied[idx]++
    else if (status === 'Rejected' || status === 'Declined') map.Rejected[idx]++
    else map.Saved[idx]++
  })

  return { days, map }
}

export default function ReportOverview({ jobs = [] }) {
  const { days, map } = useMemo(() => groupByWeekday(jobs), [jobs])

  const data = {
    labels: days,
    datasets: [
      { label: 'Saved Jobs', data: map.Saved, backgroundColor: '#2b2f47' },
      { label: 'Applied', data: map.Applied, backgroundColor: '#2f8bff' },
      { label: 'Rejected', data: map.Rejected, backgroundColor: '#9aa4b2' }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  }
  const isEmpty = data.datasets.every(ds => ds.data.every(v => v === 0))

  return (
    <>
    <h3 style={{ marginBottom: 12, color: '#cfe1ff' }}>Report Overview</h3>
    <div style={{ background: '#0b1220', padding: 20, borderRadius: 8, minHeight: 220 }}>
      {isEmpty ? (
        <div style={{ color: '#9aa4b2' }}>No data to display yet</div>
      ) : (
        <div style={{ height: 220 }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
    </>
  )
}
