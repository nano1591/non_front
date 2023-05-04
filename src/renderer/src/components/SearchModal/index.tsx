import { useContext } from 'react'
import { DialogVMContext, UserVMContext } from '@renderer/App'
import { nanoid } from 'nanoid'
import { ModalWithOutClose } from '../Modal'
import { useService } from '@renderer/hooks/useService'
import { useDebounceEffect } from 'ahooks'

export const SearchModal = () => {
  const userVM = useContext(UserVMContext)
  const dialogVM = useContext(DialogVMContext)
  const modalId = nanoid()
  const S = useService()

  const searchUser = async (keyword: string) => {
    const { result, error } = await S.searchUser({ keyword }, { hideErrorDialog: true })
    if (error) return
    if (!result) return
    userVM.setSearchResultList(result.resultList)
  }

  useDebounceEffect(
    () => {
      if (!userVM.searchKeyWord.trim()) return userVM.setSearchResultList([])
      searchUser(userVM.searchKeyWord)
    },
    [userVM.searchKeyWord],
    { wait: 500 }
  )

  const onClickUser = (username: string) => {
    if (userVM.userInfo!.username === username) {
      return dialogVM.showAlert({ type: 'warning', msg: '不能添加自己为好友！' })
    }
    if (userVM.friendList.find((friend) => friend.username === username)) {
      return dialogVM.showAlert({ type: 'warning', msg: '好友关系已存在！' })
    }
    /** TODO 发送好友请求 */
    dialogVM.showAlert({ type: 'info', msg: `已向「${username}」发送好友请求。` })
  }

  return (
    <>
      <label className="btn btn-ghost rounded-btn" htmlFor={modalId}>
        <span className="material-icons-outlined bg-transparent">group_add</span>
      </label>
      <ModalWithOutClose id={modalId}>
        <label htmlFor={modalId} className="btn btn-sm btn-ghost absolute right-2 top-5">
          <span className="material-icons-outlined bg-transparent">close</span>
        </label>
        <h3 className="text-lg font-bold">添加好友</h3>
        <input
          id="username"
          placeholder="用户名"
          type="text"
          className="input input-bordered flex-1 my-4 w-[32rem]"
          onChange={(event) => userVM.setSearchKeyWord(event.target.value)}
          value={userVM.searchKeyWord}
        />
        <div className="flex flex-wrap justify-start gap-2 w-[32rem] h-[12rem] overflow-y-scroll">
          {userVM.searchResultList.map((username) => (
            <div
              key={username}
              onClick={() => onClickUser(username)}
              className="flex items-center p-2 bg-base-200 rounded-lg  btn btn-ghost text-left flex-nowrap text-sm"
            >
              {username}
            </div>
          ))}
        </div>
      </ModalWithOutClose>
    </>
  )
}
