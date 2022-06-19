import NextImage from 'next/image'
import { ImageBlock } from '../lib/notionTypes'
export default function Image({ block } : { block: ImageBlock}) {
  const image = block.image
  const alt = image.caption ? image.caption[0]?.plain_text : ''
  return (
    <figure>
      <NextImage
        src={`/api/image/${block.id}`}
        alt={alt}
        height={image.height}
        width={image.width}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  )
}
