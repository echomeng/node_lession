var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');

var baseurl = 'https://cnodejs.org/';
superagent.get(baseurl)
    .end(function(err, res){
        if (err) return console.error(err);
        var $ = cheerio.load(res.text);
        var topicurls = [];
        $('#topic_list .topic_title').each(function(index, element){
            var $element = $(element);
            var href = $element.attr('href');
            topicurls.push(url.resolve(baseurl, href));
        });
        var ep = new eventproxy();
        ep.after('topic_comment_url', topicurls.length,function(topics){
            var result = [];
            topics.forEach(function(topic){
                var topicurl = topic[0];
                var commentHTML = topic[1];
                var $ = cheerio.load(commentHTML);
                var onetitle = $('.topic_full_title').text().trim();
                var first_comment = $('.reply_content').eq(0).text().trim();
                result.push({
                    title: onetitle,
                    href: topicurl,
                    first_comment: first_comment
                });
            })
            console.log('finish');
            console.log(result);
        });
        topicurls.forEach(function(topicurl){
            superagent.get(topicurl)
                .end(function(error, res){
                    console.log('fetch '+topicurl+' successful');
                    ep.emit('topic_comment_url', [topicurl, res.text]);
                });
        });
    });