import { UserStatus } from '@renderer/types'

const USER_STATUS: Record<UserStatus, string> = {
  online: '在线',
  outline: '离线',
  room: '组队中',
  gaming: '游戏中'
}

export default USER_STATUS
