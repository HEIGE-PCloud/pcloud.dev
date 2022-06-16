import { FileObject, FileType } from '../lib/notionTypes'

export default function VideoBlock({ video }: { video: FileObject }) {
  const url =
    video.type === FileType.external ? video.external.url : video.file.url
  return (
    <video controls>
      <source src={url} />
      Sorry, your browser does not support embedded videos. You can{' '}
      <a href={url} rel="noreferrer" target="_blank">
        download it
      </a>{' '}
      and watch it with a video player.
    </video>
  )
}
