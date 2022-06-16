import katex from 'katex'
import styles from './EquationBlock.module.css'
import 'katex/dist/katex.css'
import 'katex/contrib/mhchem'

interface EquationProps {
  expression: string
  displayMode: boolean
  className?: string
}

export default function EquationBlock({
  expression,
  displayMode,
  className
}: EquationProps) {
  if (displayMode) {
    return (
      <div
        className={styles.blockEquation}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(expression, {
            throwOnError: false,
            displayMode
          })
        }}
      ></div>
    )
  } else {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(expression, {
            throwOnError: false,
            displayMode
          })
        }}
      ></span>
    )
  }
}
