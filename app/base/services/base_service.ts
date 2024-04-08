import { PostRepository } from '../repositories/post_repository.js'

export class Service {
  constructor(private repository: PostRepository) {}
}
