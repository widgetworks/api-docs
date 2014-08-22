# Error Handling

> The structure of the result object:

``` javascript
	{
		success: boolean,
		message: string,
		data: object
	}
```

> 'getDataResult' detail:

``` javascript
	wiwo.iframeUtil.on('wiwo.dido.getDataResult', function(event, result){
		if (result.success){
			result.message 	// Extra information about the result (can be empty).
			result.data;	// Holds the Widget's input and result data.
		} else {
			result.message 	// Error message.
			result.data;	// Will be null.
		}
	});
```

> 'setDataResult' detail:

``` javascript
	wiwo.iframeUtil.on('wiwo.dido.setDataResult', function(event, result){
		if (result.success){
			result.message 	// Holds information about 'setData' request (can be empty).
			result.data;	// Will be null.
		} else {
			result.message 	// Holds information about the error.
			result.data;	// Will be null.
		}
	});
```

Widgets do their best to keep in a consistent state and ensure they don't show complex or code related errors to users. We design them to accept a wide range of inputs, but to ensure accuracy they are conservative in their approach to error handling - they will reject data on error and provide you a result object detailing what went wrong.

<aside class="notice">Widgets do their best to keep in a consistent state and ensure they don't show complex or code related errors</aside>



## Data issues

Widgets pre-process all input data and perform type conversion and internal lookups before calculating or displaying the data you give them. If lookups are invalid or outdated (eg. when you try to look up an outdated product) the widget will log errors and return the error information in the result object.

Most of the time you will still get a calculation value back from `getDataResult`, but it will use internal defaults for fields with errors.

## Missing required data

Required values that are not supplied will be logged to console and in the result object.


## Invalid datatypes

Simply rejected


## Outdated/invalid lookup references (ie Product names)

You control all product information and settings from your Widget Manager account so you must ensure you keep any external references to product keys up to date. If you try and set data with references to a product which doesn't exist the Widget will either default to the first applicable in the list or reject your set data.

