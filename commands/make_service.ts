import { BaseCommand, args,flags } from '@adonisjs/core/ace'
import { Codemods } from '@adonisjs/core/ace/codemods'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeService extends BaseCommand {
  static commandName: string = 'make:module_repository'
  static description: string = 'Create a new repository into a module'
  static options: CommandOptions = {}

  stubPath = 'make/service.stub'

  @flags.boolean()
  declare withRepository: boolean


  async execute(codemods : Codemods, moduleName: string, serviceName: string) {
    await codemods.makeUsingStub(this.app.commandsPath('stubs'), this.stubPath, {
      moduleName,
      serviceName,
    })
  }

  async run() {
    const moduleName = await this.prompt.ask('Enter the module name')
    const serviceName = await this.prompt.ask('Enter the service name')
   

    const codemods = await this.createCodemods()
    await this.execute(codemods, moduleName, serviceName)
  }
}
