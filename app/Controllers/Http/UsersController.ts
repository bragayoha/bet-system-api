import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage } = request.all()

    const users = await User.query().paginate(page, perPage)

    return response.json(users)
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)

    const user = await User.create({ ...data })

    return response.json(user)
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)
    await user.load('bets')

    return response.json(user)
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)
    const data = await request.validate(UpdateUserValidator)

    user.merge({
      name: data.name,
      email: data.email,
      cpf: data.cpf,
    })
    await user.save()

    return response.json(user)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)

    await user.delete()

    return response.status(200)
  }

  public async resetPassword({ request, response, auth }: HttpContextContract) {
    const id = auth.user?.id
    const password = await request.validate(ResetPasswordValidator)

    const user = await User.findOrFail(id)

    user.merge(password)
    await user.save()

    return response.status(202)
  }
}
