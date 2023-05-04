import type { Alert as TypeAlert } from '@renderer/vm/useDialogVM'

interface IProps {
  alert: TypeAlert
}

export const Alert = ({ alert }: IProps) => {
  switch (alert.type) {
    case 'none':
      return (
        <div className="alert shadow-lg">
          <span className="material-icons-outlined bg-transparent">info</span>
          {alert.msg}
        </div>
      )
    case 'info':
      return (
        <div className="alert alert-info shadow-lg">
          <span className="material-icons-outlined bg-transparent">info</span>
          {alert.msg}
        </div>
      )
    case 'success':
      return (
        <div className="alert alert-success shadow-lg">
          <span className="material-icons-outlined bg-transparent">check_circle</span>
          {alert.msg}
        </div>
      )
    case 'warning':
      return (
        <div className="alert alert-warning shadow-lg">
          <span className="material-icons-outlined bg-transparent">error_outline</span>
          {alert.msg}
        </div>
      )
    case 'error':
      return (
        <div className="alert alert-error shadow-lg">
          <span className="material-icons-outlined bg-transparent">highlight_off</span>
          {alert.msg}
        </div>
      )
  }
}
