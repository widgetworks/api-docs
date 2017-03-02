# iframeUtil API Reference

## Summary

> The asynchronous API is accessed via the global `_wiwo` object:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(paramList);
```

> Use the "ready" callback to get a reference to the `iframeUtil` object to call synchronous methods:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
	// Call synchronous methods on `iframeUtil`:
	console.log("Widets on page: ", iframeUtil.getIframes());
}]);
```

The `iframeUtil` is used to facilitate communication between the host page and Widgets loaded on that page.

The `iframeUtil` proivdes an asynchronous API for interacting with the Widgets (based on the [Google Analytics asynchronous syntax](https://developers.google.com/analytics/devguides/collection/gajs/#Syntax)). This API is exposed via the global `_wiwo` object.



The `_wiwo` object acts as a queue that collects API calls until the `iframeUtil` has been loaded and is ready to execute them. To add a call to the queue use the `_wiwo.push` method, passing the method name and parameters for that method:

The `paramList` is an array containing the method name and parameters of the method on the `iframeUtil` you want to invoke.

The first element of `paramList` is the name of the method you want to invoke. The remaining elements are the arguments that will be passed to that method.


### Syntax

`_wiwo.push(paramList)`

Parameter | Type | Description
--------- | ---- | -----------
paramList | array | An array containing information about the command to run once the `iframeUtil` is initialised.


### Description

Once the `iframeUtil` has been initialised on the page any queued commands will invoked in the order they were pushed onto the `_wiwo` queue.

Any commands registered after the `iframeUtil` has been initialised will be invoked immediately.


<aside class="notify">
In all cases `_wiwo.push()` must be passed an array.

The array may queue a "ready" function:

 * `_wiwo.push([function(iframeUtil){...}]);`
 
 
or a method call:

 * `_wiwo.push(['methodName', param1, param2, ...]);`

</aside>



## Ready functions

> Register a "ready" callback:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
  // Work with the initialised `iframeUtil` instance.
}]);
```

It is possible to push function objects onto the `_wiwo` queue. The functions will be invoked in order once the `iframeUtil` has been initialised on the page.

This is useful for calling synchronous methods on the `iframeUtil` once it has been initialised on the page.


### Syntax

`_wiwo.push([callback])`

Parameter | Type | Description
--------- | ---- | -----------
callback  | function | A function that will be invoked once the `iframeUtil` is initalised. The `callback` function will be passed the `iframeUtil` instance as the first parameter.


### Examples

```javascript
// List the Widget iframes that have been loaded onto the page.
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
	var frameList = iframeUtil.getIframes();
	console.log('frameList=', frameList);
}]);
```



## Method calls

### Queue a method call

> Queue up a series of method calls using the asynchronous API:

```javascript
// This event listener will be registered once the `iframeUtil` is initialised.
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.data.getDataResult', function(e, data){
  console.log('getDataResult: data=', data);
}]);

// Register these origins with the `iframeUtil`.
_wiwo.push(['addOrigins', [
	'http://www.example.com',
	'https://www.example.com'
]]);
```

Push a list containing the methodName and parameters for that method:

`_wiwo.push([methodName[, param1[, param2[, ...]]]])`

Parameter | Type | Description
--------- | ---- | -----------
methodName | string | The name of the method to invoke once `iframeUtil` is initialised.
paramN     | any    | The parameters to pass to the method.


The following methods are available on the `iframeUtil`:


## getData()

> Get data from a Widget

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['getData', 'wiwo-bimade', function(e, result){
    if (result.success){
        // Do something with `result.data`
    } else {
        // Check error with `result.message`
    }
}]);
```


### Summary

The `getData()` method lets you easily request data from a Widget.


<aside class="success">
This is the recommended way of retrieving Widget data
</aside>

<aside class="success">
This method may be called asynchronously
</aside>



### Syntax

`iframeUtil.getData(frameId, callbackFn)`

`_wiwo.push(['getData', frameId, callbackFn)`


### Parameters

Property  | Type   | Description
--------- | ------ |------
frameId   | string | The ID of the frame containing the Widget.
callbackFn | Function | A function that will receive the Widget data. See [DiDo Events.getDataResult](#event-getdataresult) for parameter types.



## setData()

> Send new data to a Widget

```javascript
var _wiwo = _wiwo || [];
_wiwo.push([
    'setData',
    'wiwo-bimade', 
    {
      "id": "wiwo-repayment-widget",
      "version": 1,
      
      // This is the data that will be loaded by the Widget:
      // This data is Widget-specific.
      "input": {
        "repaymentModel": {
          "propertyValue": 530000,
          "principal": 424000
        }
      }
    },
    function(e, result){
      if (!result.success){
        // Check error with `result.message`
      }
      
    }
]);
```

### Summary

The `setData()` method lets you easily load new data in a Widget.

<aside class="success">
This is the recommended way of sending new data to a Widget
</aside>

<aside class="success">
This method may be called asynchronously
</aside>



### Syntax

`iframeUtil.setData(frameId, payload, callbackFn)`

`_wiwo.push(['setData', frameId, payload, callbackFn)`


### Parameters

Property  | Type   | Description
--------- | ------ |------
frameId   | string | The ID of the frame containing the Widget.
payload   | [WidgetData](#type-widgetdata) | The data the Widget should load.
callbackFn | Function | A function that will receive the result of the `setData` call. See [DiDo Events.setDataResult](#event-getdataresult) for parameter types.



## addOrigins()


> Add the widget domain as an allowed origin:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(["addOrigins", [
  "http://your-widget-domain",
  "https://your-widget-domain"
]]);
```

```javascript
// Equivalent to above but using a RegExp
var _wiwo = _wiwo | [];
_wiwo.push(['addOrigins', [
	/https?:\/\/your-widget-domain/
]]);
```

### Summary

The `addOrigins()` method allows additional domains to communicate with the host page.

The `iframeUtil` implements a whitelist of domains that are allowed to host Widgets and communicate with the host page. By default only Widgets loaded from the same domain as the host page or loaded from Widget Works Cloud Servers are allowed to send messages to the host page.

If the Widget is self-hosted by the client and served from a different domain to the hosting page then `addOrigins()` should be used to whitelist the client's Widget domain.

<aside class="success">
This method may be called asynchronously
</aside>


### Syntax

`iframeUtil.addOrigins(origin1[, origin2[, ...]])`

`_wiwo.push(['addOrigins', origin1[, origin2[, ...]] ])`


### Parameters

Parameter | Type      | Description
--------- | --------- | -----------
originN | string &#124; string[] &#124; RegExp &#124; RegExp[] | String or RegExp representing Widget hosting domains that are allowed to communication with the host page. The origin values may be strings, RegExp or arrays of these types.



### Note

If the browser's JavaScript console shows the warning:  
`(iframeUtil) ERROR: Invalid event.origin="<your domain here>" with event="wiwoResize"`

Then you should make sure the domain of the hosting page has been added as a valid origin:


## on()

```javascript
// Add an event listener for the `getDataResult` event:
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, data, originalEvent){
	console.log('`getDataResult` event triggered by frame=', e.frameId);
	console.log('`getDataResult` received data=', data);
}]);
```

> Check which Widget raised the event:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, data){
	// Make sure this event came from the 'wiwo-bimade' iframe.
	if (e.frameId != 'wiwo-bimade'){
		// Ignore if not from 'wiwo-bimade'.
		return;
	}
	
	// ... handle the event ...
}]);
```

### Summary

The `on()` method registers an event listener for events raised by any Widget loaded on the host page.

To determine which Widget instance raised the event check the `e.frameId` property.


<aside class="success">
This method may be called asynchronously
</aside>


### Syntax

`iframeUtil.on(eventName, function handler(e, data, originalEvent){...})`

`_wiwo.push(['on', eventName, function handler(e, data, originalEvent){...}])`


### Parameters

Parameter | Type      | Description
--------- | --------- | -----------
eventName | string    | Add the listener for this event.
handler   | function  | The function that will be invoked when the event is raised.



## once()

```javascript
// Add an event listener that will be deregistered after the callback is run.
var _wiwo = _wiwo || [];
_wiwo.push(['once', 'wiwo.dido.getDataResult', function(e, data, originalEvent){
	console.log('`getDataResult` event triggered by frame=', e.frameId);
	console.log('`getDataResult` received data=', data);
}]);
```


### Summary

The `once()` method acts just like [on()](#on) except the event listener will be deregistered after the event has fired.

This means the callback will only be invoked once for a given event.


### Syntax

`iframeUtil.once(eventName, function handler(e, data, originalEvent){...})`

`_wiwo.push(['once', eventName, function handler(e, data, originalEvent){...}])`


### Parameters and handler()

This method accepts the same parameters and handler signature as the [on()](#on) method.



## postMessage()


```javascript
// Request data from the 'wiwo-bimade' Widget iframe.
// The data will be returned via a 'wiwo.dido.getDataResult' event from that iframe.
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.getData']);
```


```javascript
// Set new data on the 'wiwo-bimade' Widget.
// The success/failure result will be returned via a 'wiwo.dido.setDataResult' event.
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.setData', {
	id: 'wiwo-repayment-widget',
    version: 0,
    input: {
        repaymentModel: {
            principle: 150000,
            rate: 0.065
        }
    }
}]);
```


### Summary

The `postMessage()` method sends an event to a Widget loaded inside an iframe.

The Widget is identified by the `targetFrame` parameter.

If any result is expected from the event then it will be triggered asynchronously by the Widget and sent as a new event. e.g. The widget responds to the 'wiwo.dido.getData' event by raising a 'wiwo.dido.getDataResult' event.

<aside class="success">
This method may be called asynchronously
</aside>


### Syntax

`iframeUtil.postMessage(targetFrame, eventName[, data])`

`_wiwo.push(['postMessage', targetFrame, eventName[, data]])`


### Parameters

Parameter   | Type      | Description
---------   | --------- | -----------
targetFrame | string &#124; HTMLIFrameElement | The ID of the frame or IFrame element that should receive this message.
eventName   | string    | The event to send to the iframe. e.g. 'wiwo.dido.getData'
data        | object    | Optional. The data to send with the frame. This is event-specific.




## getIframes()

```javascript
// Call `getIframes()` in the iframeUtil ready function:
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
	var frameList = iframeUtil.getIframes();
	console.log('frameList=', frameList);
}]);

/*
frameList= [
	{
		frame: HTMLIFrameElement,
		frameId: 'wiwo-bimade'
	}
]
*/
```

### Summary

Call `getIframes()` to retrieve a list of all Widget iframes currently registered with the `iframeUtil`.

This method is only available after the `iframeUtil` has been loaded and initialised on the page and should be invoked inside the `iframeUtil` ready function.

<aside class="warning">
This method should be called __synchronously__
</aside>


### Syntax

```javascript
// `getIframes()` result structure:
[
	{
		frame: HTMLIFrameElement,
		frameId: string
	},
	...
]
```

`iframeUtil.getIframes()`


### Description

The `iframeUtil.getIframes()` method returns an array of objects containing a reference to the Widget's iframe element and the ID of the frame.



## getIframeIds()

```javascript
// Call `getIframeIds()` in the iframeUtil ready function:
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
	var frameIds = iframeUtil.getIframeIds();
	console.log('frameIds=', frameIds);
}]);

/*
frameIds= ["wiwo-bimade", ...]
*/
```

### Summary

Call `getIframeIds()` to retrieve a list of all Widget iframe IDs currently registered with the `iframeUtil`.

This method is only available after the `iframeUtil` has been loaded and initialised on the page and should be invoked inside the `iframeUtil` ready function.

<aside class="warning">
This method should be called __synchronously__
</aside>


### Syntax

`iframeUtil.getIframeIds()`


### Description

The `iframeUtil.getIframeIds()` method returns a list of strings.

Each string is the ID of a registered Widget.



## refresh()


```javascript
// Reinitalise a Widget:
var _wiwo = _wiwo || [];
_wiwo.push(['refresh', 'wiwo-bimade']);
```


```javascript
// Call `refresh()` to reinitialise a Widget:
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
	iframeUtil.refresh('wiwo-bimade');
}]);
```

### Summary

Invoke `refresh()` to reinitialise a Widget on the current page.

This will reset and reload the Widget.

<aside class="success">
This method may be called __asynchronously__
</aside>


### Syntax

`iframeUtil.refresh(frameId)`

`_wiwo.push(['refresh', frameId)`



## scrollTo()


```javascript
// Smooth-scroll to a location on-page:
var _wiwo = _wiwo || [];
_wiwo.push(['scrollTo', 100]);

// Scroll to the location in 100ms
_wiwo.push(['scrollTo', {
    to: 200,
    duration: 100
}]);
```


```javascript
// Smooth-scroll an element or Widget into view:
var _wiwo = _wiwo || [];
_wiwo.push(['scrollTo', {
    scrollTarget: '#wiwo-bimade'
}]);

// Scroll element into view in 500ms:
_wiwo.push(['scrollTo', {
    scrollTarget: '#wiwo-bimade',
    duration: 500
}]);
```


### Summary

Invoke `scrollTo()` to scroll the page to a position or element.


<aside class="success">
This method may be called __asynchronously__
</aside>


### Syntax

`iframeUtil.scrollTo(posOrOptions)`

`_wiwo.push(['scrollTo', posOrOptions)`


Parameter | Type | Description
--------- | ---- | -----------
posOrOptions | number or options | If a number then scroll to that position. Where 0 is the top of the page and positive numbers are further down the page.


The options object has this structure:

Property  | Type | Description
--------- | ---- | -----------
to        | number | (optional if `scrollTarget` given) The position to scroll to
scrollTarget | string | (optional if `to` is given) The selector string of the element to scroll into view
duration  | number | The duration, in milliseconds, of the smooth-scroll (default is 750)

NOTE: The `scrollTarget` property should be given as an element selector string (with leading hash: '#wiwo-bimade') as it will be passed to `document.querySelector()`



## scrollBy()


```javascript
// Smooth-scroll a relative amount:
var _wiwo = _wiwo || [];
_wiwo.push(['scrollBy', 100]);
```


```javascript
// Smooth-scroll a relative amount over 100ms:
var _wiwo = _wiwo || [];
_wiwo.push(['scrollBy', {
    to: 100,
    duration: 100
}]);
```


### Summary

Invoke `scrollBy()` to scroll the page by a relative amount.


<aside class="success">
This method may be called __asynchronously__
</aside>


### Syntax

`iframeUtil.scrollBy(posOrOptions)`

`_wiwo.push(['scrollBy', posOrOptions)`


Parameter | Type | Description
--------- | ---- | -----------
posOrOptions | number or options | If a number then scroll by that many pixels from the current location. Larger numbers will scroll further, negative numbers will scroll up the page.


The options object has this structure:

Property  | Type | Description
--------- | ---- | -----------
to        | number | The number of pixels to scroll by (positive is down the page, negative values scroll up the page)
duration  | number | The duration, in milliseconds, of the smooth-scroll (default is 750)



## Type: FrameEvent

```javascript
// FrameEvent structure:
interface FrameEvent {
	"frame": HTMLIFrameElement,	// The Element that raised the event.
	"frameId": string,			// The ID of the element that raised the event.
	"wiwoEvent": string,		// The name of the event.
	"payload": object			// Event-specific data.
}
```


```javascript
// Example FrameEvent object:
{
	"frame": HTMLIFrameElement,	// The Element that raised the event.
	"frameId": "wiwo-bimade",	// The ID of the element that raised the event.
	"wiwoEvent": "wiwo.dido.getDataResult",	// The name of the event.
	"payload": {...}			// Event-specific data.
}
```


```javascript
// Example usage:
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, data){
	// `e` is a `FrameEvent` object.
	// `data` is a `DidoResult` object (event-specific).
}]);
```

### Summary

The `FrameEvent` type is the first parameter returned to the [`on()` event handler](#on).

### Properties

Property  | Type   | Description
--------- | ------ |------
frame     | HTMLIFrameElement | Reference to iframe DOM element that raised the event.
frameId   | string | The ID of the frame that raised the event.
wiwoEvent | string | The name of the event
payload   | object | The data sent from the Widget along with this event. This data is event-specific.

