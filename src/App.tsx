import { useState } from 'react'

const reasons = [
  'djPaymer очень креативный человек, что подтверждает этот сайт',
  'Хоть одна причина почему нет?',
  'Потому что он приглашает в очень прикольное место',
  'Он очень веселый, вот его шутка:',
  'Любая болезнь лечится настроением и хорошей дозой парацетамола)',
]

const slideImages: Record<number, string> = {
  1: '/slide2.jpg',
  2: '/slide3.jpg',
}

function App() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [currentCard, setCurrentCard] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next')

  const totalCards = reasons.length + 1
  const isAnswerCard = currentCard === reasons.length
  const modalText =
    answer === 'yes'
      ? 'Для записи необходимо написать @pavelselin'
      : 'Ловко ты это придумала, такова варианта нету)'

  const goToPreviousCard = () => {
    setSlideDirection('previous')
    setCurrentCard((card) => Math.max(card - 1, 0))
  }

  const goToNextCard = () => {
    setSlideDirection('next')
    setCurrentCard((card) => Math.min(card + 1, totalCards - 1))
  }

  const goToCard = (cardIndex: number) => {
    setSlideDirection(cardIndex > currentCard ? 'next' : 'previous')
    setCurrentCard(cardIndex)
  }

  return (
    <main className="page-shell">
      <section className="cards-page">
        <p className="eyebrow">Приглашение для Алины Беляевой</p>
        <h1>5 причин почему Алине стоит пойти погулять с djPaymer</h1>

        <div className={`cards-slider ${slideDirection}`}>
          {!isAnswerCard ? (
            <article className="reason-card slide-card" key={currentCard}>
              <span>{currentCard + 1}</span>
              {slideImages[currentCard] && (
                <img
                  src={slideImages[currentCard]}
                  alt={`Картинка для слайда ${currentCard + 1}`}
                />
              )}
              <p>{reasons[currentCard]}</p>
            </article>
          ) : (
            <article className="answer-card slide-card" key="answer-card">
              <h2>Газ?</h2>
              <div className="button-row">
                <button type="button" onClick={() => setAnswer('yes')}>
                  Да
                </button>
                <button type="button" onClick={() => setAnswer('no')}>
                  Нет
                </button>
              </div>
            </article>
          )}
        </div>

        <div className="slider-controls">
          <button
            type="button"
            onClick={goToPreviousCard}
            disabled={currentCard === 0}
          >
            Назад
          </button>
          <div className="dots" aria-label="Прогресс карточек">
            {Array.from({ length: totalCards }, (_, index) => (
              <button
                className={index === currentCard ? 'active' : ''}
                type="button"
                aria-label={`Открыть карточку ${index + 1}`}
                key={index}
                onClick={() => goToCard(index)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goToNextCard}
            disabled={currentCard === totalCards - 1}
          >
            Вперед
          </button>
        </div>
      </section>

      {answer && (
        <div className="modal-backdrop" role="presentation">
          <div
            className={`modal-card ${answer === 'yes' ? 'success' : 'playful'}`}
            role="dialog"
            aria-modal="true"
            aria-live="polite"
          >
            <p>{modalText}</p>
            <button type="button" onClick={() => setAnswer(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
