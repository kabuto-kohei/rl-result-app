'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import styles from '@/styles/AdminImport.module.css';

// CSV型定義
type CompetitionCSVRow = {
  location: string;
  name: string;
  round: string;
  problem: string;
};

type PlayerCSVRow = {
  playerId: string;
  name: string;
  kana: string;
  category: string;
};

type TaskCSVRow = {
  taskId: string;
  taskName: string;
  round: string;
  category: string;
  pointTop: string;
  pointZone1: string;
  pointZone2: string;
};

export default function AdminImportPage() {
  const [competitionFile, setCompetitionFile] = useState<File | null>(null);
  const [playersFile, setPlayersFile] = useState<File | null>(null);
  const [tasksFile, setTasksFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleCompetitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCompetitionFile(e.target.files[0]);
    }
  };

  const handlePlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setPlayersFile(e.target.files[0]);
    }
  };

  const handleTasksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setTasksFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!competitionFile || !playersFile || !tasksFile) return;

    setStatus('インポート中...');

    Papa.parse<CompetitionCSVRow>(competitionFile, {
      header: true,
      complete: async (competitionResults) => {
        const competitionData = competitionResults.data[0]; // 1大会想定

        try {
          // 大会情報を保存 → 大会IDを取得
          const competitionRef = await addDoc(collection(db, 'competitions'), {
            location: competitionData.location || '',
            name: competitionData.name || '',
            createdAt: new Date(),
          });

          const competitionId = competitionRef.id;

          // 選手情報の保存
          Papa.parse<PlayerCSVRow>(playersFile, {
            header: true,
            complete: async (playerResults) => {
              const playersData = playerResults.data;

              for (const player of playersData) {
                await setDoc(
                  doc(db, `competitions/${competitionId}/players/${player.playerId}`),
                  {
                    name: player.name || '',
                    kana: player.kana || '',
                    category: player.category || '',
                    createdAt: new Date(),
                  }
                );
              }

              // 課題情報の保存
              Papa.parse<TaskCSVRow>(tasksFile, {
                header: true,
                complete: async (taskResults) => {
                  const tasksData = taskResults.data;

                  for (const task of tasksData) {
                    await setDoc(
                      doc(db, `competitions/${competitionId}/tasks/${task.taskId}`),
                      {
                        taskName: task.taskName || '',
                        round: task.round || '',
                        category: task.category || '',
                        pointTop: Number(task.pointTop) || 0,
                        pointZone1: Number(task.pointZone1) || 0,
                        pointZone2: Number(task.pointZone2) || 0,
                        createdAt: new Date(),
                      }
                    );
                  }

                  setStatus('すべてのインポートが完了しました！');
                },
              });
            },
          });
        } catch (err) {
          console.error(err);
          setStatus('インポートに失敗しました。');
        }
      },
    });
  };

  return (
    <main className={styles.container}>
      <h1>大会・選手・課題 インポート</h1>

      <div className={styles.inputGroup}>
        <label>大会情報 CSV</label>
        <input type="file" accept=".csv" onChange={handleCompetitionChange} />
      </div>

      <div className={styles.inputGroup}>
        <label>選手情報 CSV</label>
        <input type="file" accept=".csv" onChange={handlePlayersChange} />
      </div>

      <div className={styles.inputGroup}>
        <label>課題情報 CSV</label>
        <input type="file" accept=".csv" onChange={handleTasksChange} />
      </div>

      <button
        onClick={handleImport}
        className={styles.button}
        disabled={!competitionFile || !playersFile || !tasksFile}
      >
        インポート実行
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </main>
  );
}
