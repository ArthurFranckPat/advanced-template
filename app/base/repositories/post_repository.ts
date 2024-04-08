import { db } from '#core/services/db'
import { ResultOf } from '#types/common'

interface StoreDTO {}
interface UpdateDTO {
  id: string
}
export type PostListQueryResult = ResultOf<PostRepository, 'all'>
//export type PostQueryResult = ResultOf<PostRepository, 'findBySlug'>
export type PostByIdQueryResult = ResultOf<PostRepository, 'findById'>

export class PostRepository {
  all() {
    return db
      .selectFrom('tableName') //replace 'tableName'
      .select(['id', 'created_at']) // Add Selected fields
      .execute()
  }

  create(payload: StoreDTO) {
    return db
      .insertInto('tableName')
      .values({
        created_at: new Date(),
        updated_at: new Date(),
        // Add Values
      })
      .execute()
  }

  update(payload: UpdateDTO) {
    return db
      .updateTable('tableName')
      .set({
        //
      })
      .where('id', '=', payload.id)
      .execute()
  }

  findById(id: string) {
    return db.selectFrom('tableName').selectAll().where('id', '=', id).executeTakeFirst()
  }

  /*
  findBySlug(slug: string) {
    return db
      .selectFrom('tableName')
      .select(['id', 'created_at']) // Add selected fields
      .where('slug', '=', slug)
      .executeTakeFirstOrThrow()
  }
  */
}
