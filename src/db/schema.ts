import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const tierEnum = pgEnum('tier', ['family_friends', 'wider_circle'])
export const conditionEnum = pgEnum('condition', ['good', 'worn', 'repair', 'retired'])
export const copyStatusEnum = pgEnum('copy_status', ['in', 'out', 'repair', 'retired'])

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  account_name: text('account_name').notNull(),
  adult_holder: text('adult_holder').notNull(),
  phone: text('phone'),
  tier: tierEnum('tier').notNull().default('family_friends'),
})

export const children = pgTable('children', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull().references(() => members.id),
  name: text('name').notNull(),
  age: integer('age'),
})

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  age_band: text('age_band').notNull(),
  total_copies: integer('total_copies').notNull().default(1),
  cover_color: text('cover_color'),
  cover_image_url: text('cover_image_url'),
  blurb: text('blurb'),
})

export const copies = pgTable('copies', {
  id: serial('id').primaryKey(),
  book_id: integer('book_id').notNull().references(() => books.id),
  condition: conditionEnum('condition').notNull().default('good'),
  status: copyStatusEnum('status').notNull().default('in'),
})

export const pickups = pgTable('pickups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  schedule: text('schedule'),
})

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  copy_id: integer('copy_id').notNull().references(() => copies.id),
  child_id: integer('child_id').notNull().references(() => children.id),
  pickup_id: integer('pickup_id').notNull().references(() => pickups.id),
  borrowed_date: timestamp('borrowed_date').notNull(),
  due_date: timestamp('due_date').notNull(),
  returned_date: timestamp('returned_date'),
})
