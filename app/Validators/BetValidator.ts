import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    numbers: schema.array().members(schema.number([rules.required()])),
    game: schema.number([rules.exists({ table: 'games', column: 'id' })]),
  })

  public messages = {}
}
