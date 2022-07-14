import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    numbers: schema.array().members(schema.number([rules.required()])),
    game: schema.string({ trim: true }, [rules.exists({ table: 'games', column: 'type' })]),
    cart_id: schema.number([rules.exists({ table: 'cart', column: 'id' })]),
  })

  public messages = {}
}
