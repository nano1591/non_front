import { SignIn } from '@renderer/components/SignIn'
import { useNavigate } from 'react-router-dom'
import bg from '../../assets/images/sakamoto.jpg'
import { ClientInfo } from '@renderer/components/ClientInfo'
import { WindowPage } from '@renderer/components/WindowPage'

export const SignInPage = () => {
  const navigate = useNavigate()
  return (
    <WindowPage theme>
      <div className="hero relative h-full bg-base-200">
        <img src={bg} className="-z-1 w-[300px] absolute bottom-[20px] left-[20px]" />
        <div className="hero-content flex flex-row">
          <div className="item-center px-5 flex flex-col">
            <SignIn className="flex-1" />
            <div className="divider">OR</div>
            <button onClick={() => navigate('register')} className={'btn btn-accent'}>
              注册
            </button>
            <ClientInfo />
          </div>
        </div>
      </div>
    </WindowPage>
  )
}
