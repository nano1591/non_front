import { Dialog } from '@renderer/vm/useDialogVM'
import { Modal } from '../Modal'

interface IProps {
  dialog: Dialog
}

export const PortalDialog2Body = ({ dialog }: IProps) => {
  return (
    <Modal id={dialog.id} onClose={dialog.onClose}>
      {dialog.title && <h3 className="text-lg font-bold">{dialog.title}</h3>}
      {dialog.msg && <p className="py-4">{dialog.msg}</p>}
      {dialog.btns.length > 0 && (
        <div className="modal-action">
          {dialog.btns.map((btn, index) => (
            <label htmlFor={dialog.id} className="btn" onClick={btn.onClick} key={index}>
              {btn.text}
            </label>
          ))}
        </div>
      )}
    </Modal>
  )
}
