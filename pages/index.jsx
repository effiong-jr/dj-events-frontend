import Link from 'next/link'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'

const API_URL = process.env.API_URL

export default function Home({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>

      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}

      <Link href="/events">
        <a className="btn-secondary">View all events</a>
      </Link>
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/events?_sort=date:ASC`)
  const events = await res.json()

  return {
    props: { events: events.slice(0, 3) },
    revalidate: 1,
  }
}
