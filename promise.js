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
				if (called) return
				called = true;
				then.call(x, y => {
					resolvePromise(promise2, y, resolve, reject)
				}, r => {
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
		setTimeout(() => {
			if (this.state === RESOLVED) {
				let x = onFulfilled(this.value);
				resolvePromise(promise2, x, resolve, reject);
			}
			if (this.state === REJECTED) {
				let x = onRejected(this.reason);
				resolvePromise(promise2, x, resolve, reject);
			}
			if (this.state === PEDDING) {
				this.resolveCbs.push(() => {
					let x = onFulfilled(this.value);
					resolvePromise(promise2, x, resolve, reject);
				});
				this.rejectCbs.push(() => {
					let x = onRejected(this.reason);
					resolvePromise(promise2, x, resolve, reject);
				})
			}
		})
	})
	return promise2;
}
module.exports = Promise;
