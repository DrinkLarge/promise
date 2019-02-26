const PEDDING = 'pedding';
const RESOLVED = 'resolved';
const REJECTED = 'REJECTED';
function Promise(excutor) {
	const self = this;
	this.state = PEDDING;
	this.value = undefined;
	this.reason = undefined;
	function resolve(value) {
		if (self.state === PEDDING) {
			self.state = RESOLVED;
			self.value = value;
		}
	}
	function reject(reason) {
		if (self.state === PEDDING) {
			self.state = REJECTED;
			self.reason = reason;
		}
	}
	try {
		excutor(resolve, reject);
	} catch (e) {
		reject(e);
	}
}

Promise.prototype.then = function (resolve, reject) {
	if (this.state === RESOLVED) {
		resolve(this.value)
	}
	if (this.state === REJECTED) {
		reject(this.reason)
	}
}
module.exports = Promise;
