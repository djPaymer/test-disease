import { type MouseEvent, useEffect, useState } from 'react'
import diseaseVideo from './assets/IMG_0773.MP4'

const cards = [
  {
    phrase:
      'Ты не обязан быть сильным каждую минуту. Достаточно просто идти дальше маленькими шагами.',
    video: diseaseVideo,
  },
  {
    phrase:
      'Даже самый трудный день заканчивается. У тебя есть право на отдых, заботу и надежду.',
      video: diseaseVideo,
  },
  {
    phrase: 'Болезнь не определяет тебя. В тебе намного больше жизни, тепла и смысла.',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Спокойный природный пейзаж',
  },
  {
    phrase: 'Сегодня можно сделать совсем немного, и это все равно будет победой.',
    image:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Рассвет над спокойным горизонтом',
  },
  {
    phrase: 'Ты не один. Рядом могут быть люди, помощь и завтрашний день.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Море и мягкий свет у берега',
  },
  {
    phrase: 'Пусть восстановление идет в своем темпе. Твое тело делает большую работу.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Лесная тропинка среди деревьев',
  },
  {
    phrase: 'Надежда может быть тихой, но она все равно держит за руку.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    alt: 'Дорога среди мягкого природного света',
  },
]

const places = [
  {
    title: 'Прогулка у воды',
    description: 'Спокойное место, где можно подышать, посидеть рядом и никуда не спешить.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Берег моря в мягком свете',
  },
  {
    title: 'Тихая кофейня',
    description: 'Теплый чай, десерт и разговор без лишней суеты.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Уютная кофейня с теплым светом',
  },
  {
    title: 'Парк с деревьями',
    description: 'Короткая прогулка, свежий воздух и немного зелени вокруг.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Лесная тропинка среди деревьев',
  },
]

function App() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [placeIndex, setPlaceIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'phrases' | 'places'>('phrases')
  const [telegramStatus, setTelegramStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [telegramError, setTelegramError] = useState('')

  const showPreviousPhrase = () => {
    setPhraseIndex((currentIndex) =>
      currentIndex === 0 ? cards.length - 1 : currentIndex - 1,
    )
  }

  const showNextPhrase = () => {
    setPhraseIndex((currentIndex) => (currentIndex + 1) % cards.length)
  }

  const showPreviousPlace = () => {
    setPlaceIndex((currentIndex) =>
      currentIndex === 0 ? places.length - 1 : currentIndex - 1,
    )
  }

  const showNextPlace = () => {
    setPlaceIndex((currentIndex) => (currentIndex + 1) % places.length)
  }

  const handlePhraseCardClick = (event: MouseEvent<HTMLElement>) => {
    const cardBounds = event.currentTarget.getBoundingClientRect()
    const clickPosition = event.clientX - cardBounds.left

    if (clickPosition < cardBounds.width / 2) {
      showPreviousPhrase()
      return
    }

    showNextPhrase()
  }

  const handlePlaceCardClick = (event: MouseEvent<HTMLElement>) => {
    const cardBounds = event.currentTarget.getBoundingClientRect()
    const clickPosition = event.clientX - cardBounds.left

    if (clickPosition < cardBounds.width / 2) {
      showPreviousPlace()
      return
    }

    showNextPlace()
  }

  const sendPlaceToTelegram = async () => {
    const place = places[placeIndex]
    setTelegramStatus('sending')
    setTelegramError('')

    try {
      const response = await fetch('/api/telegram/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: place.title,
          description: place.description,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.error ?? 'Telegram request failed')
      }

      setTelegramStatus('sent')
    } catch (error) {
      setTelegramError(error instanceof Error ? error.message : 'Неизвестная ошибка')
      setTelegramStatus('error')
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      showNextPhrase()
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setTelegramStatus('idle')
    setTelegramError('')
  }, [placeIndex])

  const currentCard = cards[phraseIndex]
  const hasVideo = 'video' in currentCard
  const currentPlace = places[placeIndex]

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="site-name" href="/">
          Павел Селин
        </a>
        <nav className="tabs" aria-label="Разделы сайта">
          <button
            className={activeTab === 'phrases' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setActiveTab('phrases')}
          >
            Фразы
          </button>
          <button
            className={activeTab === 'places' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setActiveTab('places')}
          >
            Места
          </button>
        </nav>
      </header>

      {activeTab === 'phrases' ? (
        <section className="hero-card" aria-live="polite" onClick={handlePhraseCardClick}>
          <div className="phrase-stage">
            <div className="phrase-card" key={currentCard.phrase}>
              {hasVideo ? (
                <video
                  aria-label={currentCard.alt}
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={currentCard.video}
                />
              ) : (
                <img src={currentCard.image} alt={currentCard.alt} draggable="false" />
              )}
              <p>{currentCard.phrase}</p>
            </div>
          </div>
          <div className="progress-dots" aria-label="Текущая фраза">
            {cards.map((card, index) => (
              <button
                aria-label={`Показать фразу ${index + 1}`}
                className={index === phraseIndex ? 'dot active' : 'dot'}
                key={card.phrase}
                onClick={(event) => {
                  event.stopPropagation()
                  setPhraseIndex(index)
                }}
                type="button"
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="hero-card" aria-live="polite" onClick={handlePlaceCardClick}>
          <div className="phrase-card place-card" key={currentPlace.title}>
            <img src={currentPlace.image} alt={currentPlace.alt} draggable="false" />
            <div className="place-copy">
              <h1>{currentPlace.title}</h1>
              <p>{currentPlace.description}</p>
              <button
                className="telegram-button"
                disabled={telegramStatus === 'sending'}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  sendPlaceToTelegram()
                }}
              >
                {telegramStatus === 'sending' ? 'Отправляю...' : 'Хочу сюда пойти'}
              </button>
              {telegramStatus === 'sent' && (
                <span className="telegram-status">Сообщение отправлено</span>
              )}
              {telegramStatus === 'error' && (
                <span className="telegram-status error">
                  Не получилось отправить: {telegramError}
                </span>
              )}
            </div>
          </div>
          <div className="progress-dots" aria-label="Текущее место">
            {places.map((place, index) => (
            <button
              aria-label={`Показать место ${index + 1}`}
              className={index === placeIndex ? 'dot active' : 'dot'}
              key={place.title}
              onClick={(event) => {
                event.stopPropagation()
                setPlaceIndex(index)
              }}
              type="button"
            />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
