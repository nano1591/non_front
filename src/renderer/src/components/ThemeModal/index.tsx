import { useContext } from 'react'
import THEMES from '../../config/theme'
import { SettingVMContext } from '@renderer/App'
import { nanoid } from 'nanoid'
import { useToggle } from 'ahooks'
import { Modal } from '../Modal'

export const ThemeModal = () => {
  const [showDialog, { toggle: toggleShowDialog }] = useToggle(false)
  const settingVM = useContext(SettingVMContext)

  return (
    <button className="btn btn-ghost rounded-btn" onClick={toggleShowDialog}>
      <span className="material-icons-outlined bg-transparent">palette</span>
      {showDialog && (
        <Modal id={nanoid()}>
          <h3 className="text-lg font-bold pb-4">主题切换</h3>
          <div className="flex flex-wrap justify-start gap-2 w-[34rem] h-[24rem] overflow-y-scroll">
            {THEMES.map((theme) => (
              <button
                data-theme={theme}
                className={
                  'bg-base-100 rounded-lg h-10 w-40 m-2 p-2 ' +
                  (settingVM.theme === theme ? 'border-accent border-2' : '')
                }
                onClick={() => settingVM.setTheme(theme)}
                key={theme}
              >
                <div className="w-full h-full items-center flex">
                  <div className="flex-grow">{theme}</div>
                  <div className="flex flex-shrink-0 flex-wrap h-full gap-1">
                    <div className="bg-primary w-2 rounded" />
                    <div className="bg-secondary w-2 rounded" />
                    <div className="bg-accent w-2 rounded" />
                    <div className="bg-neutral w-2 rounded" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </button>
  )
}
