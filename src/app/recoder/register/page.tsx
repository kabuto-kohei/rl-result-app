'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import styles from '@/styles/RecoderRegister.module.css';

type Competition = {
  id: string;
  name: string;
  location: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
};

export default function RecoderRegisterPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competitionId, setCompetitionId] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [status, setStatus] = useState('');

  // 大会一覧取得
  useEffect(() => {
    const fetchCompetitions = async () => {
      const snap = await getDocs(collection(db, 'competitions'));
      const comps: Competition[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Competition, 'id'>),
      }));
      setCompetitions(comps);
    };
    fetchCompetitions();
  }, []);

  // カテゴリー一覧取得（大会が選択されたら）
  useEffect(() => {
    const fetchCategories = async () => {
      if (!competitionId) {
        setCategories([]);
        return;
      }

      const tasksSnap = await getDocs(
        collection(db, `competitions/${competitionId}/tasks`)
      );
      const categoriesSet = new Set<string>();
      tasksSnap.forEach((taskDoc) => {
        const data = taskDoc.data();
        if (data.category) {
          categoriesSet.add(data.category);
        }
      });
      setCategories(Array.from(categoriesSet));
    };

    fetchCategories();
  }, [competitionId]);

  const handleRegister = async () => {
    const trimmedId = playerId.trim();

    if (!trimmedId || !playerName || !competitionId || !category) {
      setStatus('全ての項目を入力してください');
      return;
    }

    try {
      // 二重登録防止
      const playerRef = doc(db, `players/${trimmedId}`);
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        setStatus(`選手ID「${trimmedId}」はすでに登録されています！`);
        return;
      }

      await setDoc(playerRef, {
        name: playerName,
        competitionId: competitionId,
        category: category,
        createdAt: new Date(),
      });

      setStatus(`選手「${playerName}」を登録しました！`);
      setPlayerId('');
      setPlayerName('');
      setCategory('');
      setCompetitionId('');
      setCategories([]);
    } catch (err) {
      console.error(err);
      setStatus('登録に失敗しました');
    }
  };

  return (
    <main className={styles.container}>
      <h1>選手登録フォーム</h1>

      <div className={styles.formGroup}>
        <label htmlFor="competition">コンペを選択</label>
        <select
          id="competition"
          value={competitionId}
          onChange={(e) => setCompetitionId(e.target.value)}
        >
          <option value="">選択してください</option>
          {competitions.map((comp) => (
            <option key={comp.id} value={comp.id}>
              {comp.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">カテゴリー</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categories.length === 0}
        >
          <option value="">選択してください</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="playerId">選手ID</label>
        <input
          id="playerId"
          type="text"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          placeholder="例: 001"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="playerName">選手名</label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="例: 山田 太郎"
        />
      </div>

      <button onClick={handleRegister} className={styles.button}>
        登録する
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </main>
  );
}
