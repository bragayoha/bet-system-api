import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf: schema.string([
      rules.unique({ table: 'users', column: 'cpf' }),
      rules.minLength(11),
      rules.maxLength(11),
      rules.regex(
        /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/
      ),
      rules.required(),
    ]),
    secureId: schema.string([rules.uuid({ version: 4 })]),
    name: schema.string([rules.required()]),
    email: schema.string([
      rules.unique({ table: 'users', column: 'email' }),
      rules.email(),
      rules.required(),
    ]),
    password: schema.string([rules.confirmed(), rules.minLength(6), rules.required()]),
  })

  public messages = {}
}
