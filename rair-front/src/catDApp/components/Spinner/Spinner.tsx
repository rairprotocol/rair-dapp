import styles from "./Spinner.module.css";

export const Spinner: React.FC<{
  color?: string;
  size?: string;
}> = (props) => {
  return (
    <svg
      className={styles.svg}
      style={{
        width: props.size || "32px",
        height: props.size || "32px",
      }}
      viewBox="0 0 50 50"
    >
      <circle
        className={styles.circle}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={props.color || "white"}
        strokeWidth="4"
      />
    </svg>
  );
};
