import styles from "./RichText.module.css";
import EquationBlock from './EquationBlock'

interface Annotations {
  bold: boolean,
  italic: boolean,
  strikethrough: boolean,
  underline: boolean,
  code: boolean,
  color: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'green_background' | 'blue_background' | 'purple_background' | 'pink_background' | 'red_background'
}

interface RichTextProps {
  text: [
    type: 'text',
    text: {
      content: string,
      link?: string
    },
    annotations: Annotations,
    plain_text: string,
    href?: string
  ] | [

  ]
}

export function RichText({ text }) {
  if (text.length === 0) {
    return <br/>
  }
  return text.map((value, index) => {
    const { type, annotations: { bold, code, color, italic, strikethrough, underline } } = value
    const className = [
      bold ? styles.bold : "",
      code ? styles.code : "",
      italic ? styles.italic : "",
      strikethrough ? styles.strikethrough : "",
      underline ? styles.underline : "",
      color ? styles[color] : ""
    ].join(" ")

    if (type === 'equation') {
      const { equation } = value
      return (
        <EquationBlock
          expression={equation.expression}
          displayMode={false}
          className={className} />)
    }
    else {
      const { text } = value
      if (!text) {
        return;
      }
      return (
        <span
          key={index}
          className={className}>
          {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
        </span>
      );
    }
  });
}
