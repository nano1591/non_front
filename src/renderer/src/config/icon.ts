import CONFIG from './index'
const getIcon = (id: number) => new URL(`../assets/images/avatar/${id}.png`, import.meta.url).href

const icons = {}
Array.from({ length: CONFIG.iconCount }).forEach((_, index) => {
  icons[index + 1] = getIcon(index + 1)
})
export default icons
