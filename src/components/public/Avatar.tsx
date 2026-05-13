export function Avatar({ name }: { name: string }) {
  const initial = (name || "R").trim().charAt(0).toUpperCase();
  return (
    <div className="avatar-container">
      <span className="avatar-text">{initial}</span>
    </div>
  );
}
