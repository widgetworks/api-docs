# Data in/Data out

__Note:__ all of the events and response events are asynchronous.


## getData

```javascript
// Post a message to request data from a Widget:
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'wiwo-bojumo', 'wiwo.dido.getData']);
```


### Summary

The `'wiwo.dido.getData'` event is sent from the _host page_ to a _Widget_.

The Widget will respond with a `wiwo.dido.getDataResult` event. See [__wiwo.dido.getDataResult__](#getdataresult) for detail on the response event.


### Syntax

`iframeUtil.postMessage(frameId, 'wiwo.dido.getData');`

`_wiwo.push(['postMessage', frameId, 'wiwo.dido.getData']);`


Parameter           | Type   | Description
------------------- | ------ | -------------
frameId             | string | The ID of the Widget that will receive the event.
'wiwo.dido.getData' | string | The eventName.

Widget responds with [__wiwo.dido.getDataResult__](#getdataresult) event.



## getDataResult


```javascript
// `wiwo.dido.getDataResult` listener:
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, result){
  if (result.success){
    console.log('Received data from Widget ID=', e.frameId, ', data=', result.data);
  } else {
    console.warn('Unable to get data from Widget ID=', e.frameId, ', reason=', result.message);
  }
}]);
```


### Summary

The `'wiwo.dido.getDataResult'` event is sent from a _Widget_ to the _host page_ in response to a ['wiwo.dido.getData'](#getdata) request.


### Listener

`_wiwo.push(['on', 'wiwo.dido.getDataResult', function handler(e, result){...}])`

#### Handler parameters

Parameter | Type | Description
--------- | ---- |-------------
e         | FrameEvent | See the [iframeUtil.on() documentation](#on) for the `FrameEvent` structure.
result    | object     | `DidoResult` object. See [DidoResult](#didoresult) for detail.


```javascript
// Example `DidoResult` success structure
{
	"success": true,
	"message": '',
	"data": {
		"id": "wiwo-repayment-widget",
		"version": 1,
		"input": {
			... Widget-specific properties ...
		},
		"output": {
			... Widget-specific properties ...
		}
	}
}
```

__Note:__ The `result.data` object structure is Widget-specific.



## setData

> Example 'wiwo.dido.setData' call:

```javascript
// The Widget will respond with a 'wiwo.dido.setDataResult' event.
var _wiwo = _wiwo || [];
_wiwo.push('postMessage', 'wiwo-bojumo', 'wiwo.dido.setData', {
	"id": "wiwo-repayment-widget",
	"version": 1,
	"input": {
		"repaymentModel": {
			"propertyValue": 530000,
			"principal": 424000
		}
	}
});
```

### Summary

Send `'wiwo.dido.setData'` the event to a _Widget_ to trigger it to load data.

The Widget will respond with a [wiwo.dido.setDataResult](#setdataresult) event.


### Syntax

`iframeUtil.postMessage(frameId, 'wiwo.dido.setData', payload)`

`_wiwo.push(['postMessage', frameId, 'wiwo.dido.setData', payload])`


Parameter           | Type   | Description
------------------- | ------ | -------------
frameId             | string | The ID of the Widget that will receive the event.
'wiwo.dido.setData' | string | The eventName.
payload             | object | The data to be loaded by the Widget. This data is Widget-specific.




## setDataResult

```javascript
// `wiwo.dido.setDataResult` listener:
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.setDataResult', function(e, result){
  if (result.success){
    console.log('Successfully loaded data into Widget ID=', e.frameId);
  } else {
    console.warn('Unable to set data on Widget ID=', e.frameId, ', reason=', result.message);
  }
}]);
```

Response event | Result
-------------- | -----------
wiwo.dido.setDataResult | result object with `result.data.input`, the values you called setData with



## DidoResult

> `DidoResult` type structure:

```javascript
{
	"success": boolean,
	"message": string,
	"data": object
}
```



> Example `DidoResult` success structure:

```javascript
{
	"success": true,
	"message": '',
	"data": {
		"id": "wiwo-repayment-widget",
		"version": 1,
		"input": {
			... Widget-specific properties ...
		},
		"output": {
			... Widget-specific properties ...
		}
	}
}
```


> Example `DidoResult` failure structure:

```javascript
{
	"success": false,
	"message": 'Widget has not been initialised yet.',
	"data": null
}
```

### Summary

The `DidoResult` object is returned by the ['wiwo.dido.getDataResult'](#getdataresult) and ['wiwo.dido.setDataResult'](#setdataresult) event listeners.

It is used to indicate if the preceeding `'wiwo.dido.getData'` or `'wiwo.dido.setData'` event was successful and to return any data that may be associated with the event.


### Properties

Property | Type | Description
-------- | ---- | -----------
success  | boolean | Indicates if the 'getData' or 'setData' request was successful.
message  | string  | Will be an empty string if `success` is true. Otherwise holds the error message explaining why the request failed.
data     | object &#124; [WidgetData](#widgetdata)  | Widget-specific response data. Will be `null` if `success` is false.


## WidgetData

> `WidgetData` type structure:

```javascript
{
	"id": string,
	"version": number,
	"input": object,
	"output": object
}
```

> Example `WidgetData` structure:

```javascript
{
	"id": "wiwo-repayment-widget",
	"version": 1,
	"input": {
		... Widget-specific properties ...
	},
	"output": {
		... Widget-specific properties ...
	}
}
```

### Summary

The `WidgetData` object is used to describe the input and output data belonging to a Widget.

The `WidgetData` is returned as the `result.data` property (see [DidoResult](#didoresult)) with the [wiwo.dido.getDataResult](#getdataresult) event.

A `WidgetData` object is passed to a Widget as the `payload` parameter with the [wiwo.dido.setData](#setdata) event.


### Properties

Property | Type   | Description
-------- | ------ | -----------
id       | string | Identifies the type of Widget that generated or should receive this data. Used by the Widget to verify the expected data structure.
version  | number | An integer that indicates the version of this Widget data structure. The version number is determined by the Widget that generated the data object. When loading data this value is used to validate the expected data structure. If the version number is larger than the version expected by the Widget it will be rejected.
input     | object  | Optional. Widget-specific input data.
output    | object  | Optional. Widget-specific result data.

__Note:__ Whilst the `id` and `version` properties are required, any other properties on `WidgetData` are Widget-specific. The previous table should be used as a general guide only - see Widget-specific documentation to see if the structure differs for that Widget.
