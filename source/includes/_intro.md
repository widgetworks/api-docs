# Widget Works Widget API

## Overview

The Widget is made up of four components that work together to embed the tool on your webpage.

 1. [__Host page__](#page-setup) - your webpage that will host the Widget.
 2. __Widget__ - the Widget and all of its associated assets - loaded into an iframe on the host page.
 3. __Helper library__ - The [iframeUtil library](#iframeutil-api-reference) loaded on the host page that allow communication between the host page and Widget.
 4. __Configuration__ - the customisation and configuration data for the Widget.



## Page setup

> Copy and pase this into your HTML to add a Widget to your page:

```html
<!-- Start Widget Works - do not change -->
<script src="https://calcs.widgetworks.com.au/s/bimade/live.js"></script>
<iframe id="wiwo-bimade" width="100%" height="200" src="" frameborder="0" data-wiwo-init="false"></iframe>
<script src="https://calcs.widgetworks.com.au/widget/widget-scout.min.js"></script>
<!-- End Widget Works -->
```

First, copy and insert the Widget embed code from [Widget Manager](https://wm.widgetworks.com.au). Our examples will use the following Mortgage Repayment Widget:

You can have multiple Widgets on the same page, just use the iframe id to refer to each instance specifically.

<aside class="notice">
The iframe id (*wiwo-bimade* in this case) identifies your license and the iframe itself.
</aside>



## Data In, Data Out (dido) API

> All Widget Works Widgets provide an interaction API.

> The namespace for all Widget Works libraries is : `wiwo`

> The namespace for the asynchronous cross-frame API is : `_wiwo`

Once a Widget is embedded in a page you can use our simple API to set and get calculation-specific data from the Widget. The Widget itself runs in the iframe and you can't communicate to it directly due to cross domain limitations.

Our helpful scout provides a secure, cross-frame communications API which you can use to interact with the Widget. The API is event based and asynchronous - all events sent to or from the Widget are asynchronous.

In most cases the response from the Widget will be virtually immediate.


Responses always provide:

* an *event result object* : failure/success, and details of any errors
* a *data object* : actual data from the widget, calculation results, etc. *Refer to your Widget specific documentation for the data properties.*


## Example: get data from Widget

> __Example:__ Getting data from the Widget.

> This will return the full dataset (user inputs and calculated fields) from the Widget:

```javascript
// `getData` example
var _wiwo = _wiwo || [];

// 1. Invoke the `getData` method on the iframeUtil:
_wiwo.push(['getData', 'wiwo-bimade', function(e, result){
  // 2. This callback function will be invoked when the Widget raises the `wiwo.dido.getDataResult` event:
  if (result.success){
    console.log('Received data from Widget ID=', e.frameId, ', data=', result.data);
  } else {
    console.warn('Unable to get data from Widget ID=', e.frameId, ', reason=', result.message);
  }
  
}]);
```

> Console output from the above example:

```javascript
'Received data from Widget ID=wiwo-bimade, data='{
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

This is the process that occurs when you request the current input values and calculation results from a Widget:

 1. Invoke the [getData()](#getdata) method on the Widget.
 2. The iframeUtil will use the [iframeUtil.postMessage() method](#postmessage) to send a `'wiwo.dido.getData'` event to the Widget.
 3. The Widget receives the event and processes the data into the required JSON structure.
 4. The Widget will send the `'wiwo.dido.getDataResult'` event back to the iframeUtil.
 5. The iframeUtil will invoke your callback, passing the Widget data to the function.

See [DiDo Events.getDataResult](#event-getdataresult) for detail on the returned data.



## Example: send data to Widget

> __Example:__ Setting data on the Widget.

> The data payload you send should match the structure of the [WidgetData](#type-widgetdata) type.

```javascript
// `setData` example
var _wiwo = _wiwo || [];

// 1. Invoke the `setData` method on the iframeUtil:
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
      // 2. This callback will be invoked when Widget returns the `wiwo.dido.setDataResult` event:
      if (result.success){
        console.log('Successfully loaded data into Widget ID=', e.frameId);
      } else {
        console.warn('Unable to set data on Widget ID=', e.frameId, ', reason=', result.message);
      }
      
    }
]);
```


To dynamically load new data into a Widget:

 1. Invoke the [setData()](#setdata) method on the iframeUtil, passing the frameId and data you want to load.
 2. The iframeUtil will use the [iframeUtil.postMessage() method](#postmessage) to send a `'wiwo.dido.setData'` event to the Widget along with the data payload.
 3. The Widget receives the event, validates the data payload and loads the new data.
 4. The Widget will send the `'wiwo.dido.setDataResult'` event back to the iframeUtil.
 5. The iframeUtil will invoke your callback, passing the Widget data to the function.

The [setData()](#setdata) method expects a [WidgetData](#type-widgetdata) object passed as the `payload` parameter.

See [DiDo Events.setDataResult](#event-setdataresult) detail on the data types expected by the Widget.

To load data at Widget startup see [Loading values from URL](#loading-values-from-url).

