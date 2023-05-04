import { useGetState, useRafState } from 'ahooks'
import { nanoid } from 'nanoid'
import CONFIG from '../config'

export type Btn = {
  text: string
  onClick?: () => Promise<void> | void
}

export type Dialog = {
  id: string
  title: string
  msg: string
  btns: Btn[]
  onClose: () => Promise<void> | void
}

export type IDialog = Partial<Omit<Dialog, 'id'>>

export type Alert = {
  type: 'none' | 'info' | 'success' | 'warning' | 'error'
  msg: string
}

export const useDialogVM = () => {
  const [dialogs, setList, getList] = useGetState<Dialog[]>([])
  const [robotDialog, setRobotDialog] = useRafState<Dialog | undefined>(undefined)

  const showDialog = (dialog: IDialog) => {
    const id = nanoid()
    const newDialog: Dialog = {
      id,
      title: dialog.title || '',
      msg: dialog.msg || '',
      btns: dialog.btns || [],
      onClose: async () => {
        dialog.onClose?.call(null)
        setList(getList().filter((value) => value.id !== id))
      }
    }
    setList([...getList(), newDialog])
  }

  const showRobotDialog = async (msg: string) => {
    return new Promise((resolve, reject) => {
      const id = nanoid()
      const robotDialog: Dialog = {
        id,
        msg,
        title: '',
        btns: [{ text: '点击验证', onClick: () => resolve(undefined) }],
        onClose: async () => {
          reject(undefined)
          setRobotDialog(undefined)
        }
      }
      setRobotDialog(robotDialog)
    })
  }

  const [alertList, setAlertList] = useGetState<Alert[]>([])

  const showAlert = (alert: Alert) => {
    setAlertList((list) => [...list, alert])
    setTimeout(() => {
      setAlertList((list) => list.filter((v) => v !== alert))
    }, CONFIG.alertTime)
  }

  return {
    dialogs,
    showDialog,
    robotDialog,
    showRobotDialog,
    alertList,
    showAlert
  }
}

export type DialogVM = {
  dialogs: Dialog[]
  showDialog: (dialog: IDialog) => void
  robotDialog: Dialog | undefined
  showRobotDialog: (msg: string) => Promise<unknown>
  alertList: Alert[]
  showAlert: (alert: Alert) => void
}
