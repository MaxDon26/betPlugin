const maraphonSelector = (selector: HTMLElement) => {
  return selector.closest("td");
};

const getSelectorByMeta = (meta: any) => {
  if (!meta.coeffUuid) return null;

  const lastDashIndex = meta.coeffUuid.lastIndexOf("-");
  const id =
    lastDashIndex !== -1
      ? meta.coeffUuid.slice(0, lastDashIndex)
      : meta.coeffUuid;

  return document.querySelector(`[data-coeff-uuid*='${id}']`);
};
