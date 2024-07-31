import { UserModel } from '../../data'
import { CustomError, RegisterUserDto, UserEntity } from '../../domain'

export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email })

    if (existUser) throw CustomError.badRequest('Email already exist')

    try {
      const user = new UserModel(registerUserDto)
      await user.save()

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'ABC'
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }
}
