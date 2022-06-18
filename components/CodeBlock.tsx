import { CodeBlock as CodeBlockType } from '../lib/notionTypes'
import Prism from 'prismjs'
import { useEffect, useState } from 'react'

export default function CodeBlock({ block }: { block: CodeBlockType }) {
  const [html, setHtml] = useState(null)
  const lang = block.code.language
  const code = block.code.rich_text.map((text) => text.plain_text).join('')
  useEffect(() => {
    import(`prismjs/components/prism-${lang}`)
      .then(() => {
        setHtml(Prism.highlight(code, Prism.languages[lang], lang))
      })
      .catch(() => {
        setHtml(Prism.highlight(code, Prism.languages[lang], lang))
      })
  })

  return (
    <div>
      <pre>
        <code
          className={`language-${lang}`}
          dangerouslySetInnerHTML={{
            __html: html
          }}
        ></code>
      </pre>
    </div>
  )
}
