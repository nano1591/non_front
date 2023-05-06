import { RoomInfo, RoomMsg, UserInRoom } from '@renderer/types'
import { roomUserSort } from '@renderer/utils/sort'
import { useGetState, useSafeState } from 'ahooks'

export const useRoomVM = () => {
  const [askRoomList, setAskRoomList, getAskRoomList] = useGetState<{ info: RoomInfo; fName: string }[]>([])
  const [roomInfo, setRoomInfo, getRoomInfo] = useGetState<RoomInfo | null>(null)
  const [roomUserList, setRoomUserList] = useSafeState<UserInRoom[]>([])
  const [roomMsgList, setRoomMsgList, getRoomMsgList] = useGetState<RoomMsg[]>([])

  const roomItem = [roomUserList.filter((user) => user.itemId === 0).sort(roomUserSort), roomUserList.filter((user) => user.itemId === 1).sort(roomUserSort)] as const

  const clearRoomState = () => {
    setRoomInfo(null)
    setRoomUserList([])
    setRoomMsgList([])
  }

  const askRoomToMe = (data: { info: RoomInfo; fName: string }) => {
    const oldList = [...getAskRoomList()]
    oldList.unshift(data)
    setAskRoomList(oldList)
  }

  const updateRoomMsgList = (rid: number, newMsg: Omit<RoomMsg, 'time'>) => {
    if (rid !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    oldList.unshift({ ...newMsg, time: new Date().toLocaleTimeString() })
    setRoomMsgList(oldList)
  }

  const askRoomToOther = (data: { info: RoomInfo; fName: string }) => updateRoomMsgList(data.info.id, { type: 'asking', username: data.fName })

  const rejectRoomFromOther = (data: { info: RoomInfo; fName: string }) => updateRoomMsgList(data.info.id, { type: 'reject', username: data.fName })

  const jointRoomFromOther = (data: { info: RoomInfo; fName: string }) => updateRoomMsgList(data.info.id, { type: 'join', username: data.fName })

  const quitRoomFromOther = (data: { info: RoomInfo; fName: string }) => updateRoomMsgList(data.info.id, { type: 'quit', username: data.fName })

  const kickoutOtherOfRoom = (data: { info: RoomInfo; fName: string }) => updateRoomMsgList(data.info.id, { type: 'kickout', username: data.fName })

  const roomUpdate = (data: { info: RoomInfo; list: UserInRoom[] }) => {
    console.log('roomUpdate', data)
    setRoomInfo(data.info)
    setRoomUserList(data.list)
  }

  const deleteRoomAsk = (rid: number) => {
    const oldList = [...getAskRoomList()]
    setAskRoomList(oldList.filter((ask) => ask.info.id !== rid))
  }

  return {
    askRoomList,
    roomInfo,
    roomUserList,
    roomItem,
    roomMsgList,
    clearRoomState,
    askRoomToMe,
    askRoomToOther,
    rejectRoomFromOther,
    quitRoomFromOther,
    jointRoomFromOther,
    kickoutOtherOfRoom,
    roomUpdate,
    deleteRoomAsk,
    updateRoomMsgList
  }
}

export type RoomVM = {
  askRoomList: { info: RoomInfo; fName: string }[]
  roomInfo: RoomInfo | null
  roomUserList: UserInRoom[]
  roomItem: readonly [UserInRoom[], UserInRoom[]]
  roomMsgList: RoomMsg[]
  clearRoomState: () => void
  askRoomToMe: (data: { info: RoomInfo; fName: string }) => void
  askRoomToOther: (data: { info: RoomInfo; fName: string }) => void
  rejectRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  quitRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  jointRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  kickoutOtherOfRoom: (data: { info: RoomInfo; fName: string }) => void
  roomUpdate: (data: { info: RoomInfo; list: UserInRoom[] }) => void
  deleteRoomAsk: (rid: number) => void
  updateRoomMsgList: (rid: number, newMsg: Omit<RoomMsg, 'time'>) => void
}
