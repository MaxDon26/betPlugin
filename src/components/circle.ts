let cursorCircle: HTMLDivElement | null = null;
export function addCursorCircle() {
  if (cursorCircle) return; // Если кружок уже есть, не создаём новый

  cursorCircle = document.createElement("div");
  cursorCircle.id = "custom-cursor-circle";
  document.body.appendChild(cursorCircle);

  document.addEventListener("mousemove", moveCursorCircle);
}

function moveCursorCircle(event: MouseEvent) {
  if (!cursorCircle) return;
  cursorCircle.style.left = `${event.clientX}px`;
  cursorCircle.style.top = `${event.clientY}px`;
}

export function removeCursorCircle() {
  if (cursorCircle) {
    cursorCircle.remove();
    cursorCircle = null;
  }
  document.removeEventListener("mousemove", moveCursorCircle);
}
