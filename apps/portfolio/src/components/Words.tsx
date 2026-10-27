import { Fragment } from 'react';

/** Wraps each word in a `.w` span with a stagger index (`--i`) for the word-by-word reveal. */
export default function Words({ text, from = 0 }: { text: string; from?: number }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span className="w" style={{ '--i': from + i } as React.CSSProperties}>{word}</span>
    </Fragment>
  ));
}
