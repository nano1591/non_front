import {
  ClientConfig,
  Friend,
  FriendSkip,
  ServiceResult,
  UserInfo,
  UserRegisterInfo,
  UserSignInfo
} from '@renderer/types'
import URL from '../config/url'
import { IDialog } from '@renderer/vm/useDialogVM'
import axios from 'axios'
import CONFIG from '../config'
import { IRequest } from '@renderer/types'
import CryptoJS from 'crypto-js'
import { useContext } from 'react'
import { DialogVMContext, UserVMContext } from '@renderer/App'

axios.defaults.baseURL = CONFIG.baseUrl
axios.defaults.timeout = CONFIG.timeoutTime
axios.defaults.timeoutErrorMessage = CONFIG.timeoutMsg

export type Options = {
  hideErrorDialog?: boolean
}

export const useService = () => {
  const userVM = useContext(UserVMContext)
  const dialogVM = useContext(DialogVMContext)
  const request = <T extends any, R extends any>({ url, method, data }: IRequest<T>) => {
    const headers = {
      Authorization: userVM.userInfo?.token && 'Bearer ' + userVM.userInfo?.token
    }
    return axios.request<T, R>({ url, method, headers, data })
  }

  const errorHandler = async <T>(
    serviceFun: () => Promise<T>,
    options?: Options
  ): Promise<ServiceResult<T>> => {
    try {
      const result: any = await serviceFun()
      return { result: result.data.data }
    } catch (e: any) {
      if (options?.hideErrorDialog) return { error: e }
      return new Promise((resolve) => {
        const dialog: IDialog = {
          title: '系统错误',
          msg: e?.response?.data?.message || e.message || '发生了未知错误！',
          btns: [{ text: 'ok' }],
          onClose: () => resolve({ error: e })
        }
        dialogVM.showDialog(dialog)
      })
    }
  }

  const signIn = (data: UserSignInfo, options?: Options) =>
    errorHandler<UserInfo>(
      () =>
        request({
          url: URL.SIGN_IN,
          method: 'post',
          data: { ...data, password: CryptoJS.SHA256(data.password).toString() }
        }),
      options
    )

  const register = (data: UserRegisterInfo, options?: Options) =>
    errorHandler<unknown>(
      () =>
        request({
          url: URL.REGISTER,
          method: 'post',
          data: { ...data, password: CryptoJS.SHA256(data.password).toString() }
        }),
      options
    )

  const logOut = (options?: Options) =>
    errorHandler<unknown>(
      () =>
        request({
          url: URL.LOG_OUT,
          method: 'get'
        }),
      options
    )

  const getClientConfig = (options?: Options) =>
    errorHandler<ClientConfig>(
      () =>
        request({
          url: URL.CLIENT_CONFIG,
          method: 'get'
        }),
      options
    )

  const getFriendList = (options?: Options) =>
    errorHandler<{ friendList: Friend[] }>(
      () =>
        request({
          url: URL.FRIEND_LIST,
          method: 'get'
        }),
      options
    )

  const getFriendSkipList = (options?: Options) =>
    errorHandler<{ skipList: FriendSkip[] }>(
      () =>
        request({
          url: URL.FRIEND_SKIP_LIST,
          method: 'get'
        }),
      options
    )

  const searchUser = (data: { keyword: string }, options?: Options) =>
    errorHandler<{ resultList: string[] }>(
      () =>
        request({
          url: URL.SEARCH_USER,
          method: 'post',
          data
        }),
      options
    )

  return {
    signIn,
    register,
    logOut,
    getClientConfig,
    getFriendList,
    getFriendSkipList,
    searchUser
  }
}
