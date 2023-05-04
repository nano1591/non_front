import { useNavigate } from 'react-router-dom'
import CONFIG from '../../config'

export const ClientInfo = () => {
  const navigate = useNavigate()
  return (
    <div className="text-center mt-2 flex flex-row justify-center">
      {CONFIG.version}
      <div className="divider divider-horizontal" />
      <a className="link" onClick={() => navigate('/info')}>
        应用信息
      </a>
    </div>
  )
}
