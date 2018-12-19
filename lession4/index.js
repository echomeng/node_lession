var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');

var baseurl = 'https://cnodejs.org/';
superagent.get(baseurl)
    .end(function(err, res){
        if(err) return console.error(err);
        var topicURLs = [];
        var $ = cheerio.load(res.text);
        $('#topic_list .topic_title').each(function(idx, element){
            var $element = $(element);
            var href = url.resolve(baseurl, $element.attr('href'));
            topicURLs.push(href);
        });

        var ep = new eventproxy;
        ep.after('topic_html', topicURLs.length, function(topics){
            topics = topics.map(function(topicPair){
                var topicURL = topicPair[0];
                var topicHTML = topicPair[1];
                var $ = cheerio.load(topicHTML);
                return ({
                    title: $('.topic_full_title').text().trim(),
                    herf: topicURL,
                    comment: $('.reply_content').eq(0).text().trim(),
                });
            });
            console.log('final:');
            console.log(topics);
        });
        topicURLs.forEach(function(topicurl){
            superagent.get(topicurl)
                .end(function(err, res){
                    console.log('fetch'+topicurl+'successful');
                    ep.emit('topic_html', [topicurl, res.text]);
                });
        });
    });