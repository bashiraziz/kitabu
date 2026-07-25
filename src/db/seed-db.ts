import { db } from './index'
import { books, copies, members, children, pickups, loans } from './schema'
import { LOAN_DAYS } from '../lib/constants'

const BOOKS_DATA = [
  { title: 'Anansi the Spider', author: 'Gerald McDermott', category: 'Folktales', age_band: '6-8', cover_color: '#C65D3B', total_copies: 2, available: 1, blurb: "Clever spider Anansi and his six sons outwit trouble in a classic Ashanti folktale — a story about who really deserves the reward." },
  { title: 'Where the Wild Things Are', author: 'Maurice Sendak', category: 'Picture Books', age_band: '6-8', cover_color: '#2E6E5A', total_copies: 2, available: 2, blurb: "Max puts on his wolf suit, sails to the land of the Wild Things, and becomes their king — before sailing home to his own supper." },
  { title: 'The Gruffalo', author: 'Julia Donaldson', category: 'Picture Books', age_band: '6-8', cover_color: '#C9A227', total_copies: 3, available: 2, blurb: "A quick-thinking mouse invents a terrible monster to frighten off the hungry hunters of the deep dark wood." },
  { title: "Mufaro's Beautiful Daughters", author: 'John Steptoe', category: 'Folktales', age_band: '6-8', cover_color: '#7A3B5E', total_copies: 1, available: 1, blurb: "Two sisters — one kind, one proud — journey to meet the king in this luminous Zimbabwean tale about true worth." },
  { title: "Charlotte's Web", author: 'E. B. White', category: 'Adventure', age_band: '9-12', cover_color: '#2E6E5A', total_copies: 2, available: 0, blurb: "A barn spider spins words to save Wilbur the pig — a tender story of friendship, cleverness and letting go." },
  { title: 'Matilda', author: 'Roald Dahl', category: 'Adventure', age_band: '9-12', cover_color: '#C65D3B', total_copies: 2, available: 1, blurb: "A brilliant little girl with extraordinary powers takes on the meanest grown-ups she's ever met — and wins." },
  { title: 'The Lion & the Mouse', author: 'Jerry Pinkney', category: 'Folktales', age_band: '6-8', cover_color: '#C9A227', total_copies: 2, available: 2, blurb: "A wordless, sweeping retelling of Aesop's fable set on the African savanna — a small kindness returned." },
  { title: 'Akissi: Tales of Mischief', author: 'Marguerite Abouet', category: 'Adventure', age_band: '9-12', cover_color: '#B23A48', total_copies: 1, available: 1, blurb: "Growing up in Abidjan means monkeys on the loose, a very mean cat, and endless glorious mischief." },
  { title: 'Sulwe', author: "Lupita Nyong'o", category: 'Picture Books', age_band: '6-8', cover_color: '#3B5478', total_copies: 2, available: 1, blurb: "Sulwe is the colour of midnight and wishes she were lighter — until a night-time journey teaches her to shine in her own light." },
  { title: 'The Boy Who Harnessed the Wind', author: 'William Kamkwamba', category: 'Science', age_band: '9-12', cover_color: '#1F7A82', total_copies: 2, available: 2, blurb: "A Malawian teenager builds a windmill from scrap parts to bring electricity and water to his village. A true story." },
  { title: 'Chike and the River', author: 'Chinua Achebe', category: 'Adventure', age_band: '9-12', cover_color: '#3B5478', total_copies: 1, available: 0, blurb: "Young Chike dreams of crossing the great River Niger — and on the far bank, adventure and danger are waiting." },
  { title: 'Nelson Mandela', author: 'Kadir Nelson', category: 'People & Places', age_band: '9-12', cover_color: '#4A5043', total_copies: 1, available: 1, blurb: "The life of South Africa's freedom hero — from a boy in the hills to president — told for young readers." },
  { title: 'Fatou Fetch the Water', author: 'Neil Griffiths', category: 'Folktales', age_band: '6-8', cover_color: '#C9A227', total_copies: 2, available: 2, blurb: "On the long walk to the well and back, Fatou's imagination turns an ordinary errand into a grand adventure." },
  { title: 'Magic School Bus: Inside the Earth', author: 'Joanna Cole', category: 'Science', age_band: '6-8', cover_color: '#C65D3B', total_copies: 2, available: 1, blurb: "Ms. Frizzle's class takes a very deep field trip to learn how rocks, caves and crystals are made." },
  { title: 'Africa, Amazing Africa', author: 'Atinuke', category: 'People & Places', age_band: '9-12', cover_color: '#2E6E5A', total_copies: 2, available: 2, blurb: "A joyful, region-by-region tour of all 55 countries of the continent — food, festivals, wildlife and wonders." },
  { title: "Handa's Surprise", author: 'Eileen Browne', category: 'Picture Books', age_band: '6-8', cover_color: '#B23A48', total_copies: 3, available: 2, blurb: "Handa carries seven delicious fruits to her friend Akeyo — but the animals along the path have other plans." },
  { title: 'A Is for Africa', author: 'Ifeoma Onyefulu', category: 'Picture Books', age_band: '6-8', cover_color: '#7A3B5E', total_copies: 1, available: 1, blurb: "An alphabet of everyday African life — from beads and drums to yams and weaving — in warm photographs." },
  { title: 'The Cat in the Hat', author: 'Dr. Seuss', category: 'Picture Books', age_band: '6-8', cover_color: '#B23A48', total_copies: 3, available: 3, blurb: "One cold wet day, a mischievous cat turns a quiet house upside down — with two children and a fish looking on." },
  { title: 'Bringing the Rain to Kapiti Plain', author: 'Verna Aardema', category: 'Poetry & Music', age_band: '6-8', cover_color: '#1F7A82', total_copies: 2, available: 2, blurb: "A cumulative Nandi tale told in bouncing rhyme — how the herdsman Ki-pat brought the rain to the drying plain." },
  { title: 'Nsangi and the Ogre', author: 'A Luganda Folktale', category: 'Folktales', age_band: '6-8', cover_color: '#4A5043', total_copies: 2, available: 2, blurb: "A brave Ganda girl outwits a hungry ogre on the road home — a beloved local tale retold for Kitabu readers." },
] as const

const MEMBERS_DATA = [
  { account_name: 'Nsubuga', adult_holder: 'Sarah Nsubuga', tier: 'family_friends' as const },
  { account_name: 'Okello', adult_holder: 'James Okello', tier: 'family_friends' as const },
  { account_name: 'Mensah', adult_holder: 'Ama Mensah', tier: 'family_friends' as const },
  { account_name: 'Namuli', adult_holder: 'Fatuma Namuli', tier: 'wider_circle' as const },
  { account_name: 'Ssali', adult_holder: 'Peter Ssali', tier: 'wider_circle' as const },
  { account_name: 'Auma', adult_holder: 'Rose Auma', tier: 'family_friends' as const },
]

const PICKUPS_DATA = [
  { name: 'Kampala Parents School', schedule: 'Fri, 3pm' },
  { name: 'Nakawa home hub', schedule: 'Weekends' },
  { name: 'Ntinda neighbourhood', schedule: 'Delivery' },
]

async function seed() {
  console.log('🌱 Seeding database…')

  const insertedBooks = await db.insert(books).values(
    BOOKS_DATA.map(b => ({
      title: b.title,
      author: b.author,
      category: b.category,
      age_band: b.age_band,
      cover_color: b.cover_color,
      total_copies: b.total_copies,
      blurb: b.blurb,
    }))
  ).returning({ id: books.id })

  // Insert copies for each book: `available` copies as 'in', rest as 'out'
  // Track which out-copies belong to which book for loan seeding
  const outCopyByBookIdx: Record<number, number[]> = {}

  for (let i = 0; i < BOOKS_DATA.length; i++) {
    const bookId = insertedBooks[i].id
    const { total_copies, available } = BOOKS_DATA[i]
    const outCount = total_copies - available

    const copyRows = Array.from({ length: total_copies }, (_, j) => ({
      book_id: bookId,
      status: (j < outCount ? 'out' : 'in') as 'in' | 'out',
    }))

    const inserted = await db.insert(copies).values(copyRows).returning({ id: copies.id, status: copies.status })
    outCopyByBookIdx[i] = inserted.filter(c => c.status === 'out').map(c => c.id)
  }

  const insertedMembers = await db.insert(members).values(MEMBERS_DATA).returning({ id: members.id })
  const insertedPickups = await db.insert(pickups).values(PICKUPS_DATA).returning({ id: pickups.id })

  // Children for Nsubuga (member 0) and others
  const insertedChildren = await db.insert(children).values([
    { member_id: insertedMembers[0].id, name: 'Amina', age: 7 },
    { member_id: insertedMembers[0].id, name: 'Daniel', age: 10 },
    { member_id: insertedMembers[1].id, name: 'Grace', age: 8 },
    { member_id: insertedMembers[2].id, name: 'Kofi', age: 11 },
    { member_id: insertedMembers[2].id, name: 'Efua', age: 6 },
    { member_id: insertedMembers[3].id, name: 'Aisha', age: 9 },
    { member_id: insertedMembers[4].id, name: 'Zawadi', age: 9 },
    { member_id: insertedMembers[5].id, name: 'Brian', age: 7 },
  ]).returning({ id: children.id })

  // Amina = insertedChildren[0], Daniel = insertedChildren[1]
  // Sulwe = BOOKS_DATA index 8, Charlotte's Web = index 4
  const now = new Date()

  const aminaLoanDue = new Date(now)
  aminaLoanDue.setDate(aminaLoanDue.getDate() + 6) // due soon

  const danielLoanDue = new Date(now)
  danielLoanDue.setDate(danielLoanDue.getDate() - 2) // overdue

  await db.insert(loans).values([
    {
      copy_id: outCopyByBookIdx[8][0],   // Sulwe out-copy
      child_id: insertedChildren[0].id,   // Amina
      pickup_id: insertedPickups[0].id,   // Kampala Parents School
      borrowed_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      due_date: aminaLoanDue,
    },
    {
      copy_id: outCopyByBookIdx[4][0],    // Charlotte's Web out-copy
      child_id: insertedChildren[1].id,   // Daniel
      pickup_id: insertedPickups[1].id,   // Nakawa home hub
      borrowed_date: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
      due_date: danielLoanDue,
    },
  ])

  console.log(`✅ Seeded: ${insertedBooks.length} books, ${insertedMembers.length} members, ${insertedPickups.length} pickups, 2 loans`)
}

seed().catch(err => { console.error(err); process.exit(1) })
