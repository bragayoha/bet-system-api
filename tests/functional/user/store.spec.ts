import Database from '@ioc:Adonis/Lucid/Database'

import { test } from '@japa/runner'

test.group('Users store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('make sure user content is provided', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store'))

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { message: 'required validation failed', field: 'name' || 'cpf' || 'email' || 'password' },
      ],
    })
  })

  test('create new user', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store')).form({
      name: 'Test User',
      email: 'user@test.com',
      cpf: '000.000.000-00',
      password: 'test123',
      password_confirmation: 'test123',
    })

    response.dumpBody()

    response.assertStatus(200)

    // response.assertBodyContains({
    //   errors: [
    //     { message: 'required validation failed', field: 'name' || 'cpf' || 'email' || 'password' },
    //   ],
    // })
  })
})
