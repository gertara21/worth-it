import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  return (
    <div className={styles.splash}>
      <img
        src="https://files.catbox.moe/kh4rva.png"
        alt="Worth It?"
        className={styles.logo}
      />
    </div>
  );
}
