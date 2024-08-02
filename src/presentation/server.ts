import express, { Router } from 'express'
import path from 'path'
import { logger } from '../config'

interface Options {
  port: number
  routes: Router
  publicPath?: string
}

export class Server {
  public readonly app = express()

  private serverListener?: any

  private readonly port: number

  private readonly publicPath: string

  private readonly routes: Router

  constructor(options: Options) {
    const { port, routes, publicPath = 'public' } = options
    this.port = port
    this.publicPath = publicPath
    this.routes = routes
  }

  async start() {
    //* Middlewares
    this.app.use(express.json()) // raw
    this.app.use(express.urlencoded({ extended: true })) // x-www-form-urlencoded

    //* Public Folder
    this.app.use(express.static(this.publicPath))

    //* Routes
    this.app.use(this.routes)

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join(
        `${__dirname}../../../${this.publicPath}/index.html`
      )
      res.sendFile(indexPath)
    })

    this.serverListener = this.app.listen(this.port, () => {
      logger.info(`Server running on port:  http://localhost:${this.port}`)
    })
  }

  public close() {
    this.serverListener?.close()
  }
}
