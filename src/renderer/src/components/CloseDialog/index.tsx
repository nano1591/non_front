import { SettingVMContext, UserVMContext } from '@renderer/App'
import { useService } from '@renderer/hooks/useService'
import { nanoid } from 'nanoid'
import { useContext } from 'react'
import { ModalWithOutClose } from '../Modal'
import { useBoolean, useRequest } from 'ahooks'

export const CloseDialog = () => {
  const userVM = useContext(UserVMContext)
  const settingVM = useContext(SettingVMContext)
  const modalId = nanoid()
  const S = useService()
  const [isHideCloseDialog, { toggle: toggleHideCloseDialog }] = useBoolean(
    settingVM.isHideCloseDialog
  )

  const { loading, runAsync: close } = useRequest(async () => {
    const { result, error } = await S.logOut({ hideErrorDialog: true })
    if (error) return
    if (!result) return
    settingVM.setIsHideCloseDialog(isHideCloseDialog)
    window.api.quit()
  })

  return (
    <>
      {!settingVM.isHideCloseDialog && userVM.userInfo ? (
        <>
          <label className="btn btn-ghost rounded-btn" htmlFor={modalId}>
            <span className="material-icons-outlined bg-transparent">close</span>
          </label>
          <ModalWithOutClose id={modalId}>
            <label htmlFor={modalId} className="btn btn-sm btn-ghost absolute right-2 top-5">
              <span className="material-icons-outlined bg-transparent">close</span>
            </label>
            <h3 className="text-lg font-bold">关闭</h3>
            <p className="py-4">你确定要关闭游戏吗</p>
            <label className="label cursor-pointer w-fit space-x-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={isHideCloseDialog}
                onChange={toggleHideCloseDialog}
              />
              <span className="label-text">不再提示</span>
            </label>
            <div className="modal-action">
              <label htmlFor={modalId} className={'btn ' + (loading && ' loading')} onClick={close}>
                关闭
              </label>
            </div>
          </ModalWithOutClose>
        </>
      ) : (
        <button className="btn btn-ghost rounded-btn" onClick={window.api.quit}>
          <span className="material-icons-outlined bg-transparent">close</span>
        </button>
      )}
    </>
  )
}
