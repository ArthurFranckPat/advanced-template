//import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class BaseController {
  constructor() { }
  render({ }: HttpContext) { }
  execute({ }: HttpContext) { }
}
