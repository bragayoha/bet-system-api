import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

import User from 'App/Models/User'

export default class VerifyTimeUserWithoutBet extends BaseTask {
  public static get schedule() {
    return '0 0 9 * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    dayjs.extend(isLeapYear)
    dayjs.locale('pt-br')

    try {
      const betsUser = await User.all()

      await Promise.all(
        betsUser.map(async (bet) => {
          const { createdAt } = bet.serialize()

          const newDateMoreThan7days = dayjs(createdAt).add(7, 'd').format()
          const currentDate = dayjs().format()

          if (newDateMoreThan7days < currentDate)
            try {
              return Logger.info('Success in send email')
            } catch (error) {
              return Logger.error('Error in send email')
            }
        })
      )
    } catch (error) {}
    Logger.info('Handled')
  }
}
