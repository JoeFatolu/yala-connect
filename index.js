"use strict";

var utils = require("./utils");
const anonFunc = () => {};
const isRequired = (name) => {
	throw new Error(`${name} is required`);
};

/**
 * This function creates a connect object and returns it's properties
 * @param {*} key public key gotten from yala dashboard - REQUIRED
 * @param {*} options optional params functions the be invoked on success, on load and on close
 */
function connect({
	key,
	onClose = anonFunc,
	onSuccess,
	onLoad = anonFunc,
	onEvent = anonFunc,
	...rest
}) {
	if (!(this instanceof connect))
		return new connect({
			key,
			onClose,
			onSuccess,
			onLoad,
			onEvent,
			...rest,
		});

	this.key = key || isRequired("PUBLIC_KEY");
	this.tenure = key || isRequired("TENURE");
	this.loanAmount = key || isRequired("LOANAMOUNT");
	this.config = { ...rest };
	connect.prototype.onLoad = onLoad;
	connect.prototype.onClose = onClose;
	connect.prototype.onSuccess = onSuccess || isRequired("onSuccess callback");
	connect.prototype.onEvent = onEvent;

	connect.prototype.utils = utils();
}

/**this is the entry function to setup the connect widget */
connect.prototype.setup = function (setup_configuration = {}) {
	connect.prototype.utils.addStyle();
	const qs = { ...this.config, ...setup_configuration };

	connect.prototype.utils.init({
		key: this.key,
		qs: qs,
		tenure: this.tenure,
		onload: this.onLoad,
		onevent: this.onEvent,
	});
};

connect.prototype.reauthorise = function (reauth_token) {
	if (!reauth_token) {
		throw new Error("Re-auth token is required for reauthorisation");
	}

	connect.prototype.utils.addStyle();
	connect.prototype.utils.init({
		key: this.key,
		qs: { ...this.config, reauth_token },
		onload: this.onLoad,
		onevent: this.onEvent,
	});
};

/**connect object property to open widget/modal */
connect.prototype.open = function () {
	connect.prototype.utils.openWidget();
	function handleEvents(event) {
		switch (event.data.type) {
			case "yala.connect.widget_opened":
				this.onEvent("OPENED", event.data.data);
				break;
			case "yala.connect.error_occured":
				this.onEvent("ERROR", event.data.data);
				break;
			case "yala.connect.institution_selected":
				this.onEvent("INSTITUTION_SELECTED", event.data.data);
				break;
			case "yala.connect.on_exit":
				this.onEvent("EXIT", event.data.data);
				break;
			case "yala.connect.widget.closed":
				this.onEvent("EXIT", event.data.data);
				connect.prototype.close(); // close widget on success
				break;
			case "yala.connect.login_attempt":
				this.onEvent("SUBMIT_CREDENTIALS", event.data.data);
				break;
			case "yala.connect.account_linked":
				this.onEvent("ACCOUNT_LINKED", event.data.data);
				this.onSuccess({ ...event.data.data });
				connect.prototype.close(); // close widget on success
				break;
			case "yala.connect.account_selected":
				this.onEvent("ACCOUNT_SELECTED", event.data.data);
				break;
			default:
		}
	}
	connect.prototype.eventHandler = handleEvents.bind(this);
	window.addEventListener("message", this.eventHandler, false);
};

/**connect object property to hide modal and clean up to avoid leak */
connect.prototype.close = function () {
	window.removeEventListener("message", this.eventHandler, false);
	connect.prototype.utils.closeWidget();
	this.onClose();
};

// Do not attach connect to window when imported server side.
// This makes the module safe to import in an isomorphic code base.
if (typeof window !== "undefined") {
	window.Connect = connect;
}

module.exports = connect;
