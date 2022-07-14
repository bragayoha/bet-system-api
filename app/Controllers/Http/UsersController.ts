import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import AccessAllowValidator from 'App/Validators/AccessAllowValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) {
      return User.query().preload('roles', (roleTable) => {
        roleTable.select('id', 'name')
      })
    }

    try {
      const users = await User.query()
        .preload('roles', (roleTable) => {
          roleTable.select('id', 'name')
        })
        .paginate(page || 1, perPage || 10)

      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'Error in list users', originalError: error.message })
    }
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

  public async show({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const user = await User.query()
        .where('secure_id', userSecureId)
        .preload('roles')
        .preload('bets')

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
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

  public async destroy({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const user = await User.findByOrFail('secure_id', userSecureId)
      await user.delete()

      return response.ok({ message: 'Success in delete user' })
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async resetPassword({ request, response, auth }: HttpContextContract) {
    const id = auth.user?.id
    const password = await request.validate(ResetPasswordValidator)

    const user = await User.findOrFail(id)

    user.merge(password)
    await user.save()

    return response.status(202)
  }

  public async AccessAllow({ response, request }: HttpContextContract) {
    await request.validate(AccessAllowValidator)

    const { userId, roles } = request.all()

    try {
      const userAllow = await User.findByOrFail('id', userId)

      let roleIds: number[] = []

      await Promise.all(
        roles.map(async (roleName) => {
          const hasRole = await Role.findBy('name', roleName)
          if (hasRole) roleIds.push(hasRole.id)
        })
      )

      await userAllow.related('roles').sync(roleIds)
    } catch (error) {
      return response.badRequest({ message: 'Error in access allow', originalError: error.message })
    }

    try {
      return User.query().where('id', userId).preload('roles').firstOrFail()
    } catch (error) {
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }
  }
}
