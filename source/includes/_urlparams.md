# Loading values from URL

## Override defaults


> __Example:__
 
>  1. For this example the parent page URL is: https://wm.widgetworks.com.au/widget/bimade/live
 
>  2. The parent page has a Widget with the iframe ID 'wiwo-bimade':
     e.g. `<iframe id="wiwo-bimade" width="100%" height="100" src="" frameborder="0" data-wiwo-init="false"></iframe>`
  
>  3. The parent page must have a URL query parameter with a key that matches the iframe ID:
     https://wm.widgetworks.com.au/widget/bimade/live/?__wiwo-bimade__=...
 
>  4. The value of the parameter is the URI-encoded JSON data for that Widget

>  5. Combine the everything together to form the final URL:

>  e.g. This JSON string:

 
```	json
{"id":"wiwo-repayment-widget","version":0,"input":{"repaymentModel":{"principal":123456,"term":13,"interestRate":0.13,"repaymentType":"IO_ARR","repaymentFrequency":"fortnight","productGroup":"fixed","product":"wiwoFixed3Y"},"savingsModel":{"savingsEnabled":false,"extraRepayment":0,"offset":0,"lumpSum":0,"lumpSumYear":3}}}
```
>  	Is URI-encoded as:
	
```html
%7B%22id%22%3A%22wiwo-repayment-widget%22%2C%22version%22%3A0%2C%22input%22%3A%7B%22repaymentModel%22%3A%7B%22principal%22%3A123456%2C%22term%22%3A13%2C%22interestRate%22%3A0.13%2C%22repaymentType%22%3A%22IO_ARR%22%2C%22repaymentFrequency%22%3A%22fortnight%22%2C%22productGroup%22%3A%22fixed%22%2C%22product%22%3A%22wiwoFixed3Y%22%7D%2C%22savingsModel%22%3A%7B%22savingsEnabled%22%3Afalse%2C%22extraRepayment%22%3A0%2C%22offset%22%3A0%2C%22lumpSum%22%3A0%2C%22lumpSumYear%22%3A3%7D%7D%7D
```


The Widgets can load default values from the parent page query parameters.

The data is passed into the Widget via a URL query parameter that matches the ID of the Widget's iframe.

For example, the data from the query parameter `'?wiwo-bimade=...'` will be passed to the Widget loaded into the iframe with the ID `'wiwo-bimade'`.

The parameter should be the same JSON payload that passed with the `'wiwo.dido.setDataResult'` event (see the [Set data on the Widget](#set-data-on-the-widget) section above). However, the JSON payload __must__ be URI-encoded when passed as a URL parameter.


<aside class="warning">
__NOTE:__ Setting the URL parameters after the Widgets have loaded will have no effect. The Widgets will only load the default values on page load.
</aside>

## Example

>  Combine the everything together to form the final URL:

```html
<a href="https://wm.widgetworks.com.au/widget/bimade/live/?wiwo-bimade=%7B%22id%22%3A%22wiwo-repayment-widget%22%2C%22version%22%3A0%2C%22input%22%3A%7B%22repaymentModel%22%3A%7B%22principal%22%3A123456%2C%22term%22%3A13%2C%22interestRate%22%3A0.13%2C%22repaymentType%22%3A%22IO_ARR%22%2C%22repaymentFrequency%22%3A%22fortnight%22%2C%22productGroup%22%3A%22fixed%22%2C%22product%22%3A%22wiwoFixed3Y%22%7D%2C%22savingsModel%22%3A%7B%22savingsEnabled%22%3Afalse%2C%22extraRepayment%22%3A0%2C%22offset%22%3A0%2C%22lumpSum%22%3A0%2C%22lumpSumYear%22%3A3%7D%7D%7D" target="_blank">Load Repayment Widget with custom data...</a>
```

Try it out:

<a href="https://wm.widgetworks.com.au/widget/bimade/live/?wiwo-bimade=%7B%22id%22%3A%22wiwo-repayment-widget%22%2C%22version%22%3A0%2C%22input%22%3A%7B%22repaymentModel%22%3A%7B%22principal%22%3A123456%2C%22term%22%3A13%2C%22interestRate%22%3A0.13%2C%22repaymentType%22%3A%22IO_ARR%22%2C%22repaymentFrequency%22%3A%22fortnight%22%2C%22productGroup%22%3A%22fixed%22%2C%22product%22%3A%22wiwoFixed3Y%22%7D%2C%22savingsModel%22%3A%7B%22savingsEnabled%22%3Afalse%2C%22extraRepayment%22%3A0%2C%22offset%22%3A0%2C%22lumpSum%22%3A0%2C%22lumpSumYear%22%3A3%7D%7D%7D" target="_blank">Load Repayment Widget with custom data...</a>


## URI-encoding data

This is a simple example showing one way of encoding the Widget data in the `'wiwo.dido.getDataResult'` event handler:

```javascript
	var _wiwo = _wiwo || [];
	_wiwo.push(['on', 'wiwo.dido.getDataResult', function(event, result){
		if (result.success){
			delete result.data.output 	// Remove the results data.
			
			// Encode the JSON data:
			var encodedData = encodeURIComponent(JSON.stringify(result.data));
			
			// Combine the encoded data with the frameId:
			var widgetParam = event.frameId + '=' + encodedData;
			
			// Log out the result.
			console.log('widgetParam: ', widgetParam);
		}
	}]);
```