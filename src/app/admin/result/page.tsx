'use client';

import { useState, useRef } from 'react';
import pageStyles from '@/styles/AdminResultsPage.module.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import CategorySelect from '@/components/CategorySelect';
import ResultTable from '@/components/ResultTable';
import html2canvas from 'html2canvas';
import { Result } from '@/types/Result';

type Player = {
  id: string;
  name: string;
  category: string;
  competitionId: string;
};

export default function AdminResultsPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  const competitionId = 'eCM9u6ex6q6Jq0SxjSBf'; // 適宜変更すること

  const handleSearch = async () => {
    if (!category) return;

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
            : data.tops || [],
        });
      });
    }

    setResults(allResults);
  };

  // ⭐ 画像保存
  const handleExportImage = async () => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `result_${category || 'all'}.png`;
    link.click();
  };

  // ⭐ CSV保存（順位付き）
  const handleExportCSV = () => {
    if (results.length === 0) return;

    const problemCount = results[0].results.length;

    // === ソート（ResultTable と同じ）
    const sorted = [...results].sort((a, b) => {
      const aTop = a.results.filter((r) => r === 'TOP').length;
      const bTop = b.results.filter((r) => r === 'TOP').length;
      if (bTop !== aTop) return bTop - aTop;

      const aZ2 = a.results.filter((r) => r === 'TOP' || r === 'ZONE2').length;
      const bZ2 = b.results.filter((r) => r === 'TOP' || r === 'ZONE2').length;
      if (bZ2 !== aZ2) return bZ2 - aZ2;

      const aZ1 = a.results.filter((r) =>
        ['TOP', 'ZONE2', 'ZONE1'].includes(r)
      ).length;
      const bZ1 = b.results.filter((r) =>
        ['TOP', 'ZONE2', 'ZONE1'].includes(r)
      ).length;
      return bZ1 - aZ1;
    });

    // === 順位付け（同着あり）
    const ranks: number[] = [];
    let currentRank = 1;

    sorted.forEach((r, idx) => {
      if (idx === 0) {
        ranks.push(currentRank);
        return;
      }

      const prev = sorted[idx - 1];
      const prevTop = prev.results.filter((v) => v === 'TOP').length;
      const prevZ2 = prev.results.filter((v) => v === 'TOP' || v === 'ZONE2').length;
      const prevZ1 = prev.results.filter((v) =>
        ['TOP', 'ZONE2', 'ZONE1'].includes(v)
      ).length;

      const curTop = r.results.filter((v) => v === 'TOP').length;
      const curZ2 = r.results.filter((v) => v === 'TOP' || v === 'ZONE2').length;
      const curZ1 = r.results.filter((v) =>
        ['TOP', 'ZONE2', 'ZONE1'].includes(v)
      ).length;

      if (prevTop === curTop && prevZ2 === curZ2 && prevZ1 === curZ1) {
        ranks.push(currentRank);
      } else {
        const sameRankCount = ranks.filter((rank) => rank === currentRank).length;
        currentRank += sameRankCount;
        ranks.push(currentRank);
      }
    });

    // === CSV
    const headers = [
      'Rank',
      'Player Name',
      'Category',
      'TOP',
      'ZONE2',
      'ZONE1',
      ...Array.from({ length: problemCount }).map((_, i) => `Q${i + 1}`),
    ];

    const rows = sorted.map((r, idx) => {
      const topCount = r.results.filter((v) => v === 'TOP').length;
      const z2Count = r.results.filter((v) => v === 'TOP' || v === 'ZONE2').length;
      const z1Count = r.results.filter((v) =>
        ['TOP', 'ZONE2', 'ZONE1'].includes(v)
      ).length;

      const resultsCells = r.results.map((v) => {
        if (v === 'TOP') return 'T';
        if (v === 'ZONE2') return 'Z2';
        if (v === 'ZONE1') return 'Z1';
        return '-';
      });

      return [
        ranks[idx].toString(),
        r.playerName,
        r.category,
        topCount.toString(),
        z2Count.toString(),
        z1Count.toString(),
        ...resultsCells,
      ];
    });

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `result_${category || 'all'}.csv`;
    link.click();
  };

  return (
    <main className={pageStyles.container}>
      <h1>管理者用リザルトページ</h1>

      <CategorySelect
        category={category}
        setCategory={setCategory}
        handleSearch={handleSearch}
      />

      {results.length > 0 && (
        <>
          <div className={pageStyles.buttonArea}>
            <button onClick={handleExportImage} className={pageStyles.exportButton}>
              📸 画像として保存
            </button>
            <button onClick={handleExportCSV} className={pageStyles.exportButton}>
              📄 CSVとして保存
            </button>
          </div>

          <div ref={tableRef} className={pageStyles.tableWrapper}>
            <ResultTable results={results} />
          </div>
        </>
      )}
    </main>
  );
}
