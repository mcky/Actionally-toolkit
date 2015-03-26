#!/usr/bin/env node

var fs = require("fs")
var path = require('path')
var exec = require('child_process').exec
var program = require('commander')

var userLibrary = process.env.HOME + '/Library'
var plistName = 'co.rossmackay.actionallyrollover'
var plistPath = userLibrary +'/LaunchAgents/' + plistName + '.plist'
var script = path.join(__dirname, './run.js')

var launcher = function(toggle) {
	var load = toggle ? 'load' : 'unload'
	var launchCmd = 'launchctl ' + load + ' -w ' + plistPath

	exec(launchCmd, function (err, data) {
		if(err) console.log(err)
	})
}

var generatePlist = function() {
	var plist = '' +
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
		'<plist version="1.0">\n' +
		'<dict>\n' +
		'	<key>Label</key>\n' +
		'	<string>'+ plistName +'</string>\n' +
		'	<key>ProgramArguments</key>\n' +
		'	<array>\n' +
		'		<string>/usr/local/bin/node</string>\n' +
		'		<string>'+ script +'</string>\n' +
		'	</array>\n' +
		'	<key>StartCalendarInterval</key>\n' +
		'	<dict>\n' +
		'		<key>Hour</key>\n' +
		'		<integer>0</integer>\n' +
		'		<key>Minute</key>\n' +
		'		<integer>10</integer>\n' +
		'	</dict>\n' +
		// '	<key>StartInterval</key>\n' +
		// '	<integer>20</integer>\n' +
		'</dict>\n' +
		'</plist>'

	// > sudo chown root co.rossmackay.actionallyrollover.plist
	// > sudo chmod 644 co.rossmackay.actionallyrollover2.plist
	fs.writeFile(plistPath, plist, function(err) {
		if(err) {
			return console.log(err)
		}
		console.log('Saved')
		launcher(true)
	})
}

var install = function() {
	// generatePlist()
	// launcher(true)
}

program
  .version('0.0.1')

program
	.command('install')
	.description('install and start the script')
	.action(function(env, options){
		generatePlist()
	})

program
	.command('start')
	.description('starts the script')
	.action(function(env, options){
		launcher(true)
		console.log('Started')
	})

program
	.command('stop')
	.description('stops the script')
	.action(function(env, options){
		launcher(false)
		console.log('Stopped')
	})

program.parse(process.argv)
