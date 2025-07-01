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
      </Link>
      <Link
        href="/recoder/input"
        className={`${styles.link} ${pathname === '/recoder/input' ? styles.active : ''}`}
      >
        <span className={styles.icon}>✏️</span>
      </Link>
      <Link
        href="/recoder/results"
        className={`${styles.link} ${pathname === '/recoder/results' ? styles.active : ''}`}
      >
        <span className={styles.icon}>❤️‍🔥</span>
      </Link>
    </nav>
  );
}
