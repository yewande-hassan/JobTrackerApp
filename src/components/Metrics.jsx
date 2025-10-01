import React from 'react'
import '../styles/Metrics.css'

function Metrics({description,count}) {
  return (
    <div className='metrics-card'>
        <p className="metrics_header">{description}</p>
        <p className="metrics_count">{count}</p>
    </div>

  )
}

export default Metrics