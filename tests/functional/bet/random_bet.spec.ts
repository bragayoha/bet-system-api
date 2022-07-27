import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Bet random bets', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before betting', async ({ client, route }) => {
    const response = await client.post(route('BetsController.store'))

    response.assertStatus(401)

    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('bet content isnt provided', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client.post(route('BetsController.store')).bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'numbers' || 'game',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('numbers must be an array', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('BetsController.store'))
      .form({ numbers: 'a', game: 1 })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'array',
          field: 'numbers',
          message: 'array validation failed',
        },
      ],
    })
  })

  test('game must be a game.id and existing game', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('BetsController.store'))
      .form({ numbers: [1, 2, 3, 4, 5], game: 'a' })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'number',
          field: 'game',
          message: 'number validation failed',
        },
        {
          rule: 'exists',
          field: 'game',
          message: 'exists validation failed',
        },
      ],
    })
  })

  test('bet must be a min value (setting by cart)', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('BetsController.store'))
      .form({ numbers: [1, 2, 3, 4, 5], game: 'a' })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'number',
          field: 'game',
          message: 'number validation failed',
        },
        {
          rule: 'exists',
          field: 'game',
          message: 'exists validation failed',
        },
      ],
    })
  })
})
