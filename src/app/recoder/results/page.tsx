'use client';

import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import CategorySelect from '@/components/CategorySelect';
import ResultTable from '@/components/ResultTable';
import styles from '@/styles/RecoderResults.module.css';
import { Result } from '@/types/Result';

// プレイヤー型
type Player = {
  id: string;
  name: string;
  category: string;
  competitionId: string;
};

export default function ResultPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const competitionId = 'eCM9u6ex6q6Jq0SxjSBf'; // ← 適宜置換

  const handleSearch = async () => {
    if (!category) return;

    // 🔍 players から該当カテゴリーの選手を取得
    const playersSnap = await getDocs(collection(db, 'players'));
    const players: Player[] = playersSnap.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Player, 'id'>),
      }))
      .filter(
        (player) =>
          player.category === category && player.competitionId === competitionId
      );

    const allResults: Result[] = [];

    for (const player of players) {
      // 🔍 results から該当選手の結果を取得
      const resultsQuery = query(
        collection(db, 'results'),
        where('playerId', '==', player.id),
        where('competitionId', '==', competitionId)
      );

      const resultsSnap = await getDocs(resultsQuery);

      resultsSnap.forEach((resultDoc) => {
        const data = resultDoc.data();
        allResults.push({
          id: resultDoc.id,
          playerId: player.id,
          playerName: player.name,
          category: player.category,
          results: Array.isArray(data.results)
            ? data.results
            : data.tops || [], // fallback
        });
      });
    }

    setResults(allResults);
  };

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
  );
}
