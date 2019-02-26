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
Promise.prototype.then = function (onFulfilled, onReject) {
	let promise2 = new Promise((resolve, reject) => {
		if (this.state === RESOLVED) {
			let x = onFulfilled(this.value);
			resolve(x);
		}
		if (this.state === REJECTED) {
			let x = onReject(this.reason);
			reject(x);
		}
		if (this.state === PEDDING) {
			this.resolveCbs.push(() => {
				let x = onFulfilled(this.value);
				resolve(x);
			});
			this.rejectCbs.push(() => {
				let x = onReject(this.reason);
				reject(x);
			})
		}
	})
	return promise2;
}
module.exports = Promise;
