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
<script type="text/javascript" src="https://w.widgetworks.com.au/s/bimade.js"></script>
<iframe id="wiwo-bimade" width="100%" height="100" src="" frameborder="0" data-wiwo-init="false"></iframe>
<script type="text/javascript" src="//s3-ap-southeast-2.amazonaws.com/w-widgetworks-com-au/widget/widget-scout.min.js"></script>
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

> 'wiwo.dido.getDataResult' returns the full dataset (user inputs and calculated fields) from the Widget:

```javascript
// `getData` example
var _wiwo = _wiwo || [];

// 1. Add the `wiwo.dido.getDataResult` listener:
_wiwo.push(['on', 'wiwo.dido.getDataResult', function(e, result){

  // 4. The Widget raises the `wiwo.dido.getDataResult` for us to handle here:
  if (result.success){
    console.log('Received data from Widget ID=', e.frameId, ', data=', result.data);
  } else {
    console.warn('Unable to get data from Widget ID=', e.frameId, ', reason=', result.message);
  }
  
}]);
```

> 'wiwo.dido.getData' requests the data from the Widget:

```javascript
// 2. Send the `wiwo.dido.getData` event to the Widget to get the current data:
// [3. Step three is handled inside the Widget.]
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.getData']);
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


This is the process that occurs to get the current input values and calculation results from a Widget:

 1. Add listeners for the `'wiwo.dido.getDataResult'` event.
 2. Once the Widget has loaded use the [iframeUtil.postMessage() method](#postmessage) to send a `'wiwo.dido.getData'` event to the Widget.
 3. The Widget receives the event and processes the data into the required JSON structure.
 4. Once processing is complete the Widget raises the `'wiwo.dido.getDataResult'` event for your listener to handle.

See [DiDo Events.getData](#getdata) and [DiDo Events.getDataResult](#getdataresult) for more detail.



## Example: send data to Widget

> __Example:__ Setting data on the Widget.

> The data payload you send should match the structure of the [WidgetData](#widgetdata) type.

```javascript
// `setData` example
var _wiwo = _wiwo || [];

// 1. Add the `wiwo.dido.setDataResult` listener:
_wiwo.push(['on', 'wiwo.dido.setDataResult', function(e, result){
  
  // 4. The Widget raises the `wiwo.dido.setDataResult` event for us to handle here:
  if (result.success){
    console.log('Successfully loaded data into Widget ID=', e.frameId);
  } else {
    console.warn('Unable to set data on Widget ID=', e.frameId, ', reason=', result.message);
  }
  
}]);

// 2. Send the `wiwo.dido.setData` event to load new data into the Widget:
// [3. Step three is handled inside the Widget.]
_wiwo.push(['postMessage', 'wiwo-bimade', 'wiwo.dido.setData', {
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
}]);
```



To dynamically load new data into a Widget:
 
 1. Add listeners for the `'wiwo.dido.setDataResult'` event.
 2. Once the Widget has loaded use the [iframeUtil.postMessage() method](#postmessage) to send a `'wiwo.dido.setData'` event to the Widget, along with a data payload.
 3. The Widget receives the event, validates the data payload and loads the new data.
 4. Once the data has been loaded the Widget will raise the `'wiwo.dido.setDataResult'` for your listener to handle.

See [DiDo Events.setData](#setdata) and [DiDo Events.setDataResult](#setdataresult) for more detail.

The `'wiwo.dido.setData'` event expects a [WidgetData](#widgetdata) object passed as the `payload` parameter.

To load data at Widget startup see [Loading values from URL](#loading-values-from-url).

