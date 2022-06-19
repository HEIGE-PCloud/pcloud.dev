import NextImage from 'next/image'
import { ImageBlock } from '../lib/notionTypes'
import { useEffect, useState } from 'react'

export default function Image({ block }: { block: ImageBlock }) {
  const [src, setSrc] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const image = block.image
  const url = image[image.type].url
  const alt = image.caption ? image.caption[0]?.plain_text : ''
  const expiry_time = image.type === 'file' ? image.file.expiry_time : null

  // if external or cache is not expired, set src directly
  // if the cache is expired, load new src from api
  useEffect(() => {

    if (image.type === 'external') {
      setSrc(url)
    } else {
      if (new Date(expiry_time) > new Date()) {
        setSrc(url)
      } else {
        setLoading(true)
        fetch(`/api/image/${block.id}`)
          .then((res) => res.json())
          .then((data) => {
            setSrc(data.url)
          })
      }
    }
    setLoading(false)
  }, [image.type, url, expiry_time, block.id])

  return (
    <figure>
      <NextImage
        src={isLoading ? image.blurDataURL : src}
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
