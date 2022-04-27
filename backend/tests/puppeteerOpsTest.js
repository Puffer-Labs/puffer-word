const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

(async () => {
    // Runs 9 clients in parallel
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 4,  // Change this number for more workers
        monitor: true,
        timeout: 500000,
    });

    // Email is sent as data to be used for login -
    // Requires accounts to already be registered in the format:
    // test<num>@tst.com with password 'test'
    await cluster.task(async ({ page, data: {email, num} }) => {
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
        // await page.waitForTimeout(Math.floor(Math.random() * (6000 - 3000 + 1) + 3000));
        await page.waitForTimeout(Math.floor(Math.random() * (6000 - 3000 + 1) + 3000));

        for(let i = 0; i < num; i++){
            await page.keyboard.press('ArrowDown');
        }
        await page.waitForTimeout(Math.floor(Math.random() * (6000 - 3000 + 1) + 3000));
        // Types Hello World! into quill text editor all at the same time
        await page.keyboard.type("Hello World!", { delay: 100 });
        // await page.waitForNavigation({ waitUntil: "networkidle0" });
        browser.close();
    });

    /// Queues each worker client account
    cluster.queue({email: "test1@test.com", num: 0});
    cluster.queue({email: "test2@test.com", num: 1});
    cluster.queue({email: "test3@test.com", num: 2});
    cluster.queue({email: "test4@test.com", num: 3});
    // cluster.queue({email: "test5@test.com", num: 4});
    // cluster.queue({email: "test6@test.com", num: 5});
    // cluster.queue({email: "test7@test.com", num: 6});
    // cluster.queue({email: "test8@test.com", num: 7});
    // cluster.queue({email: "test9@test.com", num: 8});
    // Add more workers here

    await cluster.idle();
    await cluster.close();
})();
