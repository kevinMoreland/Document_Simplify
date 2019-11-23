// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');



changeColor.onclick = function(element) {    
    chrome.storage.sync.get('email', function(data) {
        changeColor.innerHTML = "Send Email to Kindle: " + data.email;
        let emailReciever = data.email;
        Email.send({
            SecureToken : "f4d23c20-26bf-43c7-8436-bd27d826a6c0",
            To : emailReciever,
            From : "documentsimplify@gmail.com",
            Subject : "Convert",
            Body : "And this is the body"
        }).then(
        message => alert(message)
    );
    });
    

};
