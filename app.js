const fs = require('fs');

const request = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');

charset(request);




const rootUrl = 'http://office.wuxi.fang.com/';
const minArea = 110;
const maxArea = 200;
const maxTotalPrice = 6000;


const infoList = [];


function getDatas(url) {
    request
    .get(url)
    .charset('gb2312')
    .end(function(err, res) {
        if (err || !res.ok) {
            console.log('=== error ===');
            return;
        }

        const $ = cheerio.load(res.text);
        const $domItems = $('.houseList .list');

        $domItems.each((i, item) => {
            const $this = $domItems.eq(i).find('.info');
            const info = {
                link: rootUrl + $this.find('.title a').attr('href'),
                title: $this.find('.title a').attr('title'),
                build: $this.find('.spName').text().trim(),
                location: $this.find('.spAddr').attr('title'),
                area: parseFloat($this.find('.area').text()),
                price: parseFloat($this.find('.price').text()),
            };

            if(info.area >= minArea
            && info.area <= maxArea
            && (info.price * info.area) <= maxTotalPrice) {
                console.log('==========', info);

                infoList.push(info);
            }
        });

        const nextBtn = $('#PageControl1_hlk_next');
        if(nextBtn.length !== 0) {
            const targetUrl = rootUrl + nextBtn.attr('href');

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
        console.log('==========end');
    });
}

getDatas(rootUrl);
