import { UserVMContext } from '@renderer/App'
import { check6_16Name, check6_16Word } from '@renderer/utils/check'
import { useBoolean, useRequest } from 'ahooks'
import { useContext, useState } from 'react'
import type { IBaseProps } from '../../types'
import TIP from '../../config/tip'
import { useService } from '@renderer/hooks/useService'
import { useNavigate } from 'react-router-dom'

type IProps = IBaseProps

export const Register = ({ className }: IProps) => {
  const userVM = useContext(UserVMContext)
  const navigate = useNavigate()

  const [account, setAcct] = useState<string>('')
  const [username, setName] = useState<string>('')
  const [password, setPwd] = useState<string>('')
  const [rePwd, setRePwd] = useState<string>('')

  const [showPwd, { toggle: toggleShowPwd }] = useBoolean(false)
  const [showRePwd, { toggle: toggleShowRePwd }] = useBoolean(false)

  const disabled =
    !check6_16Word(account) ||
    !check6_16Word(password) ||
    !check6_16Name(username) ||
    password !== rePwd

  const S = useService()
  const { loading, runAsync: register } = useRequest(
    async () => {
      const { error } = await S.register({ account, password, username })
      if (error) return
      userVM.saveSignInfo({ account, password })
      userVM.setIsSaveSignInfo(false)
      navigate('/')
    },
    { manual: true }
  )

  const onRegister = async () => {
    await register()
  }

  return (
    <div className={'flex flex-col ' + className}>
      <div className={'form-control flex flex-col space-y-2'}>
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
          <input
            id="username"
            placeholder="游戏昵称"
            type="text"
            className="input input-bordered w-full max-w-lg flex-1"
            onChange={(event) => setName(event.target.value)}
            value={username}
          />
          <div className="tooltip tooltip-right material-icons-outlined" data-tip={TIP['6_16name']}>
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
              <span className="swap-off material-icons-outlined bg-transparent">
                visibility_off
              </span>
              <span className="swap-on material-icons-outlined  bg-transparent">visibility</span>
            </label>
          </div>
          <div className="tooltip tooltip-right material-icons-outlined" data-tip={TIP['6_16word']}>
            info
          </div>
        </div>
        <div className="flex flex-row space-x-2 items-center w-full">
          <div className="flex flex-row input-group">
            <input
              id="repwd"
              placeholder="确认密码"
              type={showRePwd ? 'text' : 'password'}
              className="input input-bordered w-full max-w-lg flex-1"
              onChange={(event) => setRePwd(event.target.value)}
              value={rePwd}
            />
            <label className="btn btn-circle swap swap-rotate">
              <input type="checkbox" checked={showRePwd} onClick={toggleShowRePwd} />
              <span className="swap-off material-icons-outlined bg-transparent">
                visibility_off
              </span>
              <span className="swap-on material-icons-outlined  bg-transparent">visibility</span>
            </label>
          </div>
          <div className="tooltip tooltip-right material-icons-outlined" data-tip={TIP['6_16word']}>
            info
          </div>
        </div>
      </div>

      <button
        onClick={onRegister}
        disabled={disabled}
        className={
          'btn  btn-accent mt-5' + (loading ? ' loading' : '') + (disabled ? ' btn-disabled' : '')
        }
      >
        注册
      </button>
    </div>
  )
}
