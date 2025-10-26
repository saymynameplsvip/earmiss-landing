export default function NoteSection({ title, children }) {
  return (
    <div className="note-section">
      <h3 className="text-[var(--text-color)]">{title}</h3>
      <div className="text-[var(--text-color)]">{children}</div>
    </div>
  );
}
