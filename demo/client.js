var http = require('http'),
    EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

var server = http.createServer(function (req, res, proxy) {
    emitter.on('done', function (e) {
        if(e) {
            res.writeHead(502);
            res.end();
        }
        else {
            res.writeHead(200);
            res.end();
        }
    })
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.8.0&GLOBAL-ID=EBAY-US&SECURITY-APPNAME=Qlio1a92e-fea5-485d-bcdb-1140ee96527&RESPONSE-DATA-FORMAT=XML&REST-PAYLOAD=&keywords=mini%20cooper&paginationInput.entriesPerPage=10&paginationInput.pageNumber=1&outputSelector(0)=SellerInfo&sortOrder=',
        method: 'GET'
    };

    var happy = false;
    var clientReq = http.request(options, function (clientRes) {
        happy = true;
        emitter.emit('done');
    });
    clientReq.setTimeout(1200, function () {
        if(happy) {
            console.log('in timeout');
        }
        emitter.emit('done', {
            message: 'timeout'
        });
    });
    clientReq.on('error', function () {
        console.log('in error');
        clientReq.connection.destroy();
        emitter.emit({
            message: 'error'
        });
    })
    clientReq.end();
});

server.listen(3000);

