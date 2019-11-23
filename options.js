// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

function constructOptions(kButtonColors) {
    let button = document.getElementById('submitButton');
    
    button.addEventListener('click', function() {
        var nameValue = document.getElementById("email").value;
        chrome.storage.sync.set({email: nameValue}, function() {
            console.log('color is ' + nameValue);
      })
    });
    
    page.appendChild(button);
}

constructOptions(kButtonColors);
