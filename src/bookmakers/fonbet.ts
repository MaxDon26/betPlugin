function getReactFiberMeta(target: EventTarget | null): any {
  let element = target as HTMLElement;

  const fiber = Object.keys(element).find((key) =>
    key.startsWith("__reactFiber")
  );

  if (fiber) return (element as any)[fiber].return.pendingProps.cell.factorId;

  return null;
}

function findElementByProps(props: { marketId: string }) {
  return Array.from(document.querySelectorAll(`[class*='factor']`)).find(
    (item) => {
      const cell = item.closest(`[class*='cell']`);

      const factorId = getReactFiberMeta(cell);
      return factorId === props.marketId;
    }
  );
}
