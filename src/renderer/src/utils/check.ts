export const check6_16Word = (value: string) => /^\w{6,16}$/.test(value)

export const check6_16Name = (value: string) => /^[一-龠ぁ-んァ-ヴー\u4E00-\u9FA5A-Za-z0-9]{6,16}$/.test(value)
