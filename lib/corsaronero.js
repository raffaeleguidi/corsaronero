module.exports = {
    search: function(query, cb) {
        search(query, cb);
    },
    info: function(url, cb) {
        info(url, cb);
    }
}

var request = require('request');
var cheerio = require('cheerio');

function toGB(item) {
    var tmp = parseFloat(item);
    if (item.toLowerCase().indexOf("tb") > 0) {
        tmp*=1024;
    } else if (item.toLowerCase().indexOf("gb") > 0) {
        // leave it as is
    } else if (item.toLowerCase().indexOf("mb") > 0) {
        tmp/=1024;
    } else if (item.toLowerCase().indexOf("kb") > 0) {
        tmp/=(1024*1024);
    }
    return tmp;
}

function loadDetails(body){
    $ = cheerio.load(body);
    var details = {
        magnetUrl: $('a.forbtn').attr('href')
    }
    return details;
}

function info(url, cb) {
    request(url, function (error, response, body) {
        var details = loadDetails(response.body);
        cb(details);
    });
}

function search(query, cb) {
    var results = new Array();
    request('http://ilcorsaronero.info/argh.php?search=' + encodeURIComponent(query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(response.body);
            var sizes=$('font[size="-2"][color="#FF6600"]');
            var dates=$('font[color="#669999"]');
            var classes=$('a.red');

            $('a.tab').each(function(i, elem) {
                var row = elem.parent.parent;
                var filename=$(this).text();
                var detailsUrl = $(this).attr('href');
                var size = $(sizes.get(i)).text();
                var date = $(dates.get(i)).text();
                var type = $(classes.get(i)).text();
                var seeds = $($(row).find("td").get(5)).text();
                var leeches = $($(row).find("td").get(6)).text();
                var item = {
                    filename: filename,
                    size: size,
                    sizeInGB: toGB(size),
                    date: date,
                    type: type,
                    seeds: parseInt(seeds),
                    leeches: parseInt(leeches),
                    detailsUrl: detailsUrl
                }
                results.push(item);
            });
            cb(results);
        }
    });
}
