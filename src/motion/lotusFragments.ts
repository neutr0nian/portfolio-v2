// Source-coordinate boundaries isolate terminal growth, never a whole vine.
// The short, irregular closing edges become the small fracture at the twig.
export const exposedPetals = [4, 5, 6, 8, 9, 11, 12]

export const weakTwig = {
  center: [247, 178] as const,
  area: 620,
  lever: 68,
  paths: [10],
  boundary: ['M', 228, 144, 'L', 268, 144, 'L', 268, 206, 'L', 248, 210,
    'L', 244, 205, 'L', 240, 207, 'L', 238, 202, 'L', 234, 202, 'L', 228, 198, 'Z'] as (string | number)[],
}

export const flowerBranch = {
  center: [325, 174] as const,
  area: 6100,
  lever: 118,
  paths: [10, ...exposedPetals],
  boundary: ['M', 270, 108, 'L', 390, 108, 'L', 390, 210, 'L', 305, 226,
    'L', 300, 221, 'L', 299, 218, 'L', 296, 219, 'L', 294, 214, 'L', 291, 214,
    'L', 288, 211, 'L', 270, 200, 'Z'] as (string | number)[],
}
