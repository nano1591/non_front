import { createContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PortalDialog2Body } from './components/PortalDialog2Body'
import { PortalRobotDialog2Body } from './components/PortalRobotDialog2Body'
import { InfoPage } from './pages/InfoPage'
import { RegisterPage } from './pages/RegisterPage'
import { SignInPage } from './pages/SignInPage'
import { DialogVM, useDialogVM } from './vm/useDialogVM'
import { UserVM, useUserVM } from './vm/useUserVM'
import { SettingVM, useSettingVM } from './vm/useSettingVM'
import { ClientPage } from './pages/ClientPage'
import { Alert } from './components/Alert'
import { RoomVM, useRoomVM } from './vm/useRoomVM'

export const UserVMContext = createContext<UserVM>({} as any)
export const DialogVMContext = createContext<DialogVM>({} as any)
export const SettingVMContext = createContext<SettingVM>({} as any)
export const RoomVMContext = createContext<RoomVM>({} as any)

export const App = () => {
  const dialogVM = useDialogVM()
  const userVM = useUserVM()
  const settingVM = useSettingVM()
  const roomVM = useRoomVM()
  return (
    <SettingVMContext.Provider value={settingVM}>
      <DialogVMContext.Provider value={dialogVM}>
        <UserVMContext.Provider value={userVM}>
          <RoomVMContext.Provider value={roomVM}>
            <SettingVMContext.Consumer>
              {(settingVM) => (
                <div id="app" className="overflow-hidden h-screen w-screen" data-theme={settingVM.theme} data-set-theme={settingVM.theme}>
                  <Routes>
                    <Route path="/" element={<SignInPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/info" element={<InfoPage />} />
                    <Route path="/client" element={<ClientPage />} />
                  </Routes>
                </div>
              )}
            </SettingVMContext.Consumer>
            <DialogVMContext.Consumer>{(dialogVM) => dialogVM.dialogs.map((dialog) => <PortalDialog2Body dialog={dialog} key={dialog.id} />)}</DialogVMContext.Consumer>
            <DialogVMContext.Consumer>{(dialogVM) => dialogVM.robotDialog && <PortalRobotDialog2Body dialog={dialogVM.robotDialog} />}</DialogVMContext.Consumer>
            <DialogVMContext.Consumer>
              {(dialogVM) => (
                <div className="toast toast-top toast-center w-1/2" id="toast">
                  {dialogVM.alertList.map((alert, index) => (
                    <Alert alert={alert} key={index} />
                  ))}
                </div>
              )}
            </DialogVMContext.Consumer>
          </RoomVMContext.Provider>
        </UserVMContext.Provider>
      </DialogVMContext.Provider>
    </SettingVMContext.Provider>
  )
}
