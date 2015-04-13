# corsaronero
A simple library to find italian torrents using nodejs


```javascript
// remember: piracy is stealing

var _ = require("underscore");
var log = require('winston');
var corsaronero = require("corsaronero");

corsaronero.search('ubuntu', function(results){
    _.each(
        _.sortBy(_.where(results, {type: 'App Linux'}), 'seeds'), function(item){
            log.info(
                "[%s] %s - size: %s date: %s seeds: %d leeches: %d info: %s", 
                item.type, 
                item.filename, 
                item.size, 
                item.date, 
                item.seeds, 
                item.leeches, 
                item.detailsUrl); 
            corsaronero.info(item.detailsUrl, function(details){
                log.info(
                    "magnet url for '%s': %s", 
                    item.filename,
                    details.magnetUrl 
                )
            });
        }
    );
});
```
