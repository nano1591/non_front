const getIcon = (id: number) => new URL(`../assets/images/avatar/${id}.png`, import.meta.url).href

const icons = {}
Array.from({ length: 52 }).forEach((_, index) => {
  icons[index + 1] = getIcon(index + 1)
})
export default icons
