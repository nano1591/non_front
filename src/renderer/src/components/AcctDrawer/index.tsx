import { ReactNode, useContext } from 'react'
import { Me } from '../Me'
import { Friends } from '../Friends'
import { UserVMContext } from '@renderer/App'

interface IProps {
  id: string
  children: ReactNode
  show: boolean
}

export const AcctDrawer = ({ id, show, children }: IProps) => {
  return (
    <div className="drawer">
      <input id={id} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      {show && (
        <div className="drawer-side">
          <label htmlFor={id} className="drawer-overlay"></label>
          <div className="flex flex-col w-64 border-l-[1px] border-accent bg-base-300">
            <Me />
            <div className="flex-grow w-full h-friend">
              <Friends />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const AcctDrawerToggle = ({ id }: { id: string }) => {
  const userVM = useContext(UserVMContext)
  const skipAskCount = userVM.friendSkipList.length
  return (
    <label htmlFor={id} className="drawer-button btn btn-ghost rounded-btn">
      <div className="indicator">
        {skipAskCount !== 0 && (
          <span className="indicator-item badge badge-secondary">{skipAskCount}</span>
        )}
        <span className="material-icons-outlined bg-transparent">account_circle</span>
      </div>
    </label>
  )
}
