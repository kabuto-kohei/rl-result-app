'use client'

import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import styles from '@/styles/RecoderResults.module.css'

type Props = {
  category: string | null
  setCategory: (val: string) => void
  handleSearch: () => void
}

export default function CategorySelect({
  category,
  setCategory,
  handleSearch,
}: Props) {
  const [categories, setCategories] = useState<string[]>([])
  const competitionId = '68CDDTtWfnCHJ704KHM2' // ← ID置き換え

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(
        collection(db, `competitions/${competitionId}/players`)
      )
      const all = snapshot.docs
        .map(doc => doc.data().category as string)
        .filter((c) => !!c)
      const unique = Array.from(new Set(all))
      setCategories(unique)
    }

    fetchCategories()
  }, [])

  return (
    <div className={styles.selectArea}>
      <label>
        カテゴリー：
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">選択してください</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSearch}>検索</button>
    </div>
  )
}
