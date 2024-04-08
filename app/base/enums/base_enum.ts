export const BaseEnum = {
  A: 1,
  B: 2,
  C: 3,
} as const

export type IBaseEnum = (typeof BaseEnum)[keyof typeof BaseEnum]

export const BaseEnumText = {
  [BaseEnum.A]: 'A',
  [BaseEnum.B]: 'B',
  [BaseEnum.C]: 'C',
} as const
