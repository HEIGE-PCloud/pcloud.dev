import NextImage from "next/image"
export default function Image({ src, alt, height, width, blurDataURL }) {
    return (
        <figure>
            <NextImage src={src} alt={alt} height={height} width={width} placeholder='blur' blurDataURL={blurDataURL} />
            {alt && <figcaption>{alt}</figcaption>}
        </figure>
    )
}