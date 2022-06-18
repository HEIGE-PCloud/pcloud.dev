import { PdfBlock as PdfBlockType } from '../lib/notionTypes'
import styles from './PdfBlock.module.css'
export function PdfBlock({ block }: { block: PdfBlockType }) {
  const src =
    block.pdf.type === 'external' ? block.pdf.external.url : block.pdf.file.url
  return (
    <embed
      src={src}
      type="application/pdf"
      height="100%"
      width="100%"
      className={styles.pdf}
    ></embed>
  )
}
