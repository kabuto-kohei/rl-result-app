'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import styles from '@/styles/RecoderResults.module.css';

type Props = {
  category: string | null;
  setCategory: (val: string) => void;
  handleSearch: () => void;
};

type Player = {
  competitionId: string;
  category: string;
};

export default function CategorySelect({
  category,
  setCategory,
  handleSearch,
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const competitionId = 'rYryS6KqHF8BjoY6BDsy'; // ← 適宜置換

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'players'));
      const all = snapshot.docs
        .map((doc) => doc.data() as Player)
        .filter((p) => p.competitionId === competitionId && !!p.category)
        .map((p) => p.category);

      const unique = Array.from(new Set(all));
      setCategories(unique);
    };

    fetchCategories();
  }, []);

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
  );
}
