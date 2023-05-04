import { useLocalStorageState } from 'ahooks'
import STORAGE_KEY from '../config/storageKey'
import { Theme } from '@renderer/config/theme'
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState'

export const useSettingVM = () => {
  const [theme, setTheme] = useLocalStorageState<Theme>(STORAGE_KEY.settingTheme, {
    defaultValue: 'light'
  })

  return {
    theme,
    setTheme
  }
}

export type SettingVM = {
  theme: Theme
  setTheme: (value: Theme | IFuncUpdater<Theme>) => void
}
