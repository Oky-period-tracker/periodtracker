import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

interface IUserHelpCenter {
  id: number
  userId: string
  helpCenterId: number
  lang: string
  date_created: string
}

@Entity()
export class UserHelpCenter {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: string

  @Column()
  helpCenterId: number

  @Column()
  lang: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  /* tslint:disable-next-line */
  date_created: string

  private constructor(props?: IUserHelpCenter) {
    if (props) {
      const { id, userId, helpCenterId, lang, date_created } = props

      this.id = id
      this.userId = userId
      this.helpCenterId = helpCenterId
      this.lang = lang
      this.date_created = date_created
    }
  }
}
