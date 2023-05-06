import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeModal } from '../ThemeModal'
import { nanoid } from 'nanoid'
import { AcctDrawer, AcctDrawerToggle } from '../AcctDrawer'
import { SearchModal } from '../SearchModal'
import { CloseDialog } from '../CloseDialog'
import { RoomAskList } from '../RoomAskList'

interface IProps {
  children: ReactNode
  title?: string
  back?: boolean
  theme?: boolean
  acct?: boolean
  search?: boolean
  roomAskList?: boolean
}

export const WindowPage = ({ children, title = 'Nano of Nichijou', back = false, theme = false, acct = false, search = false, roomAskList = false }: IProps) => {
  const navigate = useNavigate()
  const drawerId = nanoid()
  return (
    <AcctDrawer id={drawerId} show={acct}>
      <div>
        <div className="navbar bg-base-300 border-b-[1px] border-accent">
          <div className="navbar-start">
            {back && (
              <button className="btn btn-ghost rounded-btn" onClick={() => navigate(-1)}>
                <span className="material-icons-outlined bg-transparent">arrow_back</span>
              </button>
            )}
            {acct && <AcctDrawerToggle id={drawerId} />}
            {search && <SearchModal />}
            {roomAskList && <RoomAskList />}
          </div>
          <div className="navbar-center">
            <div className="text-center text-3xl font-bold">{title}</div>
          </div>
          <div className="navbar-end">
            {theme && <ThemeModal />}
            <button className="btn btn-ghost rounded-btn" onClick={window.api.hide}>
              <span className="material-icons-outlined bg-transparent">remove</span>
            </button>
            <button className="btn btn-ghost rounded-btn" onClick={window.api.full}>
              <span className="material-icons-outlined bg-transparent">crop_din</span>
            </button>
            <CloseDialog />
          </div>
        </div>
        <div className="contener">{children}</div>
      </div>
    </AcctDrawer>
  )
}
