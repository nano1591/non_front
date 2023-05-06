import { useContext } from 'react'
import { DialogVMContext, RoomVMContext, UserVMContext } from '@renderer/App'
import { nanoid } from 'nanoid'
import { ModalWithOutClose } from '../Modal'
import { useSocket } from '@renderer/hooks/useSocket'
import { UserInRoom } from '@renderer/types'
import { IDialog } from '@renderer/vm/useDialogVM'

export const ReMasterDialog = () => {
  const userVM = useContext(UserVMContext)
  const roomVM = useContext(RoomVMContext)
  const roomUser = roomVM.roomUserList.filter((user) => user.id !== userVM.userInfo?.id)
  const dialogVM = useContext(DialogVMContext)
  const modalId = nanoid()
  const WS = useSocket()

  const onReMaster = (user: UserInRoom) => {
    const dialog: IDialog = {
      title: '变更确认',
      msg: `你确定要将房主变更为「${user.username}」？`,
      btns: [{ text: '变更', onClick: () => WS.reMasterRoom(user.id) }]
    }
    dialogVM.showDialog(dialog)
  }

  return (
    <>
      <label className={'btn btn-ghost rounded-btn btn-sm ' + (roomVM.roomUserList.length === 1 && 'btn-disabled')} htmlFor={modalId}>
        <span className="material-icons-outlined bg-transparent">manage_accounts</span>
      </label>
      <ModalWithOutClose id={modalId}>
        <h3 className="text-lg font-bold">变更房主</h3>
        <div className="flex flex-wrap justify-start gap-2 w-[16rem] max-h-[12rem] min-h-0 h-fit overflow-y-scroll mt-2">
          {roomUser.map((user) => (
            <div key={user.id} onClick={() => onReMaster(user)} className="flex items-center p-2 bg-base-200 rounded-lg  btn btn-ghost text-left flex-nowrap text-sm">
              {user.username}
            </div>
          ))}
        </div>
      </ModalWithOutClose>
    </>
  )
}
