var path = require('path');
var remote = require('electron').remote;
var dialog = remote.require('dialog');
var fs = require('fs');
var app = remote.app;

function showMyMessage() {
    remote.dialog.showMessageBox({ message: 'test', buttons: ["OK"] });
}