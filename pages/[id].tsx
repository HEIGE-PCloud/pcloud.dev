import { Fragment } from 'react'
import Head from 'next/head'
import { getDatabase, getPage, getBlockChildren } from '../lib/notion'
import Link from 'next/link'
import { databaseId } from './index'
import styles from './post.module.css'
import { RichText } from '../components/RichText'
import { PDF } from '../components/PDF'
import Image from '../components/Image'
import { getPlaiceholder } from 'plaiceholder'
import EquationBlock from '../components/EquationBlock'
import copyTeX from '../lib/copyTeX'
import VideoBlock from '../components/VideoBlock'

function renderNestedList(block) {
  const { type } = block
  const value = block[type]
  if (!value) return null

  const isNumberedList = value.children[0].type === 'numbered_list_item'

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>
}

function renderBlock(block) {
  const { type, id } = block
  const value = block[type]

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <RichText text={value.rich_text} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <RichText text={value.rich_text} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <RichText text={value.rich_text} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <RichText text={value.rich_text} />
        </h3>
      )
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <RichText text={value.rich_text} />
          {!!value.children && renderNestedList(block)}
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <RichText text={value.rich_text} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <RichText text={value.rich_text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      )
    case 'child_page':
      return <p>{value.title}</p>
    case 'image':
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          src={value.src}
          alt={value.caption ? value.caption[0]?.plain_text : ''}
          height={value.height}
          width={value.width}
          blurDataURL={value.blurDataURL}
        />
      )
    case 'divider':
      return <hr key={id} />
    case 'quote':
      return (
        <blockquote key={id}>
          <RichText text={value.rich_text} />
        </blockquote>
      )
    case 'file':
      const src_file =
        value.type === 'external' ? value.external.url : value.file.url
      const splitSourceArray = src_file.split('/')
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1]
      const caption_file = value.caption ? value.caption[0]?.plain_text : ''
      return (
        <figure>
          <div className={styles.file}>
            📎{' '}
            <Link href={src_file} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      )
    case 'bookmark':
      const href = value.url
      return (
        <a href={href} target="_brank" className={styles.bookmark}>
          {href}
        </a>
      )
    case 'pdf':
      return <PDF url={value.file.url} />
    case 'equation':
      return <EquationBlock expression={value.expression} displayMode={true} />
    case 'video':
      return <VideoBlock block={block} />
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />
  }
  return (
    <div>
      <Head>
        <title>{page.properties.Name.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article onCopy={copyTeX} className={styles.container}>
        <h1 className={styles.name}>
          <RichText text={page.properties.Name.title} />
        </h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          <div className={styles.footer}>
            <Link href="/">
              <a className={styles.back}>← Go home</a>
            </Link>
            <a
              href={page.url.replace('www.notion.so', 'pcloud.notion.site')}
              rel="noreferrer"
              target="_blank"
            >
              Notion source
            </a>
          </div>
        </section>
      </article>
    </div>
  )
}

export async function getStaticPaths() {
  const database = (await getDatabase(databaseId)).results
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true
  }
}

export async function getStaticProps(context) {
  const { id } = context.params
  const page = await getPage(id)
  const blocks = await getBlockChildren(id)
  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlockChildren(block.id)
        }
      })
  )
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find(
        (x) => x.id === block.id
      )?.children
    }
    return block
  })

  const blocksWithImage = await Promise.all(
    blocksWithChildren.map(async (block) => {
      if (block.type === 'image') {
        const imageUrl = block.image[block.image.type].url
        const { base64, img } = await getPlaiceholder(imageUrl)
        block.image.blurDataURL = base64
        block.image.width = img.width
        block.image.height = img.height
        block.image.src = img.src
      }
      return block
    })
  )

  return {
    props: {
      page,
      blocks: blocksWithImage
    },
    revalidate: 1
  }
}
