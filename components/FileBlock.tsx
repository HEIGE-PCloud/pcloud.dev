import { FileBlock as FileBlockType } from '../lib/notionTypes'
import styles from './FileBlock.module.css'
import { RichText } from './RichText'

export default function FileBlock({ block }: { block: FileBlockType }) {
  const file = block.file
  const src: string = file[file.type].url
  const fileName = src.split('/').pop().split('?')[0]
  return (
    <figure>
      <div className={styles.file}>
        📂 <a href={src}>{fileName}</a>
      </div>
      {file.caption.length > 0 && (
        <figcaption>
          <RichText text={file.caption} />
        </figcaption>
      )}
    </figure>
  )
}
