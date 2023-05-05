import { useContext, useState } from 'react'
import { UserVMContext } from '@renderer/App'
import { ModalWithOutClose } from '../Modal'
import ICON from '../../config/icon'
import CONFIG from '../../config'
import { useSocket } from '@renderer/hooks/useSocket'

interface IProps {
  id: string
}

export const IconModal = ({ id }: IProps) => {
  const userVM = useContext(UserVMContext)
  const [iconId, setIconId] = useState<number>(userVM.userInfo!.icon)
  const WS = useSocket()
  const changeIcon = () => {
    WS.changeMeIcon(iconId)
  }

  return (
    <ModalWithOutClose id={id} scroll={false}>
      <label htmlFor={id} className="btn btn-sm btn-ghost absolute right-2 top-5">
        <span className="material-icons-outlined bg-transparent">close</span>
      </label>
      <h3 className="text-lg font-bold">更换头像</h3>
      <div className="flex flex-row mt-5 w-[30rem]">
        <div className="flex flex-col pr-5 h-min">
          <div className="avatar">
            <div className="w-24 h-24 rounded">
              <img src={ICON[iconId]} />
            </div>
          </div>
          <label className="btn mt-5" onClick={changeIcon} htmlFor={id}>
            确定
          </label>
        </div>
        <div className="flex flex-wrap justify-start gap-2 p-[5px] h-[20rem] overflow-y-scroll ">
          {Array.from({ length: CONFIG.iconCount }).map((_, index) => (
            <div
              key={index}
              className={
                'avatar ' +
                (index + 1 === iconId &&
                  'rounded ring ring-primary ring-offset-base-100 ring-offset-2')
              }
              onClick={() => setIconId(index + 1)}
            >
              <div className="w-16 h-16 rounded">
                <img src={ICON[index + 1]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalWithOutClose>
  )
}
