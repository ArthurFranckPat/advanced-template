import { BaseCommand, args } from '@adonisjs/core/ace'
import { Codemods } from '@adonisjs/core/ace/codemods'
import app from '@adonisjs/core/services/app'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeController extends BaseCommand {
  static commandName: string = 'make:module_controller'
  static description: string = 'Create a new controller into a module'
  static options: CommandOptions = {}

  @args.string({ description: 'Name of the module' })
  declare moduleName: string

  @args.string({ description: 'Name of the controller file' })
  declare controllerName: string


  static async execute(codemods : Codemods, moduleName: string, controllerName: string) {
    await codemods.makeUsingStub(app.commandsPath('stubs'), 'make/controller.stub', {
      moduleName,
      controllerName,
    })
  }

  async run() {
    const codemods = await this.createCodemods()
    await MakeController.execute(codemods, this.moduleName, this.controllerName)
  }
}
