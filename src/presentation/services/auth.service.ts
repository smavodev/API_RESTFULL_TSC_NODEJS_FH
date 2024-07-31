import { bcryptAdapter, JwtAdapter } from '../../config'
import { UserModel } from '../../data'
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain'

export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  constructor() {}

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

      const { password, ...userEntity } = UserEntity.fromObject(user)

      return {
        user: userEntity,
        token: 'ABC',
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
}
