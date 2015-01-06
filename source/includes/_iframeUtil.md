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


#### handler()

The handler function accepts these parameters:

`function(e, data, originalEvent)`

```javascript
// FrameEvent structure:
{
	"frame": HTMLIFrameElement,	// The Element that raised the event.
	"frameId": "wiwo-bimade",	// The ID of the element that raised the event.
	"payload": {...},	// Event-specific data.
	"wiwoEvent": "wiwo.dido.getDataResult"	// The name of the event.
}
```

Parameter | Type       | Description
--------- | ---------  | -----------
e         | [FrameEvent](#frameevent) | Information about the iframe (i.e. Widget) that raised this event.
data      | object     | The data passed with the event. The data is event-specific.
originalEvent | Event  | The original browser event, usually a `MessageEvent` instance [dispatched by `window.postMessage(...)`](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage) inside the Widget.



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



## FrameEvent

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

