import { Response, Request } from 'express'
import { logger } from '../../config'
import { CreateProductDto, CustomError, PaginationDto } from '../../domain'
import { ProductService } from '../services'

export class ProductController {
  // DI
  constructor(private readonly productService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    logger.error(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id, // Aqui mandamos el id del user
    })
    if (error) return res.status(400).json({ error })

    this.productService
      .createProduct(createProductDto!)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res))
  }

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query
    const [error, paginationDto] = PaginationDto.create(+page, +limit)
    if (error) return res.status(400).json({ error })

    this.productService
      .getProducts(paginationDto!)
      .then((products) => res.json(products))
      .catch((error) => this.handleError(error, res))
  }
}
