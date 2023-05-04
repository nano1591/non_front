import { DialogVMContext, UserVMContext } from '@renderer/App'
import { useService } from '@renderer/hooks/useService'
import { check6_16Word } from '@renderer/utils/check'
import { useBoolean, useRequest } from 'ahooks'
import { useContext, useState } from 'react'
import type { IBaseProps } from '../../types'
import TIP from '../../config/tip'
import { useNavigate } from 'react-router-dom'
import { IDialog } from '@renderer/vm/useDialogVM'
import CONFIG from '../../config'

type IProps = IBaseProps

export const SignIn = ({ className }: IProps) => {
  const dialogVM = useContext(DialogVMContext)
  const userVM = useContext(UserVMContext)
  const navigate = useNavigate()

  const [showPwd, { toggle: toggleShowPwd }] = useBoolean(false)
  const [isSaveSignInfo, { toggle: toggleSaveSignInfo }] = useBoolean(userVM.isSaveSignInfo)

  const [account, setAcct] = useState<string>(userVM.defaultSignInfo?.account || '')
  const [password, setPwd] = useState<string>(userVM.defaultSignInfo?.password || '')

  const disabled = !check6_16Word(account) || !check6_16Word(password)

  const S = useService()
  const { loading, runAsync: signIn } = useRequest(
    async () => {
      const { result } = await S.signIn({ account, password })
      if (!result) return
      userVM.setUserInfo(result)
      if (isSaveSignInfo) {
        userVM.saveSignInfo({ account, password })
        userVM.setIsSaveSignInfo(true)
      } else {
        userVM.saveSignInfo(undefined)
        userVM.setIsSaveSignInfo(false)
      }
      navigate('/client')
    },
    { manual: true }
  )
  const { runAsync: checkClient } = useRequest(
    async () => {
      const { result, error } = await S.getClientConfig()
      if (error) return Promise.reject(window.api.quit())
      if (result?.version !== CONFIG.version) {
        return new Promise((_, reject) => {
          const dialog: IDialog = {
            title: '版本过低',
            msg: '客户端版本过低，请更新！',
            btns: [{ text: '退出' }],
            onClose: () => reject(window.api.quit())
          }
          dialogVM.showDialog(dialog)
        })
      }
      Promise.resolve(undefined)
    },
    { manual: true }
  )

  const onSignIn = async () => {
    await checkClient()
    await dialogVM.showRobotDialog('登录前请完成人机验证o_0')
    await signIn()
  }

  return (
    <div className={'form-control flex flex-col space-y-2 ' + className}>
      <div className="flex flex-row space-x-2 items-center w-full">
        <input
          id="account"
          placeholder="账号"
          type="text"
          className="input input-bordered w-full max-w-lg flex-1"
          onChange={(event) => setAcct(event.target.value)}
          value={account}
        />
        <div className="tooltip tooltip-right material-icons-outlined" data-tip={TIP['6_16word']}>
          info
        </div>
      </div>
      <div className="flex flex-row space-x-2 items-center w-full">
        <div className="flex flex-row input-group">
          <input
            id="password"
            placeholder="密码"
            type={showPwd ? 'text' : 'password'}
            className="input input-bordered w-full max-w-lg flex-1"
            onChange={(event) => setPwd(event.target.value)}
            value={password}
          />
          <label className="btn btn-circle swap swap-rotate">
            <input type="checkbox" checked={showPwd} onClick={toggleShowPwd} />
            <span className="swap-off material-icons-outlined bg-transparent">visibility_off</span>
            <span className="swap-on material-icons-outlined  bg-transparent">visibility</span>
          </label>
        </div>
        <div className="tooltip tooltip-right material-icons-outlined" data-tip={TIP['6_16word']}>
          info
        </div>
      </div>

      <label className="label cursor-pointer w-fit space-x-2">
        <input
          type="checkbox"
          className="checkbox"
          checked={isSaveSignInfo}
          onChange={toggleSaveSignInfo}
        />
        <span className="label-text">保存账号密码</span>
      </label>

      <button
        onClick={onSignIn}
        disabled={disabled}
        className={'btn' + (loading ? ' loading' : '') + (disabled ? ' btn-disabled' : '')}
      >
        登录
      </button>
    </div>
  )
}
