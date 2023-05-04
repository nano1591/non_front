import { Friend, FriendSkip, UserInfo, UserSignInfo } from '@renderer/types'
import { useLocalStorageState, useSafeState } from 'ahooks'
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState'
import STORAGE_KEY from '../config/storageKey'
import { useState } from 'react'

// const testList = [
//   '城市早已沉睡',
//   '在甜美的虚伪',
//   '真实就像',
//   '刺眼的阳光',
//   '习惯伸手就挡',
//   '我像火烧在大雨下',
//   '剩最后微弱的火花',
//   '看不见国王的新衣裳',
//   '是否太倔强',
//   '生活就像一场',
//   '繁华里的流浪',
//   '多少欲望',
//   '像汹涌的浪',
//   '城市早已沉睡',
//   '在甜美的虚伪',
//   '真实就像',
//   '刺眼的阳光',
//   '习惯伸手就挡',
//   '我像火烧在大雨下',
//   '剩最后微弱的火花',
//   '看不见国王的新衣裳',
//   '是否太倔强',
//   '生活就像一场',
//   '繁华里的流浪',
//   '多少欲望',
//   '像汹涌的浪',
//   '城市早已沉睡',
//   '在甜美的虚伪',
//   '真实就像',
//   '刺眼的阳光',
//   '习惯伸手就挡',
//   '我像火烧在大雨下',
//   '剩最后微弱的火花',
//   '看不见国王的新衣裳',
//   '是否太倔强',
//   '生活就像一场',
//   '繁华里的流浪',
//   '多少欲望',
//   '像汹涌的浪'
// ]

export const useUserVM = () => {
  const [userInfo, setUserInfo] = useSafeState<UserInfo>()
  const [defaultSignInfo, saveSignInfo] = useLocalStorageState<UserSignInfo | undefined>(
    STORAGE_KEY.signInfo
  )
  const [isSaveSignInfo, setIsSaveSignInfo] = useLocalStorageState<boolean>(
    STORAGE_KEY.isSaveSignInfo,
    { defaultValue: false }
  )

  const [friendList, setFriendList] = useSafeState<Friend[]>([])
  const [friendSkipList, setFriendSkipList] = useSafeState<FriendSkip[]>([])

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [searchResultList, setSearchResultList] = useState<string[]>([])

  return {
    userInfo,
    setUserInfo,
    defaultSignInfo,
    saveSignInfo,
    isSaveSignInfo,
    setIsSaveSignInfo,
    friendList,
    setFriendList,
    friendSkipList,
    setFriendSkipList,
    searchKeyWord,
    setSearchKeyWord,
    searchResultList,
    setSearchResultList
  }
}

export type UserVM = {
  userInfo: UserInfo | undefined
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | undefined>>
  defaultSignInfo: UserSignInfo | undefined
  saveSignInfo: (value: UserSignInfo | IFuncUpdater<UserSignInfo | undefined> | undefined) => void
  isSaveSignInfo: boolean
  setIsSaveSignInfo: (value: boolean | IFuncUpdater<boolean>) => void
  friendList: Friend[]
  setFriendList: React.Dispatch<React.SetStateAction<Friend[]>>
  friendSkipList: FriendSkip[]
  setFriendSkipList: React.Dispatch<React.SetStateAction<FriendSkip[]>>
  searchKeyWord: string
  setSearchKeyWord: React.Dispatch<React.SetStateAction<string>>
  searchResultList: string[]
  setSearchResultList: React.Dispatch<React.SetStateAction<string[]>>
}
