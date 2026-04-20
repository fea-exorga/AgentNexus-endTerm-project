import ClubCard from '../components/ClubCard'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function ClubsPage() {
  const { clubs, toggleJoinClub } = useAppData()
  const { user } = useAuth()

  return (
    <section className="page-shell">
      <SectionHeader
        eyebrow="Communities"
        title="Explore campus clubs"
        description="Each club has a profile, event trail, and clear action path for students."
      />
      <div className="card-grid">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} onJoin={user ? toggleJoinClub : undefined} />
        ))}
      </div>
    </section>
  )
}

export default ClubsPage
