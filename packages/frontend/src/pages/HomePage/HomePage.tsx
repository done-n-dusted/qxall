import { useNavigate } from 'react-router';
import { Button, GlassCard, Chip } from '../../components';
import './HomePage.css';

/* ── Mock recent games ── */
const RECENT_GAMES = [
  {
    id: 1,
    opponent: 'Magnus',
    result: 'Win' as const,
    opening: 'Sicilian Defense: Najdorf',
    date: '2026-06-04',
  },
  {
    id: 2,
    opponent: 'Hikaru',
    result: 'Loss' as const,
    opening: "Queen's Gambit Declined",
    date: '2026-06-03',
  },
  {
    id: 3,
    opponent: 'Ding',
    result: 'Draw' as const,
    opening: 'Ruy Lopez: Berlin Defense',
    date: '2026-06-01',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <h1 className="headline-lg home-hero__headline">Master Every Opening</h1>
        <p className="body-lg home-hero__subtitle">
          A meditative chess experience focused on deep opening exploration
        </p>
      </section>

      {/* Quick-Start Buttons */}
      <div className="home-actions">
        <Button variant="primary" onClick={() => navigate('/play')}>
          New Game
        </Button>
        <Button variant="secondary" onClick={() => navigate('/play')}>
          Explore Openings
        </Button>
        <Button variant="ghost" disabled>
          Continue
        </Button>
      </div>

      {/* Recent Games */}
      <section className="home-recent">
        <h2 className="headline-md home-recent__heading">Recent Games</h2>

        <div className="home-recent__grid">
          {RECENT_GAMES.map((game) => (
            <GlassCard key={game.id} padding="md">
              <div className="home-game-card">
                <div className="home-game-card__top">
                  <span className="home-game-card__opponent">{game.opponent}</span>
                  <Chip>{game.result}</Chip>
                </div>
                <span className="home-game-card__opening">{game.opening}</span>
                <span className="home-game-card__date">{game.date}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
