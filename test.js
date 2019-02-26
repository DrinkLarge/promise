const Promise = require('./promise')
let p = new Promise((resolve, reject) => {
	console.log('start');
	setTimeout(() => {
		resolve('resolve');
	}, 1000)
});
p.then((data) => {
	console.log(data);
}).then((data) => {
	console.log('success' + data);
}, (e) => {
	console.log('error' + e);
})
