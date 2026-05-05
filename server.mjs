import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.npm_lifecycle_event === 'start' ||
  process.env.npm_lifecycle_event === 'preview'
const port = Number(process.env.PORT ?? 5173)

const app = express()

app.use(express.json())

app.post('/api/telegram/place', async (request, response) => {
  const { title, description } = request.body ?? {}
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^bot/i, '')
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    response.status(500).json({ error: 'Telegram token or chat id is not configured.' })
    return
  }

  if (typeof title !== 'string' || typeof description !== 'string') {
    response.status(400).json({ error: 'Place title and description are required.' })
    return
  }

  try {
    const text = `Хочу сюда пойти: ${title}\n${description}`
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text()
      response.status(telegramResponse.status).json({ error: errorText })
      return
    }

    response.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Telegram request failed.'
    response.status(502).json({ error: message })
  }
})

if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  const vite = await createViteServer({
    appType: 'spa',
    server: { middlewareMode: true },
  })

  app.use(vite.middlewares)
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
