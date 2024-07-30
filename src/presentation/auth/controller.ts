import { Request, Response } from 'express'

export class AuthController {
  // DI
  constructor() {}

  registerUser = (req: Request, res: Response) => {
    res.send({ data: 'Register User' })
  }

  loginUser = (req: Request, res: Response) => {
    res.send({ data: 'Register User' })
  }

  validateEmail = (req: Request, res: Response) => {
    res.json('validateEmail')
  }
}
