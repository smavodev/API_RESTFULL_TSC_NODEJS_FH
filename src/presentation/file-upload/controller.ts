import { Response, Request } from 'express'
// eslint-disable-next-line import/no-extraneous-dependencies
import { UploadedFile } from 'express-fileupload'
import { CustomError } from '../../domain'
import { FileUploadService } from '../services/file-upload.service'
import { logger } from '../../config'

export class FileUploadController {
  // DI
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    logger.error(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  uploadFile = (req: Request, res: Response) => {
    const {type} = req.params
    const file = req.body.files.at(0) as UploadedFile

    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res))
  }

  uploadMultileFiles = (req: Request, res: Response) => {
    const {type} = req.params
    const files = req.body.files as UploadedFile[]

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res))
  }
}
