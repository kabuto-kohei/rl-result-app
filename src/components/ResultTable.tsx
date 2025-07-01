'use client'

import React from 'react'
import { Result } from '@/types/Result' // 共通型
import styles from '@/styles/RecoderResults.module.css'

export default function ResultTable({ results }: { results: Result[] }) {
  // TOP数降順でソート
  const sorted = [...results].sort((a, b) => {
    const aTop = Array.isArray(a.results) ? a.results.filter(r => r === 'TOP').length : 0
    const bTop = Array.isArray(b.results) ? b.results.filter(r => r === 'TOP').length : 0
    return bTop - aTop
  })

  const problemCount = sorted[0]?.results?.length || 0

  return (
    <div className={styles.container}>
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
            const topCount = Array.isArray(r.results)
              ? r.results.filter(v => v === 'TOP').length
              : 0
            const z2Count = Array.isArray(r.results)
              ? r.results.filter(v => v === 'TOP' || v === 'ZONE2').length
              : 0
            const z1Count = Array.isArray(r.results)
              ? r.results.filter(v => v === 'TOP' || v === 'ZONE2' || v === 'ZONE1').length
              : 0

            return (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.playerName}</td>
                <td>{topCount}</td>
                <td>{z2Count}</td>
                <td>{z1Count}</td>
                {Array.isArray(r.results) &&
                  r.results.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
