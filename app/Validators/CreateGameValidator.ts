import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string([
      rules.required(),
      rules.unique({ table: 'games', column: 'type' }),
      rules.regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    description: schema.string([rules.required()]),
    range: schema.number([rules.required()]),
    price: schema.number([rules.required()]),
    minAndMaxValue: schema.number([rules.required()]),
    color: schema.string([
      rules.required(),
      rules.regex(/^#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/),
      rules.unique({ table: 'games', column: 'color' }),
    ]),
  })

  public messages = {}
}
