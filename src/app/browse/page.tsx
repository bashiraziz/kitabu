import { getBooks } from '@/db/queries'
import { BrowsePublic } from '@/components/public/BrowsePublic'

export const revalidate = 3600

export default async function BrowsePage() {
  const books = await getBooks()
  return <BrowsePublic books={books} />
}
