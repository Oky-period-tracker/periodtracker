import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm'

@Entity()
export class Video {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  youtubeId: string | null

  @Column({ nullable: true })
  assetName: string | null

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  live: boolean

  @Column()
  lang: string

  @Column({ generated: 'increment' })
  sortingKey: number
}
