import styles from './PDF.module.css'
export function PDF({ url }) {
    return (
        <embed
            src={url}
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            height="100%"
            width="100%"
            className={styles.pdf}
        ></embed>
    )
}