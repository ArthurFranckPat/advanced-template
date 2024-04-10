import { BaseCommand, args } from '@adonisjs/core/ace'
import { Codemods } from '@adonisjs/core/ace/codemods'
import app from '@adonisjs/core/services/app'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeMigration extends BaseCommand {
  static commandName = 'make:migration'
  static description = 'Create a new Kysely migration file'
  static options: CommandOptions = {}

  @args.string({ description: 'Name of the migration file' })
  declare name: string

  static async execute(codemods : Codemods,name : string) {
    const entity = app.generators.createEntity(name)
    const tableName = app.generators.tableName(entity.name)
    const fileName = `${new Date().getTime()}_create_${tableName}_table.ts`

    await codemods.makeUsingStub(app.commandsPath('stubs'), 'make/migration.stub', {
      entity,
      migration: {
        tableName,
        fileName,
      },
    })
  }

  async run() {
   
    const codemods = await this.createCodemods()
    await MakeMigration.execute(codemods, this.name)
  }
}
