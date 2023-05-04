import { WindowPage } from '@renderer/components/WindowPage'
import CONFIG from '../../config'

export const InfoPage = () => {
  return (
    <WindowPage title="应用信息" back theme>
      <div className="hero h-full bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="text-center text-4xl my-5 font-bold flex items-center justify-center">
              Nano of Nichijou<span className="badge">{CONFIG.version}</span>
            </div>
            <p className="pt-6">
              《Nano of Nichijou》是由Nano自主研发的一款全新不开放世界联机对抗游戏。
            </p>
            <p className="pt-6">
              游戏发生在一个被称作「Nichijou」的幻想世界，在这里，实力强的人将得到「WOOD
              CUBE」，成为国王。你将扮演一位名为「8号士兵」的神秘角色，在公主的报复中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌——同时，逐步发掘「Nichijou」的真相。
            </p>
            <p className="py-6">
              日々私たちが過ごしている日常は、実は、奇跡の連続なのかもしれない。
            </p>
          </div>
        </div>
      </div>
    </WindowPage>
  )
}
