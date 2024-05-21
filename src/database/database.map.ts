import { Book, BookSchema } from "@/book/book.schema"
import { Category, CategorySchema } from "@/category/category.schema"
import { Crawl, CrawlSchema } from "@/crawl/crawl.schema"
import { Reactions, ReactionsSchema } from "@/reactions/reactions.schema"
import { ReadTime, ReadTimeSchema } from "@/read-time/read-time.schema"
import { Schedule, ScheduleSchema } from "@/schedule/schedule.schema"
import { Tracker, TrackerSchema } from "@/tracker/tracker.schema"
import { User, UserSchema } from "@/user/user.schema"

const databases = [
  { name: User.name, schema: UserSchema },
  { name: Category.name, schema: CategorySchema },
  { name: Book.name, schema: BookSchema },
  { name: Tracker.name, schema: TrackerSchema },
  { name: ReadTime.name, schema: ReadTimeSchema },
  { name: Reactions.name, schema: ReactionsSchema },
  { name: Crawl.name, schema: CrawlSchema },
  { name: Schedule.name, schema: ScheduleSchema },
]

export default databases
