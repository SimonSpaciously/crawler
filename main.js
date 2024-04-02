import { PlaywrightCrawler, Dataset } from "crawlee";
const crawler = new PlaywrightCrawler({
  //headless: false,
  requestHandler: async ({ page, request, enqueueLinks }) => {
    console.log(`Processing: ${request.url}`);
    if (request.label === "CLASSES") {
      const titleData = await page.locator('h1[itemprop="name"]').textContent();
      const title = titleData.replace(/\n/g, "");
      //console.log("TITLE: ", title);
      //const vendor = await page.locator(".black-link").first().textContent();
      const vendorData = await page.$eval(
        ".profile-short-summary-div .black-link.teacher-threshold-link",
        (element) => element.textContent.trim()
      );
      const vendor = vendorData.replace(/\n/g, "");

      await page.waitForSelector("p#mobile-sticky-threshold");
      const descriptionData = await page.$eval(
        "p#mobile-sticky-threshold",
        (element) => element.textContent.trim()
      );
      const description = descriptionData.replace(/\n/g, "");

      const priceData = await page.$eval("#price-summary-rhs", (element) =>
        element.textContent.trim()
      );
      const price = priceData.replace(/\n/g, "");

      const locationData = await page.$$eval(
        "#location-outer-wrapper > div.col-sm-9 > p",
        (elements) => {
          return elements.map((element) => element.textContent.trim());
        }
      );
      const location = locationData[0];

      const durationElement = await page.$(".duration-icon"); // Select the element with the "duration-icon" class
      const nextSibling = await durationElement.evaluateHandle(
        (node) => node.nextSibling
      ); // Get the next sibling of the duration element

      const duration = await page.evaluate(
        (node) => node.textContent.trim(),
        nextSibling
      );
      await page.waitForSelector(
        'img[data-src="/images/general/icons/students.png"]'
      );
      const elementWithDataSrc = await page.$(
        'img[data-src="/images/general/icons/students.png"]'
      );

      const nextSibling1 = await elementWithDataSrc.evaluateHandle(
        (node) => node.nextSibling
      );
      const textContent = await page.evaluate(
        (node) => node.textContent.trim(),
        nextSibling1
      );
      const numberOfParticipants = textContent;
      const urlBento = request.url;
      const results = {
        title,
        vendor,
        description,
        price,
        location,
        duration,
        numberOfParticipants,
        urlBento,
      };

      await Dataset.pushData(results);
    } else {
      await page.waitForSelector(".mtlm-class");
      await enqueueLinks({
        selector: ".mtlm-class",
        label: "CLASSES",
      });

      // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
      //   const nextButton = await page.$('a.page-link[rel="next"]');
      //   if (nextButton) {
      //     await enqueueLinks({
      //       selector: "a.pagination__next",
      //       label: "PAGES", // <= note the same label
      //     });
      //   }
    }
  },
  maxRequestsPerCrawl: 49,
});

await crawler.run([
  "https://classbento.com/workshops-san-francisco?vanilla=1&hide_tall_ribbon=1&page=4",
]);
