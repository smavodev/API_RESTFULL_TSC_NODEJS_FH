import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l', // true, // 'yyyy-mm-dd HH:MM:ss.l',
    },
  },
  base: {
    pid: false,
  },
})

export default logger
