import { CategoryService } from "@/category/category.service"
import { Crawl, CrawlDocument } from "@/crawl/crawl.schema"
import { TypeCrawl } from "@/crawl/dto/crawl.dto"
import databases from "@/database/database.map"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel, MongooseModule } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CrawlController } from "./crawl.controller"
import { CrawlService } from "./crawl.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [CrawlController],
  providers: [CrawlService, CategoryService],
})
export class CrawlModule implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Crawl.name) private crawlModel: Model<CrawlDocument>,
    private readonly crawlService: CrawlService,
    private readonly categoryService: CategoryService
  ) {}

  async onApplicationBootstrap() {
    // console.log("[CrawlModule] onApplicationBootstrap")
    // this.initCrawl().then()
    // this.crawlCategory().then()
  }

  async initCrawl() {
    const urls = [
      "https://www.dtv-ebook.com/best-seller-493.html",
      "https://www.dtv-ebook.com/co-dai-511.html",
      "https://www.dtv-ebook.com/chien-tranh-1449.html",
      "https://www.dtv-ebook.com/di-nang-496.html",
      "https://www.dtv-ebook.com/dam-my-494.html",
      "https://www.dtv-ebook.com/do-thi-quan-truong-495.html",
      "https://www.dtv-ebook.com/ngon-tinh-487.html",
      "https://www.dtv-ebook.com/huyen-ao-497.html",
      "https://www.dtv-ebook.com/hoi-ky-but-ky-503.html",
      "https://www.dtv-ebook.com/kinh-di-491.html",
      "https://www.dtv-ebook.com/ky-nang-song-khoi-nghiep-500.html",
      "https://www.dtv-ebook.com/quan-tri-kinh-doanh-499.html",
      "https://www.dtv-ebook.com/sac-hiep-489.html",
      "https://www.dtv-ebook.com/tan-van-504.html",
      "https://www.dtv-ebook.com/tien-hiep-488.html",
      "https://www.dtv-ebook.com/trinh-tham-492.html",
      "https://www.dtv-ebook.com/trom-mo-506.html",
      "https://www.dtv-ebook.com/trong-sinh-507.html",
      "https://www.dtv-ebook.com/tieu-thuyet-490.html",
      "https://www.dtv-ebook.com/thieu-nhi-505.html",
      "https://www.dtv-ebook.com/xuyen-khong-498.html",
      "https://www.dtv-ebook.com/cuong-cong-thu-sung-512.html",
      "https://www.dtv-ebook.com/cuong-thu-hao-doat-513.html",
      "https://www.dtv-ebook.com/co-trang-515.html",
      "https://www.dtv-ebook.com/co-tich-516.html",
      "https://www.dtv-ebook.com/du-hi-517.html",
      "https://www.dtv-ebook.com/hai-huoc-523.html",
      "https://www.dtv-ebook.com/khoa-huyen-524.html",
      "https://www.dtv-ebook.com/kinh-dien-525.html",
      "https://www.dtv-ebook.com/kiem-hiep-vo-hiep-526.html",
      "https://www.dtv-ebook.com/hien-dai-527.html",
      "https://www.dtv-ebook.com/lang-man-528.html",
      "https://www.dtv-ebook.com/phieu-luu-529.html",
      "https://www.dtv-ebook.com/phong-thuy-530.html",
      "https://www.dtv-ebook.com/sach-teen-531.html",
      "https://www.dtv-ebook.com/sach-tam-linh-532.html",
      "https://www.dtv-ebook.com/su-thi-533.html",
      "https://www.dtv-ebook.com/tho-534.html",
      "https://www.dtv-ebook.com/truyen-dan-gian-535.html",
      "https://www.dtv-ebook.com/truyen-ngan-536.html",
      "https://www.dtv-ebook.com/tuyen-tap-537.html",
      "https://www.dtv-ebook.com/gian-diep-phan-gian-540.html",
      "https://www.dtv-ebook.com/ton-giao-541.html",
      "https://www.dtv-ebook.com/tap-van-542.html",
      "https://www.dtv-ebook.com/tu-truyen-543.html",
      "https://www.dtv-ebook.com/vien-tuong-544.html",
      "https://www.dtv-ebook.com/vo-han-luu-545.html",
      "https://www.dtv-ebook.com/vong-du-546.html",
      "https://www.dtv-ebook.com/kinh-te-1450.html",
      "https://www.dtv-ebook.com/18-1451.html",
      "https://www.dtv-ebook.com/tu-duy-1452.html",
      "https://www.dtv-ebook.com/giao-duc-1453.html",
    ]

    for (const url of urls) {
      console.log("[START] [CrawlModule] [initCrawl] url: ", url)
      // if (await this.crawlModel.exists({ crawlURL: url })) {
      //   console.log("[START] [CrawlModule] [initCrawl] url: ", url, "is exists")
      //   continue
      // }

      const crawls = await this.crawlService.crawlWebApp(url)

      // Cắt chỉ lấy 15 phần tủ
      const _crawls = crawls.slice(0, 15)

      console.log("[CrawlModule] [URL] [LENGTH]", _crawls.length)

      for (const crawl of _crawls) {
        console.log("[CRAWL] [URL]", crawl.urlDetail) // console by M-MON
        const crawlExist = await this.crawlModel.findOne({ urlDetail: crawl?.urlDetail, name: crawl?.name })
        if (!!crawlExist?.uri) {
          console.log("[CRAWL] [URL] [EXIST]", crawlExist.urlDetail) // console by M-MON
          continue
        }

        const { linkBook = "" } = await this.crawlService.crawlWebApp(crawl?.urlDetail, "html", TypeCrawl.DETAIL)
        const urlDocs = await this.crawlService.crawlWebApp(linkBook, "html", TypeCrawl.DOC)
        if (typeof urlDocs === "string") {
          console.log("[urlDocs]", urlDocs) // console by M-MON
          crawl.uri = urlDocs
          const data = await this.crawlModel.create(crawl)
          console.log("[SUCCESS] [CrawlModule] [initCrawl] data", data)
        }
      }
    }

    console.log("[CrawlModule] initCrawl")
  }
}
