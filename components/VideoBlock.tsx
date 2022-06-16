import { VideoBlock as VideoBlockType } from '../lib/notionTypes'
import styles from './VideoBlock.module.css'

export default function VideoBlock({ block }: { block: VideoBlockType }) {
  const video = block.video
  const url = video.type === 'external' ? video.external.url : video.file.url
  return (
    <video controls className={styles.video}>
      <source src={url} />
      Sorry, your browser does not support embedded videos. You can{' '}
      <a href={url} rel="noreferrer" target="_blank">
        download it
      </a>{' '}
      and watch it with a video player.
    </video>
  )
}
