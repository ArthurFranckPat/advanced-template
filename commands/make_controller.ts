import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeController extends BaseCommand {
  static commandName: string = 'make:module_controller'
  static description: string = 'Create a new controller into a module'
  static options: CommandOptions = {}

  stubPath = 'make/controller.stub'

  @args.string({ description: 'Name of the module' })
  declare moduleName: string

  @args.string({ description: 'Name of the controller file' })
  declare controllerName: string

  async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(this.app.commandsPath('stubs'), this.stubPath, {
      moduleName: this.moduleName,
      controllerName: this.controllerName,
    })
  }
}
