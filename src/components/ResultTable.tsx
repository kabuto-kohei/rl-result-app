'use client'

import React from 'react'
import { Result } from '@/types/Result'
import styles from '@/styles/RecoderResults.module.css'

export default function ResultTable({ results }: { results: Result[] }) {
  // 条件に従ってソート
  const sorted = [...results].sort((a, b) => {
    const aTop = a.results.filter(r => r === 'TOP').length
    const bTop = b.results.filter(r => r === 'TOP').length

    if (bTop !== aTop) return bTop - aTop

    const aZ2 = a.results.filter(r => r === 'TOP' || r === 'ZONE2').length
    const bZ2 = b.results.filter(r => r === 'TOP' || r === 'ZONE2').length

    if (bZ2 !== aZ2) return bZ2 - aZ2

    const aZ1 = a.results.filter(r => ['TOP', 'ZONE2', 'ZONE1'].includes(r)).length
    const bZ1 = b.results.filter(r => ['TOP', 'ZONE2', 'ZONE1'].includes(r)).length

    return bZ1 - aZ1
  })

  const problemCount = sorted[0]?.results.length || 0

  return (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>順位</th>
          <th>選手名</th>
          <th>TOP</th>
          <th>ZONE2</th>
          <th>ZONE1</th>
          {Array.from({ length: problemCount }).map((_, i) => (
            <th key={i}>Q{i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, index) => {
          const topCount = r.results.filter(v => v === 'TOP').length
          const z2Count = r.results.filter(v => v === 'TOP' || v === 'ZONE2').length
          const z1Count = r.results.filter(v => ['TOP', 'ZONE2', 'ZONE1'].includes(v)).length

          return (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.playerName}</td>
              <td>{topCount}</td>
              <td>{z2Count}</td>
              <td>{z1Count}</td>
              {r.results.map((v, i) => (
                <td key={i}>
                  {v === 'TOP' ? (
                    <span style={{ background: 'red', color: 'white', display: 'inline-block', padding: '0 4px' }}>T</span>
                  ) : v === 'ZONE2' ? (
                    <span style={{ color: 'red' }}>Z2</span>
                  ) : v === 'ZONE1' ? (
                    <span style={{ color: 'red' }}>Z1</span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
