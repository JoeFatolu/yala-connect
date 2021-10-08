# Yala Connect.js

Yala Connect is a quick and secure way to link bank accounts to Yala from within your app. Yala Connect is a drop-in framework that handles connecting a financial institution to your app (credential validation, multi-factor authentication, error handling, etc). It works with all major javascript frameworks.

## Requirements

Node 10 or higher.

## Getting Started

1. Register on the [Yala](https://yala-yala.netlify.app) website and get your public and secret keys.

## Installation

You can install the package using NPM or Yarn;

```bash
npm install yala-connect
```

or

```bash
yarn add ala-connect
```

Then import it into your project;

```js
import Connect from "yala-connect";
```

## Usage

Click the links below for detailed examples on how to use connect.js with your favourite framework;

- [`React`](#React)


## Parameters

- [`key`](#key)
- [`tenure`](#tenure)
- [`amount`](#amount)
- [`onSuccess`](#onSuccess)
- [`onClose`](#onClose)
- [`onLoad`](#onLoad)
- [`onEvent`](#onEvent)
- [`reference`](#reference)
- [`setupConfig`](#setupConfig)

### <a name="key"></a> `key`

**Required**  
This is your Yala public API key from the [Yala dashboard](https://app.withyala.com/apps).

```js
new Connect({ key: "yala_public_key" });
```

### <a name="onSuccess"></a> `onSuccess`

**Required**
This function is called when a user has successfully onboarded their account. It should take a single String argument containing the token that can be [exchanged for an account id](#).

```js
new Connect({
	key: "yala_public_key",
	onSuccess: (data) => {
		// in the case of authentication auth code is returned
		console.log("auth code", data.code);
		// in the case of direct debit payments
		// a charge object is return containing amount, transaction_reference, type...
		console.log("charge object", data);
	},
});
```

### <a name="onClose"></a> `onClose`

The optional closure is called when a user has specifically exited the Yala Connect flow (i.e. the widget is not visible to the user). It does not take any arguments.

```js
new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("auth code", code),
	onClose: () => console.log("widget has been closed"),
});
```

### <a name="onLoad"></a> `onLoad`

This function is invoked the widget has been mounted unto the DOM. You can handle toggling your trigger button within this callback.

```js
new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("auth code", code),
	onLoad: () => console.log("widget loaded successfully"),
});
```

### <a name="onEvent"></a> `onEvent`

This optional function is called when certain events in the Yala Connect flow have occurred, for example, when the user selected an institution. This enables your application to gain further insight into the Yala Connect onboarding flow.

See the [data](#dataObject) object below for details.

```js
new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("auth code", code),
	onEvent: (eventName, data) => {
		console.log(eventName);
		console.log(data);
	},
});
```

### <a name="reference"></a> `reference`

This optional string is used as a reference to the current instance of Yala Connect. It will be passed to the data object in all onEvent callbacks. It's recommended to pass a random string.

```js
new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("auth code", code),
	reference: "some_random_string",
});
```

## API Reference

### `setup(config: object)`

This method is used to load the widget onto the DOM, the widget remains hidden after invoking this function until the `open()` method is called.

It also allows an optional configuration object to be passed. When the setup method is called without a config object, the list of institutions will be displayed for a user to select from.

```js
const connect = new Connect({
	key: "yala_public_key",
	tenure: 60,
	amount: 500,
	onSuccess: ({ code }) => console.log("code", code),
	onLoad: () => console.log("widget loaded successfully"),
	onClose: () => console.log("widget has been closed"),
	onEvent: (eventName, data) => {
		console.log(eventName);
		console.log(data);
	},
	reference: "random_string",
});

connect.setup(config);
```

### `open()`

This method makes the widget visible to the user.

```js
const connect = new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("code", code),
});

connect.setup();
connect.open();
```

### `close()`

This method programatically hides the widget after it's been opened.

```js
const connect = new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("code", code),
});

connect.setup();
connect.open();

// this closes the widget 5seconds after it has been opened
setTimeout(() => connect.close(), 5000);
```

### <a name="onEventCallback"></a> onEvent Callback

The onEvent callback returns two paramters, [eventName](#eventName) a string containing the event name and [data](#dataObject) an object that contains event metadata.

```js
const connect = new Connect({
	key: "yala_public_key",
	onSuccess: ({ code }) => console.log("code", code),
	onEvent: (eventName, data) => {
		if (eventName == "OPENED") {
			console.log("Widget opened");
		}
		console.log(eventName);
		console.log(data);
	},
});
```

#### <a name="eventName"></a> `eventName`

Event names corespond to the `type` key returned by the raw event data. Possible options are in the table below.

| Event Name | Description                                        |
| ---------- | -------------------------------------------------- |
| OPENED     | Triggered when the user opens the Connect Widget.  |
| EXIT       | Triggered when the user closes the Connect Widget. |

#### <a name="dataObject"></a> `data`

The data object returned from the onEvent callback.

```js
{
  "reference": "ref_code_passed", // emitted in all events
  "errorType": "ERORR_NAME", // emitted in ERROR
  "errorMessage": "An error occurred.", // emitted in ERORR
}
```

# <a name="React"></a> `React`

## Link account

Link a user account

```js
import React from "react";
import YalaConnect from "yala-connect";

export default function App() {
	const yalaConnect = React.useMemo(() => {
		const yalaInstance = new YalaConnect({
			onClose: () => console.log("Widget closed"),
			onLoad: () => console.log("Widget loaded successfully"),
			onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
			key: "PUBLIC_KEY",
			amount: "amount",
			tenure: "tenure",
		});

		yalaInstance.setup();

		return yalaInstance;
	}, []);

	return (
		<div>
			<button onClick={() => yalaConnect.open()}>Link account with Mono</button>
		</div>
	);
}
```

## Support

If you're having general trouble with Yala Connec or your Yala integration, please reach out to us at <hi@yala.co> or come chat with us on Slack. We're proud of our level of service, and we're more than happy to help you out with your integration to Yala.

## Contributing

If you find any issue using this package please let us know by filing an issue right [here](https://github.com/JoeFatolu/yala-connect/issues).
