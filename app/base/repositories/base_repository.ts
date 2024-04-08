import { db } from '#core/services/db'
import { ResultOf } from '#types/common'

export type BaseListQueryResult = ResultOf<BaseRepository, 'all'>
export type BaseQueryResult = ResultOf<BaseRepository, 'findBySlug'>
export type BaseByIdQueryResult = ResultOf<BaseRepository, 'findById'>

interface StoreDTO { }
interface UpdateDTO {
  id: string
}

export class BaseRepository {
  all() {
    return db
      .selectFrom('posts')
      .select(['id', 'created_at']) // Add Selected fields
      .execute()
  }

  create(payload: StoreDTO) {
    return db
      .insertInto('posts')
      .values({
        created_at: new Date(),
        updated_at: new Date(),
        // Add Values
      })
      .execute()
  }

  update(payload: UpdateDTO) {
    return db
      .updateTable('posts')
      .set({
        //
      })
      .where('id', '=', payload.id)
      .execute()
  }

  findById(id: string) {
    return db.selectFrom('posts').selectAll().where('id', '=', id).executeTakeFirst()
  }

  findBySlug(slug: string) {
    return db
      .selectFrom('posts')
      .select(['id', 'created_at']) // Add selected fields
      .where('slug', '=', slug)
      .executeTakeFirstOrThrow()
  }
}
