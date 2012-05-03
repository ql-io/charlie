/*
 * Copyright 2012 eBay Software Foundation
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

'use strict'

var charlie = require('../lib/charlie.js');

var source = ['source'];
module.exports = {
    'happy': function(test) {
        var decision = charlie.ask(source, 100, 10000);
        var count = 0;
        var interval = setInterval(function() {
            charlie.ok(source);
            decision = charlie.ask(source, 100, 10000);
            test.equals(decision.state, 'go');
            count++;
            if(count > 5) {
                clearInterval(interval);
                charlie.clear(source);
                test.done();
            }
        }, 100);
    },

    'one fail, try before delay': function(test) {
        var decision = charlie.ask(source, 100, 10000);
        charlie.notok(source);
        setTimeout(function() {
            decision = charlie.ask(source, 100, 10000);
            test.equals(decision.state, 'go');
            charlie.clear(source);
            test.done();
        }, 100)
    },

    'four fails, try before delay': function(test) {
        var decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        setTimeout(function() {
            decision = charlie.ask(source, 200, 10000);
            test.equals(decision.state, 'nogo');
            charlie.clear(source);
            test.done();
        }, 10)
    },

    'fail few, try after delay': function(test) {
        var decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        charlie.notok(source);
        charlie.notok(source);
        decision = charlie.ask(source, 200, 10000);
        setTimeout(function() {
            decision = charlie.ask(source, 200, 10000);
            test.equals(decision.state, 'go');
            charlie.clear(source);
            test.done();
        }, 800)
    },

    'fail, try after delay': function(test) {
        var decision = charlie.ask(source, 200, 10000);
        charlie.notok(source);
        decision = charlie.ask(source, 200, 10000);
        setTimeout(function() {
            decision = charlie.ask(source, 200, 10000);
            test.equals(decision.state, 'go');
            charlie.clear(source);
            test.done();
        }, decision.delay + 1)
    }
}