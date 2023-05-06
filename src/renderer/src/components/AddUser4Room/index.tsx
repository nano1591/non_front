import { useContext, useState } from 'react'
import { DialogVMContext, RoomVMContext, UserVMContext } from '@renderer/App'
import { nanoid } from 'nanoid'
import { ModalWithOutClose } from '../Modal'
import { useService } from '@renderer/hooks/useService'
import { useDebounceEffect } from 'ahooks'
import { useSocket } from '@renderer/hooks/useSocket'
import { IDialog } from '@renderer/vm/useDialogVM'

export const AddUser4Room = () => {
  const userVM = useContext(UserVMContext)
  const roomVM = useContext(RoomVMContext)
  const dialogVM = useContext(DialogVMContext)
  const modalId = nanoid()
  const S = useService()
  const WS = useSocket()
  const [searchMode, setSearchMode] = useState<'friend' | 'global'>('friend')
  const [resultList, setResultlist] = useState<string[]>([])
  const [kw, setKW] = useState<string>('')

  const searchUser = async (keyword: string) => {
    const { result, error } = await S.searchUser({ keyword }, { hideErrorDialog: true })
    if (error) return
    if (!result) return
    setResultlist(result.resultList)
  }

  useDebounceEffect(
    () => {
      if (!kw.trim()) return setResultlist([])
      if (searchMode === 'global') searchUser(kw)
      else setResultlist(userVM.friendList.filter((f) => f.username.includes(kw)).map((f) => f.username))
    },
    [kw],
    { wait: 500 }
  )

  const inRoom = (username: string) => !!roomVM.roomUserList.find((user) => user.username === username)

  const onClickUser = (username: string) => {
    const dialog: IDialog = {
      title: '邀请确认',
      msg: `你确定邀请「${username}」到组队吗？`,
      btns: [{ text: '邀请', onClick: () => WS.askRoomToOther(username) }]
    }
    dialogVM.showDialog(dialog)
  }

  return (
    <>
      <label className="btn btn-ghost rounded-btn btn-sm " htmlFor={modalId}>
        <span className="material-icons-outlined bg-transparent">person_add_alt</span>
      </label>
      <ModalWithOutClose id={modalId}>
        <h3 className="text-lg font-bold">{`邀请用户「${searchMode === 'friend' ? '从好友' : '从非好友'}」`}</h3>
        <div className="flex flex-1 items-center">
          <input id="username" placeholder="用户名" type="text" className="input input-bordered flex-1 my-4 w-[12rem]" onChange={(event) => setKW(event.target.value)} value={kw} />
          <div className="btn-group ml-4">
            <button className="btn btn-sm" onClick={() => setSearchMode('friend')}>
              <span className="material-icons-outlined bg-transparent">group</span>
            </button>
            <button className="btn btn-sm" onClick={() => setSearchMode('global')}>
              <span className="material-icons-outlined bg-transparent">public</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-start gap-2 w-[16rem] max-h-[12rem] min-h-0 h-fit overflow-y-scroll">
          {resultList.map((username) => (
            <button
              key={username}
              onClick={() => onClickUser(username)}
              className={'flex items-center p-2 bg-base-200 rounded-lg  btn btn-ghost text-left flex-nowrap text-sm ' + (inRoom(username) && 'btn-disabled')}
              disabled={inRoom(username)}
            >
              {username}
            </button>
          ))}
        </div>
      </ModalWithOutClose>
    </>
  )
}
