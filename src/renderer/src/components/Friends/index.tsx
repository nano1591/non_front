import { UserVMContext } from '@renderer/App'
import { useContext } from 'react'
import USER_STATUS from '../../config/userstatus'
import { useToggle } from 'ahooks'
import ICON from '../../config/icon'

export const Friends = () => {
  const [showFriends, { toggle: toggleMode }] = useToggle(true)
  return (
    <div className="flex flex-col mt-2 border-t-[1px] border-accent ">
      <div className="flex flex-row text-center justify-center p-2 h-10">
        <button
          className={'btn btn-xs btn-ghost rounded-btn ' + (showFriends && 'btn-active')}
          onClick={toggleMode}
        >
          好友列表
        </button>
        <div className="divider divider-horizontal" />
        <button
          className={'btn btn-xs btn-ghost rounded-btn  ' + (showFriends || 'btn-active')}
          onClick={toggleMode}
        >
          请求列表
        </button>
      </div>
      <div className="flex-grow space-y-2 p-2 border-t-[1px] border-accent overflow-y-scroll h-friend-list">
        {showFriends ? <FriendList /> : <FriendSkips />}
      </div>
    </div>
  )
}

const FriendList = () => {
  const userVM = useContext(UserVMContext)
  return (
    <>
      {userVM.friendList.map((friend, index) => (
        <div
          key={index}
          className="flex items-center justify-start flex-grow-0 p-2 bg-base-200 rounded-lg btn btn-ghost h-auto text-left flex-nowrap"
        >
          <div className="avatar">
            <div className="w-8 rounded-full flex items-center justify-center mr-5">
              <img src={ICON[friend.icon]} />
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm">{friend.username}</h3>
            <h4 className="text-xs opacity-50">{USER_STATUS[friend.status]}</h4>
          </div>
          <button className="btn btn-ghost rounded-btn btn-sm">
            <span className="material-icons-outlined bg-transparent">more_vert</span>
          </button>
        </div>
      ))}
      {userVM.friendList.length === 0 && <div className="text-sm text-center">好友列表，是0哦</div>}
    </>
  )
}

const FriendSkips = () => {
  const userVM = useContext(UserVMContext)
  return (
    <>
      {userVM.friendSkipList.map((skip, index) => (
        <div
          key={index}
          className="flex items-center p-2 bg-base-200 rounded-lg  btn btn-ghost h-auto text-left flex-nowrap"
        >
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm">{skip.username}</h3>
          </div>
          <button className="btn btn-ghost rounded-btn btn-sm" onClick={() => console.log(2)}>
            <span className="material-icons-outlined bg-transparent">done</span>
          </button>
          <button className="btn btn-ghost rounded-btn btn-sm" onClick={() => console.log(3)}>
            <span className="material-icons-outlined bg-transparent">close</span>
          </button>
        </div>
      ))}
      {userVM.friendSkipList.length === 0 && (
        <div className="text-sm text-center">好友请求，是0哦</div>
      )}
    </>
  )
}
