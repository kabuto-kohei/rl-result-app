'use client';

import Link from 'next/link';
import Image from 'next/image';
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
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/rl-result-app.firebasestorage.app/o/%E3%83%9B%E3%83%BC%E3%83%A0%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=6f874d1b-e218-4998-94e8-8fe2e218c356"
          alt="ホーム"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span className={styles.label}>ホーム</span>
      </Link>

      <Link
        href="/recoder/input"
        className={`${styles.link} ${pathname === '/recoder/input' ? styles.active : ''}`}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/rl-result-app.firebasestorage.app/o/%E5%85%A5%E5%8A%9B%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=90eb686a-a9f8-4667-b9a9-2fd4c05ffe9e"
          alt="入力"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span className={styles.label}>入力</span>
      </Link>

      <Link
        href="/recoder/results"
        className={`${styles.link} ${pathname === '/recoder/results' ? styles.active : ''}`}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/rl-result-app.firebasestorage.app/o/%E3%83%AA%E3%82%B5%E3%82%99%E3%83%AB%E3%83%88%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=aa1758f8-4461-4e7a-871a-7c79c3766bfc"
          alt="リザルト"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span className={styles.label}>リザルト</span>
      </Link>

      <Link
        href="/recoder/register"
        className={`${styles.link} ${pathname === '/recoder/register' ? styles.active : ''}`}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/rl-result-app.firebasestorage.app/o/%E7%99%BB%E9%8C%B2%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3.png?alt=media&token=700d8078-8492-41a2-8004-509d469a859d"
          alt="登録"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span className={styles.label}>登録</span>
      </Link>
    </nav>
  );
}
