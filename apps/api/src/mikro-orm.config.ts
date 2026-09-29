import { type Environment, validateEnvironment } from './common/infrastructure/config/env.config.js'
import { createMikroOrmOptions } from './common/infrastructure/config/mikro-orm.options.js'

const env: Pick<Environment, 'DATABASE_URL' | 'NODE_ENV'> = validateEnvironment(process.env)

export default createMikroOrmOptions(env)
