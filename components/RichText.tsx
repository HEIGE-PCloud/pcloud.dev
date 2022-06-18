import styles from './RichText.module.css'
import { RichTextItemResponse } from '../lib/notionTypes'
import katex from 'katex'
import 'katex/dist/katex.css'
import 'katex/contrib/mhchem'
import { Fragment } from 'react'

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

        const colorClass = color ? styles[color] : ''
        if (type === 'equation') {
          const { equation } = value
          return (
            <span
              key={index}
              className={colorClass}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(equation.expression, {
                  throwOnError: false,
                  displayMode: false
                })
              }}
            ></span>
          )
        } else if (type === 'text') {
          const { text } = value
          let tag = <Fragment>{text.content}</Fragment>
          if (bold) tag = <b>{tag}</b>
          if (code) tag = <code>{tag}</code>
          if (italic) tag = <i>{tag}</i>
          if (strikethrough) tag = <s>{tag}</s>
          if (underline) tag = <u>{tag}</u>
          return (
            <span key={index} className={colorClass}>
              {text.link ? <a href={text.link.url}>{tag}</a> : tag}
            </span>
          )
        } else if (type === 'mention') {
          // TODO
        }
      })}
    </>
  )
}
