import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm'

@Entity()
@Index('idx_video_lang', ['lang'])
@Index('idx_video_lang_live', ['lang', 'live'])
@Index('idx_video_sorting', ['lang', 'sortingKey'])
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
