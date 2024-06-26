import { BaseCommand, args } from '@adonisjs/core/ace'
import { Codemods } from '@adonisjs/core/ace/codemods'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeRepository extends BaseCommand {
  static commandName: string = 'make:module_repository'
  static description: string = 'Create a new repository into a module'
  static options: CommandOptions = {}

  stubPath = 'make/repository.stub'

  // @args.string({ description: 'Name of the module' })
  // declare moduleName: string

  // @args.string({ description: 'Name of the controller file' })
  // declare repositoryName: string


  async execute(codemods : Codemods, moduleName: string, repositoryName: string) {
    await codemods.makeUsingStub(this.app.commandsPath('stubs'), this.stubPath, {
      moduleName,
      repositoryName,
    })
  }

  async run() {
    const moduleName = await this.prompt.ask('Enter the module name')
    const repositoryName = await this.prompt.ask('Enter the repository name')

    const codemods = await this.createCodemods()
    await this.execute(codemods, moduleName, repositoryName)
  }
}
