import { CodeBlock as CodeBlockType } from '../lib/notionTypes'
import Prism from 'prismjs'
import { useEffect } from 'react'

export default function CodeBlock({ block }: { block: CodeBlockType }) {
  const lang = block.code.language
  const code = block.code.rich_text.map((text) => text.plain_text).join('')
  useEffect(() => {
    import(`prismjs/components/prism-${lang}`)
      .then(() => {
        Prism.highlightAll()
      })
      .catch(() => {
        Prism.highlightAll()
      })
  })

  return (
    <pre className={`line-numbers language-${lang}`}>
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  )
}
