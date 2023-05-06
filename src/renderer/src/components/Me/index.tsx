import { UserVMContext } from '@renderer/App'
import { useContext } from 'react'
import USER_STATUS from '../../config/userstatus'
import ICON from '../../config/icon'
import { SearchModal } from '../SearchModal'
import { nanoid } from 'nanoid'
import { IconModal } from '../IconModal'

export const Me = () => {
  const userVM = useContext(UserVMContext)
  const iconModalId = nanoid()
  return (
    <div className="w-64 h-32 flex flex-row items-center p-5 shadow-xl bg-base-200 rounded-br-lg rounded-bl-lg">
      <label htmlFor={iconModalId} className="avatar rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2 mr-5 btn btn-ghost btn-circle">
        <div className="w-12 rounded-full flex items-center justify-center">
          <img src={ICON[userVM.userInfo!.icon]} />
        </div>
      </label>
      <div className="flex flex-col flex-grow">
        <h3 className="text-base">{userVM.userInfo!.username}</h3>
        <h4 className="text-xs opacity-50">{USER_STATUS[userVM.userInfo!.status]}</h4>
      </div>
      <SearchModal />
      <IconModal id={iconModalId} />
    </div>
  )
}
