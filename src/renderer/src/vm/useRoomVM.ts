import { UserVMContext } from "@renderer/App"
import { RoomInfo, RoomMsg, UserInRoom } from "@renderer/types"
import { useGetState, useSafeState } from "ahooks"
import { useContext } from "react"

export const useRoomVM = () => {
  const userVM = useContext(UserVMContext)
  const [askRoomList, setAskRoomList, getAskRoomList] = useGetState<{ info: RoomInfo; fName: string }[]>([])
  const [roomInfo, setRoomInfo, getRoomInfo] = useGetState<RoomInfo | null>(null)
  const [roomUserList, setRoomUserList] = useSafeState<UserInRoom[]>([])
  const [roomMsgList, setRoomMsgList, getRoomMsgList] = useGetState<RoomMsg[]>([])

  const isMaster = getRoomInfo()?.id === userVM?.userInfo

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

  const askRoomToOther = (data: { info: RoomInfo; fName: string }) => {
    if (data.info.id !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    oldList.push({ type: 'asking', username: data.fName })
    setRoomMsgList(oldList)
  }

  const rejectRoomFromOther = (data: { info: RoomInfo; fName: string }) => {
    if (data.info.id !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    setRoomMsgList(
      oldList.map((v) => (v.username === data.fName ? { type: 'reject', username: data.fName } : v))
    )
  }

  const jointRoomFromOther = (data: { info: RoomInfo; fName: string }) => {
    if (data.info.id !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    setRoomMsgList(
      oldList.map((v) => (v.username === data.fName ? { type: 'join', username: data.fName } : v))
    )
  }

  const quitRoomFromOther = (data: { info: RoomInfo; fName: string }) => {
    if (data.info.id !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    setRoomMsgList(
      oldList.map((v) => (v.username === data.fName ? { type: 'quit', username: data.fName } : v))
    )
  }

  const kickoutOtherOfRoom = (data: { info: RoomInfo; fName: string }) => {
    if (data.info.id !== getRoomInfo()?.id) return
    const oldList = [...getRoomMsgList()]
    setRoomMsgList(
      oldList.map((v) =>
        v.username === data.fName ? { type: 'kickout', username: data.fName } : v
      )
    )
  }

  const roomUpdate = (data: { info: RoomInfo; list: UserInRoom[] }) => {
    if (data.info.id !== getRoomInfo()?.id) return
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
    roomMsgList,
    isMaster,
    clearRoomState,
    askRoomToMe,
    askRoomToOther,
    rejectRoomFromOther,
    quitRoomFromOther,
    jointRoomFromOther,
    kickoutOtherOfRoom,
    roomUpdate,
    deleteRoomAsk
  }
}

export type RoomVM = {
  askRoomList: { info: RoomInfo; fName: string }[]
  roomInfo: RoomInfo | null
  roomUserList: UserInRoom[]
  roomMsgList: RoomMsg[]
  isMaster: boolean
  clearRoomState: () => void
  askRoomToMe: (data: { info: RoomInfo; fName: string }) => void
  askRoomToOther: (data: { info: RoomInfo; fName: string }) => void
  rejectRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  quitRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  jointRoomFromOther: (data: { info: RoomInfo; fName: string }) => void
  kickoutOtherOfRoom: (data: { info: RoomInfo; fName: string }) => void
  roomUpdate: (data: { info: RoomInfo; list: UserInRoom[] }) => void
  deleteRoomAsk: (rid: number) => void
}
