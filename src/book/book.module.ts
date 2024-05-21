import { Book, BookDocument } from "@/book/book.schema"
import { Category, CategoryDocument } from "@/category/category.schema"
import { Crawl, CrawlDocument } from "@/crawl/crawl.schema"
import databases from "@/database/database.map"
import { randomUserAgent } from "@/helpers/helper"
import { ImageGateway } from "@/services/image.gateway.service"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { JwtStrategy } from "@/user/guards/jwt.strategy"
import { UserService } from "@/user/user.service"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel, MongooseModule } from "@nestjs/mongoose"
import * as cheerio from "cheerio"
import { Model } from "mongoose"
import puppeteer from "puppeteer"
import { BookController } from "./book.controller"
import { BookService } from "./book.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [BookController],
  providers: [UserService, BookService, JwtStrategy, ImageGateway],
  exports: [UserService, BookService, ImageGateway],
})
export class BookModule implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Crawl.name) private crawModel: Model<CrawlDocument>
  ) {}
  async onApplicationBootstrap() {
    console.log("[BookModule] onApplicationBootstrap")
    // const categories = await this.categoryModel.find()
    // const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    // console.log("randomCategory", randomCategory)
  }

  async crawlWebApp(url: string, type: "html" | "txt" = "html"): Promise<any> {
    const array = []
    let category = ""

    const browser = await puppeteer.launch({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headless: "new", // Use the headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-features=site-per-process",
      ],
    })
    console.log("🚀 ~ CrawlService ~ browser:", browser)
    try {
      const page: any = await browser.newPage()
      page.on("framenavigated", (frame) => {
        console.log("Frame navigated: " + frame.name())
      })

      page.on("framedetached", (frame) => {
        console.log("Frame detached: " + frame.name())
      })
      page.setDefaultNavigationTimeout(60)
      await page.setUserAgent(randomUserAgent(false))
      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" })
      await page.waitForTimeout(1000)

      let htmlContent = ""
      if (type === "txt") {
        // await page.waitForSelector('.example-class');
        const pageContent = await page.evaluate(() => {
          return document.body.innerText
        })
        return pageContent
      } else {
        htmlContent = await page.content()
        const $ = cheerio.load(htmlContent)

        const contentElements = $(".hide-for-small-only")
        const categoryElements = $(".tieu_de .text-left")
        category = $(categoryElements).html()
        // Kiểm tra xem phần tử có tồn tại không
        if (contentElements.length > 0) {
          contentElements.each((index, element) => {
            const htmlContent = $(element).html()
            const hrefValue = $(element).find("a").attr("href")
            const title = $(element).find("a").attr("title")
            const hrefImg = $(element).find("img").attr("src")
            // const textContent = htmlToText(htmlContent);
            console.log("hrefValue", hrefValue)
            console.log("hrefImg", hrefImg)
            array.push({
              href: hrefValue,
              title,
              img: hrefImg,
              category,
            })
          })
        } else {
          console.log("Không tìm thấy phần tử với class đã chỉ định.")
        }
      }
      return array
    } catch (error) {
      console.error("[ERROR crawlWebApp]:", error)
    } finally {
      await browser.close()
    }
    return ""
  }
}
