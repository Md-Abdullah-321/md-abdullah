function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|\*[^*]+\*)/g).filter((part) => part !== undefined && part !== "");
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)$/);
    if (link) return <a key={key} href={link[2]} target={link[2].startsWith("http") ? "_blank" : undefined} rel={link[2].startsWith("http") ? "noopener noreferrer" : undefined} className="underline decoration-primary/40 underline-offset-4 hover:text-primary">{link[1]}</a>;
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) return <strong className="font-semibold text-foreground" key={key}>{part.slice(2, -2)}</strong>;
    if ((part.startsWith("_") && part.endsWith("_")) || (part.startsWith("*") && part.endsWith("*"))) return <em key={key}>{part.slice(1, -1)}</em>;
    return <span key={key}>{part}</span>;
  });
}

function normalizeContent(content: string) { return content.replace(/\r/g, "").replace(/([^\n])\s+(?=\d+[.)]\s)/g, "$1\n"); }

export function RichText({ content, className = "" }: { content: string; className?: string }) {
  const lines = normalizeContent(content).split("\n"); const blocks: React.ReactNode[] = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim(); if (!line) { index += 1; continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { const Tag = heading[1].length === 1 ? "h3" : "h4"; blocks.push(<Tag className="font-mono text-xl font-semibold tracking-[-0.03em] text-foreground" key={`heading-${index}`}>{renderInline(heading[2], `heading-${index}`)}</Tag>); index += 1; continue; }
    if (/^\d+[.)]\s+/.test(line)) { const items: string[] = []; while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*\d+[.)]\s+/, "")); index += 1; } blocks.push(<ol className="list-decimal space-y-2 pl-6 marker:font-mono marker:text-primary" key={`ordered-${index}`}>{items.map((item, itemIndex) => <li className="pl-2" key={`${index}-${itemIndex}`}>{renderInline(item, `ordered-${index}-${itemIndex}`)}</li>)}</ol>); continue; }
    if (/^[-*]\s+/.test(line)) { const items: string[] = []; while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*[-*]\s+/, "")); index += 1; } blocks.push(<ul className="list-disc space-y-2 pl-6 marker:text-primary" key={`unordered-${index}`}>{items.map((item, itemIndex) => <li className="pl-2" key={`${index}-${itemIndex}`}>{renderInline(item, `unordered-${index}-${itemIndex}`)}</li>)}</ul>); continue; }
    const paragraph: string[] = [line]; index += 1; while (index < lines.length && lines[index].trim() && !/^\s*(?:#{1,3}\s+|\d+[.)]\s+|[-*]\s+)/.test(lines[index])) { paragraph.push(lines[index].trim()); index += 1; } blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph.join(" "), `paragraph-${index}`)}</p>);
  }
  return <div className={`space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 ${className}`}>{blocks}</div>;
}
