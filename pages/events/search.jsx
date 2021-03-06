import qs from 'qs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'

const API_URL = process.env.API_URL

export default function SearchPage({ events }) {
  const router = useRouter()
  return (
    <Layout title="Search results">
      <Link href="/events">Go back</Link>
      <h1>
        Search Results for {router.query.term && `'${router.query.term}'`}
      </h1>

      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { term = '' } = context.query

  const query = qs.stringify({
    _where: {
      _or: [
        { name_contains: term },
        { address_contains: term },
        { description_contains: term },
        { performers_contains: term },
        { venue_contains: term },
      ],
    },
  })

  const res = await fetch(`${API_URL}/events?${query}`)
  const events = await res.json()

  return {
    props: { events },
  }
}
