import styles from "./ProfilePic.module.css";

function ProfilePic({ src, size, online = false }) {
  return (
    <div
      className={styles.container}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img className={styles.image} src={src} />
      {online && <div className={styles.online}></div>}
    </div>
  );
}

export default ProfilePic;
