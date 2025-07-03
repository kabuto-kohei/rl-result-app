'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/RecoderFooterNav.module.css';

export default function RecoderFooterNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/recoder"
        className={`${styles.link} ${pathname === '/recoder' ? styles.active : ''}`}
      >
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>ホーム</span>
      </Link>

      <Link
        href="/recoder/input"
        className={`${styles.link} ${pathname === '/recoder/input' ? styles.active : ''}`}
      >
        <span className={styles.icon}>✏️</span>
        <span className={styles.label}>入力</span>
      </Link>

      <Link
        href="/recoder/results"
        className={`${styles.link} ${pathname === '/recoder/results' ? styles.active : ''}`}
      >
        <span className={styles.icon}>❤️‍🔥</span>
        <span className={styles.label}>リザルト</span>
      </Link>

      <Link
        href="/recoder/register"
        className={`${styles.link} ${pathname === '/recoder/register' ? styles.active : ''}`}
      >
        <span className={styles.icon}>📝</span>
        <span className={styles.label}>登録</span>
      </Link>
    </nav>
  );
}
