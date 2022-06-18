import katex from 'katex'
import styles from './EquationBlock.module.css'
import 'katex/dist/katex.css'
import 'katex/contrib/mhchem'
import { EquationBlock as EquationBlockType } from '../lib/notionTypes'

export default function EquationBlock({ block }: { block: EquationBlockType }) {
  return (
    <div
      className={styles.blockEquation}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(block.equation.expression, {
          throwOnError: false,
          displayMode: true
        })
      }}
    ></div>
  )
  // else {
  //   return (
  //     <span
  //       className={className}
  //       dangerouslySetInnerHTML={{
  //         __html: katex.renderToString(expression, {
  //           throwOnError: false,
  //           displayMode
  //         })
  //       }}
  //     ></span>
  //   )
}
