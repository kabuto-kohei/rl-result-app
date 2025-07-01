'use client'

import React from 'react'
import { Result } from '@/types/Result'
import styles from '@/styles/RecoderResults.module.css'

export default function ResultTable({ results }: { results: Result[] }) {
  const sorted = [...results].sort((a, b) => {
    const aTop = a.results.filter(r => r === 'TOP').length
    const bTop = b.results.filter(r => r === 'TOP').length
    return bTop - aTop
  })

  const problemCount = sorted[0]?.results.length || 0

  return (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>順位</th>
          <th>選手名</th>
          <th>T</th>
          <th>Z2</th>
          <th>Z1</th>
          {Array.from({ length: problemCount }).map((_, i) => (
            <th key={i}>{i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, index) => {
          const topCount = r.results.filter(v => v === 'TOP').length
          const z2Count = r.results.filter(v => v === 'TOP' || v === 'ZONE2').length
          const z1Count = r.results.filter(v => v === 'TOP' || v === 'ZONE2' || v === 'ZONE1').length

          return (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.playerName}</td>
              <td>{topCount}</td>
              <td>{z2Count}</td>
              <td>{z1Count}</td>
              {r.results.map((v, i) => {
                const isNone = v === 'なし' || v === '' || v === null

                let cellClass = ''
                if (v === 'TOP') cellClass = styles.topCell
                if (v === 'ZONE2') cellClass = styles.z2Cell
                if (v === 'ZONE1') cellClass = styles.z1Cell

                return (
                  <td key={i} className={cellClass}>
                    {isNone
                      ? '-' 
                      : v === 'TOP'
                      ? 'T'
                      : v === 'ZONE2'
                      ? 'Z2'
                      : v === 'ZONE1'
                      ? 'Z1'
                      : v}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
