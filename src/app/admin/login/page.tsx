'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '@/styles/AdminLogin.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('ログイン成功');
      router.push('/admin/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('ログイン失敗:', err.message);
      } else {
        console.error('ログイン失敗:', err);
      }
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };

  return (
    <main className={styles.container}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          ログイン
        </button>
      </form>
    </main>
  );
}
