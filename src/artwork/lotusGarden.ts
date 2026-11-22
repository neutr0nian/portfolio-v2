export type GardenLeaf = {
  kind: 'leaf'
  form: 'round' | 'cup' | 'fold'
  tone: 'deep' | 'green' | 'soft'
  x: number
  y: number
  scale: number
  angle: number
  stem: string
}
export type GardenFlower = {
  kind: 'flower' | 'bud'
  pale?: boolean
  x: number
  y: number
  scale: number
  angle: number
  stem: string
}
export type GardenPlant = GardenLeaf | GardenFlower

// Each composition is arranged back to front. Every stem terminates beneath
// its own leaf or flower. The outer gardens enter from the sides; the middle
// gardens have independent, upright growth and different focal heights.
export const lotusGardens: GardenPlant[][] = [
  [
    { kind: 'leaf', form: 'round', tone: 'soft', x: 5, y: 185, scale: 1.12, angle: -17, stem: 'M-16 414 C28 351 36 255 5 185' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 119, y: 254, scale: 0.98, angle: 18, stem: 'M32 414 C58 340 117 321 119 254' },
    { kind: 'leaf', form: 'cup', tone: 'soft', x: 267, y: 301, scale: 0.78, angle: -14, stem: 'M202 415 Q247 367 267 301' },
    { kind: 'bud', x: 58, y: 130, scale: 0.85, angle: -12, stem: 'M15 413 C59 317 72 208 58 130' },
    { kind: 'flower', x: 137, y: 158, scale: 0.9, angle: -18, stem: 'M54 414 C88 343 145 255 137 158' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 42, y: 311, scale: 1.05, angle: -17, stem: 'M12 414 Q37 365 42 311' },
    { kind: 'leaf', form: 'round', tone: 'green', x: 218, y: 249, scale: 0.86, angle: 16, stem: 'M172 414 C184 341 222 319 218 249' },
    { kind: 'flower', x: 231, y: 286, scale: 0.66, angle: 14, pale: true, stem: 'M184 415 Q222 355 231 286' },
    { kind: 'leaf', form: 'cup', tone: 'deep', x: 139, y: 359, scale: 1.02, angle: 8, stem: 'M108 414 Q127 384 139 359' },
  ],
  [
    { kind: 'leaf', form: 'round', tone: 'soft', x: 215, y: 166, scale: 0.92, angle: -18, stem: 'M205 417 C235 331 201 247 215 166' },
    { kind: 'leaf', form: 'cup', tone: 'green', x: 32, y: 267, scale: 0.86, angle: -16, stem: 'M54 416 C58 348 41 317 32 267' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 148, y: 291, scale: 1.05, angle: 14, stem: 'M160 415 C160 372 142 338 148 291' },
    { kind: 'flower', x: 103, y: 194, scale: 0.86, angle: -12, stem: 'M105 416 C117 336 93 263 103 194' },
    { kind: 'bud', x: 59, y: 291, scale: 0.7, angle: 18, pale: true, stem: 'M35 417 Q53 348 59 291' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 241, y: 345, scale: 0.93, angle: 16, stem: 'M230 416 Q227 377 241 345' },
    { kind: 'flower', x: 247, y: 265, scale: 0.64, angle: 8, pale: true, stem: 'M266 416 C265 357 242 315 247 265' },
    { kind: 'leaf', form: 'round', tone: 'green', x: 60, y: 372, scale: 0.88, angle: -25, stem: 'M68 418 L60 372' },
  ],
  [
    { kind: 'leaf', form: 'round', tone: 'soft', x: 34, y: 219, scale: 1.04, angle: 13, stem: 'M61 418 C31 336 48 281 34 219' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 266, y: 169, scale: 0.91, angle: 13, stem: 'M238 419 C256 329 247 244 266 169' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 172, y: 293, scale: 0.97, angle: -12, stem: 'M155 416 Q186 355 172 293' },
    { kind: 'bud', x: 222, y: 122, scale: 0.75, angle: 8, stem: 'M203 415 C214 321 211 218 222 122' },
    { kind: 'flower', x: 124, y: 155, scale: 0.92, angle: -6, pale: true, stem: 'M121 417 C104 334 141 250 124 155' },
    { kind: 'leaf', form: 'cup', tone: 'soft', x: 293, y: 326, scale: 1.01, angle: -13, stem: 'M274 416 Q279 366 293 326' },
    { kind: 'flower', x: 235, y: 253, scale: 0.7, angle: 12, stem: 'M233 417 C246 350 221 302 235 253' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 36, y: 350, scale: 0.86, angle: -19, stem: 'M48 417 Q28 383 36 350' },
    { kind: 'leaf', form: 'cup', tone: 'green', x: 133, y: 385, scale: 0.9, angle: 4, stem: 'M142 419 L133 385' },
  ],
  [
    { kind: 'leaf', form: 'round', tone: 'soft', x: 301, y: 193, scale: 1.12, angle: 17, stem: 'M319 415 C283 344 279 254 301 193' },
    { kind: 'leaf', form: 'fold', tone: 'deep', x: 153, y: 267, scale: 0.96, angle: -13, stem: 'M268 418 C229 352 180 326 153 267' },
    { kind: 'leaf', form: 'cup', tone: 'soft', x: 22, y: 333, scale: 0.85, angle: -10, stem: 'M83 418 Q40 381 22 333' },
    { kind: 'bud', x: 239, y: 145, scale: 0.78, angle: 12, pale: true, stem: 'M307 415 C279 310 254 233 239 145' },
    { kind: 'flower', x: 191, y: 223, scale: 0.88, angle: 9, stem: 'M315 404 C256 370 204 297 191 223' },
    { kind: 'leaf', form: 'round', tone: 'green', x: 70, y: 283, scale: 0.74, angle: -22, stem: 'M151 419 C116 368 82 333 70 283' },
    { kind: 'leaf', form: 'cup', tone: 'green', x: 263, y: 354, scale: 1.03, angle: -6, stem: 'M300 417 Q277 387 263 354' },
    { kind: 'flower', x: 87, y: 318, scale: 0.6, angle: -9, pale: true, stem: 'M142 416 Q102 370 87 318' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 144, y: 406, scale: 0.93, angle: 9, stem: 'M150 423 L144 406' },
  ],
]

// Shoots continue the established planting toward the free edge of each scroll.
// Coordinates share the main garden's 420-unit baseline and drawing scale.
type Shoots = { width: number; plants: GardenPlant[] }
export const gardenExtensions: { left?: Shoots; right?: Shoots }[] = [
  { right: { width: 520, plants: [
    { kind: 'leaf', form: 'fold', tone: 'soft', x: 62, y: 271, scale: 1.06, angle: 6, stem: 'M84 420 C79 366 55 314 62 271' },
    { kind: 'bud', pale: true, x: 112, y: 200, scale: 0.81, angle: 4, stem: 'M93 421 C92 342 110 254 112 200' },
    { kind: 'leaf', form: 'cup', tone: 'green', x: 136, y: 325, scale: 0.94, angle: -12, stem: 'M110 422 Q118 356 136 325' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 302, y: 258, scale: 1.13, angle: -9, stem: 'M320 422 C312 371 298 320 302 258' },
    { kind: 'flower', x: 354, y: 212, scale: 0.86, angle: 3, stem: 'M337 420 C331 332 354 274 354 212' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 396, y: 302, scale: 0.9, angle: 14, stem: 'M366 422 Q371 343 396 302' },
    { kind: 'leaf', form: 'cup', tone: 'deep', x: 234, y: 365, scale: 0.82, angle: 6, stem: 'M253 421 Q248 387 234 365' },
    { kind: 'leaf', form: 'cup', tone: 'soft', x: 474, y: 342, scale: 0.98, angle: -5, stem: 'M458 421 Q458 379 474 342' },
  ] } },
  {
    left: { width: 260, plants: [
      { kind: 'leaf', form: 'round', tone: 'green', x: 68, y: 278, scale: 1.01, angle: -12, stem: 'M82 420 C88 363 62 320 68 278' },
      { kind: 'bud', x: 109, y: 223, scale: 0.78, angle: 4, stem: 'M92 421 C93 353 107 273 109 223' },
      { kind: 'leaf', form: 'fold', tone: 'soft', x: 194, y: 296, scale: 0.94, angle: 13, stem: 'M176 422 Q171 350 194 296' },
      { kind: 'leaf', form: 'cup', tone: 'deep', x: 132, y: 347, scale: 1.01, angle: 8, stem: 'M150 422 Q145 372 132 347' },
    ] },
    right: { width: 260, plants: [
      { kind: 'leaf', form: 'fold', tone: 'soft', x: 141, y: 251, scale: 1.07, angle: 8, stem: 'M130 420 C125 371 147 299 141 251' },
      { kind: 'flower', pale: true, x: 96, y: 273, scale: 0.7, angle: -5, stem: 'M114 420 C105 371 99 314 96 273' },
      { kind: 'leaf', form: 'cup', tone: 'green', x: 40, y: 332, scale: 0.83, angle: 12, stem: 'M64 422 Q62 366 40 332' },
      { kind: 'leaf', form: 'round', tone: 'green', x: 191, y: 322, scale: 0.87, angle: -10, stem: 'M201 421 Q188 365 191 322' },
      { kind: 'leaf', form: 'cup', tone: 'deep', x: 233, y: 371, scale: 0.74, angle: -8, stem: 'M219 422 Q221 395 233 371' },
    ] },
  },
  {
    left: { width: 260, plants: [
      { kind: 'leaf', form: 'cup', tone: 'soft', x: 63, y: 294, scale: 0.98, angle: 12, stem: 'M83 421 C83 368 65 328 63 294' },
      { kind: 'flower', x: 97, y: 231, scale: 0.75, angle: 2, stem: 'M91 420 C84 355 95 282 97 231' },
      { kind: 'leaf', form: 'round', tone: 'green', x: 145, y: 322, scale: 0.86, angle: -8, stem: 'M131 422 Q139 363 145 322' },
      { kind: 'leaf', form: 'fold', tone: 'deep', x: 204, y: 353, scale: 0.83, angle: 10, stem: 'M189 421 Q191 383 204 353' },
    ] },
    right: { width: 260, plants: [
      { kind: 'bud', pale: true, x: 177, y: 230, scale: 0.75, angle: 6, stem: 'M162 421 C155 346 171 277 177 230' },
      { kind: 'leaf', form: 'round', tone: 'green', x: 118, y: 280, scale: 0.97, angle: 5, stem: 'M147 422 C144 364 119 321 118 280' },
      { kind: 'leaf', form: 'fold', tone: 'deep', x: 43, y: 352, scale: 0.76, angle: -13, stem: 'M59 422 Q55 377 43 352' },
      { kind: 'leaf', form: 'cup', tone: 'soft', x: 196, y: 340, scale: 0.96, angle: -10, stem: 'M175 420 Q173 382 196 340' },
    ] },
  },
  { left: { width: 520, plants: [
    { kind: 'leaf', form: 'round', tone: 'soft', x: 65, y: 256, scale: 1.03, angle: -10, stem: 'M83 420 C85 361 68 305 65 256' },
    { kind: 'bud', x: 123, y: 224, scale: 0.79, angle: 8, stem: 'M96 422 C103 365 117 271 123 224' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 118, y: 317, scale: 0.96, angle: 6, stem: 'M106 420 Q108 354 118 317' },
    { kind: 'leaf', form: 'cup', tone: 'deep', x: 30, y: 359, scale: 0.81, angle: 7, stem: 'M47 422 Q44 382 30 359' },
    { kind: 'leaf', form: 'round', tone: 'deep', x: 295, y: 294, scale: 1.05, angle: 12, stem: 'M275 420 C273 365 300 329 295 294' },
    { kind: 'flower', pale: true, x: 249, y: 236, scale: 0.82, angle: -4, stem: 'M267 421 C259 356 252 291 249 236' },
    { kind: 'leaf', form: 'cup', tone: 'soft', x: 375, y: 347, scale: 1.1, angle: -7, stem: 'M353 421 Q353 387 375 347' },
    { kind: 'leaf', form: 'fold', tone: 'green', x: 471, y: 317, scale: 0.91, angle: -11, stem: 'M487 422 Q476 369 471 317' },
  ] } },
]

export const gardenLeafForms = {
  round: {
    silhouette: 'M0-55 C12-59 24-55 31-47 C44-48 55-38 56-26 C66-18 67-5 61 6 C63 19 53 30 42 33 C34 47 20 50 9 46 C-4 53-17 48-25 41 C-39 42-51 31-51 19 C-62 10-62-4-55-15 C-56-29-44-41-31-42 C-23-55-11-59 0-55Z',
    veins: 'M0 9 Q-5-20 0-51 M0 9 Q9-22 28-43 M0 9 Q23-12 51-24 M0 9 Q28-2 58 4 M0 9 Q26 17 39 30 M0 9 Q12 28 9 43 M0 9 Q-15 24-24 38 M0 9 Q-25 15-48 18 M0 9 Q-24-5-51-14 M0 9 Q-16-21-29-39',
  },
  cup: {
    silhouette: 'M-69 0 C-57-13-43-20-28-16 C-15-25 1-27 14-20 C30-21 46-13 52-5 C61-4 69 3 72 11 C50 11 35 18 19 27 C4 34-14 31-29 23 C-44 21-60 11-69 0Z',
    veins: 'M2 26 Q-20 6-61 0 M2 26 Q-15-3-29-13 M2 26 Q-6 0-4-20 M2 26 Q13 5 15-17 M2 26 Q25 5 45-7 M2 26 Q37 15 64 10',
  },
  fold: {
    silhouette: 'M-39 39 C-53 28-54 10-46-3 C-47-19-33-34-18-36 C-8-49 9-49 20-41 C36-40 48-26 47-12 C58 2 53 22 39 31 C26 47 8 49-4 44 C-18 50-31 46-39 39Z',
    veins: 'M-8 39 Q-22 12-43-1 M-8 39 Q-25-1-17-33 M-8 39 Q-4 7 18-37 M-8 39 Q15 9 43-10 M-8 39 Q17 25 36 29 M-8 39 Q-25 33-37 36',
    fold: 'M-8 39 Q-4 7 20-41 C36-40 48-26 47-12 C58 2 53 22 39 31 C26 47 8 49-8 39Z',
  },
}
