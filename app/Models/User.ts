import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  beforeUpdate,
} from '@ioc:Adonis/Lucid/Orm'

import { v4 as uuidv4 } from 'uuid'
import Bet from './Bet'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidv4

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true, serialize: (value) => value.toFormat('dd/MM/yyyy') })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('dd/MM/yyyy'),
  })
  public updatedAt: DateTime

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>
}
