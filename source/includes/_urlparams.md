# Loading values from URL

## Override defaults


> __Example:__
 
>  1. The parent page URL is: http://widgetworks.com.au/tools/widget-api-demo/
 
>  2. The parent page has a Widget with the iframe ID 'wiwo-bimade':
     e.g. `<iframe id="wiwo-bimade" width="100%" height="100" src="" frameborder="0" data-wiwo-init="false"></iframe>`
  
>  3. The parent page must have a URL query parameter with a key that matches the iframe ID:
     http://widgetworks.com.au/tools/widget-api-demo/?__wiwo-bimade__=...
 
>  4. The value of the parameter is the URI-encoded JSON data for that Widget

>  5. Combine the everything together to form the final URL:

>  e.g. This JSON string:

 
```	json
   {"id":"wiwo-repayment-widget","version":0,"input":{"repaymentModel":{"principal":123456,"term":13,"interestRate":0.13,"repaymentType> ":"IO_ARR","repaymentFrequency":"fortnight","product":"wiwoFixed3Y"},"savingsModel":{"savingsEnabled":false,"extraRepayment":0,"offset":0,"lumpSum> ":0,"lumpSumYear":3}}}
```
>  	Is URI-encoded as:
	
```html
 	%7B"id"%3A"wiwo-repayment-widget"%2C"version"%3A0%2C"input"%3A%7B"repaymentModel"%3A%7B"principal"%3A123456%2C"term"%3A13%2C"interestRat> e"%3A0.13%2C"repaymentType"%3A"IO_ARR"%2C"repaymentFrequency"%3A"fortnight"%2C"product"%3A"wiwoFixed3Y"%7D%2C"savingsModel"%3A%7B"savingsEnabled"%> 3Afalse%2C"extraRepayment"%3A0%2C"offset"%3A0%2C"lumpSum"%3A0%2C"lumpSumYear"%3A3%7D%7D%7D
```

>  Combine the everything together to form the final URL:

```html
    <a href="http://widgetworks.com.au/tools/widget-api-demo/?wiwo-bimade=%7B%22id%22%3A%22wiwo-repayment-widget%22%2C%22version%22%3A0%2C%22input%22%3A%7B%22rep> aymentModel%22%3A%7B%22principal%22%3A123456%2C%22term%22%3A13%2C%22interestRate%22%3A0.13%2C%22repaymentType%22%3A%22IO_ARR%22%2C%22repaymentFrequency%22%3A> %22fortnight%22%2C%22product%22%3A%22wiwoFixed3Y%22%7D%2C%22savingsModel%22%3A%7B%22savingsEnabled%22%3Afalse%2C%22extraRepayment%22%3A0%2C%22offset%22%3A0%2> C%22lumpSum%22%3A0%2C%22lumpSumYear%22%3A3%7D%7D%7D" target="_blank">http://widgetworks.com.au/tools/widget-api-demo/?wiwo-bimade=%7B"id"%3A"wiwo-> repayment...</a>
```

> Which will provide a link which overrides defaults with whatever value you like


The Widgets can load default values from the parent page query parameters.

The data is passed into the Widget via a URL query parameter that matches the ID of the Widget's iframe.

For example, the data from the query parameter '?wiwo-bimade=...' will be passed to the Widget loaded into the iframe with the ID 'wiwo-bimade'.

The Widgets expect the same JSON data structure that is returned by the `wiwo.dido.getDataResult` event (see the __"Get data from Widget"__ section above). However the JSON result __must__ be URI-encoded when passed as a URL parameter.


<aside class="warning">
__NOTE:__ Setting the URL parameters after the Widgets have loaded will have no effect. The Widgets will only load the default values on page load.
</aside>


## URI-encoding data

This is a simple example showing the expected format of the URI-encoded JSON string:

```javascript
	wiwo.iframeUtil.on('wiwo.dido.getDataResult', function(event, result){
		if (result.success){
			delete result.data.output 	// Remove the results data.
			
			var widgetParam = event.frameId + '=' + encodeURIComponent(JSON.stringify(result.data));
			console.log('widgetParam: ', widgetParam);
		}
	});
```