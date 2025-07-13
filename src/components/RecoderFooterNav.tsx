'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/RecoderFooterNav.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faPen,
  faChartBar,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

export default function RecoderFooterNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/recoder"
        className={`${styles.link} ${pathname === '/recoder' ? styles.active : ''}`}
      >
        <FontAwesomeIcon icon={faHouse} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>ホーム</span>
      </Link>

      <Link
        href="/recoder/input"
        className={`${styles.link} ${pathname === '/recoder/input' ? styles.active : ''}`}
      >
        <FontAwesomeIcon icon={faPen} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>入力</span>
      </Link>

      <Link
        href="/recoder/results"
        className={`${styles.link} ${pathname === '/recoder/results' ? styles.active : ''}`}
      >
        <FontAwesomeIcon icon={faChartBar} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>リザルト</span>
      </Link>

      <Link
        href="/recoder/register"
        className={`${styles.link} ${pathname === '/recoder/register' ? styles.active : ''}`}
      >
        <FontAwesomeIcon icon={faUserPlus} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>登録</span>
      </Link>
    </nav>
  );
}
