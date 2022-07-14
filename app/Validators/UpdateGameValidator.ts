import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    type: schema.string.optional([
      rules.required(),
      rules.unique({ table: 'games', column: 'type', whereNot: { id: this.refs.id } }),
      rules.regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    description: schema.string.optional([rules.required()]),
    range: schema.number.optional([rules.required()]),
    price: schema.number.optional([rules.required()]),
    minAndMaxValue: schema.number.optional([rules.required()]),
    color: schema.string.optional([
      rules.required(),
      rules.unique({ table: 'games', column: 'color', whereNot: { id: this.refs.id } }),
      rules.regex(/^#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/),
    ]),
  })

  public messages = {}
}
