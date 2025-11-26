// @ts-check
import { test, expect } from '@playwright/test';
import { error } from "console";
import { request } from "https";

// Browser opening for every test
/**
 * @param {import("playwright-core").Page} page
 */
async function urlStatus(page) {
     try {
            const response = await page.goto(`https://imaginxavr.com/`);
        // const response = await page.goto(`https://dev.imaginxavr.com/imaginx/`);
            try {
                    await page.waitForLoadState('load', { timeout: 90000 }); // try for 90s
            } catch (e) {
                    // @ts-ignore
                    throw new error('❌ ImaginX Url did not load within 90s.');
            }
            // @ts-ignore
            expect(response.status()).toBeLessThan(400);
            expect.soft(await page.title()).toEqual(`Experience Innovation and Inspiration with AVR - imaginX`);
        // await expect.soft(page).toHaveTitle(/Innovation and Inspire/);

            return true;
    } catch (er) {
            console.error(`❌ There is issue with Url : ${er}`);
            // @ts-ignore
            console.error(`➡️ Error Message: ${er.message}`);
            // @ts-ignore
            console.error(`➡️ Error Stack: ${er.stack}`);
            expect.soft(true).toBeTruthy();
            return false;
    }
};
// Scroll to bottom of the page
/**
 * @param {import("playwright-core").Page} page
 * @param {number} step
 * @param {number} delay
 */
async function scrollToBottom(page, step, delay) {
        if(!page.isClosed()){
        try {
            await page.evaluate(async ({step,delay}) => {
                for (let i = 0; i < document.body.scrollHeight; i += step) {
                window.scrollTo(0, i);
                await new Promise(resolve => setTimeout(resolve, delay)); // wait for for each scroll
                }
            },{step,delay});
            await page.waitForTimeout(1000); // wait after scroll completed
        } catch (error) {
            console.error('⚠️ Scrolling to bottom error : '+error);
        }
    }
};
// Scroll to top of the page
/**
 * @param {import("playwright-core").Page} page
 */
async function scrolltoTop(page) {
    if(!page.isClosed()){
    try {
        await page.evaluate(()=>{
        window.scrollTo(0,0);
    });
    await page.waitForTimeout(1000);
    } catch (error) {
        console.error('⚠️ Scrolling to top error : '+error);
        }
    }
};
// printing local date & time
const date = new Date().toLocaleDateString().replace(/[/\//]/g,'-');
const time = new Date().toLocaleTimeString().replace(/[:. ]/g,'-');
const Date_Time = `${date},${time}`;
console.log(`time is : ${Date_Time}`);

/**
 * @param {import('@playwright/test').Page} page  -The Playwright Page object.
 * @param {String} name -Name for the video file (e.g. 'Banner').
 */
// Take screenshot
async function takeScreenshot(page,name,testInfo) {

    if(!page.isClosed()){
        try {

            await page.screenshot({ path: `screenshots/${name}_${Date_Time}.png`, fullPage: true });
            const screenshotPath = `screenshots/${name}_${Date_Time}.png`;
                            await page.screenshot({path:screenshotPath,fullPage:true});
                            // This one will attach the every screenshot manually to the html report from screenshot folder
                            await testInfo.attach(`${name}`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error('⚠️ Screenshot error : '+error);
        }
    }
};
// Take screenshot of element with url of element
/**
 * @param {import('@playwright/test').Page} page -The Playwright Page object.
 * @param {String} Imgurl -Need img url in string form.
 * @param {String} name Name for the screenshot.
 * @param {import("playwright/test").TestInfo} testInfo
 */
async function takeScreenshotEle(page,testInfo,Imgurl,name) {
    if(!page.isClosed()){
        try {
                // const fullUrl = Imgurl;
                var fullUrl = Imgurl;
                const fileName = fullUrl.split('/').pop(); // it will give last part of url
                const ele = await page.locator(`(//*[contains(@src,'${fileName}')]/parent::*)[1]`);
                await ele.waitFor({timeout:20000});
                const screenshotPath = `ErrorScreenshots/${name}_Error_${Date_Time}.png`;
                await ele.screenshot({path:screenshotPath});
                // @ts-ignore
                fullUrl=null;
                // This one will attach the every screenshot manually to the html report from screenshot folder
                await testInfo.attach(`${name}error`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error(`⚠️ ${name} screenshot error : ${error}`);
        }
    }
};
// Take screenshot of element with xpath of element
/**
 * @param {import("playwright-core").Page} page
 * @param {import("playwright/test").TestInfo} testInfo
 * @param {string} xpath
 * @param {string} name
 */
async function takeScreenshotEle2(page,testInfo,xpath,name) {
    if(!page.isClosed()){
        try {
                const ele = await page.locator(xpath);
                await ele.waitFor({timeout:40000});
                const screenshotPath = `ErrorScreenshots/${name}error_${Date_Time}.png`;
                await ele.screenshot({path:screenshotPath});
                // This one will attach the every screenshot manually to the html report from screenshot folder
                await testInfo.attach(`${name}error`,{path:screenshotPath,contentType:'image/png'});
        } catch (error) {
            console.error(`⚠️ ${name} screenshot error : ${error}`);
        }
    }
};
// Hover and click any element with xpath
/**
 * @param {import("playwright-core").Page} scope
 * @param {string} xpath
 */
async function hoverAndClickWithXpath(scope,xpath) {
        try {
        //     const locator = await page.locator(xpath);
                const locator = scope.locator(xpath);
                let page;
                // @ts-ignore
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page then it will return true
                        // @ts-ignore
                        page = scope.page(); // it will extract the main page onject from scope parameter
                } else {
                        page = scope; // if scope is the page itself
                }
            await locator.waitFor({state:'visible',timeout:60000});
            await locator.hover();
            await page.waitForTimeout(1000);
            await locator.click();
            return true;
        } catch (error) {
            console.error(`⚠️ Error during hover and click: ${error}`);
            return false;
        }
};
// Hover and click any element with direct locator
/**
 * @param {{ page: () => any; waitFor: (arg0: { state: string; timeout: number; }) => any; hover: () => any; click: () => any; }} locator
 */
async function hoverAndClickWithLocator(locator) {
        try {
            const page = locator.page(); // Get the page from locator
            await locator.waitFor({state:'visible',timeout:40000});
            await locator.hover();
            await locator.click();
            return true;
        } catch (error) {
            console.error(`⚠️ Error during hover and click: ${error}`);
            return false;
        }
};
// Hovering the element with xpath of element
/**
 * @param {{ page: () => any; locator: (arg0: any) => any; }} scope
 * @param {any} xpath
 */
async function hoverWithXpath(scope,xpath) {
        try {
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page object from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.hover({ timeout: 60000 });
                       return true;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.hover({ timeout: 60000 });
                       return true;
                }
        } catch (error) {
                console.error(`⚠️ Error during hover: ${error}`);
                return false;
        }
};
// Hover the element with direct locator
/**
 * @param {{ waitFor: (arg0: { timeout: number; }) => any; hover: (arg0: { timeout: number; }) => any; }} locator
 */
async function hoverWithLocator(locator) {
        try {
                await locator.waitFor({ timeout: 40000});
                await locator.hover({ timeout: 60000 });
                return true;
        } catch (error) {
                console.error(`⚠️ Error during hover: ${error}`);
                return false;
        }
        
};
// Click the element with xpath of element
/**
 * @param {{ page: () => any; locator: (arg0: any) => any; }} scope
 * @param {any} xpath
 */
async function clickWithXpath(scope,xpath) {
        try {
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.click({ timeout: 60000 });
                       return true;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       await ele.click({ timeout: 60000 });
                       return true;
                }
        } catch (error) {
                console.error(`⚠️ Error during click: ${error}`);
                return false;
        }
};
// Click the element with direct locator
/**
 * @param {{ waitFor: (arg0: { timeout: number; }) => any; click: (arg0: { timeout: number; }) => any; }} locator
 */
async function clickWithLocator(locator) {
        try {
                await locator.waitFor({ timeout: 40000});
                await locator.click({ timeout: 60000 });
                return true;
        } catch (error) {
                console.error(`⚠️ Error during click: ${error}`);
                return false;
        }
        
};
// Exstracting inner text of the element with xpath
/**
 * @param {{ page: () => any; locator: (arg0: any) => any; }} scope
 * @param {any} xpath
 */
async function getInnerTextWithXpath(scope,xpath) {
        try {
                let text=null;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       text = await ele.innerText();
                       return text;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:40000});
                       text = await ele.innerText();
                       return text;
                }
        } catch (error) {
                console.error(`⚠️ Error during getting innet text: ${error}`);
                return `⚠️ Unable to get the text.`;
        }
};
// Exstracting inner text of the element with locator
/**
 * @param {{ waitFor: (arg0: { timeout: number; }) => any; innerText: () => any; }} locator
 */
async function getInnetTextWithLocator(locator) {
        try {
                let text = null;
                await locator.waitFor({ timeout: 40000});
                text = await locator.innerText();
                return text;
        } catch (error) {
                console.error(`⚠️ Error during getting innet text: ${error}`);
                return `⚠️ Unable to get the text.`;
        }
        
}
// Exstracting attribute value of the element with xpath
/**
 * @param {{ page: () => any; locator: (arg0: any) => any; }} scope
 * @param {any} xpath
 * @param {any} attrubuteName
 */
async function getAttributeWithXpath(scope,xpath,attrubuteName) {
        try {
                let attributeValue=null;
                if ('page' in scope && typeof scope.page() === 'function') { // if scope parameter contains page and scope.page must not be a function then it will return true
                       const page = scope.page(); // it will extract the main page onject from scope parameter
                       const ele = await page.locator(xpath);
                       await ele.waitFor({timeout:60000});
                       attributeValue = await ele.getAttribute(attrubuteName);
                       return attributeValue;
                } else {
                        const ele = await scope.locator(xpath);
                       await ele.waitFor({timeout:60000});
                       attributeValue = await ele.getAttribute(attrubuteName);
                       return attributeValue;
                }
        } catch (error) {
                console.error(`⚠️ Error during getting the attribute value: ${error}`);
                return `⚠️ Unable to get the attribute value.`;
        }
};
// Exstracting attribute value of the element with locator
/**
 * @param {{ getAttribute: (arg0: any) => any; waitFor: (arg0: { timeout: number; }) => any; }} locator
 * @param {any} attributeName
 */
async function getAttributeWithLocator(locator,attributeName) {
        try {
                let attributeValue = null;
                attributeValue = await locator.getAttribute(attributeName);
                await locator.waitFor({ timeout: 60000});
                return attributeValue;
        } catch (error) {
                console.error(`⚠️ Error during getting the attribute value: ${error}`);
                return `⚠️ Unable to get the attrubute value.`;
        }
        
}
// Element checking on page
/**
 * @param {import("playwright-core").Page} page
 * @param {import("playwright/test").TestInfo} testInfo
 * @param {string} elementPath
 * @param {string} elementName
 * @param {string} pageName
 */
async function elementCheck(page,testInfo,elementPath,elementName,pageName) {
    try {
            const element = await page.locator(elementPath);
            await element.waitFor({timeout:40000});
            if(await element.isVisible()){
                console.log(`✅ ${elementName} is displayed on ${pageName} page.`);
                await element.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500);
                await element.hover({ timeout: 60000 });
                await page.waitForTimeout(500);
                return true;
            }else{
                console.error(`⚠️ Issue with the ${elementName} on ${pageName} page.`);
                await takeScreenshotEle2(page,testInfo,elementPath,elementName);
                return false;
        }
    } catch (error) {
        console.error(`⚠️ Issue with the ${elementName} on ${pageName} page. ${error}`);
        return false;
    } 
};
// Image checking
/**
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {String} imageName - Name for the image file (e.g. 'Logo', 'Banner').
 * @param {String} imgUrl - image 'src' value (e.g., 'https://example.com/logo.png').
 * @param {String} pageName - web page neme (e.g., "home")
 * @param {import("playwright/test").TestInfo} testInfo
 */
async function imageChecking(page,testInfo,imgUrl,imageName,pageName) {
             try {
                
                // it will store all images and check the loading of the images which are matching of given url or src value.
                // const isImageLoaded = await page.evaluate((url)=>{
                //             return [...document.images].some(img =>
                //                         img.src.includes(url) && img.complete && img.naturalWidth > 0
                //                     );
                // },imgUrl);
                var fullUrl = imgUrl;
                const fileName = fullUrl.split('/').pop(); // it will give last part of url
                // @ts-ignore
                fullUrl=null;
                const ele = page.locator(`(//*[contains(@src,'${fileName}')]/parent::*)[1]`);
                await ele.waitFor({timeout:20000});
                if(await ele.isDisabled){
                    console.log(`✅ ${imageName} image Displayed on ${pageName} page.`);
                    return true;
                }else{
                    console.error(`⚠️ Issue with the ${imageName} image on ${pageName} page.`);
                    await takeScreenshotEle(page,testInfo,imgUrl,imageName);
                    return false;
                }
        } catch (error1) {
                await takeScreenshotEle(page,testInfo,imgUrl,imageName);
                console.error(`⚠️ ${imageName} image error on ${pageName} page: ${error1}`);
                return false;
        };

};
// Banner video checking
/**
 * Checks if a video with a given source URL is playing and takes a screenshot.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} videoUrl - The partial or full src URL to match the video.
 * @param {string} videoName - The label/name used for video file naming.
 * @param {string} pageName - The label/name used for page naming.
 * @param {number} waitingTime - This time is to wait the video to load.
 * @param {boolean} isBannerVideoChecking - For banner video checking the value is "true", for normal video checking the value is "false".
 * @param {import("playwright-core").APIRequestContext} request
 * @param {import("playwright/test").TestInfo} testInfo
 */
async function isvideoWithSrcPlaying(page,request,testInfo,videoUrl,videoName,pageName,waitingTime=10000,isBannerVideoChecking=false) {
        try {  
                // Video url status checking
                const fileResponse = await request.head(videoUrl);
                console.log(`Status: ${fileResponse.status()} - ${videoUrl}`);
                expect(fileResponse.status()).toBe(200);
                if(fileResponse.status()!==200){
                        console.error(`❌ Video URL not reachable (${fileResponse.status()}): ${videoUrl}`);
                        // await takeScreenshotEle(page, testInfo, videoUrl, videoName);
                        return false;
                }
                const isVideoPlaying = await page.evaluate(async({videoUrl,waitingTime,isBannerVideoChecking})=>{
                    let mactchedVideo = null;
                    // @ts-ignore
                    const delay = (ms) => new Promise(res => setTimeout(res, ms));
                    const videos = Array.from(document.querySelectorAll('video'));
                    for(const ele of videos){
                        if(ele.src && ele.src.includes(videoUrl)){
                                mactchedVideo = ele;
                                break;
                            }
                        const source = ele.querySelector('source');
                        if(source && source.src && source.src.includes(videoUrl)){
                                mactchedVideo = ele;
                                break;
                            }
                    }
                    await delay(waitingTime); // Wait for video to buffer and play
                    if(isBannerVideoChecking){
                        return (
                                mactchedVideo &&                     
                                !mactchedVideo.paused &&
                                mactchedVideo.readyState >= 3
                        );
                    }else{
                        return (
                            mactchedVideo &&                     
                            mactchedVideo.readyState >= 3
                        );
                    }
                   
                },{videoUrl,waitingTime,isBannerVideoChecking});
                if(isVideoPlaying){
                    console.log(`✅ ${videoName} video is playing fine on ${pageName} page.`);
                    return true;
                }else{
                    console.log(`⚠️ Issue with the ${videoName} video on ${pageName} page.`);
                    await takeScreenshotEle(page,testInfo,videoUrl,videoName);
                    return false;
                }
        } catch (error2) {
            console.error(`⚠️ ${videoName} video error on ${pageName}: ${error2}`);
            await takeScreenshotEle(page,testInfo,videoUrl,videoName);
            return false;
        };
};
/**
 * 
 * @param {import('@playwright/test').Page} page 
 * @param {String} elementXpath - Element xpath
 * @param {Number} elementXvalue - Element X value
 * @param {Number} elementYvalue - Element Y value
 * @param {String} elementName  - Element Name
 * @param {String} pageName  - Page Name
 * @returns 
 */
async function elementCoordinates(page,elementXpath,elementXvalue,elementYvalue,elementName,pageName) {
        try {
                // Header coordinates checking for page design checking
                const element = await page.locator(elementXpath);
                await element.waitFor({timeout:40000});
                const box = await element.boundingBox();
                if (!box) {
                        console.warn('⚠️ Not visible or has no bounding box.');
                        return false;
                }
                console.log(`${pageName} Page ${elementName} coordinates - x: ${box.x}, y: ${box.y}`);
                if(box.x === elementXvalue && box.y === elementYvalue){
                        console.log(`✅ ${pageName} page ${elementName} desing ok.`);
                        return true;
                }else{console.error(`⚠️ ${pageName} page ${elementName} design got broken.`);
                        return false;
                }
        } catch (error) {
                // @ts-ignore
                console.error(`❌ Error checking coordinates for ${elementName} on ${pageName} page:`, error.message);
                return false;
        }     
}
// Home page checking
test('Home Page', async({page,request},testInfo)=>{
    if(await urlStatus(page)){
        // Scroll to bottom
        await scrollToBottom(page,300,500);
        // Scroll to top
        await scrolltoTop(page);
        // take screenshot
        await takeScreenshot(page,"HomePage",testInfo);
        // Logo checking
        const result =await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/imaginxlogo.svg","Logo","Home");
        // if(!result){await takeScreenshotEle(page,"img[alt='logo']","Logo")}
        expect.soft(result).toBeTruthy();
        // Banner video checking
        const videoRes = await isvideoWithSrcPlaying(page,request,testInfo,"https://www.imaginxavr.com/assets/vids/-e753-4fb1-8ee7-af0035d9f693.mp4","BannerVideo","Home",10000,true);
        // if(!videoRes){await takeScreenshotEle(page,"//video","BannerVideo")};
        // expect.soft(videoRes).toBeTruthy();
        // header checking
        const headerCoRes = await elementCoordinates(page,"//h1[contains(normalize-space(),'Empowering Tomorrow')]",370.40625,360,"Header","Home");
        // expect.soft(headerCoRes).toBeTruthy();
        const header = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Empowering Tomorrow')]","MainHeader","Home")
        expect.soft(header).toBeTruthy();
        // paragraph checking
        const para = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'With over a decade of experience in VR/AR/XR technologies')]","para","Home")
        expect.soft(para).toBeTruthy();
        // Experience Innovation button checking
        // const experienceInnovationButton = await elementCheck(page,testInfo,"//a[contains(normalize-space(),'Experience Innovation')]","experienceInnovationButton","Home")
        // expect.soft(experienceInnovationButton).toBeTruthy();
        // if(experienceInnovationButton){
        //                 const res8 = await hoverAndClickWithXpath(page,"//a[contains(normalize-space(),'Experience Innovation')]");
        //                 expect.soft(res8).toBeTruthy();
        //                 // Checking the Contact Us page is open or not
        //                 const contactUsPageHeadr = await elementCheck(page,testInfo,"//h1[contains(normalize-space(),'Contact Us')]","contactUsPageHeadr","ContactUs");
        //                 expect.soft(contactUsPageHeadr).toBeTruthy();
        //                 if(res8){
        //                         // Going back to Home page
        //                         await page.goBack();
        //                         await page.waitForLoadState("load");
        //                         await page.waitForTimeout(1000);
        //                 }      
        // }
        // // Education button checking
        // const EducationButton = await elementCheck(page,testInfo,"//li[normalize-space()='Education']","EducationButton","Home")
        // expect.soft(EducationButton).toBeTruthy();
        // if(EducationButton){
        //     // Jet engine image checking
        //     const jetEngineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/educational.png","JetEngine","Home");
        //     expect.soft(jetEngineImg).toBeTruthy();
        //     // Education Header checking
        //     const educationHeader = await elementCheck(page,testInfo,"//h2[normalize-space()='Revolutionizing Learning']","educationHeader","Home")
        //     expect.soft(educationHeader).toBeTruthy();
        //     // Education Para checking
        //     const educationPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Engage students with experiential learning through VR simulations')]","educationPara","Home")
        //     expect.soft(educationPara).toBeTruthy();
        //     // View more button checking
        //     const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
        //     expect.soft(viewMoreButton).toBeTruthy();
        //     if(viewMoreButton){
        //                 const res7 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
        //                 expect.soft(res7).toBeTruthy();
        //                 if(res7){
        //                         // Checking the Educational page is open or not
        //                         const educationalPageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Immersive Learning')]/span[contains(normalize-space(),'Solutions')])[1]","educationalPageHeadr","Educational");
        //                         expect.soft(educationalPageHeadr).toBeTruthy();
        //                         // Going back to Home page
        //                         await page.goBack();
        //                         await page.waitForLoadState("load");
        //                         await page.waitForTimeout(1000);
        //                 }
        //         }
        // }
        // // Workforce button checking
        // const WorkforceButton = await elementCheck(page,testInfo,"//li[normalize-space()='Workforce']","WorkforceButton","Home")
        // expect.soft(WorkforceButton).toBeTruthy();
        // if(WorkforceButton){
        //     const res6 = await hoverAndClickWithXpath(page,"//li[normalize-space()='Workforce']");
        //     expect.soft(res6).toBeTruthy();
        //     await page.waitForTimeout(1000);
        //     // Ice machine image checking
        //     const iceMachineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/workforce-tab.png","iceMachineImg","Home");
        //     expect.soft(iceMachineImg).toBeTruthy();
        //     // WorkforceHeader checking
        //     const WorkforceHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Training Tomorrow')]","WorkforceHeader","Home")
        //     expect.soft(WorkforceHeader).toBeTruthy();
        //     // WorkforcePara checking
        //     const WorkforcePara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Enhance workforce development with XR solutions designed to upskill')]","WorkforcePara","Home")
        //     expect.soft(WorkforcePara).toBeTruthy();
        //     // View more button checking
        //     const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
        //     expect.soft(viewMoreButton).toBeTruthy();
        //     if(viewMoreButton){
        //                 const res5 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
        //                 expect.soft(res5).toBeTruthy();
        //                 if(res5){
        //                         // Checking the Workforce page is open or not
        //                         const workforcePageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Workforce Development')]/span[contains(normalize-space(),'Solutions')])[1]/parent::*","workforcePageHeadr","Workforce");
        //                         expect.soft(workforcePageHeadr).toBeTruthy();
        //                         // Going back to Home page
        //                         await page.goBack();
        //                         await page.waitForLoadState("load");
        //                         await page.waitForTimeout(1000);
        //                 }      
        //         }
        // }
        //  // Industry button checking
        // const industryButton = await elementCheck(page,testInfo,"//li[normalize-space()='Industry']","industryButton","Home")
        // expect.soft(industryButton).toBeTruthy();
        // if(industryButton){
        //     const res4 = await hoverAndClickWithXpath(page,"//li[normalize-space()='Industry']");
        //     expect.soft(res4).toBeTruthy();
        //     await page.waitForTimeout(1000);
        //     // Cessna machine image checking
        //     const cessnaMachineImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/industry.png","cessnaMachineImg","Home");
        //     expect.soft(cessnaMachineImg).toBeTruthy();
        //     // IndustryHeader checking
        //     const industryHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Optimizing Efficiency')]","industryHeader","Home")
        //     expect.soft(industryHeader).toBeTruthy();
        //     // IndustryPara checking
        //     const industryPara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Boost productivity and efficiency with immersive virtual training')]","industryPara","Home")
        //     expect.soft(industryPara).toBeTruthy();
        //     // View more button checking
        //     const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
        //     expect.soft(viewMoreButton).toBeTruthy();
        //     if(viewMoreButton){
        //                 const res2 = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
        //                 expect.soft(res2).toBeTruthy();
        //                 // Checking the Industrial page is open or not
        //                 const industrialPageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Industrial Training')]/span[contains(normalize-space(),'Solutions')])[1]","industrialPageHeadr","Industrial");
        //                 expect.soft(industrialPageHeadr).toBeTruthy();
        //                 // Going back to Home page
        //                 await page.goBack();
        //                 await page.waitForLoadState("load");
        //                 await page.waitForTimeout(1000);
        //         }
        // }
        //  // Healthcare button checking
        // const healthcareButton = await elementCheck(page,testInfo,"(//li[normalize-space()='Healthcare'])[2]","healthcareButton","Home")
        // expect.soft(healthcareButton).toBeTruthy();
        // if(healthcareButton){
        //     const res1 = await hoverAndClickWithXpath(page,"(//li[normalize-space()='Healthcare'])[2]");
        //     expect.soft(res1).toBeTruthy();
        //     await page.waitForTimeout(1000);
        //     // Heart image checking
        //     const heartImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/healthcare.png","heartImg","Home");
        //     expect.soft(heartImg).toBeTruthy();
        //     // HealthcareHeader checking
        //     const healthcareHeader = await elementCheck(page,testInfo,"//h2[contains(normalize-space(),'Transforming Care')]","healthcareHeader","Home")
        //     expect.soft(healthcareHeader).toBeTruthy();
        //     // HealthcarePara checking
        //     const healthcarePara = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Revolutionize patient care and medical training with our VR simulations')]","healthcarePara","Home")
        //     expect.soft(healthcarePara).toBeTruthy();
        //     // View more button checking
        //     const viewMoreButton = await elementCheck(page,testInfo,"//a[normalize-space()='View More']","viewMoreButton","Home")
        //     expect.soft(viewMoreButton).toBeTruthy();
        //     if(viewMoreButton){
        //                 const res = await hoverAndClickWithXpath(page,"//a[normalize-space()='View More']");
        //                 expect.soft(res).toBeTruthy();
        //                 if(res){
        //                         // Checking the HealthCare page is open or not
        //                         const HealthCarePageHeadr = await elementCheck(page,testInfo,"(//h1[contains(normalize-space(),'Healthcare Training')]/span[contains(normalize-space(),'Solutions')])[1]","HealthCarePageHeadr","HealthCare");
        //                         expect.soft(HealthCarePageHeadr).toBeTruthy();
        //                         // Going back to Home page
        //                         await page.goBack();
        //                         await page.waitForLoadState("load");
        //                         await page.waitForTimeout(1000);
        //                 }    
        //         }
        // }
        // // Maximized ROI image checking
        // const maximizedROIimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/roi.svg","maximizedROIimg","Home");
        // expect.soft(maximizedROIimg).toBeTruthy(); 
        // // Your Long-Term Innovation Partner image checking
        // const YourLongTermInnovationPartnerimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/partner.svg","YourLongTermInnovationPartnerimg","Home");
        // expect.soft(YourLongTermInnovationPartnerimg).toBeTruthy();
        // // Versatile Solutions Across Sectors image checking
        // const versatileSolutionsAcrossSectorsimg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/solution.svg","versatileSolutionsAcrossSectorsimg","Home");
        // expect.soft(versatileSolutionsAcrossSectorsimg).toBeTruthy();
        // // Red Hat Logo image checking
        // const redHatLogoImg = await imageChecking(page,testInfo,"https://www.imaginxavr.com/assets/imgs/redhat-logo.png","redHatLogoImg","Home");
        // expect.soft(redHatLogoImg).toBeTruthy();
        // // Clint Slider checking
        // const clientSlider = page.locator("//div[contains(@id,'swiper-wrapper')]");
        // await clientSlider.waitFor({timeout:40000});
        // expect.soft(clientSlider).toBeVisible();
        // if(await clientSlider.isVisible()){clientSlider.scrollIntoViewIfNeeded();}
        // // Footer logo checking
        // const footerLogo = await elementCheck(page,testInfo,"img[alt='imaginx logo']","FooterLogo","Home");
        // expect.soft(footerLogo).toBeTruthy();
        // // Mail checking
        // const mail = await elementCheck(page,testInfo,"//a[normalize-space()='info@imaginxavr.com']","SiteMail","Home");
        // expect.soft(mail).toBeTruthy();
        // // Copyright text checking
        // const copyrightText = await elementCheck(page,testInfo,"//p[contains(normalize-space(),'Copyright © 2025 • imaginX.')]","Copyrights","Home");
        // expect.soft(copyrightText).toBeTruthy();
        // await page.waitForTimeout(1000);
        // await scrolltoTop(page);
    }else{console.log(`❌ Home Page test got Failed.`);
            expect.soft(false).toBeTruthy();
    }; 
});
