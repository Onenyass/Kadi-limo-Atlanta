/** Chapter marker: the "stop" signature used across the site. */
export function Stop({ num, label, as: Tag = "p" }: { num: string; label: string; as?: "p" | "span" }) {
  return (
    <Tag className="stop">
      <span className="stop__num" aria-hidden="true">
        {num}
      </span>
      <span className="stop__line" aria-hidden="true" />
      <span>{label}</span>
    </Tag>
  );
}
