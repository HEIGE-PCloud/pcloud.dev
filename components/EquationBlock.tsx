import katex from 'katex'
import 'katex/dist/katex.css'
import './EquationBlock.module.css'
require('katex/contrib/mhchem')

export default function EquationBlock({ expression }: { expression: string }) {
    return (
        <div dangerouslySetInnerHTML={{__html: katex.renderToString(expression, {
            throwOnError: false,
            displayMode: true
        })}}></div>
    )
}