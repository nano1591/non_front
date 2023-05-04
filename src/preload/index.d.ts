import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      quit: () => void
      hide: () => void
      full: () => void
    }
  }
}
