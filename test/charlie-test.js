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

module.exports = {
    'happy': function(test) {
        var decision = charlie.ask(['source1'], 100, 10000);
        var count = 0;
        var interval = setInterval(function() {
            charlie.ok(['source1']);
            decision = charlie.ask(['source1'], 100, 10000);
            test.equals(decision.state, 'go');
            count++;
            if(count > 5) {
                clearInterval(interval);
                test.done();
            }
        }, 100);
    },

    'one fail, try before delay': function(test) {
        var decision = charlie.ask(['source2'], 100, 10000);
        charlie.notok(['source2']);
        setTimeout(function() {
            decision = charlie.ask(['source2'], 100, 10000);
            test.equals(decision.state, 'nogo');
            test.done();
        }, 100)
    },

    'fail few, try after delay': function(test) {
        var decision = charlie.ask(['source3'], 200, 10000);
        charlie.notok(['source3']);
        charlie.notok(['source3']);
        charlie.notok(['source3']);
        decision = charlie.ask(['source3'], 200, 10000);
        setTimeout(function() {
            decision = charlie.ask(['source3'], 200, 10000);
            test.equals(decision.state, 'go');
            test.done();
        }, 800)
    },

    'fail, try after delay': function(test) {
        var decision = charlie.ask(['source4'], 200, 10000);
        charlie.notok(['source4']);
        decision = charlie.ask(['source4'], 200, 10000);
        setTimeout(function() {
            decision = charlie.ask(['source4'], 200, 10000);
            test.equals(decision.state, 'go');
            test.done();
        }, decision.delay + 1)
    }
}