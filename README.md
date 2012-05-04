Charlie is a node module keeps of success and failures of network requests and adises on a delay
between attempts using the backoff algorithm described in [Exponential Backoff in Distributed
Systems](http://dthain.blogspot.com/2009/02/exponential-backoff-in-distributed.html).

This module applies skips upto three failures before starting the backoff.

![Travis status](https://secure.travis-ci.org/ql-io/charlie.png)

## Getting Charlie

    npm install charlie

## Usage

### charlie.ask

Before making a request to an origin, let charlie know. This functiont akes three arguments:

* `keys`: An array of keys used to identify the network resource. For HTTP requests, the keys could
  be the URI of the resource, or the IP address, or the host name etc.
* `initTimeout`: Initial timeout. As suggested in the blog post above, choose a value under which
  99% of requests complete.
* `maxDelay`: Maximum backoff delay. Choose an acceptable value based on availability requirements.

This function returns a decision with three fields:

* `state`: values are `go` or `nogo`
* `count`: number of failures so far. The count is reset after a success.
* `delay`: currently applied backoff delay

Here is an example.

    // Arr is an array of keys used to identify the network resource.
    var decision = charlie.ask(arr, timeout, maxDelay);
    if(decision.state === 'go') {
        // make the request
    }
    else {
        // don't make the request
        console.log('Waiting until ' + decision.delay);
    }

### charlie.ok

When a request succeeds, tell charlie.

    charlie.ok(arr);

### charlie.notok

When the request fails, tell charlie any way.

    charlie.notok(arr);

### charlie.clear

Forget everything about the resource.

    charlie.clear(arr);




