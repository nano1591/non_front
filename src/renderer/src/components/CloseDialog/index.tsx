import { SettingVMContext, UserVMContext } from '@renderer/App'
import { useService } from '@renderer/hooks/useService'
import { nanoid } from 'nanoid'
import { useContext, useState } from 'react'
import { Modal, ModalWithOutClose } from '../Modal'
import { useBoolean, useRequest, useToggle } from 'ahooks'

export const CloseDialog = () => {
  const userVM = useContext(UserVMContext)
  const settingVM = useContext(SettingVMContext)
  const S = useService()
  const modalId = nanoid()
  const [showDialog, { toggle: toggleShowDialog }] = useToggle(false)

  const { runAsync: logout } = useRequest(async () => {
    await S.logOut({ hideErrorDialog: true })
  }, { manual: true })

  const onClose = () => {
    if (!settingVM.isHideCloseDialog && userVM.userInfo) {
      toggleShowDialog()
    } else window.api.quit()
  }
  const close = async () => {
    await logout()
    window.api.quit()
  }
  const closeAndNoMoreHint = async () => {
    settingVM.setIsHideCloseDialog(true)
    await close()
  }

  return (
    <div className="btn btn-ghost rounded-btn" onClick={onClose}>
      <span className="material-icons-outlined bg-transparent">close</span>
      {showDialog &&
        <Modal id={modalId}>
          <label htmlFor={modalId} className="btn btn-sm btn-ghost absolute right-2 top-5">
            <span className="material-icons-outlined bg-transparent">close</span>
          </label>
          <h3 className="text-lg font-bold">退出确认</h3>
          <p className="py-4">你确定退出NoN程序吗？</p>
          <div className="modal-action w-full">
            <label className={'btn btn-ghost'} htmlFor="">
              取消
            </label>
            <div className='flex-grow' />
            <div className={'btn btn-secondary'} onClick={closeAndNoMoreHint}>
              退出且不再提示
            </div>
            <div className={'btn'} onClick={close}>
              退出
            </div>
          </div>
        </Modal>
      }
    </div>
  )
}
