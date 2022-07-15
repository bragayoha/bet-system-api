import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

import User from 'App/Models/User'
import { sendMail } from 'App/Services/sendMail'
import Bet from 'App/Models/Bet'

export default class VerifyTimeUserWithoutBet extends BaseTask {
  public static get schedule() {
    return '*/5 * 14 * * *'
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
      // const sevenDaysLatter = dayjs(new Date()).subtract(7, 'd')
      // const users = await User.query().whereHas(
      //   'bets',
      //   (query) => {
      //     query.where('created_at', '>', sevenDaysLatter.format('YYYY-MM-DD HH:mm:ss'))
      //   },
      //   '!=',
      //   '0'
      // )
      // users.forEach(async (user) => {
      //   try {
      //     console.log('entrou', user.name)
      //     await sendMail(user, 'email/let_bet_us')
      //     return Logger.info('Success in send email')
      //   } catch (error) {
      //     return Logger.error('Error in send email')
      //   }
      // })

      const users = await User.all()

      await Promise.all(
        users.map(async (user) => {
          const bets = await Bet.query().where('user_id', user.id)

          await Promise.all(
            bets.map(async (bet) => {
              const createDate = bet.createdAt.toString()

              const newDateMoreThan7days = dayjs(createDate).add(7, 'd').format()
              const currentDate = dayjs().format()

              if (newDateMoreThan7days < currentDate) {
                try {
                  await sendMail(user, 'email/let_bet_us')
                  return Logger.info('Success in send email')
                } catch (error) {
                  return Logger.error('Error in send email')
                }
              }
            })
          )
        })
      )
    } catch (error) {
      Logger.error(error)
    }
  }
}
