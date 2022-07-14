import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import BetValidator from 'App/Validators/BetValidator'

export default class BetsController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) {
      return Bet.query()
    }

    try {
      const bets = await Bet.query().paginate(page || 1, perPage || 10)

      return response.ok(bets)
    } catch (error) {
      return response.badRequest({ message: 'Error in list bets', originalError: error.message })
    }
  }

  public async store({ response, request, params, auth }: HttpContextContract) {
    const data = await request.validate(BetValidator)

    let bet

    try {
      bet = await Bet.create({
        numbers: data.numbers.join(),
        userId: auth.user?.id,
        gameId: params.gameId,
      })
    } catch (error) {
      return response.badRequest({ message: 'Error in store bet', originalError: error.message })
    }

    let betFind

    try {
      betFind = await Bet.query().where('id', bet.id)
    } catch (error) {
      return response.badRequest({ message: 'Error in find bet', originalError: error.message })
    }

    return response.ok(betFind)
  }

  public async show({ response, params }: HttpContextContract) {
    const betId = params.id

    try {
      const bet = await Bet.query().where('id', betId)

      return response.ok(bet)
    } catch (error) {
      return response.notFound({ message: 'Bet not found', originalError: error.message })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const betId = params.id

    try {
      await Bet.query().where('id', betId).delete()
    } catch (error) {
      return response.notFound({ message: 'Bet not found', originalError: error.message })
    }
  }
}
