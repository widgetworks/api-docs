# Widget Works Widget API

##Data In, Data Out (dido) API

> All Widget Works Widgets provide an interaction API.


Once a widget is placed on a page using the Widget Manager provided license and links, you can use our simple API to set and get calculatin specific data from the widget. The Widget itself runs in the iframe and you can't communicate to it directly due to cross domain limitations. Our helpful scout provides a secure, cross-frame communications API which you can use to query the Widget.

The API is event based and asynchronous:

> The namespace for all Widget Works API libraries is : `wiwo`

* use our `wiwo.iframeUtil` to create event listeners for `wiwo.dido.getDataResult` or `wiwo.dido.setDataResult` with your callbacks to take action with the data returned
* once the iframe has loaded, use `wiwo.iframeUtil.postMessage` to fire a `'wiwo.dido.getData'` or `'wiwo.dido.setData'` event, with your data payload
* the Widget recevies the postMessage and will internally process the event. Depending on the action, it may offer the user options to save data before continuing
* once ready, the Widget will fire a `'wiwo.dido.getDataResult'` or `'wiwo.dido.setDataResult'` via iframeUtil for your listener to be invoked

In most cases the response from the Widget will be virtually immediate. Responses always provide:

* an *event result object* : failure/success, and details of any errors
* a *data object* : actual data from the widget, calculation results, etc. *Refer to your Widget specific documentation for the data properties.*



## Page setup

> To add a Widget to your page

```html
<!-- Start Widget Works - do not change -->
<script type="text/javascript" src="https://w.widgetworks.com.au/s/bojumo.js"></script>
 <iframe id="wiwo-bojumo" width="100%" height="100" src="" frameborder="0" data-wiwo-init="false"></iframe>
<script type="text/javascript" src="//s3-ap-southeast-2.amazonaws.com/w-widgetworks-com-au/widget/widget-scout.min.js"></script>
<!-- End Widget Works -->
```

First, copy and insert the Widget embed code from [Widget Manager](https://wm.widgetworks.com.au). Our examples will use the following Mortgage Repayment Widget:

 You can have multiple Widgets on the same page, just use the iframe id to refer to each instance specifically.

<aside class="notice">
The iframe id (*wiwo-bojumo* in this case) identifies your license and the iframe itself.
</aside>