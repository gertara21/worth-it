import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  return (
    <div className={styles.splash}>
      <img
        src="https://files.catbox.moe/l4vrwk.png"
        alt="Worth It?"
        className={styles.logo}
      />
    </div>
  );
}
