function Group({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <div className="grp" aria-hidden={hidden || undefined}>
      {items.concat(items).map((t, i) => (
        <span key={i} style={{ display: 'contents' }}><span>{t}</span><b>✱</b></span>
      ))}
    </div>
  );
}

function Band({ items, cls, dur }: { items: string[]; cls: string; dur: string }) {
  return (
    <div className={`band ${cls}`} style={{ ['--dur' as string]: dur }}>
      <div className="track"><Group items={items} /><Group items={items} hidden /></div>
    </div>
  );
}

/** Two crossing sticker bands that scroll in opposite directions. Decorative. */
export function Stickers({ a, b }: { a: string[]; b: string[] }) {
  return (
    <div className="stickers" aria-hidden="true">
      <Band items={a} cls="b1" dur="46s" />
      <Band items={b} cls="b2 rev" dur="58s" />
    </div>
  );
}
