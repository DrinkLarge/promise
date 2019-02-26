const PEDDING = 'pedding';
const RESOLVED = 'resolved';
const REJECTED = 'REJECTED';
function Promise(excutor) {
	const self = this;
	this.state = PEDDING;
	this.value = undefined;
	this.reason = undefined;
	this.resolveCbs = [];
	this.rejectCbs = [];
	function resolve(value) {
		if (value instanceof Promise) {
			return value.then((data) => {
				resolve(data)
			}, y => {
				reject(y);
			});
		}
		if (self.state === PEDDING) {
			self.state = RESOLVED;
			self.value = value;
			self.resolveCbs.forEach(fn => fn());
		}
	}
	function reject(reason) {
		if (self.state === PEDDING) {
			self.state = REJECTED;
			self.reason = reason;
			self.rejectCbs.forEach(fn => fn());
		}
	}
	try {
		excutor(resolve, reject);
	} catch (e) {
		reject(e);
	}
}
function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('循环引用'))
	}
	let called;//标记状态是否已经改变，因为状态不可逆
	if ((x !== null && typeof x === 'object') || typeof x === 'function') {
		try {
			let then = x.then;
			if (typeof then === 'function') {//promise
				then.call(x, y => {
					if (called) return
					called = true;
					resolvePromise(promise2, y, resolve, reject)
				}, r => {
					if (called) return
					called = true;
					reject(r);
				})
			} else {//普通对象
				if (called) return
				called = true;
				resolve(x);
			}
		} catch (err) {
			if (called) return
			called = true;
			reject(err);
		}
	} else {//常量
		resolve(x);
	}
}
Promise.prototype.then = function (onFulfilled, onRejected) {
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
	onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
	let promise2 = new Promise((resolve, reject) => {
		if (this.state === RESOLVED) {
			setTimeout(() => {
				try {
					let x = onFulfilled(this.value);
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					reject(e)
				}
			}, 0)
		}
		if (this.state === REJECTED) {
			setTimeout(() => {
				try {
					let x = onRejected(this.reason);
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					reject(e)
				}
			}, 0)
		}
		if (this.state === PEDDING) {
			this.resolveCbs.push(() => {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value);
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e)
					}
				}, 0)
			});
			this.rejectCbs.push(() => {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason);
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e)
					}
				}, 0)
			})
		}
	})
	return promise2;
}
Promise.prototype.catch = function (errFn) {
	return this.then(null, errFn)
}
Promise.resolve = function () {
	return new Promise((resolve, reject) => {
		resolve();
	})
}
Promise.reject = function () {
	return new Promise((resolve, reject) => {
		reject();
	})
}
Promise.all = function (values) {
	return new Promise((resolve, reject) => {
		let arr = []; // 最终结果的数组
		let index = 0;
		function processData(key, value) {
			index++;
			arr[key] = value;
			if (index === values.length) { // 如果最终的结果的个数和values的个数相等 抛出结果即可
				resolve(arr);
			}
		}
		for (let i = 0; i < values.length; i++) {
			let current = values[i];
			if (current && current.then && typeof current.then == 'function') {
				// promise
				current.then(y => {
					processData(i, y);
				}, reject)
			} else {
				processData(i, current);
			}
		}
	})
}
Promise.race = function (values) {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < values.length; i++) {
			let current = values[i];
			if (current && current.then && typeof current.then == 'function') {
				// race方法 如果已经成功了 就不会失败了 反之一样
				current.then(resolve, reject)
			} else {
				resolve(current);
			}
		}
	});
}
Promise.deferred = function () {
	let dfd = {};
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	})
	return dfd
}
module.exports = Promise;
