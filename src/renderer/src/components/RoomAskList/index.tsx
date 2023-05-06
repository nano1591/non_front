import { useContext } from 'react'
import { RoomVMContext } from '@renderer/App'
import { nanoid } from 'nanoid'
import { ModalWithOutClose } from '../Modal'
import { useSocket } from '@renderer/hooks/useSocket'

export const RoomAskList = () => {
  const roomVM = useContext(RoomVMContext)
  const modalId = nanoid()
  const WS = useSocket()

  return (
    <>
      <label className="btn btn-ghost rounded-btn" htmlFor={modalId}>
        <div className="indicator">
          {roomVM.askRoomList.length !== 0 && <span className="indicator-item badge badge-secondary">{roomVM.askRoomList.length}</span>}
          <span className="material-icons-outlined bg-transparent">bedroom_baby</span>
        </div>
      </label>
      <ModalWithOutClose id={modalId}>
        <h3 className="text-lg font-bold">游戏邀请</h3>
        <div className="flex flex-wrap justify-start gap-2 max-w-[21rem] max-h-[20rem] h-fit overflow-y-scroll mt-4">
          {roomVM.askRoomList.map((v, index) => (
            <div key={index} className="flex items-center p-2 bg-base-200 rounded-lg  btn btn-ghost h-auto text-left flex-nowrap w-full">
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm">{v.info.name}</h3>
                <h4 className="text-xs opacity-50">来自：{v.fName}</h4>
              </div>
              <button className="btn btn-ghost rounded-btn btn-sm" onClick={() => WS.sureRoomToOther(v.info.id)}>
                <span className="material-icons-outlined bg-transparent">sports_kabaddi</span>
              </button>
              <button className="btn btn-ghost rounded-btn btn-sm" onClick={() => WS.rejectRoomToOther(v.info.id)}>
                <span className="material-icons-outlined bg-transparent">close</span>
              </button>
            </div>
          ))}
          {roomVM.askRoomList.length === 0 && <div className="text-sm text-center">当前没有收到游戏邀请</div>}
        </div>
      </ModalWithOutClose>
    </>
  )
}
