import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface IProps {
  id: string
  onClose?: () => void
  children: ReactNode
  scroll?: boolean
}

export const Modal = ({ id, onClose, children, scroll = true }: IProps) => {
  const dialogDom = (
    <div>
      <input type="checkbox" id={id} className="modal-toggle" onChange={(event) => event.target.checked || onClose?.call(null)} checked />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className={'modal-box rounded-lg relative min-w-[24rem] max-w-[80vw] max-h-[80vh]' + (scroll ? ' w-auto' : ' w-min')} htmlFor="">
          {children}
        </label>
      </label>
    </div>
  )
  return ReactDOM.createPortal(dialogDom, document.getElementById('app')!)
}

export const ModalWithOutClose = ({ id, children, scroll = true }: IProps) => {
  const dialogDom = (
    <div>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className={'modal-box rounded-lg relative min-w-[24rem] max-w-[80vw] max-h-[80vh]' + (scroll ? ' w-auto' : ' w-min')}>
          <label htmlFor={id} className="btn btn-sm btn-ghost absolute right-2 top-5">
            <span className="material-icons-outlined bg-transparent">close</span>
          </label>
          {children}
        </div>
      </div>
    </div>
  )
  return ReactDOM.createPortal(dialogDom, document.getElementById('app')!)
}
