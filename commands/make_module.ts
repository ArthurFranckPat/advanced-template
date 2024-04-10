import { inject } from '@adonisjs/core'
import { BaseCommand, args , flags} from "@adonisjs/core/ace"
import { Codemods } from "@adonisjs/core/ace/codemods"
import { CommandOptions } from "@adonisjs/core/types/ace"
import PackageJson from "@npmcli/package-json"
import app from "@adonisjs/core/services/app"
import MakeMigration from './make_migration.js'
import MakeController from './make_controller.js'

type ActionType = 'migration'| 'repository'| 'controller'| 'service'|'enum'


abstract class Action {
    constructor(private module : string,private names: string , private type : ActionType) {}
    #extractNames(names : string) {
        return names.split(',').map(name => name.trim())
    }
    async #make(codemods : Codemods, path : string,moduleName: string, name : string) {
        await codemods.makeUsingStub(app.commandsPath('stubs'), path, {
            moduleName,
            name
        })
    }

    render(prompt : any) {
        return prompt.ask(`Enter the ${this.type} names`, {hint: 'You can separate multiple names with comma'})
    }
   
     execute(codemods : Codemods)  {
        this.#extractNames(this.names).forEach(name => this.#make(codemods, `make/${this.type}.stub`,this.module, name))
     }
  
}

// class All extends Action {
//     set 
//     constructor(moduleName: string) {
//         super('',moduleName)
//     }
//     operations = [
//         {
//         type: 'controller',
//         path : 'make/repository.stub'
//         },
//         {
//         type: 'repository',
//         path : 'make/repository.stub'
//         },
//         {
//         type: 'service',
//         path : 'make/service.stub'
//         }
//     ]


//     async execute(codemods : Codemods) {
//         this.operations.forEach(operation => {
//             this.make(codemods, operation.path,operation.type,this.moduleName)
//         })
        


//         this.extractNames(this.controllers).forEach(name => this.make(this.codemods, name))
//         this.#extractNames(this.#repositories).forEach(name => this.#make(codemods, 'repository', name))
//         this.#extractNames(this.#services).forEach(name => this.#make(codemods, 'service', name))
//     }
// }

class Controller extends Action {
    constructor(moduleName: string, names: string) {
        super(moduleName,names,'controller')
    }
}

class Repository extends Action {
    constructor(moduleName: string, names: string) {
        super(moduleName,names,'controller')
    }
}

class Service extends Action {
    constructor(moduleName: string, names: string) {
        super(moduleName,names,'controller')
    }
}

export default class MakeModule extends BaseCommand {

    static commandName: string = 'make:module'
    static description: string = 'Create a new module'
    static options: CommandOptions = {
        staysAlive : true,
        allowUnknownFlags : false
    }

    @flags.boolean({ alias: ['a'], description: 'Activate all features' })
    declare all : boolean

    @flags.boolean({ alias: ['m'], description: 'With migrations' })
    declare migration : boolean

    @flags.boolean({ alias: ['c'], description: 'With controllers' })
    declare controller : boolean

    @flags.boolean({ alias: ['r'], description: 'With repositories' })
    declare repository : boolean

    @flags.boolean({ alias: ['s'], description: 'With services' })
    declare service : boolean

    @args.string(({ description: 'Name of the module',
    parse (value) {
        return value.toLowerCase()
      } }))
    declare moduleName: string



    #controllers : string = ''
    #repositories : string = ''
    #services : string = ''
    #migrations : string = ''

    #stubPaths = {
        'repository' : {path : 'make/repository.stub'},
        'controller' : {path : 'make/controller.stub'},
        'migration' : {path : 'make/migration.stub'},
        'service' : {path : 'make/service.stub'},
        'enum' : {path : 'make/enum.stub'},
    }

    async #updatePackageJson() {
        const packageJsonFile =await PackageJson.load(this.app.makePath())
        const packageJsonContent = packageJsonFile.content
        const pathAlias = `#${this.moduleName.toLowerCase()}/*`
        packageJsonFile.update({
            imports : {
                [pathAlias] : `./app/${this.moduleName.toLowerCase()}/*.js`,
                ...packageJsonContent.imports,
            }
    })

        await packageJsonFile.save()
    }

    #extractNames(names : string) {
        return names.split(',').map(name => name.trim())
    }

    #execute(codemods : Codemods,names : string,type : ActionType ) {
        const namesArray =  names.split(',').map(name => name.trim())
        namesArray.forEach(name => codemods.makeUsingStub(this.app.commandsPath('stubs'), this.#stubPaths[type].path, {
            moduleName : this.moduleName,
            name
        }))
    }


    #executeAll(codemods : Codemods ) {
        this.#extractNames(this.#migrations).forEach(name =>  MakeMigration.execute(codemods,name))
        this.#extractNames(this.#controllers).forEach(name =>  MakeController.execute(codemods,this.moduleName,name))
      


        const operations : {type : ActionType, names : string}[] = [
            {
            type: 'controller',
            names : this.#controllers
            },
            {
            type: 'repository',
            names : this.#repositories
            },
            {
            type: 'service',
            names : this.#services
            }
        ]
        operations.forEach(operation => this.#execute(codemods,operation.names,operation.type))
    }
   async prepare() {
    if(this.parsed.flags.all){
        this.#migrations = await this.prompt.ask('Enter the migration names', {hint: 'You can separate multiple names with comma'})
        this.#controllers = await this.prompt.ask('Enter the controller names', {hint: 'You can separate multiple names with comma'})
        this.#repositories = await this.prompt.ask('Enter the repository names', {hint: 'You can separate multiple names with comma'})
        this.#services = await this.prompt.ask('Enter the service names', {hint: 'You can separate multiple names with comma'})
    }

    this.parsed.flags.controller && (this.#controllers = await this.prompt.ask('Enter the controller names', {hint: 'You can separate multiple names with comma'}))
    this.parsed.flags.migration && (this.#migrations = await this.prompt.ask('Enter the migration names', {hint: 'You can separate multiple names with comma'}))
    this.parsed.flags.repository && (this.#repositories = await this.prompt.ask('Enter the repository names', {hint: 'You can separate multiple names with comma'}))
    this.parsed.flags.service && (this.#services = await this.prompt.ask('Enter the service names', {hint: 'You can separate multiple names with comma'}))

    
}

    async run() {
        const codemods = await this.createCodemods()
        if(this.parsed.flags.all){
            this.#executeAll(codemods)
        }

        this.parsed.flags.controller && this.#execute(codemods,this.#controllers,'controller')
        this.parsed.flags.repository && this.#execute(codemods,this.#repositories,'repository')
        this.parsed.flags.service && this.#execute(codemods,this.#services,'service')

    }

    async completed(..._: any[]) {
        this.#updatePackageJson()
        this.logger.success('Module created successfully')
    }

    async terminate() {
        await this.app.terminate()
    }
}