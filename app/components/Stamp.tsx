export default function Stamp({ text, style, className = "" }: { text: string; style?: React.CSSProperties, className?: string }) {
  return (
    <div className={`stamp ${className}`} style={style}>
      {text}
    </div>
  );
}
