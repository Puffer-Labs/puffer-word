const puppeteer = require("puppeteer");
const { Cluster } = require('puppeteer-cluster');



(async () => {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 9,
      monitor: true,
      timeout: 500000
    });
  
    await cluster.task(async ({ page, data: email}) => {
        const browser = await puppeteer.launch({ headless: true });
        // const page = await browser.newPage();
    
        await page.goto("http://localhost:3000");
        await page.type("#login-username", email);
        await page.type("#login-password", "test");
        await page.click("#login-btn"),
            await page.waitForNavigation({ waitUntil: "networkidle0" });
           const tag = await page.$x("//a[contains(., doc1)]");
           await Promise.all([
            tag[0].click(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
          ]);
        //   await Promise.all([
        //     page.type('input[name=editor]', 'Hello World!', { delay: 100 }),
        //     page.waitForNavigation({ waitUntil: 'networkidle0' }),
        //   ]);
        for (let i = 0; i < 9; i++) {
            await page.keyboard.press("Tab");
        }

        await page.type("#editor", "Hello World!", { delay: 1000 });
            // await page.screenshot({ path: "./example.png" });
            await page.waitForNavigation({ waitUntil: "networkidle0" });
            browser.close();
    });
  
    cluster.queue('test1@test.com');
     cluster.queue('test2@test.com');
    cluster.queue('test3@test.com');
    cluster.queue('test4@test.com');
    cluster.queue('test5@test.com');
    cluster.queue('test6@test.com');
    cluster.queue('test7@test.com');
    cluster.queue('test8@test.com');
    cluster.queue('test9@test.com');

    // many more pages
  
    await cluster.idle();
    await cluster.close();
  })();
// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     await page.goto("http://localhost:3000");
//     await page.type("#login-username", "test1@test.com");
//     await page.type("#login-password", "test");
//     await page.click("#login-btn"),
//         await page.waitForNavigation({ waitUntil: "networkidle0" });
//        const tag = await page.$x("//a[contains(., doc1)]");
//        await Promise.all([
//         tag[0].click(),
//         page.waitForNavigation({ waitUntil: 'networkidle0' }),
//       ]);
//     //   await Promise.all([
//     //     page.type('input[name=editor]', 'Hello World!', { delay: 100 }),
//     //     page.waitForNavigation({ waitUntil: 'networkidle0' }),
//     //   ]);
//     for (let i = 0; i < 9; i++) {
//         await page.keyboard.press("Tab");
//     }
//     await page.type("#editor", "Hello World!", { delay: 100 });
//         await page.screenshot({ path: "./example.png" });

//     await browser.close();
// })();
