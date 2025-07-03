import styles from '@/styles/RecoderHome.module.css';

export default function RecoderHomePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
      </div>
      
      <div className={styles.guide}>
       <h2>セルフジャッジアプリ</h2></div>

      <div className={styles.actions}>
        <div className={styles.actionsRow}>
          <button className={styles.btn}>① 選手登録</button>
          <button className={styles.btn}>② リザルト入力</button>
        </div>
        <button className={styles.btnWide}>② リザルト表示</button> 
        </div>
      </div>
  );
}
