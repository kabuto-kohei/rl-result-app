'use client';

import Link from 'next/link';
import styles from '@/styles/AdminHome.module.css';

export default function AdminHomePage() {
  return (
    <main className={styles.container}>
      <h1>Admin Home</h1>

      <nav className={styles.nav}>
        <Link href="/admin/import" className={styles.link}>
          📄 データインポート
        </Link>

        <Link href="/admin/result" className={styles.link}>
          📊 リザルトページ
        </Link>
      </nav>
    </main>
  );
}
