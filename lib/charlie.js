/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//
// Implements the backoff algo from
// http://dthain.blogspot.com/2009/02/exponential-backoff-in-distributed.html
//
// Let's assume that they delay chosen at any point is based on an initial timeout (T), an exponential
// factor (F), the number of retries so far (N), a random number (R), and a maximum timeout (M).
// Then:
//
//    delay = MIN( R * T * F ^ N , M )
//
// * R should be a random number in the range [1-2], so that its effect is to spread out the load
//   over time, but always more conservative than plain backoff.
//
// * T is the initial timeout, and should be set at the outer limits of expected response time for the
//   service. For example, if your service responds in 1ms on average but in 10ms for 99% of requests,
//   then set t=10ms.
//
// * F doesn't matter much, so choose 2 as a nice round number. (It's the exponential nature that
//   counts.)
//
// * M should be as low as possible to keep your customers happy, but high enough that the system can
//   definitely handle requests from all clients at that sustained rate.
//

'use strict'

var assert = require('assert');

var status = {};

// Collection failure
exports.notok = function(keys) {
    assert.ok(keys, 'Keys not specified');
    var key = keys.join(':');
    var cur = status[key];
    assert.ok(cur, 'No state found');
    cur.count++;
};

// Clear failures
exports.ok = function(keys) {
    assert.ok(keys, 'Keys not specified');
    var key = keys.join(':');
    var curr = status[key];
    assert.ok(curr, 'No state found');
    delete status[key];
};

// Give a go-nogo decision
exports.ask = function(keys, timeout, maxDelay) {
    assert.ok(keys, 'Keys not specified');
    assert.ok(timeout, 'Timeout not specified');
    assert.ok(maxDelay, 'Max delay not specified');

    var key = keys.join(':');
    status[key] = status[key] || {
        start: Date.now(),
        timeout: timeout,
        maxDelay: maxDelay,
        count: 0
    };

    var cur = status[key];
    var diff = Date.now() - cur.start;

    var d = cur.delay || delay(cur.timeout, cur.count, cur.maxDelay);
    if(diff < d && cur.count > 0) {
        cur.state = 'nogo';
        cur.delay = d;
        return {
            state: 'nogo',
            count: cur.count,
            delay: d
        }
    }
    else {
        cur.count = 0;
        cur.state = 'go';
        return {
            state: 'go'
        }
    }
}

function delay(min, count, max) {
    var r = Math.random() + 1;
    return Math.min(r * min * 2^count , max)
}