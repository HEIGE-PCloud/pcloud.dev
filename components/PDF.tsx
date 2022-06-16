import styles from './PDF.module.css'
export function PDF({ url }) {
  return (
    <embed
      src={url}
      type="application/pdf"
      height="100%"
      width="100%"
      className={styles.pdf}
    ></embed>
  )
}
