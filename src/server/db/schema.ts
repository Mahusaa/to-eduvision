import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  serial,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const Role = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `to-eduvision_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 15 }).notNull().default(Role.USER),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }),
});

export type User = typeof users.$inferSelect

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);



export const tryouts = createTable("tryout", {
  id: serial("id").primaryKey(),
  tryoutNumber: integer('tryout_number').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  mode: varchar('mode', { length: 255 }).notNull(),
  endedAt: timestamp('ended_at').notNull(),
  duration: integer('duration'),
  puDuration: integer('pu_duration').notNull(),
  pbmDuration: integer('pbm_duration').notNull(),
  ppuDuration: integer('ppu_duration').notNull(),
  kkDuration: integer('kk_duration').notNull(),
  lbinDuration: integer('lbind_duration').notNull(),
  lbingDuration: integer('lbing_duration').notNull(),
  pmDuration: integer('pm_duration').notNull(),
  puTotal: integer('pu_total').notNull(),
  pbmTotal: integer('pbm_total').notNull(),
  ppuTotal: integer('ppu_total').notNull(),
  kkTotal: integer('kk_total').notNull(),
  lbinTotal: integer('lbind_total').notNull(),
  lbingTotal: integer('lbing_total').notNull(),
  pmTotal: integer('pm_total').notNull(),
});

export type TryoutData = typeof tryouts.$inferSelect;

export const questions = createTable("question", {
  id: serial("id").primaryKey(),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  questionNumber: integer('question_number').notNull(),
  subtest: varchar('subtest', { length: 20 }).notNull(),
  problemDesc: varchar('problem_desc'),
  option: varchar('option'),
  imagePath: varchar("image_path"),
});
export type AllProblems = typeof questions.$inferSelect;

export const answerKey = createTable("answerKey", {
  id: serial("id").primaryKey(),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  questionNumber: integer('question_number').notNull(),
  subtest: varchar('subtest', { length: 20 }).notNull(),
  answer: varchar('answer'),
  explanation: varchar("explanation"),
  imagePath: varchar("image_path"),
  linkPath: varchar("link"),
});


export const answerSum = createTable("answerSum", {
  id: serial("id").primaryKey(),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  puSum: integer('pu_sum').notNull(),
  pbmSum: integer('pbm_sum').notNull(),
  ppuSum: integer('ppu_sum').notNull(),
  kkSum: integer('kk_sum').notNull(),
  lbindSum: integer('lbind_sum').notNull(),
  lbingSum: integer('lbing_sum').notNull(),
  pmSum: integer('pm_sum').notNull(),
  totalUser: integer("total_user").notNull(),
});

export const userAnswer = createTable('userAnswer', {
  id: serial("id").primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  subtest: varchar("subtest", { length: 20 }),
  answerArray: varchar("answer"),
}, (table) => ({
  uniqueConstraint: unique('unique_constraint').on(table.userId, table.tryoutId, table.subtest),
}));

export const userTime = createTable("userTime", {
  id: serial("id").primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  tryoutEnd: timestamp('tryout_end', { withTimezone: true }),
  puEnd: timestamp('pu_end', { withTimezone: true }),
  pbmEnd: timestamp('pbm_end', { withTimezone: true }),
  ppuEnd: timestamp('ppu_end', { withTimezone: true }),
  kkEnd: timestamp('kk_end', { withTimezone: true }),
  lbindEnd: timestamp('lbind_end', { withTimezone: true }),
  lbingEnd: timestamp('lbing_end', { withTimezone: true }),
  pmEnd: timestamp('pm_end', { withTimezone: true }),
});

export type UserTime = typeof userTime.$inferSelect

export const userScore = createTable('userScore', {
  id: serial("id").primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  tryoutId: integer('tryout_id').references(() => tryouts.id),
  totalScore: integer('total_score'),
});
