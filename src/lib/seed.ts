import type { Book, Child, Loan, Pickup, Family } from './types'

export const BOOKS: Book[] = [
  { id: 1, title: 'Anansi the Spider', author: 'Gerald McDermott', category: 'Folktales', age_band: '6-8', cover_color: '#C65D3B', ink_color: '#fff', total_copies: 2, available: 1, blurb: "Clever spider Anansi and his six sons outwit trouble in a classic Ashanti folktale — a story about who really deserves the reward." },
  { id: 2, title: 'Where the Wild Things Are', author: 'Maurice Sendak', category: 'Picture Books', age_band: '6-8', cover_color: '#2E6E5A', ink_color: '#fff', total_copies: 2, available: 2, blurb: "Max puts on his wolf suit, sails to the land of the Wild Things, and becomes their king — before sailing home to his own supper." },
  { id: 3, title: 'The Gruffalo', author: 'Julia Donaldson', category: 'Picture Books', age_band: '6-8', cover_color: '#C9A227', ink_color: '#1a1a1a', total_copies: 3, available: 2, blurb: "A quick-thinking mouse invents a terrible monster to frighten off the hungry hunters of the deep dark wood." },
  { id: 4, title: "Mufaro's Beautiful Daughters", author: 'John Steptoe', category: 'Folktales', age_band: '6-8', cover_color: '#7A3B5E', ink_color: '#fff', total_copies: 1, available: 1, blurb: "Two sisters — one kind, one proud — journey to meet the king in this luminous Zimbabwean tale about true worth." },
  { id: 5, title: "Charlotte's Web", author: 'E. B. White', category: 'Adventure', age_band: '9-12', cover_color: '#2E6E5A', ink_color: '#fff', total_copies: 2, available: 0, blurb: "A barn spider spins words to save Wilbur the pig — a tender story of friendship, cleverness and letting go." },
  { id: 6, title: 'Matilda', author: 'Roald Dahl', category: 'Adventure', age_band: '9-12', cover_color: '#C65D3B', ink_color: '#fff', total_copies: 2, available: 1, blurb: "A brilliant little girl with extraordinary powers takes on the meanest grown-ups she's ever met — and wins." },
  { id: 7, title: 'The Lion & the Mouse', author: 'Jerry Pinkney', category: 'Folktales', age_band: '6-8', cover_color: '#C9A227', ink_color: '#1a1a1a', total_copies: 2, available: 2, blurb: "A wordless, sweeping retelling of Aesop's fable set on the African savanna — a small kindness returned." },
  { id: 8, title: 'Akissi: Tales of Mischief', author: 'Marguerite Abouet', category: 'Adventure', age_band: '9-12', cover_color: '#B23A48', ink_color: '#fff', total_copies: 1, available: 1, blurb: "Growing up in Abidjan means monkeys on the loose, a very mean cat, and endless glorious mischief." },
  { id: 9, title: 'Sulwe', author: "Lupita Nyong'o", category: 'Picture Books', age_band: '6-8', cover_color: '#3B5478', ink_color: '#fff', total_copies: 2, available: 1, blurb: "Sulwe is the colour of midnight and wishes she were lighter — until a night-time journey teaches her to shine in her own light." },
  { id: 10, title: 'The Boy Who Harnessed the Wind', author: 'William Kamkwamba', category: 'Science', age_band: '9-12', cover_color: '#1F7A82', ink_color: '#fff', total_copies: 2, available: 2, blurb: "A Malawian teenager builds a windmill from scrap parts to bring electricity and water to his village. A true story." },
  { id: 11, title: 'Chike and the River', author: 'Chinua Achebe', category: 'Adventure', age_band: '9-12', cover_color: '#3B5478', ink_color: '#fff', total_copies: 1, available: 0, blurb: "Young Chike dreams of crossing the great River Niger — and on the far bank, adventure and danger are waiting." },
  { id: 12, title: 'Nelson Mandela', author: 'Kadir Nelson', category: 'People & Places', age_band: '9-12', cover_color: '#4A5043', ink_color: '#fff', total_copies: 1, available: 1, blurb: "The life of South Africa's freedom hero — from a boy in the hills to president — told for young readers." },
  { id: 13, title: 'Fatou Fetch the Water', author: 'Neil Griffiths', category: 'Folktales', age_band: '6-8', cover_color: '#C9A227', ink_color: '#1a1a1a', total_copies: 2, available: 2, blurb: "On the long walk to the well and back, Fatou's imagination turns an ordinary errand into a grand adventure." },
  { id: 14, title: 'Magic School Bus: Inside the Earth', author: 'Joanna Cole', category: 'Science', age_band: '6-8', cover_color: '#C65D3B', ink_color: '#fff', total_copies: 2, available: 1, blurb: "Ms. Frizzle's class takes a very deep field trip to learn how rocks, caves and crystals are made." },
  { id: 15, title: 'Africa, Amazing Africa', author: 'Atinuke', category: 'People & Places', age_band: '9-12', cover_color: '#2E6E5A', ink_color: '#fff', total_copies: 2, available: 2, blurb: "A joyful, region-by-region tour of all 55 countries of the continent — food, festivals, wildlife and wonders." },
  { id: 16, title: "Handa's Surprise", author: 'Eileen Browne', category: 'Picture Books', age_band: '6-8', cover_color: '#B23A48', ink_color: '#fff', total_copies: 3, available: 2, blurb: "Handa carries seven delicious fruits to her friend Akeyo — but the animals along the path have other plans." },
  { id: 17, title: 'A Is for Africa', author: 'Ifeoma Onyefulu', category: 'Picture Books', age_band: '6-8', cover_color: '#7A3B5E', ink_color: '#fff', total_copies: 1, available: 1, blurb: "An alphabet of everyday African life — from beads and drums to yams and weaving — in warm photographs." },
  { id: 18, title: 'The Cat in the Hat', author: 'Dr. Seuss', category: 'Picture Books', age_band: '6-8', cover_color: '#B23A48', ink_color: '#fff', total_copies: 3, available: 3, blurb: "One cold wet day, a mischievous cat turns a quiet house upside down — with two children and a fish looking on." },
  { id: 19, title: 'Bringing the Rain to Kapiti Plain', author: 'Verna Aardema', category: 'Poetry & Music', age_band: '6-8', cover_color: '#1F7A82', ink_color: '#fff', total_copies: 2, available: 2, blurb: "A cumulative Nandi tale told in bouncing rhyme — how the herdsman Ki-pat brought the rain to the drying plain." },
  { id: 20, title: 'Nsangi and the Ogre', author: 'A Luganda Folktale', category: 'Folktales', age_band: '6-8', cover_color: '#4A5043', ink_color: '#fff', total_copies: 2, available: 2, blurb: "A brave Ganda girl outwits a hungry ogre on the road home — a beloved local tale retold for Kitabu readers." },
]

export const CHILDREN: Child[] = [
  { id: 'c1', name: 'Amina', age: 7, initial: 'A', color: '#C65D3B', member_id: 'f1' },
  { id: 'c2', name: 'Daniel', age: 10, initial: 'D', color: '#1F7A82', member_id: 'f1' },
]

export const INITIAL_LOANS: Loan[] = [
  { id: 'l1', child_name: 'Amina', child_id: 'c1', family_name: 'Nsubuga', title: 'Sulwe', book_id: 9, cover_color: '#3B5478', pickup: 'Kampala Parents School', due_date: '30 Jul', status: 'soon' },
  { id: 'l2', child_name: 'Daniel', child_id: 'c2', family_name: 'Nsubuga', title: "Charlotte's Web", book_id: 5, cover_color: '#2E6E5A', pickup: 'Nakawa home hub', due_date: '22 Jul', status: 'overdue' },
]

export const PICKUPS: Pickup[] = [
  { id: 'p1', name: 'Kampala Parents School', note: 'Fri, 3pm' },
  { id: 'p2', name: 'Nakawa home hub', note: 'Weekends' },
  { id: 'p3', name: 'Ntinda neighbourhood', note: 'Delivery' },
]

export const FAMILIES: Family[] = [
  { id: 'f1', name: 'Nsubuga family', parent: 'Sarah Nsubuga', kids_text: 'Amina (7) · Daniel (10)', loan_count: 2, tier: 'family_friends' },
  { id: 'f2', name: 'Okello family', parent: 'James Okello', kids_text: 'Grace (8)', loan_count: 1, tier: 'family_friends' },
  { id: 'f3', name: 'Mensah family', parent: 'Ama Mensah', kids_text: 'Kofi (11) · Efua (6)', loan_count: 0, tier: 'family_friends' },
  { id: 'f4', name: 'Namuli family', parent: 'Fatuma Namuli', kids_text: 'Aisha (9) · attends KPS', loan_count: 0, tier: 'wider_circle' },
  { id: 'f5', name: 'Ssali family', parent: 'Peter Ssali', kids_text: 'Zawadi (9)', loan_count: 1, tier: 'wider_circle' },
  { id: 'f6', name: 'Auma family', parent: 'Rose Auma', kids_text: 'Brian (7)', loan_count: 0, tier: 'family_friends' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  'Picture Books': '#C65D3B',
  'Folktales': '#C9A227',
  'Adventure': '#2E6E5A',
  'Science': '#1F7A82',
  'Poetry & Music': '#7A3B5E',
  'People & Places': '#4A5043',
}

export const LOAN_DAYS = 14
