const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

(async () => {
    // Runs 9 clients in parallel
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 9,  // Change this number for more workers
        monitor: true,
        timeout: 500000,
    });

    // Email is sent as data to be used for login -
    // Requires accounts to already be registered in the format:
    // test<num>@tst.com with password 'test'
    await cluster.task(async ({ page, data: email }) => {
        const browser = await puppeteer.launch({ headless: true });
        await page.goto("http://localhost:3000");
        await page.type("#login-username", email);
        await page.type("#login-password", "test");
        await page.click("#login-btn"),
            await page.waitForNavigation({ waitUntil: "networkidle0" });
        const tag = await page.$x("//a[contains(., doc1)]");
        await Promise.all([
            tag[0].click(),
            page.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);
        // Pressing tab until clients can type into quill since we cannot identify
        // the quill element by any css attribute
        for (let i = 0; i < 9; i++) {
            await page.keyboard.press("Tab");
        }

        // Types Hello World! into quill text editor all at the same time
        await page.type("#editor", "Hello World!", { delay: 1000 });
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        browser.close();
    });

    /// Queues each worker client account
    cluster.queue("test1@test.com");
    cluster.queue("test2@test.com");
    cluster.queue("test3@test.com");
    cluster.queue("test4@test.com");
    cluster.queue("test5@test.com");
    cluster.queue("test6@test.com");
    cluster.queue("test7@test.com");
    cluster.queue("test8@test.com");
    cluster.queue("test9@test.com");
    // Add more workers here

    await cluster.idle();
    await cluster.close();
})();
