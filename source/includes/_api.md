# The API

## Available messages

> getData and setData - easy as that!

```javascript
  jQuery(function(){
    wiwo.iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.getData');
    wiwo.iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.setData');
  )};
```

Message | Function
---------- | -----------
wiwo.dido.getData | queues a request to get data from the specified widget
wiwo.dido.setData | queues a request to set your data payload on the specified widget

To invoke actions on the Widget, use `wiwo.iframeUtil.postMessage`. Ensure you wrap any of these calls in `jQuery(function(){})` to ensure `wiwo.iframeUtil` is ready and that the Widget has fully loaded and waiting for your messages.


## Response events

Event | Result
---------- | -----------
'wiwo.dido.getDataResult' | result object with `result.data.output` and `result.data.input`
'wiwo.dido.setDataResult' | result object with `result.data.input`, the values you called setData with

All event listeners and callbacks need to be setup in the context of `wiwo.iframeUtil_config.ready`, which ensures your functions are only run once the Widget has fully loaded.


## Event Properties

> Your returned data will be in an object like this

```json
{
  "wiwoEvent": "string - the name of the event",
  "frameId": "string - id of the frame that raised the event",
  "frame": "iframe element - DOM reference to the frame that raised the event"
}
```

Property | Details
-------|------------
event.wiwoEvent | string - the name of the event
event.frameId | string - id of the frame that raised the event
event.frame | iframe element - DOM reference to the frame that raised the event


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
    frameId: string - name of the frame
    frame: DOM element reference to the frame itself
  },
  {...}
]
```

`wiwo.iframeUtil.getFrameList()` returns a list of all the Widget frames it knows about on a page.



## Get data from widget


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


You can call `getData` at any time. Widgets aim to always be in a consistent state - even if they have to rely on default input values. Internal calculations are always attempted before the `getData` request is fulfilled.

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

## Set data on the widget

> The data payload you send must follow the input.modelName format style that is returned from a getData:

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

```javascript

    //setup your event listeners, which will receive data in result
    wiwo.iframeUtil_config = wiwo.iframeUtil_config || {}; //manual namespace in case the support script haven't loaded yet
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
      wiwo.iframeUtil.postMessage('wiwo-bojumo', 'wiwo.dido.setData', myData);      
    });

```

Using setData, you provide an object to the widget with all the of the standard input fields. Any input field which is usually provided on screen can be set on via the API. Refer to your Widget specific documentation for the input object model.
