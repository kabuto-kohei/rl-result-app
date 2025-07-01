'use client'

import React from 'react'
import { Result } from '@/types/Result'
import styles from '@/styles/RecoderResults.module.css'

export default function ResultTable({ results }: { results: Result[] }) {
  // ソート条件: TOP > Z2 > Z1
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

  // ✅ 順位付け（同着対応）
  const ranks: number[] = []
  let currentRank = 1
  sorted.forEach((r, idx) => {
    if (idx === 0) {
      ranks.push(currentRank)
      return
    }

    const prev = sorted[idx - 1]
    const prevTop = prev.results.filter(v => v === 'TOP').length
    const prevZ2 = prev.results.filter(v => v === 'TOP' || v === 'ZONE2').length
    const prevZ1 = prev.results.filter(v => ['TOP', 'ZONE2', 'ZONE1'].includes(v)).length

    const curTop = r.results.filter(v => v === 'TOP').length
    const curZ2 = r.results.filter(v => v === 'TOP' || v === 'ZONE2').length
    const curZ1 = r.results.filter(v => ['TOP', 'ZONE2', 'ZONE1'].includes(v)).length

    if (prevTop === curTop && prevZ2 === curZ2 && prevZ1 === curZ1) {
      // 同着
      ranks.push(currentRank)
    } else {
      const sameRankCount = ranks.filter(rank => rank === currentRank).length
      currentRank += sameRankCount
      ranks.push(currentRank)
    }
  })

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
            <th key={`q-header-${i}`}>Q{i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, index) => {
          const topCount = r.results.filter(v => v === 'TOP').length
          const z2Count = r.results.filter(v => v === 'TOP' || v === 'ZONE2').length
          const z1Count = r.results.filter(v => ['TOP', 'ZONE2', 'ZONE1'].includes(v)).length

          return (
            <tr key={`${r.id}-${index}`}>
              <td>{ranks[index]}</td>
              <td>{r.playerName}</td>
              <td>{topCount}</td>
              <td>{z2Count}</td>
              <td>{z1Count}</td>
              {r.results.map((v, i) => (
                <td
                  key={`${r.id}-result-${i}`}
                  className={
                    v === 'TOP'
                      ? styles.topCell
                      : v === 'ZONE2'
                      ? styles.z2Cell
                      : v === 'ZONE1'
                      ? styles.z1Cell
                      : ''
                  }
                >
                  {v === 'なし' ? '-' : v === 'TOP' ? 'T' : v === 'ZONE2' ? 'Z2' : v === 'ZONE1' ? 'Z1' : '-'}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
