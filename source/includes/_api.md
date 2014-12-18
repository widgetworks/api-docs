# The API


## Host events

> getData and setData - easy as that!

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.getData']);
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.setData', {...}]);
```

```javascript
// Equivalent to above example:
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
  iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.getData');
  iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.setData', {...});
}]);
```

The following events may be sent from the host page to the Widget:

Event name | Description | Response event from Widget
----------------- | ----------- | --------
[wiwo.dido.getData](#getdata) | Request data from the specified widget | [wiwo.dido.getDataResult](#getdataresult)
[wiwo.dido.setData](#setdata) | Request to set your data payload on the specified widget | [wiwo.dido.setDataResult](#setdataresult)

Ensure you wrap any of these calls in `_wiwo.push([function(){}])` to be sure the `iframeUtil` has been initialised on the page.


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



## Get data from Widget

> __Example:__ Getting data from the Widget.

> 'wiwo.dido.getData' provides the full dataset (user inputs and calculated fields) of the Widget:

```javascript
var _wiwo = _wiwo || [];

// Setup your 'wiwo.dido.getDataResult' event listener:
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(event, result){
  if (result.success){
    // All `result.data.input` and `result.data.output` is available to you:
    console.log("You will pay a total of %d interest for the loan",
      result.data.output.repaymentResultModel.totalInterestPayable
    );
    
    // Log out the entire `result` object.
    console.log("result =", result);
  } else {
    // Handle the error:
    console.log('Error getting data: ', result.message)
  }
}]);

/** 
 * Send a 'wiwo.dido.getData' event to the Wdiget.
 * Once Widget has generated the data a 'wiwo.dido.getDataResult' 
 * event will be raised and your listener above will be invoked.
 */
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.getData']);
```

> Console output from the above example:

```javascript
"You will pay a total of 89094.6689249568 interest for the loan"

result = {
  "data": {
    "output": {       
      "repaymentResultModel": {
        "hasFixedRepayment": false,
        "fixedRepayment": 0,
        "ongoingRepayment": 690.911525212645,
        "totalInterestPayable": 89094.6689249568,
        "totalLoanAmount": 189094.66892495676,
        "loanDuration": {
          "rawPeriods": 300,
          "totalYears": 25,
          "years": 25,
          "periods": 0
        },
        "chartSeries": {
            "lastTerm": 25,
            "repaymentSeries": [
                [
                  0,
                  189094.67
                ]
                //, ....
            ]
          }
      }       

    },
    "input": {
      ...
    }
  }
}
```

`'wiwo.dido.getDataResult'` will return you a [DidoResult](#didoresult). You can modify the `result.data` input fields and send the `result.data` object back for recalculation via `'wiwo.dido.setData'`.

You can call `'wiwo.dido.getData'` at any time after the Widget has been initialised. Widgets aim to always be in a consistent state - even if they have to rely on default input values. Internal calculations are always attempted before the `'wiwo.dido.getData'` request is fulfilled.

See [DiDo Events.getData](#getdata) and [DiDo Events.getDataResult](#getdataresult) for more detail.


## Set data on the Widget

> __Example:__ Setting data on the Widget.

```javascript

      var _wiwo = _wiwo || [];
      // Setup your result event listeners.
      _wiwo.push(['on', 'wiwo.dido.setDataResult', function(event, result){
        if (result.success){
          console.log("Your data was set, run getData to get the calculation results");
        } else {
          console.log('Error setting data. Reason: ', result.message)
        }
      }]);

      /** 
       * When the `iframeUtil` is ready send a 'wiwo.dido.setData' request with your payload. 
       * Once the data has been loaded a 'wiwo.dido.setDataResult' event will be 
       * raised and your listener above will be invoked.
       */
      _wiwo.push([function(iframeUtil){
        var myData = {
          id: 'wiwo-repayment-widget',
          version: 0,
          
          // Only values included here will be changed in the Widget.
          input: {
            repaymentModel: {
              principle: 150000,
              rate: 0.065
              // ...
            }, 
            savingsModel: {
              // ...
            }
          }       
        };      
        iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.setData', myData);      
      }]);
```

> The data payload you send is the `result.data` property returned by 'wiwo.dido.getDataResult', minus the output section.


The `'wiwo.dido.setData'` event will send a payload of data to be loaded by the Widget. This event can be triggered at any time after the Widget has been initailised.

The `'wiwo.dido.setData'` event expects a [WidgetData](#widgetdata) object passed as the `payload` parameter.

You may send a subset of Widget data with the `'wiwo.dido.setData'` event. Any properties that are not defined in the payload will be unchanged in the Widget.

See [DiDo Events.setData](#setdata) and [DiDo Events.setDataResult](#setdataresult) for more detail.

To load data at Widget startup see [Loading values from URL](#loading-values-from-url).
