import styles from '@/styles/RecoderHome.module.css';
import Link from 'next/link';

export default function RecoderHomePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}></div>

      <div className={styles.guide}>
        <h2>セルフジャッジアプリ</h2>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsRow}>
          <Link href="/recoder/register" className={styles.btn}>
            ① 選手登録
          </Link>
          <Link href="/recoder/input" className={styles.btn}>
            ② リザルト入力
          </Link>
        </div>
        <Link href="/recoder/results" className={styles.btnWide}>
          ② リザルト表示
        </Link>
      </div>
    </div>
  );
}

