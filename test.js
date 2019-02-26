const Promise = require('./promise')
let p = new Promise(function (resolve, reject) {
	console.log('start');
	resolve('success')
})
let promise2 = p.then((data) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(3000)
				}, 1000);
			}))
		}, 1000);
	})
})
promise2.then((value) => {
	console.log(value);
}, (reason) => {
	console.log(reason);
})
