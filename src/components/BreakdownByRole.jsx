import React, { useMemo } from 'react'

export default function BreakdownByRole({ jobs = [] }) {
  const rows = useMemo(() => {
    const counts = {}
    jobs.forEach(j => {
      const role = (j.job_title || 'Unknown').trim()
      counts[role] = (counts[role] || 0) + 1
    })
    return Object.entries(counts).sort((a,b) => b[1]-a[1])
  }, [jobs])

  return (
    <div style={{ padding: 20, border : '1px solid #3771CB', borderRadius: 8, minHeight: 220 }}>
        <h3 style={{ marginBottom: 12, color: '#cfe1ff' }}>Breakdown by Role</h3>
      <table style={{ width: '100%', color: '#cfe1ff' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingBottom: 8 }}>Roles</th>
            <th style={{ textAlign: 'right', paddingBottom: 8 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([role, count]) => (
            <tr key={role}>
              <td style={{ padding: '8px 0' }}>{role}</td>
              <td style={{ textAlign: 'right' }}>{String(count).padStart(2,'0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
