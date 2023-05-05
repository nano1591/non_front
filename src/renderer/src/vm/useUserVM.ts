import { Friend, FriendSkip, UserInfo, UserSignInfo } from '@renderer/types'
import { useGetState, useLocalStorageState, useSafeState } from 'ahooks'
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState'
import STORAGE_KEY from '../config/storageKey'
import { useState } from 'react'
import { friendSkipSort, friendSort } from '@renderer/utils/sort'

export const useUserVM = () => {
  const [userInfo, setUserInfo] = useSafeState<UserInfo>()
  const [defaultSignInfo, saveSignInfo] = useLocalStorageState<UserSignInfo | undefined>(
    STORAGE_KEY.signInfo
  )
  const [isSaveSignInfo, setIsSaveSignInfo] = useLocalStorageState<boolean>(
    STORAGE_KEY.isSaveSignInfo,
    { defaultValue: false }
  )

  const [friendList, setFriendList, getFriendList] = useGetState<Friend[]>([])
  const [friendSkipList, setFriendSkipList, getFriendSkipList] = useGetState<FriendSkip[]>([])

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [searchResultList, setSearchResultList] = useState<string[]>([])

  const updateFriendList = (data: Friend) => {
    const oldList = [...getFriendList()]
    const index = oldList.findIndex((f) => f.id === data.id)
    if (index === -1) {
      oldList.push(data)
    } else {
      oldList.splice(index, 1, data)
    }
    setFriendList(oldList.sort(friendSort))
  }

  const askSkipToMe = (data: { fName: string }) => {
    const oldList = [...getFriendSkipList()]
    oldList.push({
      username: data.fName,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    })
    setFriendSkipList(oldList.sort(friendSkipSort))
  }

  const deleteFriend = (data: { fName: string }) => {
    const oldList = [...getFriendList()]
    setFriendList(oldList.filter((f) => f.username !== data.fName))
  }

  const deleteSkip = (fName: string) => {
    const oldList = [...getFriendSkipList()]
    setFriendSkipList(oldList.filter((skip) => skip.username !== fName))
  }

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
    setSearchResultList,
    updateFriendList,
    askSkipToMe,
    deleteFriend,
    deleteSkip
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
  updateFriendList: (data: Friend) => void
  askSkipToMe: (data: { fName: string }) => void
  deleteFriend: (data: { fName: string }) => void
  deleteSkip: (fName: string) => void
}
