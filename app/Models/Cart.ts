import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public minCartValue: number

  @column.dateTime({ autoCreate: true, serialize: (value) => value.toFormat('dd/MM/yyyy') })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('dd/MM/yyyy'),
  })
  public updatedAt: DateTime
}
