Charlie is a utility that implements the backoff algorithm described in [Exponential Backoff in
Distributed Systems](http://dthain.blogspot.com/2009/02/exponential-backoff-in-distributed.html).

![Travis status](https://secure.travis-ci.org/ql-io/charlie.png)

The usage is simple. Before making a request to an origin, let charlie know.

    // arr is an array of strings used as a key
    // timeout and maxDelay are in msec
    var decision = charlie.ask(arr, timeout, maxDelay);
    if(decision.state === 'go') {
        // make the request
    }
    else {
        // don't make the request
        console.log('Waiting until ' + decision.delay);
    }

When the request succeeds, let Charlie know.

    charlie.ok(arr);

When the request fails, let Charlie know.

    charlie.notok(arr);





