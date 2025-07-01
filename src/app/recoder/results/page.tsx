'use client'

import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import CategorySelect from '@/components/CategorySelect'
import ResultTable from '@/components/ResultTable'
import styles from '@/styles/RecoderResults.module.css'
import { Result } from '@/types/Result' // ✅ 共通型を import

// プレイヤー型（このページ内で完結）
type Player = {
  id: string
  name: string
  category: string
}

export default function ResultPage() {
  const [category, setCategory] = useState<string | null>(null)
  const [results, setResults] = useState<Result[]>([])

  const competitionId = 'rCPkv5KdwX2FSg0UtKLq' // ← Firestore の大会IDに置き換え

  const handleSearch = async () => {
    if (!category) return

    // players コレクション取得
    const playersSnap = await getDocs(
      collection(db, `competitions/${competitionId}/players`)
    )

    // カテゴリーでフィルタ
    const players: Player[] = playersSnap.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Player, 'id'>)
      }))
      .filter(player => player.category === category)

    const allResults: Result[] = []

    for (const player of players) {
      // 各 player の results を取得
      const resultsSnap = await getDocs(
        collection(db, `competitions/${competitionId}/players/${player.id}/results`)
      )

      resultsSnap.forEach(resultDoc => {
        const data = resultDoc.data()
        allResults.push({
          id: resultDoc.id,
          playerId: player.id,
          playerName: player.name,
          category: player.category,
          results: Array.isArray(data.results)
            ? data.results
            : data.tops || [], // fallback（古いtops対応）
        })
      })
    }

    setResults(allResults)
  }

  return (
    <main className={styles.container}>
      <CategorySelect
        category={category}
        setCategory={setCategory}
        handleSearch={handleSearch}
      />

      {results.length > 0 && (
        <div className={styles.tableWrapper}>
          <ResultTable results={results} />
        </div>
      )}
    </main>
  )
}
