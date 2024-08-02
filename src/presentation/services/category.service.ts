import { CategoryModel } from '../../data'
import { CreateCategoryDto, CustomError, UserEntity } from '../../domain'

export class CategoryService {
  // DI
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    })
    if (categoryExists) throw CustomError.badRequest('Category already exists')

    try {
      // Aqui se conecta el user y el category [token de usuario]
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      })

      await category.save()

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  async getCategories() {
    // Implement
    return true
  }
}
