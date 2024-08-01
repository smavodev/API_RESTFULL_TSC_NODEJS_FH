import { Request, Response } from 'express'
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain'
import { AuthService } from '../services'
import logger from '../../config/logger'

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    logger.error(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  // eslint-disable-next-line consistent-return
  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.authService
      .registerUser(registerUserDto!)
      .then((user) => res.json(user))
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .catch((error) => this.handleError(error, res))
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.authService
      .loginUser(loginUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res))
  }

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params

    this.authService
      .validateEmail(token)
      .then(() => res.json({ data : 'Email was validated properly' }))
      .catch((error) => this.handleError(error, res))
  }
}
