import styles from "./RichText.module.css";
import EquationBlock from './EquationBlock'

export function RichText({ text }) {
  if (!text) {
    return null;
  }
  return text.map((value, index) => {
    console.log(value)
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
