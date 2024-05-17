import scrapy
import json

class TrueUpSpider(scrapy.Spider):
    name = 'trueup_spider'
    start_urls = ['https://www.trueup.io/']

    def parse(self, response):
        yield scrapy.FormRequest.from_response(
            response,
            formdata={'username': 'mathewchris96@gmail.com', 'password': 'Nighthack123'},
            callback=self.after_login
        )

    def after_login(self, response):
        yield scrapy.Request(url='https://www.trueup.io/jobs', callback=self.scrape_jobs)

    def scrape_jobs(self, response):
        jobs_info = {}
        job_listings = response.css('.mb-3.card')
        for job in job_listings:
            company_name = job.css('div.mb-2.align-items-baseline a::text').get(default="N/A").strip()
            if company_name in jobs_info:
                jobs_info[company_name] += 1
            else:
                jobs_info[company_name] = 1

        show_more_button = response.css("div:contains('Show more')")
        if show_more_button:
            yield scrapy.Request(show_more_button.attrib['href'], callback=self.scrape_jobs)

        yield self.export_data(jobs_info)

    def export_data(self, jobs_aggregate):
        with open('aggregated_jobs_data.json', 'w') as file:
            json.dump(jobs_aggregate, file)
        self.log("Data exported successfully.")