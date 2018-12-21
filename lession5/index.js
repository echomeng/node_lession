var async = require('async');

var concurrencyCount = 0;
var fetch = function(url, callback){
    var delay = parseInt((Math.random() * 1000000) % 2000, 10); /* 10指定十进制 */
    console.log('现在的并发数量是：',concurrencyCount, '，正在抓取的是：',url, '，耗时：'+delay+'毫秒');
    concurrencyCount++;
    setTimeout(function() {
        concurrencyCount--;
        callback(null, url+' html content');
    }, delay);
};

var urls = [];
for(let i = 0; i < 30; i++) {
    urls.push('http://datasource_'+i);
}
async.mapLimit(urls, 5, function(url, callback){
    fetch(url, callback);
}, function(error, result){
    console.log('final:');
    console.log(result);
});