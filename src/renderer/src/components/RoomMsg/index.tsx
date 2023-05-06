import type { RoomMsg as TypeRoomMsg } from '@renderer/types'

interface IProps {
  roomMsg: TypeRoomMsg
}

export const RoomMsg = ({ roomMsg }: IProps) => {
  switch (roomMsg.type) {
    case 'asking':
      return (
        <div className="text-sm">
          <span className="text-info">{roomMsg.time}: </span>
          已向 「{`${roomMsg.username}`}」 发送游戏邀请。
        </div>
      )
    case 'join':
      return (
        <div className="text-sm">
          <span className="text-success">{roomMsg.time}: </span>「{`${roomMsg.username}`}」 已加入组队。
        </div>
      )
    case 'reject':
      return (
        <div className="text-sm">
          <span className="text-error">{roomMsg.time}: </span>「{`${roomMsg.username}`}」 拒绝了游戏邀请。
        </div>
      )
    case 'kickout':
      return (
        <div className="text-sm">
          <span className="text-info">{roomMsg.time}: </span>「{`${roomMsg.username}`}」 已被踢出组队。
        </div>
      )
    case 'quit':
      return (
        <div className="text-sm">
          <span className="text-info">{roomMsg.time}: </span>「{`${roomMsg.username}`}」 已退出组队。
        </div>
      )
  }
}
