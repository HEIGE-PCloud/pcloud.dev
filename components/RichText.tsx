import styles from './RichText.module.css'
import EquationBlock from './EquationBlock'
import { RichTextItemResponse } from '../lib/notionTypes'

export function RichText({ text }: { text: RichTextItemResponse[] }) {
  if (text.length === 0) {
    return <br />
  }
  return (
    <>
      {text.map((value, index) => {
        const {
          type,
          annotations: { bold, code, color, italic, strikethrough, underline }
        } = value

        const className = [
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
          color ? styles[color] : ''
        ].join(' ')

        if (type === 'equation') {
          const { equation } = value
          return (
            <EquationBlock
              expression={equation.expression}
              displayMode={false}
              className={className}
            />
          )
        } else if (type === 'text') {
          const { text } = value
          return (
            <span key={index} className={className}>
              {text.link ? (
                <a href={text.link.url}>{text.content}</a>
              ) : (
                text.content
              )}
            </span>
          )
        } else if (type === 'mention') {
          // TODO
        }
      })}
    </>
  )
}
