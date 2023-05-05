import { UserVMContext } from '@renderer/App'
import { WindowPage } from '@renderer/components/WindowPage'
import { useService } from '@renderer/hooks/useService'
import { useSocket } from '@renderer/hooks/useSocket'
import { useAsyncEffect } from 'ahooks'
import { useContext } from 'react'

export const ClientPage = () => {
  const userVM = useContext(UserVMContext)
  const S = useService()
  const { initSocket } = useSocket()

  useAsyncEffect(async () => {
    const { result: res1 } = await S.getFriendList()
    if (res1) userVM.setFriendList(res1.friendList)
    const { result: res2 } = await S.getFriendSkipList()
    if (res2) userVM.setFriendSkipList(res2.skipList)
    initSocket()
  }, [])

  return (
    <WindowPage theme acct search>
      <div className="w-full h-full flex bg-base-200">
        <div className="flex flex-grow justify-center items-center">
          <button className="btn btn-primary btn-lg">PLAY</button>
        </div>
      </div>
    </WindowPage>
  )
}
