import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      const token = await auth.use('api').attempt(email, password)

      return token
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }
}
