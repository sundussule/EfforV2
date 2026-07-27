import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { apiRouter } from './routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT ?? 5001

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
