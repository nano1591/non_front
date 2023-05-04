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
  createdAt: Date
  updatedAt: Date
} & Pick<User, 'username'>
