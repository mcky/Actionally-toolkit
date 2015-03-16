var fs = require("fs")
var Asana = require('asana')

var userLibrary = process.env.HOME + '/Library'
var actionAllyPath = userLibrary +'/Application\ Support/ActionAlly/action_ally.db'
var dbFile = actionAllyPath
var dbConfig = {
		client: 'sqlite3'
		, connection: { filename: dbFile }
	}
var knex = require('knex')(dbConfig)
var bookshelf = require('bookshelf')(knex)


var Tasks = bookshelf.Model.extend({
	tableName: 'tasks'
})

var today = new Date().toISOString().substring(0, 10)

function rolloverTasks() {
	Tasks
		.query('where', 'status', '=', 'not-done')
		.fetchAll()
		.then(function(tasks){
			var i = 0
			tasks.each(function(task){
				i++
				task.set({
					ordr: i
					, day: today
				})
			})
			res.end(JSON.stringify(tasks))
		})
}

var clearTodaysTasks = function() {
	Tasks
		.query(function(qb) {
			qb
				.where('status', '=', 'not-done')
				.andWhere('day', '=', today)
		})
		.fetchAll()
		.then(function(tasks) {
			tasks.each(function(task){
				console.log(task)
				task.destroy()
			})
		})
}
// clearTodaysTasks()

var todaysTasks = function() {
	Tasks
		.query(function(qb) {
			qb
				.where('status', '=', 'not-done')
				.andWhere('day', '=', today)
		})
		.fetchAll()
		.then(function(tasks) {
			tasks.each(function(task){
				console.log(task.attributes)
			})
		})
}
// todaysTasks()

var newTask = function(taskTitle) {
	new Tasks({
			task: taskTitle
			, detail: null
			, why: null
			, day: today
			// query before, get highest order
			// where date = today, get order
			, status: 'not-done'
		}).save().then(function(model) {
	})
}
// newTask('Hello')
