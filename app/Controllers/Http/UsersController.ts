import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
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

    let user

    try {
      user = await User.create({
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        password: data.password,
      })

      const rolePlayer = await Role.findBy('name', 'player')

      if (rolePlayer) await user.related('roles').attach([rolePlayer.id])
    } catch (error) {
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    let userFind
    try {
      userFind = await User.query().where('id', user.id).preload('roles')
    } catch (error) {
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }

    return response.ok({ userFind })
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)
    await user.load('bets')

    return response.json(user)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const data = await request.validate(UpdateUserValidator)

    const userSecureId = params.id

    let user

    try {
      user = await User.findByOrFail('secure_id', userSecureId)
      user.merge({ name: data.name, cpf: data.cpf, email: data.email }).save()
    } catch (error) {
      return response.badRequest({ message: 'Error in update user', originalError: error.message })
    }

    let userFind
    try {
      userFind = await User.query().where('id', user.id).preload('roles')
    } catch (error) {
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }

    return response.ok({ userFind })
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
