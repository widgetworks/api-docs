# The API

## Overview

Asynchronous API

"ready" listener

```javascript
var _wiwo = _wiwo || [];
var iframeUtil;
_wiwo.push([function(_iframeUtil){
  iframeUtil = _iframeUtil;
}]);
```


## Event listeners

Add event listeners

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'eventName', function(e, data){
  
}]);
```

All event listeners should be registered using the asynchronous `_wiwo.push(['on', ...]);` syntax (see [iframeUtil.on() documentation](#on) for more detail).


## Sending messages

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['postMessage', 'frameId', 'eventName', data]);
```

In our examples "wiwo-bimade"



## Available messages

> getData and setData - easy as that!

```javascript
var _wiwo = _wiwo || [];
_wiwo.push([function(iframeUtil){
  iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.getData');
  iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.setData', {...});
}]);
```

To invoke actions on the Widget, use `iframeUtil.postMessage()`. ([see documentation](#postmessage)).

Ensure you wrap any of these calls in `_wiwo.push([function(){}])` to ensure the `iframeUtil` has been initialised on the page.

Message to Widget | Function | Response event from Widget
----------------- | ----------- | --------
wiwo.dido.getData | Request data from the specified widget | wiwo.dido.getDataResult
wiwo.dido.setData | Request to set your data payload on the specified widget | wiwo.dido.setDataResult



## Event Properties

> Your returned data will be in an object like this

```javascript
{
      wiwoEvent: string, // The name of the event
      frameId: string, // ID of the frame that raised the event
      frame: HTMLIFrameElement // Reference to the iframe DOM element that raised the event
}
```

Property | Type | Details
-------|------|------
event.wiwoEvent | string | The name of the event
event.frameId | string | ID of the frame that raised the event
event.frame | HTMLIFrameElement | Reference to iframe DOM element that raised the event


> And then you can use it to check the result and take action

```javascript
wiwo.iframeUtil_config.ready = function(iframeUtil){
    iframeUtil.on('wiwo.dido.getDataResult', function(event, result){
        if (result.success){
            //your data handling here
            console.log(result.data.output);
        } else {
            //your error handling here
            console.log('Error getting data: ', result.message)
        }
    });
}
```


## Helpers

```javascript
wiwo.iframeUtil.getFrameList()

// returns
 
[
    {
        frameId: string, // ID of the frame
        frame: HTMLIFrameElement // Reference to the iframe DOM element
    },
    // ...
]
```

`wiwo.iframeUtil.getFrameList()` returns a list of all the Widget frames it knows about on a page.



## Get data from widget

> getData provides the full dataset (user inputs and calculated fields) of the Widget

```javascript
  "result": {
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
        //all the input fields
      }
    }
  }
```

`getData` will return you a `result` with two primary objects, the *standard input fields* under `data.input` and the *calculation results* under `data.output`. You can modify the input fields and send it right back for recalculation via `setData`.


> Putting it all together

```javascript
    //setup your event listeners, which will receive data in result
    wiwo.iframeUtil_config = wiwo.iframeUtil_config || {}; //manual namespace in case the support script haven't loaded yet
    wiwo.iframeUtil_config.ready = function(iframeUtil){
      iframeUtil.on('wiwo.dido.getDataResult', function(event, result){
        if (result.success){
          //all result.data.input and result.data.output is available to you
          console.log("You will pay a total of %d interest for the loan",
            result.data.output.repaymentResultModel.totalInterestAmt
          );
        } else {
          //handle the error
          console.log('Error getting data: ', result.message)
        }
      });
    }

    /** 
     * Once the page is ready (which will ensure the Widget is ready and listening too),
     * send a getData request. Once it's fulfilled, a 'wiwo.dido.getDataResult' will be 
     * raised and your listener above will be invoked
     */
    jQuery(function(){
      // Need to make sure the frame content has been loaded. 
      wiwo.iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.getData');
    });
 
```


You can call `getData` at any time. Widgets aim to always be in a consistent state - even if they have to rely on default input values. Internal calculations are always attempted before the `getData` request is fulfilled.

## Set data on the widget

> The data payload you send is the object structure returned by a `getData`, minus the output section.

```javascript
var myData = {
    input: {
        modelName: {
            property: value
            // ...
        },
        modelName: {
            // ...
        }
    }
};
```

> __Example:__ Setting data on the Widget

```javascript

        //setup your event listeners, which will receive data in result
      var wiwo = wiwo || {};
      wiwo.iframeUtil_config = wiwo.iframeUtil_config || {};
      
      wiwo.iframeUtil_config.ready = function(iframeUtil){
        iframeUtil.on('wiwo.dido.setDataResult', function(event, result){
          if (result.success){
            //all result.data.input and result.data.output is available to you
            console.log("Your data was set, run getData to get the calc results");
          } else {
            //handle the error
            console.log('Error getting data: ', result.message)
          }
        });
      }

      /** 
       * Once the page is ready (which will ensure the Widget is ready and listening too),
       * send a setData request with your payload. Once it's fulfilled, 
       * a 'wiwo.dido.setDataResult' will be 
       * raised and your listener above will be invoked
       */
      jQuery(function(){
        // Need to make sure the frame content has been loaded.       
        var myData = {
          id: 'wiwo-repayment-widget', //the product identifier
          version: 0,          //future use
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
        wiwo.iframeUtil.postMessage('wiwo-bimade', 'wiwo.dido.setData', myData);      
      });

```

Using setData, you provide an object to the widget with all the of the standard input fields. Any input field which is usually provided on screen can be set on via the API. Refer to your Widget specific documentation for the input object model.

<aside class="notice">
The input data payload must:

 * follow the `input.modelName` format style that is returned from a getData
 * provide a property `id:string`, the product identifier, specified in your Widget specific documentation. In this case it's *'wiwo-repayment-widget'*
 * provide a property `version:int`, currently defaulted to 0 and will be used in future Widget revisions
 
</aside>

