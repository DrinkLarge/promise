const Promise = require('./promise')
let p = new Promise((resolve, reject) => {
	console.log('start');
	reject('reject')
	resolve('resolve');
});
p.then((data) => {
	console.log(data);
}, (e) => {
	console.log(e);
})
