import { DialogVMContext, RoomVMContext, UserVMContext } from '@renderer/App'
import { WindowPage } from '@renderer/components/WindowPage'
import { useService } from '@renderer/hooks/useService'
import { useSocket } from '@renderer/hooks/useSocket'
import { useAsyncEffect, useToggle } from 'ahooks'
import { useContext, useState } from 'react'
import ICON from '../../config/icon'
import { RoomMsg } from '@renderer/components/RoomMsg'
import { ItemId } from '@renderer/types'
import { IDialog } from '@renderer/vm/useDialogVM'
import { ReMasterDialog } from '@renderer/components/ReMasterDialog'
import { AddUser4Room } from '@renderer/components/AddUser4Room'

export const ClientPage = () => {
  const userVM = useContext(UserVMContext)
  const roomVM = useContext(RoomVMContext)
  const dialogVM = useContext(DialogVMContext)
  const [isEdit, { toggle: toggleEdit }] = useToggle(false)
  const [roomName, setRoomName] = useState<string | undefined>(undefined)
  const [selectUserId, setSelectUserId] = useState<number>(-1)
  const S = useService()
  const WS = useSocket()

  useAsyncEffect(async () => {
    const { result: res1 } = await S.getFriendList()
    if (res1) userVM.setFriendList(res1.friendList)
    const { result: res2 } = await S.getFriendSkipList()
    if (res2) userVM.setFriendSkipList(res2.skipList)
    WS.initSocket()
  }, [])

  const saveRoomName = () => {
    if (!roomName) return
    toggleEdit()
    WS.renameRoom(roomName)
  }

  const onDissolveRoom = () => {
    const dialog: IDialog = {
      title: '解散组队',
      msg: '你确定要解散组队吗？',
      btns: [{ text: '解散', onClick: WS.dissolveRoom }]
    }
    dialogVM.showDialog(dialog)
  }

  const onKickoutUser = (username: string) => {
    const dialog: IDialog = {
      title: '踢出组队',
      msg: `你确定要把「${username}」踢出组队吗？`,
      btns: [{ text: '踢出', onClick: () => WS.kickoutOtherOfRoom(username) }]
    }
    dialogVM.showDialog(dialog)
  }

  const onQuitRoom = () => {
    const dialog: IDialog = {
      title: '离开组队',
      msg: '你确定要离开组队吗？',
      btns: [{ text: '离开', onClick: WS.quitRoom }]
    }
    dialogVM.showDialog(dialog)
  }

  return (
    <WindowPage theme acct search roomAskList title={roomVM.roomInfo ? `组队中「${roomVM.roomUserList.length}/6」` : undefined}>
      <div className="w-full h-full flex bg-base-200">
        {!roomVM.roomInfo && (
          <div className="flex flex-grow justify-center items-center">
            <div className="btn btn-primary btn-lg" onClick={WS.createRoom}>
              创建队伍
            </div>
          </div>
        )}
        {roomVM.roomInfo && (
          <div className="flex flex-col w-full h-full px-2 py-4">
            <div className="flex flex-row h-8 pt-2 pb-8 items-center">
              {WS.isMaster ? (
                <>
                  <button className="btn btn-sm btn-ghost" onClick={onDissolveRoom}>
                    <span className="material-icons-outlined bg-transparent -scale-x-[1]">logout</span>
                  </button>
                  {isEdit ? (
                    <div className="btn-group">
                      <button className="btn btn-sm" onClick={toggleEdit}>
                        <span className="material-icons-outlined bg-transparent">close</span>
                      </button>
                      <button className={'btn btn-sm ' + (!roomName ? 'btn-disabled' : 'btn-active')} disabled={!roomName} onClick={saveRoomName}>
                        <span className="material-icons-outlined bg-transparent">done</span>
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-ghost" onClick={toggleEdit}>
                      <span className="material-icons-outlined bg-transparent">edit</span>
                    </button>
                  )}
                </>
              ) : (
                <button className="btn btn-sm btn-ghost" onClick={onQuitRoom}>
                  <span className="material-icons-outlined bg-transparent -scale-x-[1]">logout</span>
                </button>
              )}
              {isEdit ? (
                <input
                  placeholder="房间名"
                  type="text"
                  className="input flex-grow input-bordered mx-4"
                  onChange={(event) => setRoomName(event.target.value)}
                  value={roomName ?? roomVM.roomInfo.name}
                  onKeyDown={(event) => event.key === 'Enter' && saveRoomName()}
                />
              ) : (
                <h2 className="text-xl flex-grow font-bold mx-4">{roomVM.roomInfo.name ?? roomName}</h2>
              )}
              {roomVM.roomUserList.length !== 6 && <AddUser4Room />}
              {WS.isMaster && <ReMasterDialog />}
            </div>
            <div className="flex flex-row justify-around items-center w-[70vw] border-4 border-accent rounded-lg px-2 py-4 mx-auto">
              {roomVM.roomItem.map((item, itemId) => (
                <>
                  <div key={itemId} className="flex flex-col justify-start items-start w-[30vw] space-y-5">
                    {[0, 1, 2].map((index) => {
                      if (item[index]) {
                        return (
                          <div
                            className="p-2 bg-base-300 rounded-lg btn btn-ghost text-left flex-nowrap w-full h-4 justify-start"
                            key={index}
                            onClick={() => setSelectUserId((id) => (id === item[index].id ? -1 : item[index].id))}
                          >
                            {[0].map((v) => {
                              if (selectUserId === item[index].id && selectUserId !== userVM.userInfo?.id) {
                                if (!userVM.friendList.find((friend) => friend.id === item[index].id)) {
                                  return (
                                    <div key={0}>
                                      <button className="btn btn-sm btn-ghost bg-info mr-2" onClick={() => WS.askSkipToOther(item[index].username)}>
                                        <span className="material-icons-outlined bg-transparent">person_add_alt</span>
                                      </button>
                                      <button
                                        className={'btn btn-sm btn-ghost bg-error mr-2 ' + (WS.isMaster || ' btn-disabled')}
                                        onClick={() => onKickoutUser(item[index].username)}
                                        disabled={!WS.isMaster}
                                      >
                                        <span className="material-icons-outlined bg-transparent">gavel</span>
                                      </button>
                                    </div>
                                  )
                                }
                                return (
                                  <button
                                    key={0}
                                    className={'btn btn-sm btn-ghost bg-error mr-2 ' + (WS.isMaster || ' btn-disabled')}
                                    onClick={() => WS.kickoutOtherOfRoom(item[index].username)}
                                    disabled={!WS.isMaster}
                                  >
                                    <span className="material-icons-outlined bg-transparent">gavel</span>
                                  </button>
                                )
                              }
                              return (
                                <div className="avatar items-center" key={v}>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                    <img src={ICON[item[index].icon]} />
                                  </div>
                                </div>
                              )
                            })}
                            <h3 className="text-sm">{item[index].username}</h3>
                          </div>
                        )
                      }
                      if (item.length !== 3 && item.length === index && !item.find((v) => v.id === userVM.userInfo?.id)) {
                        return (
                          <div className="p-2 bg-base-300 rounded-lg btn btn-ghost h-4 text-left flex-nowrap w-full flex-row-reverse justify-start" key={index}>
                            <button className="btn btn-sm btn-ghost" onClick={() => WS.reItemInRoom(itemId as ItemId)}>
                              <span className="material-icons-outlined bg-transparent">keyboard_return</span>
                            </button>
                          </div>
                        )
                      }
                      return <div className="p-2 bg-base-300 rounded-lg btn btn-ghost h-4 text-left flex-nowrap w-full" key={index} />
                    })}
                  </div>
                  {itemId === 0 && <div className="divider divider-horizontal" />}
                </>
              ))}
            </div>
            <div className="py-8 items-end flex-grow grid grid-cols-3">
              <div />
              <div className="flex justify-center items-center">
                <div className="btn btn-lg">开始游戏！</div>
              </div>
              <div className="flex justify-center items-center p-4 ">
                <div className="flex flex-col justify-start flex-nowrap h-[10rem] overflow-y-scroll border-2 border-accent rounded-lg p-2 gap-2 w-full">
                  {roomVM.roomMsgList.map((roomMsg, index) => (
                    <RoomMsg key={index} roomMsg={roomMsg} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WindowPage>
  )
}
