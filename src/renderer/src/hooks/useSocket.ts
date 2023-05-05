import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import CONFIG from '../config'
import { useContext } from 'react'
import { DialogVMContext, RoomVMContext, UserVMContext } from '@renderer/App'
import { Friend, ItemId, RoomInfo, UserInRoom, UserStatus } from '@renderer/types'

export type ServerToClientEvents = {
  /** 好友状态变更状态，没有则新建 */
  'friend:notify': (data: Friend) => void
  /** 对方发送给自己的好友申请 */
  'friend:ask': (data: { fName: string }) => void
  /** 对方删除自己 */
  'friend:delete': (data: { fName: string }) => void

  /** 别人发送给自己的房间邀请 */
  'me:room:ask': (data: { info: RoomInfo; fName: string }) => void
  /** 加入房间失败 */
  'me:room:failed': (data: { info: RoomInfo }) => void
  /** 自己退出了房间 */
  'me:room:quit': (data: { info: RoomInfo }) => void
  /** 自己被踢出房间 */
  'me:room:kickout': (data: { info: RoomInfo }) => void
  /** 房间被解散 */
  'me:room:dissolve': (data: { info: RoomInfo }) => void

  /** 正在邀请别人加入房间 */
  'room:ask': (data: { info: RoomInfo; fName: string }) => void
  /** 别人拒绝加入房间 */
  'room:reject': (data: { info: RoomInfo; fName: string }) => void
  /** 某人加入房间失败 */
  // 'room:failed': (data: { info: RoomInfo; fName: string }) => void
  /** 某人退出了房间 */
  'room:quit': (data: { info: RoomInfo; fName: string }) => void
  /** 某人被踢出房间 */
  'room:kickout': (data: { info: RoomInfo; fName: string }) => void
  /** 某人加入了房间 */
  'room:join': (data: { info: RoomInfo; fName: string }) => void
  /** 房间的新况 */
  'room:list': (data: { info: RoomInfo; list: UserInRoom[] }) => void
}

export interface ClientToServerEvents {
  /** 更换图标 */
  'me:icon': (data: { icon: number }) => void
  /** 给别人发送好友申请 */
  'friend:ask': (data: { fName: string }) => void
  /** 同意别人的好友申请 */
  'friend:sure': (data: { fName: string }) => void
  /** 拒绝别人的好友申请 */
  'friend:reject': (data: { fName: string }) => void
  /** 删除好友 */
  'friend:delete': (data: { fName: string }) => void

  /** 创建房间 */
  'room:create': (data: { rName: string }) => void
  /** 更改房间名 */
  'room:rename': (data: { rid: number; rName: string }) => void
  /** 更改房主 */
  'room:master': (data: { rid: number; masterId: number }) => void
  /** 邀请别人加入我的房间*/
  'room:ask': (data: { rid: number; fName: string }) => void
  /** 加入别人的房间 */
  'room:sure': (data: { rid: number }) => void
  /** 拒绝加入别人的房间 */
  'room:reject': (data: { rid: number }) => void
  /** 加入别人的房间 */
  'room:join': (data: { fName: string }) => void
  /** 把某人踢出自己的房间 */
  'room:kickout': (data: { rid: number; fName: string }) => void
  /** 退出房间 */
  'room:quit': () => void
  /** 解散自己的房间 */
  'room:dissolve': (data: { rid: number }) => void
  /** 更换队伍 */
  'room:item': (data: { rid: number; itemId: ItemId }) => void
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

export const useSocket = () => {
  const userVM = useContext(UserVMContext)
  const dialogVM = useContext(DialogVMContext)
  const roomVM = useContext(RoomVMContext)

  const initSocket = () => {
    if (socket) return
    socket = io(CONFIG.socketBaseUrl, {
      extraHeaders: {
        authorization: userVM.userInfo!.token
      }
    })
    initSocketEvent()
  }

  const initSocketEvent = () => {
    socket!.on('connect', () => {
      const status: UserStatus = 'online'
      // TODO 恢复之前的status
      userVM.setUserInfo((info) => ({ ...info!, status }))
      console.log('connect socket', userVM.userInfo)
    })

    socket!.on('disconnect', () => {
      dialogVM.showDialog({
        title: '断开连接',
        msg: '已断开与服务器的连接。',
        btns: [{ text: '关闭' }],
        onClose: window.api.quit
      })
    })

    socket!.on('friend:notify', userVM.updateFriendList)
    socket!.on('friend:ask', userVM.askSkipToMe)
    socket!.on('friend:delete', userVM.deleteFriend)

    socket!.on('me:room:ask', roomVM.askRoomToMe)
    socket!.on('me:room:failed', (data: { info: RoomInfo }) => {
      dialogVM.showDialog({
        title: '操作失败',
        msg: `加入「${data.info.name}」失败。原因可能是房间不存在，或房间已满员。`
      })
    })
    socket!.on('me:room:quit', roomVM.clearRoomState)
    socket!.on('me:room:kickout', (data: { info: RoomInfo }) => {
      dialogVM.showDialog({
        title: '通知',
        msg: `你已被移出「${data.info.name}」。`,
        onClose: roomVM.clearRoomState
      })
    })
    socket!.on('me:room:dissolve', (data: { info: RoomInfo }) => {
      // 自己解散的
      if (data.info.masterId === userVM.userInfo?.id) {
        dialogVM.showAlert({ type: 'success', msg: `你已解散「${data.info.name}」。` })
        return roomVM.clearRoomState()
      }
      dialogVM.showDialog({
        title: '通知',
        msg: `「${data.info.name}」已被解散。`,
        onClose: roomVM.clearRoomState
      })
    })

    socket!.on('room:ask', roomVM.askRoomToOther)
    socket!.on('room:reject', roomVM.rejectRoomFromOther)
    socket!.on('room:quit', roomVM.quitRoomFromOther)
    socket!.on('room:kickout', roomVM.kickoutOtherOfRoom)
    socket!.on('room:join', roomVM.jointRoomFromOther)
    socket!.on('room:list', roomVM.roomUpdate)
  }

  /** 改变自己的图标 */
  const changeMeIcon = (icon: number) => {
    socket!.emit('me:icon', { icon })
    userVM.setUserInfo((info) => ({ ...info!, icon }))
  }

  /** 发送好友申请 */
  const askSkipToOther = (fName: string) => {
    socket!.emit('friend:ask', { fName })
  }

  /** 同意别人的好友申请 */
  const sureSkipToOther = (fName: string) => {
    socket!.emit('friend:sure', { fName })
    userVM.deleteSkip(fName)
    dialogVM.showAlert({ type: 'success', msg: `已同意「${fName}」的好友申请。` })
  }

  /** 拒绝别人的好友申请 */
  const rejectSkipToOther = (fName: string) => {
    socket!.emit('friend:reject', { fName })
    userVM.deleteSkip(fName)
    dialogVM.showAlert({ type: 'info', msg: `已拒绝「${fName}」的好友申请。` })
  }

  /** 删除好友 */
  const deleteFriend = (fName: string) => {
    socket!.emit('friend:delete', { fName })
    userVM.deleteFriend({ fName })
    dialogVM.showAlert({ type: 'success', msg: `已从好友列表删除「${fName}」。` })
  }

  /** 创建房间 */
  const createRoom = () => {
    socket!.emit('room:create', {
      rName: CONFIG.roomName.replace('{0}', userVM.userInfo!.username)
    })
  }

  /** 更改房间名 */
  const renameRoom = (rName: string) => {
    if (!roomVM.roomInfo || !roomVM.isMaster) return
    socket!.emit('room:rename', {
      rid: roomVM.roomInfo.id,
      rName
    })
  }

  /** 更换房主 */
  const reMasterRoom = (mid: number) => {
    if (!roomVM.roomInfo || !roomVM.isMaster) return
    socket!.emit('room:master', {
      rid: roomVM.roomInfo.id,
      masterId: mid
    })
  }

  /** 邀请别人加入房间 */
  const askRoomToOther = (fName: string) => {
    if (!roomVM.roomInfo) return
    socket!.emit('room:ask', {
      rid: roomVM.roomInfo.id,
      fName
    })
  }

  /** 同意别人的房间邀请 */
  const sureRoomToOther = (rid: number) => {
    socket!.emit('room:sure', { rid })
    roomVM.deleteRoomAsk(rid)
  }

  /** 拒绝别人的房间邀请 */
  const rejectRoomToOther = (rid: number) => {
    socket!.emit('room:reject', { rid })
    roomVM.deleteRoomAsk(rid)
  }

  /** 加入好友的房间 */
  const joinRoomFromFriend = (fName: string) => {
    socket!.emit('room:join', { fName })
  }

  /** 把房间内的某人踢出房间 */
  const kickoutOtherOfRoom = (fName: string) => {
    if (!roomVM.roomInfo || !roomVM.isMaster) return
    socket!.emit('room:kickout', { rid: roomVM.roomInfo.id, fName })
  }

  /** 退出房间 */
  const quitRoom = () => {
    if (!roomVM.roomInfo) return
    socket!.emit('room:quit')
    roomVM.clearRoomState()
  }

  /** 解散房间 */
  const dissolveRoom = () => {
    if (!roomVM.roomInfo || !roomVM.isMaster) return
    socket!.emit('room:dissolve', { rid: roomVM.roomInfo.id })
    roomVM.clearRoomState()
  }

  /** 更换队伍 */
  const reItemInRoom = (itemId: ItemId) => {
    if (!roomVM.roomInfo) return
    socket!.emit('room:item', { rid: roomVM.roomInfo.id, itemId })
  }

  return {
    initSocket,
    changeMeIcon,
    askSkipToOther,
    sureSkipToOther,
    rejectSkipToOther,
    deleteFriend,
    createRoom,
    renameRoom,
    reMasterRoom,
    askRoomToOther,
    sureRoomToOther,
    rejectRoomToOther,
    joinRoomFromFriend,
    kickoutOtherOfRoom,
    quitRoom,
    dissolveRoom,
    reItemInRoom
  }
}
