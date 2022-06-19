import Head from 'next/head'
import { getDatabase, getPage, getPageBlocks } from '../lib/notion'
import Link from 'next/link'
import { databaseId } from './index'
import styles from './post.module.css'
import { RichText } from '../components/RichText'
import { PdfBlock } from '../components/PdfBlock'
import Image from '../components/ImageBlock'
import EquationBlock from '../components/EquationBlock'
import copyTeX from '../lib/copyTeX'
import VideoBlock from '../components/VideoBlock'
import colors from '../styles/color.module.css'
import {
  BlockObjectResponse,
  BulletedListItemBlock,
  NumberedListItemBlock,
  PageResponse
} from '../lib/notionTypes'
import { Fragment } from 'react'
import CodeBlock from '../components/CodeBlock'

function renderBlock(
  block: BlockObjectResponse,
  index: number,
  array: BlockObjectResponse[]
) {
  const { type, id } = block
  const value = block[type]

  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <RichText text={block.paragraph.rich_text} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <RichText text={block.heading_1.rich_text} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <RichText text={block.heading_2.rich_text} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <RichText text={block.heading_3.rich_text} />
        </h3>
      )
    case 'bulleted_list_item':
      // To render a bulleted list item
      // If the bulleted list item is the first item in the sublist
      // Create array itemList
      // and add all subsequent bulleted list item in to itemList
      // Render itemList
      // Otherwise (not the first item)
      // return void
      if (
        index === 0 ||
        (index > 0 && array[index - 1].type !== 'bulleted_list_item')
      ) {
        const itemList: BulletedListItemBlock[] = []
        for (let i = index; array[i]?.type === 'bulleted_list_item'; i++) {
          itemList.push(array[i] as BulletedListItemBlock)
        }
        return (
          <ul>
            {itemList.map((block) => {
              return (
                <li key={block.id} className={colors[block.bulleted_list_item.color]}>
                  <RichText text={block.bulleted_list_item.rich_text} />
                  {block.has_children &&
                    (block as BlockObjectResponse).children.map(
                      (childBlock, index, array) => {
                        return (
                          <Fragment key={childBlock.id}>
                            {renderBlock(childBlock, index, array)}
                          </Fragment>
                        )
                      }
                    )}
                </li>
              )
            })}
          </ul>
        )
      } else return
    case 'numbered_list_item':
      // To render a numbered list item
      // If the numbered list item is the first item in the sublist
      // Create array itemList
      // and add all subsequent bulleted list item in to itemList
      // Render itemList
      // Otherwise (not the first item)
      // return void
      if (
        index === 0 ||
        (index > 0 && array[index - 1].type !== 'numbered_list_item')
      ) {
        const itemList: NumberedListItemBlock[] = []
        for (let i = index; array[i]?.type === 'numbered_list_item'; i++) {
          itemList.push(array[i] as NumberedListItemBlock)
        }
        return (
          <ol>
            {itemList.map((block) => {
              return (
                <li key={block.id} className={colors[block.numbered_list_item.color]}>
                  <RichText text={block.numbered_list_item.rich_text} />
                  {block.has_children &&
                    (block as BlockObjectResponse).children.map(
                      (childBlock, index, array) => {
                        return (
                          <Fragment key={childBlock.id}>
                            {renderBlock(childBlock, index, array)}
                          </Fragment>
                        )
                      }
                    )}
                </li>
              )
            })}
          </ol>
        )
      } else return
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
            <RichText text={block.toggle.rich_text} />
          </summary>
          {block.children?.map((block, index, array) => {
            return (
              <Fragment key={block.id}>
                {renderBlock(block, index, array)}
              </Fragment>
            )
          })}
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
      return <PdfBlock block={block} />
    case 'equation':
      return <EquationBlock block={block} />
    case 'video':
      return <VideoBlock block={block} />
    case 'code':
      return <CodeBlock block={block} />
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

export default function Post({
  page,
  blocks
}: {
  page: PageResponse
  blocks: BlockObjectResponse[]
}) {
  if (!page) {
    return
  }
  const title = page.properties.Name
  if (title.type != 'title') return
  return (
    <div>
      <Head>
        <title>{title.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article onCopy={copyTeX} className={styles.container}>
        <h1 className={styles.name}>
          <RichText text={title.title} />
        </h1>
        <section>
          {blocks.map((block, index, array) => (
            <Fragment key={block.id}>
              {renderBlock(block, index, array)}
            </Fragment>
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
  const blocks = await getPageBlocks(id)

  return {
    props: {
      page,
      blocks: blocks
    },
    revalidate: 1
  }
}
