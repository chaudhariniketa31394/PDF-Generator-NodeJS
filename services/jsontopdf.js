var json2xls = require('json2xls');
var xlsx = require('xlsx');
var fs = require('fs');
const path = require('path');
const utils = require('util')
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile)

// const readFile = utils.promisify(fs.readFile)




 function getAttachments (req, res, next) { 
        var json = {
            foo: 'bar',
            qux: 'moo',
            poo: 123,
            stux: new Date()
        }
        
        var xls = json2xls(json);
        console.log("xls",xls)
        
        fs.writeFileSync('data.xlsx', xls, 'binary');
        //fs.writeFileSync('prediction.html', data, 'utf8') 
        var wb = xlsx.readFileSync('data.xlsx');
        var sheetName = wb.SheetNames[0];
        var sheetValue = wb.Sheets[sheetName]
        var htmlData = xlsx.utils.sheet_to_html(sheetValue);
        writeData(htmlData);
        // fs.writeFileSync('exceltoHtml.html',htmlData,'utf8')
        // generatePdf();
        
    }
    var generatePdf  = async (req, res, next) => {

    let data = {};

    getTemplateHtml()
        .then(async (res) => {

            console.log("Compiing the template with handlebars")
            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;

            const browser = await puppeteer.launch();
            const page = await browser.newPage()

            await page.setContent(html)

            await page.pdf({ path: 'prediction.pdf', format: 'A4' })

            await browser.close();
            console.log("PDF Generated")

        })
        .catch(err => {
            console.error(err)
        });
}




async function getTemplateHtml() {

    console.log("Loading template file in memory")
    try {
        const invoicePath = path.resolve("prediction.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject("Could not load html template");
    }
}
// var getTemplateHtml = async (req, res, next) => {

//     console.log("Loading template file in memory")
//     try {
//         fs.readFile('prediction.html', 'utf8',(err,data)=>{
//             if(err) console.log("errrrrrrrrrr",err)
//             else console.log(data);
//             });
//         // path.resolve("prediction.html",(err,data)=>{
//         //     if(err){
//         //         console.log("rrrrrrrrrrrrrrrrrrrrrrr",err)
               
//         //     }
//         //     else{
//         //         return  fs.readFile(invoicePath, 'utf8');
//         //     }
//         // });
       
//     } catch (err) {
//         console.log("inside catch",err)
//         return err;
//     }
// }

var writeData = (data) =>{
    try {
        fs.writeFileSync('prediction.html', data, 'utf8') 
        console.log("COMPLETED");  
        generatePdf(); 
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    myFunction: getAttachments
  };




