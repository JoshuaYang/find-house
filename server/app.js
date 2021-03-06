const fs = require('fs');
const url = require('url');

const request = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');

charset(request);




const rootUrl = 'http://office.wuxi.fang.com/zu/house/j3100/';
const minArea = 110;
const maxArea = 200;
const maxTotalPrice = 6000;


const infoList = [];
const unionChecker = new Set();


function getDatas(urlPath) {
    request
    .get(urlPath)
    .charset('gb2312')
    .end(function(err, res) {
        if (err || !res.ok) {
            console.log('=== error ===', err.message);
            return;
        }

        console.log(`process urlPath: ${urlPath}`);

        const $ = cheerio.load(res.text);
        const $domItems = $('.houseList .list');

        $domItems.each((i, item) => {
            const $this = $domItems.eq(i).find('.info');
            const info = {
                link: url.resolve(rootUrl, $this.find('.title a').attr('href')),
                title: $this.find('.title a').attr('title'),
                build: $this.find('.spName').text().trim(),
                location: $this.find('.spAddr').attr('title'),
                area: parseFloat($this.find('.area').text()),
                price: parseFloat($this.find('.price').text()),
            };

            if(info.area >= minArea
            && info.area <= maxArea
            && (info.price * info.area) <= maxTotalPrice) {

                if(!unionChecker.has(info.title)) {
                    unionChecker.add(info.title);
                    infoList.push(info);
                }
            }
        });

        const nextBtn = $('#PageControl1_hlk_next');
        if(nextBtn.length !== 0) {
            const targetUrl = url.resolve(rootUrl, nextBtn.attr('href'));

            getDatas(targetUrl);
        } else {
            writeToFile();
        }
    });
}

function writeToFile() {
    const output = {
        result: infoList,
    };

    fs.writeFile('output.json', JSON.stringify(output), 'utf8', function(){
        console.log('fetch over');
    });
}

getDatas(rootUrl);
