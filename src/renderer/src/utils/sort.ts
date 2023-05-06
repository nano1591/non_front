import { Friend, FriendSkip, UserInRoom } from '@renderer/types'

export const friendSort = (a: Friend, b: Friend): number => {
  if (a.status !== 'outline' && b.status !== 'outline') return a.username.toUpperCase() < b.username.toUpperCase() ? -1 : 1
  else if (a.status !== 'outline') return -1
  else return 1
}

export const friendSkipSort = (a: FriendSkip, b: FriendSkip): number => (new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1)

export const roomUserSort = (a: UserInRoom, b: UserInRoom): number => a.index - b.index
