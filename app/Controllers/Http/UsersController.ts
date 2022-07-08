import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {}

  public async store({ response, request, route }: HttpContextContract) {
    const body = request.all()

    response.ok({ body })
  }

  public async show({ response }: HttpContextContract) {}

  public async update({ response }: HttpContextContract) {}

  public async destroy({ response }: HttpContextContract) {}
}
