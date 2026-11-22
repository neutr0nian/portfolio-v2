// Match the 7.2-unit strands in pattern-square.svg after its 45° rotation.
// The diagonal braid lines have x+y = 326/348/373 and x-y = 162/140/115.
// Keep each extension joined to its strand while preserving stepped lengths.
const width = 7.2
const half = width / 2
const number = (value: number) => Number(value.toFixed(3))

const horizontal = [326, 348, 373].map((sum, index) => {
  const y = 337 + (sum - 476) / Math.SQRT2
  const end = 352 + index * 6
  return `M396 ${number(y - half)} L${end} ${number(y - half)} L${number(end + width)} ${number(y + half)} L396 ${number(y + half)} Z`
})

const vertical = [162, 140, 115].map((difference, index) => {
  const x = 337 + (difference - 12) / Math.SQRT2
  const end = 320 - index * 6
  return `M${number(x - half)} 278 L${number(x + half)} 278 L${number(x + half)} ${number(end - width)} L${number(x - half)} ${end} Z`
})

// Filled contours give true 45° cut faces; SVG stroke caps cannot make them.
export const cornerStrandEnds = [...horizontal, ...vertical]
