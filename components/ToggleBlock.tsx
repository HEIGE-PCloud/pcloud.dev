import { Fragment } from 'react'
import {
  BlockObjectResponse,
  ToggleBlock as ToggleBlockType
} from '../lib/notionTypes'
import { RichText } from './RichText'
import styles from './ToggleBlock.module.css'

export default function ToggleBlock({
  block,
  render
}: {
  block: ToggleBlockType
  render: (
    block: BlockObjectResponse,
    index: number,
    array: BlockObjectResponse[]
  ) => JSX.Element
}) {
  return (
    <details>
      <summary>
        <RichText text={block.toggle.rich_text} />
      </summary>
      <div className={styles.toggleInner}>
        {(block as BlockObjectResponse).children?.map((block, index, array) => {
          return (
            <Fragment key={block.id}>{render(block, index, array)}</Fragment>
          )
        })}
      </div>
    </details>
  )
}
