var http = require('http');
var Asana = require('asana');

function todaysAsanaTasks(callback) {
	var asanaKey = process.env.ASANA_API_KEY
		, client = Asana.Client.create().useBasicAuth(asanaKey)
		, data = []

	getData = function(user, offset) {
		var userId = user.id
			, workspaceId = user.workspaces[0].id
			, params = {
				assignee: userId,
				workspace: workspaceId,
				completed_since: 'now',
				opt_fields: 'id,name,assignee_status,completed'
			}
		if (offset !== null) {
			params.offset = offset
		}
		var tasks = client.tasks.findAll(params);

		tasks.then(function(dataForMe) {
			data = data.concat(dataForMe.data)

			if (dataForMe.next_page !== null) {
				getData(user, dataForMe.next_page.offset)
			} else {
				display()
			}
		})
	}

	filterData = function(obj) {
		return obj.assignee_status === 'today'
	}

	display = function() {
		var todaysTasks = data.filter(filterData)
		// return todaysTasks
		callback(todaysTasks)
	}

	client.users.me().nodeify(function(err, result){
		getData(result)
	})
}

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/JSON'});
	todaysAsanaTasks(function(tasks) {
		res.end(JSON.stringify(tasks))
	})
}).listen(1337, '127.0.0.1');
