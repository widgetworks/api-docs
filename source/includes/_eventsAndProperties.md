# Events and Properties


## Host events

```javascript
// Example: send 'wiwo.dido.getData' and 'wiwo.dido.setData' events to a Widget
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.getData']);
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.setData', {...}]);
```
> For more information see: [method calls](#method-calls)


```javascript
// Example: send 'wiwo.dido.getData' and 'wiwo.dido.setData' events to a Widget
// Equivalent to above example but uses synchronous ready function:
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
  iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.getData');
  iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.setData', {...});
}]);
```
> For more information see: [ready functions](#ready-functions)


The following events may be sent from the host page to the Widget:

Event name | Description | Response event from Widget
----------------- | ----------- | --------
[wiwo.dido.getData](#getdata) | Request data from the specified widget | [wiwo.dido.getDataResult](#getdataresult)
[wiwo.dido.setData](#setdata) | Request to set your data payload on the specified widget | [wiwo.dido.setDataResult](#setdataresult)

See [iframeUtil API](#iframeutil-api-reference) for detail on how to [add event listeners](#on) and [send messages to the Widget](#postmessage).


## Widget events

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, result){
  // Handle the event here.
}]);

_wiwo.push(['on', 'wiwo.dido.setDataResult', function(e, result){
  // Handle the event here.
}]);

_wiwo.push(['on', 'pageTrack', function(e, data){
  // Handle the event here.
}]);

_wiwo.push(['on', 'eventTrack', function(e, data){
  // Handle the event here.
}]);
```

The following events may be raised by the Widget and handled on the host page:

Event name   | Description
------------ | ------------
[wiwo.dido.getDataResult](#getdataresult) | Indicates success of failure of preceeding 'wiwo.dido.getData' event. Returns Widget data if successful.
[wiwo.dido.setDataResult](#setdataresult) | Indicates success or failure of preceeding 'wiwo.dido.setData' event.
[pageTrack](#pagetrack) | Analytics event. The user has navigated to a new screen in the Widget.
[eventTrack](#eventtrack) | Analytics event. The user has interacted with the Widget.

See [iframeUtil.on()](#on) for more detail on registering event listeners.



## Event Properties

See [iframeUtil.FrameEvent](#frameevent) for the properties on the `e` parameter in event listeners.

