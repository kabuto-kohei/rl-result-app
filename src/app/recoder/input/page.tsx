'use client';

import { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import styles from '@/styles/RecoderInput.module.css';

type Player = {
  name: string;
  kana: string;
  category: string;
};

type Task = {
  taskId: string;   // Firestore のドキュメントID
  taskName: string; // 課題番号
  round: string;    // ラウンド名
  pointTop: number;
  pointZone2: number;
  pointZone1: number;
};

export default function RecoderInputPage() {
  const [playerId, setPlayerId] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [results, setResults] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const competitionId = '68CDDTtWfnCHJ704KHM2'; // ← IDに置き換え

  const handleSearch = async () => {
    if (!playerId) return;

    const docRef = doc(
      db,
      `competitions/${competitionId}/players/${playerId.trim()}`
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const playerData = docSnap.data() as Player;
      setPlayer(playerData);
      setStatus('');

      const tasksQuery = query(
        collection(db, `competitions/${competitionId}/tasks`),
        where('category', '==', playerData.category)
      );
      const tasksSnap = await getDocs(tasksQuery);

      const tasksList: Task[] = [];
      tasksSnap.forEach((taskDoc) => {
        tasksList.push({
          taskId: taskDoc.id,
          taskName: taskDoc.data().taskName,
          round: taskDoc.data().round,
          pointTop: Number(taskDoc.data().pointTop) || 0,
          pointZone2: Number(taskDoc.data().pointZone2) || 0,
          pointZone1: Number(taskDoc.data().pointZone1) || 0,
        });
      });

      tasksList.sort((a, b) => Number(a.taskName) - Number(b.taskName));
      setTasks(tasksList);
      setResults({});
    } else {
      setPlayer(null);
      setTasks([]);
      setStatus('選手が見つかりません。');
    }
  };

  const handleSelect = (taskId: string, value: string) => {
    setResults((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const allSelected =
    tasks.length > 0 && tasks.every((task) => results[task.taskId]);

    const handleSubmit = async () => {
      // 課題ID順に results を配列に変換
      const resultsArray = tasks.map((task) => results[task.taskId]);

      await setDoc(
        doc(
          db,
          `competitions/${competitionId}/players/${playerId.trim()}/results/final`
        ),
        {
          results: resultsArray, 
          submittedAt: new Date(),
        }
      );

      setStatus(`送信が完了しました！`);
      setPlayer(null);
      setPlayerId('');
      setResults({});
      setTasks([]);
      setShowConfirm(false);
    };

  return (
    <main className={styles.container}>

      {/* 🔲 入力BOX */}
      <div className={styles.box}>
        <div className={styles.inputGroup}>
          <label>選手IDを入力</label>
          <input
            type="text"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
          />

          <div className={styles.buttonColumn}>
            <button onClick={handleSearch} className={styles.searchButton}>
              検索
            </button>
            
            <button
              onClick={() => {
                setPlayerId('');
                setPlayer(null);
                setTasks([]);
                setResults({});
                setShowConfirm(false);
                setStatus('');
              }}
              className={styles.resetButton}
            >
              IDリセット
            </button>
          </div>
        </div>
      </div>

      {/* 🔲 情報＋結果入力BOX */}
      {player && (
        <div className={styles.box}>
          <div className={styles.info}>
            <p>名前: {player.name}</p>
            <p>カテゴリー: {player.category}</p>
          </div>

          <h2>課題リザルト</h2>
          {tasks.map((task) => (
            <div key={task.taskId} className={styles.selectRow}>
              <span>{`${task.round} ${task.taskName}`}</span>
              <select
                value={results[task.taskId] || ''}
                onChange={(e) => handleSelect(task.taskId, e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="TOP">TOP</option>
                <option value="ZONE2">ZONE2</option>
                <option value="ZONE1">ZONE1</option>
                <option value="なし">なし</option>
              </select>
            </div>
          ))}

          <button
            onClick={() => setShowConfirm(true)}
            disabled={!allSelected}
            className={allSelected ? styles.activeButton : styles.disabledButton}
          >
            確認
          </button>
        </div>
      )}

      {showConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>確認画面</h3>
            <p>選手ID: {playerId}</p>
            <p>名前: {player?.name}</p>
            <p>カテゴリー: {player?.category}</p>

            <h4>課題リザルト</h4>
            {tasks.map((task) => (
              <p key={task.taskId}>
                {`${task.round} ${task.taskName}`}: {results[task.taskId]}
              </p>
            ))}

            {(() => {
              let topCount = 0;
              let z2Count = 0;
              let z1Count = 0;

              tasks.forEach((task) => {
                const result = results[task.taskId];
                if (result === 'TOP') {
                  topCount++;
                  z2Count++;
                  z1Count++;
                } else if (result === 'ZONE2') {
                  z2Count++;
                  z1Count++;
                } else if (result === 'ZONE1') {
                  z1Count++;
                }
              });

              return (
                <p>TOP: {topCount}　Z2: {z2Count}　Z1: {z1Count}</p>
              );
            })()}

            <div className={styles.modalActions}>
              <button onClick={() => setShowConfirm(false)}>戻る</button>
              <button onClick={handleSubmit}>送信</button>
            </div>
          </div>
        </div>
      )}

      {status && <p>{status}</p>}
    </main>
  );
}
