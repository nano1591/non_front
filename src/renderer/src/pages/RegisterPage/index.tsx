import { Register } from '@renderer/components/Register'
import bg from '../../assets/images/sakamoto.jpg'
import { ClientInfo } from '@renderer/components/ClientInfo'
import { WindowPage } from '@renderer/components/WindowPage'

export const RegisterPage = () => {
  return (
    <WindowPage back theme>
      <div className="hero bg-base-200 relative h-full">
        <img src={bg} className="-z-1 w-[300px] absolute bottom-[20px] left-[20px]" />
        <div className="hero-content flex flex-row">
          <div className="item-center px-5 flex flex-col">
            <Register className="flex-1" />
            <ClientInfo />
          </div>
        </div>
      </div>
    </WindowPage>
  )
}
