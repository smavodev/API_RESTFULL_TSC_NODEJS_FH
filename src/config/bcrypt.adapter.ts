// eslint-disable-next-line import/no-extraneous-dependencies
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { envs} from '../config'

export const bcryptAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync(envs.SALT_ROUNDS)
    return hashSync(password, salt)
  },

  compare: (password: string, hashed: string) => compareSync(password, hashed),
}
