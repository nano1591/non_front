export type User = {
  account: string
  password: string
  username: string
  status: UserStatus
  icon: number
}

export type UserInfo = Omit<User, 'password'> & { id: number; token: string }

export type ItemId = 0 | 1
export type UserStatus = 'online' | 'outline' | 'room' | 'gaming'

export interface IBaseProps {
  className?: string
}

export type UserSignInfo = Pick<User, 'account' | 'password'>
export type UserRegisterInfo = Pick<User, 'account' | 'password' | 'username'>

export type IRequest<T extends any> = {
  url: string
  method: 'get' | 'post' | 'delete'
  data?: T
}

export type ServiceResult<T> = {
  result?: T
  error?: any
}

export type ClientConfig = {
  version: string
}

export type Friend = Omit<User, 'account' | 'password'> & { id: number }

export type FriendSkip = {
  createdAt: string
  updatedAt: string
} & Pick<User, 'username'>

export type RoomInfo = {
  id: number
  masterId: number
  name: string
}

export type ItemId = 0 | 1

export type RoomItem = {
  id: number
  index: number
  itemId: ItemId
}

export type UserInRoom = Omit<UserInfo, 'status' | 'token'> & Pick<RoomItem, 'index' | 'itemId'>

export type RoomMsg = {
  type: 'asking' | 'join' | 'reject' | 'kickout' | 'quit'
  username: string
}
