import { Dialog } from '@renderer/vm/useDialogVM'
import robot from '../../assets/images/robot.jpg'
import { Modal } from '../Modal'

interface IProps {
  dialog: Dialog
}

export const PortalRobotDialog2Body = ({ dialog }: IProps) => {
  return (
    <Modal id={dialog.id} onClose={dialog.onClose} scroll={false}>
      <h3 className="text-lg font-bold">人机验证</h3>
      {dialog.msg && <p className="py-4">{dialog.msg}</p>}
      <img src={robot} className="object-contain w-full" />
      <label htmlFor={dialog.id} className="btn mt-2 w-full" onClick={dialog.btns[0].onClick}>
        {dialog.btns[0].text}
      </label>
    </Modal>
  )
}
