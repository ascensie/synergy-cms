import express from 'express'
import payload from 'payload'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()

// Serve static files from public directory
app.use('/assets', express.static(path.join(__dirname, '../public/assets')))

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  const PORT = process.env.PAYLOAD_PORT || 3001

  app.listen(PORT, async () => {
    payload.logger.info(
      `🚀 Synergy CMS gestart op http://localhost:${PORT}`
    )
    payload.logger.info(
      `📝 Admin panel: http://localhost:${PORT}/admin`
    )
  })
}

start()
