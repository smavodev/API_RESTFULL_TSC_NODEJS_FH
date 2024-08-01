import { bcryptAdapter, JwtAdapter, envs } from '../../config'
import { UserModel } from '../../data'
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain'
import { EmailService } from './email.service'

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email })

    if (existUser) throw CustomError.badRequest('Email already exist')

    try {
      const user = new UserModel(registerUserDto)

      user.password = bcryptAdapter.hash(registerUserDto.password)

      // // Password of compare
      // const reverse = bcryptAdapter.compare(registerUserDto.password, user.password)
      // console.log(reverse, registerUserDto.password, user.password)

      await user.save()

      if (!user.email) throw CustomError.badRequest('no se encontro Email')
      await this.sendEmailValidationLink(user.email)

      const { password, ...userEntity } = UserEntity.fromObject(user)

      const token = await JwtAdapter.generateToken({ id: user.id })
      if (!token) throw CustomError.internalServer('Error while creating JWT')

      return {
        user: userEntity,
        token: token,
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email })
    if (!user) throw CustomError.badRequest('Email not exist')

    if (typeof user.password !== 'string') {
      throw CustomError.internalServer('User password is missing or invalid')
    }

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    )
    if (!isMatching) throw CustomError.badRequest('Password is not valid')

    const { password, ...userEntity } = UserEntity.fromObject(user)

    const token = await JwtAdapter.generateToken(
      {
        id: user.id,
        email: user.email,
      },
      '1h'
    )

    if (!token) throw CustomError.internalServer('Error while creating JWT')

    return {
      user: userEntity,
      token: token,
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email })
    if (!token) throw CustomError.internalServer('Error getting token')

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options)
    if (!isSent) throw CustomError.internalServer('Error sending email')

    return true
  }

  public validateEmail = async (token: string) => {
    return true
  }
}
