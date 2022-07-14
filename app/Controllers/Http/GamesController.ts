import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import CreateGameValidator from 'App/Validators/CreateGameValidator'
import UpdateGameValidator from 'App/Validators/UpdateGameValidator'

export default class GamesController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) {
      return Game.query()
    }

    try {
      const games = await Game.query().paginate(page || 1, perPage || 10)

      return response.ok(games)
    } catch (error) {
      return response.badRequest({ message: 'Error in list games', originalError: error.message })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(CreateGameValidator)

    let game

    try {
      game = await Game.create({
        type: data.type,
        description: data.description,
        range: data.range,
        price: data.price,
        minAndMaxNumber: data.minAndMaxValue,
        color: data.color,
      })
    } catch (error) {
      return response.badRequest({ message: 'Error in create game', originalError: error.message })
    }

    let gameFind

    try {
      gameFind = await Game.query().where('id', game.id)
    } catch (error) {
      return response.badRequest({ message: 'Error in game find', originalError: error.message })
    }

    return response.ok(gameFind)
  }

  public async show({ response, params }: HttpContextContract) {
    const gameId = params.index

    try {
      const game = await Game.query().where('id', gameId)

      return response.ok(game)
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const data = await request.validate(UpdateGameValidator)

    const gameId = params.id

    let game

    try {
      game = await Game.findByOrFail('id', gameId)
      game
        .merge({
          type: data.type,
          description: data.description,
          range: data.range,
          price: data.price,
          minAndMaxValue: data.minAndMaxValue,
          color: data.color,
        })
        .save()
    } catch (error) {
      return response.badRequest({ message: 'Error in update game', originalError: error.message })
    }

    let gameFind

    try {
      gameFind = await Game.query().where('id', game.id)
    } catch (error) {
      return response.badRequest({ message: 'Error in find game', originalError: error.message })
    }

    return response.ok(gameFind)
  }

  public async destroy({ response, params }: HttpContextContract) {
    const gameId = params.id

    try {
      await Game.query().where('id', gameId).delete()
      return response.ok({ message: 'Game deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Game not found', originalError: error.message })
    }
  }
}
