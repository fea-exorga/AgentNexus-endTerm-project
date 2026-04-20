import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-shell centered-page">
      <span className="eyebrow">404</span>
      <h1>That page wandered off campus.</h1>
      <p>Try heading back to the homepage and continue exploring from there.</p>
      <Link className="primary-button" to="/">
        Go home
      </Link>
    </section>
  )
}

export default NotFoundPage
