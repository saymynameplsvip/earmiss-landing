export default function NoteSection({ title, children }) {
  return (
    <div className="note-section">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
