# Analytics Events

The Widgets may emit tracking events that can be used to integrate with data analytics services.

See the examples for [Adobe Marketing Cloud](#adobe-marketing-cloud-integration) and [Google Analytics](#google-analytics-integration).

## pageTrack

> Example 'pageTrack' event listener:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'pageTrack', function(e, path){
	console.log('User viewing path: ', path);
}]);
```

### Summary

The `'pageTrack'` event is emitted by the Widget as the user navigates through the Widget.

The event listener parameters contain information about the Widget that raised the event and the URL path fragment that represents the application state that the user is viewing.


### Listener

`_wiwo.push(['on', 'pageTrack', function handler(e, path){...}])`

#### Handler Parameters

Parameter | Type | Description
--------- | ---- | -----------
e | [FrameEvent](#frameevent) | Information about the Widget that emitted the event.
path | string | The URL path fragment that represents the application state that the user is viewing. This value always includes a leading slash '/'.



## eventTrack

> Example 'eventTrack' event listener:

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'eventTrack', function(e, properties){
	console.log('User interaction: category="%s", action="%s", label="%s", value=%s',
		properties.category,
		properties.action,
		properties.label,
		properties.value
	);
}]);
```

### Summary

The `'eventTrack'` event is emitted by the Widget when the user interacts with the Widget.

It represents the user performing some action inside the Widget - e.g. clicking a button, showing a tooltip, etc.

The first time the user interacts with the Widget a special `'eventTrack'` is raised with the `category` property set to 'initial'.


### Listener

`_wiwo.push(['on', 'eventTrack', function handler(e, properties){...}])`


#### Handler Parameters

Parameter | Type | Description
--------- | ---- | -----------
e | [FrameEvent](#frameevent) | Information about the Widget that emitted the event.
properties | [EventTrackProperties](#eventtrackproperties) | The tracking properties associated with this event.


## EventTrackProperties


```javascript
interface EventTrackProperties {
	category: string,
	action: string,
	label: string,
	value: number
}
```

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>category</td>
			<td>string</td>
			<td>
				<p>The type of item that triggered the event.</p>
				<p>
				Examples:
				</p>
				<ul>
					<li><strong>'initial'</strong> - the user's first interaction with the Widget on the page.</li>
					<li><strong>'control'</strong> - the user interacted with a control.</li>
					<li><strong>'interaction'</strong> - general interaction with the Widget, but not associated with an input control.</li>
				</ul>
			</td>
		</tr>
		
		<tr>
			<td>action</td>
			<td>string</td>
			<td>
				<p>The tpye of interaction that triggered the event.</p>
				<p>For controls associated with another input (e.g. a slider associated
	with a text input field) this will contain the action followed by the control type, separated by a '|' character.</p>
				<p>
				Examples:
				</p>
				<ul>
					<li><strong>'click'</strong> - an element was clicked or tapped.</li>
					<li><strong>'change'</strong> - the value of a control was changed.</li>
					<li><strong>'change|slider'</strong> - the value of the control was changed by a slider.</li>
				</ul>
			</td>
		</tr>
		
		<tr>
			<td>label</td>
			<td>string</td>
			<td>
				<p>The identifier of the item that triggered the event.</p>
				<p>For list selection controls (select menu, radiobuttons) this	will be the identifier followed by the new selection value, separated by a ':' character.</p>
				<p>The actual values of the `label` property will vary depending on the Widget being tracked.</p>
				<p>
				Examples:
				</p>
				<ul>
					<li><strong>'current.voluntaryContribution'</strong> - This event relates to the 'current.voluntaryContribution' control</li>
					<li><strong>'adjusted.voluntaryContribution'</strong> - This event relates to the 'adjusted.voluntaryContribution' control</li>
					<li><strong>'repaymentModel.product:wiwoFixed5Y'</strong> - This event relates to the 'repaymentModel.product' control and the new value is 'wiwoFixed5Y'.</li>
				</ul>
			</td>
		</tr>
		
		<tr>
			<td>value</td>
			<td>number</td>
			<td>
				<p>Optional.</p>
				<p>If there is a numeric value associated with the event then this property will be present.</p>
				<p>
				Examples:
				</p>
				<ul>
					<li><strong>undefined</strong> - This event does not have an associated numeric value.</li>
					<li><strong>null</strong> - This event does not have an associated numeric value.</li>
					<li><strong>29000</strong> - The value associated with this event is 29000.</li>
					<li><strong>0.0775</strong> - The value associated with this event is 0.0775.</li>
				</ul>
			</td>
		</tr>
		
	</tbody>
</table>



## Adobe Marketing Cloud Integration

> Example page view tracking (navigation event) in Adobe Marketing Cloud.

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'pageTrack', function(e, path){
	/*
	// Set additional tracking properties here as determined
	// by your tracking requirements.
	
	s.prop1 = 'tools:calculator:repayment';
	*/
	
	s.t();
}]);
```

> Example link/interaction tracking in Adobe Marketing Cloud.

```javascript
var _wiwo = _wiwo || [];
// An example of how 
_wiwo.push(['on', 'pageTrack', function(e, properties){
	/*
	// Set additional tracking properties here as determined
	// by your tracking requirements.
	
	s.prop1 = 'tools:calculator:repayment';
	s.prop2 = s.eVar1 = properties.category;
	s.events = 'event1';
	*/
	
	s.tl(true, 'o', properties.label);
}]);
```


Integration with Adobe Marketing Cloud (formerly Omniture/SiteCatalyst) is supported through the `'pageTrack'` and `'eventTrack'` events emitted by the Widgets.

See the [Adobe Marketing Cloud documentation ](http://microsite.omniture.com/t2/help/en_US/sc/implement/oms_sc_implement.pdf) for more information on available tracking options.

See [EventTrackProperties](#eventtrackproperties) for the properties available to the `'eventTrack'` event.



## Google Analytics Integration

> Example page tracking in Google Analytics.

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'pageTrack', function(e, path){
	_gaq.push(['_trackPageview', path]);
}]);
```

> Example interaction tracking in Google Analytics.

```javascript
var _wiwo = _wiwo || [];
_wiwo.push(['on', 'eventTrack', function(e, properties){
	// Pass `properties.value` if it exists, otherwise set `value` to `undefined`.
	var value = properties.value == null ? void 0 : properties.value;
	
	// Set any additional tracking properties as required by your analytics requirements.
	
	_gaq.push(['_trackEvent', properties.category, properties.action, properties.label, value]);
}]);
```

Google Analytics tracking is supported through the `'pageTrack'` and `'eventTrack'` events emitted by the Widgets.

See the [Google Analytics documentation](https://developers.google.com/analytics/devguides/collection/gajs/methods/) for more detail:

 * [`_trackPageview` documentation](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._trackPageview)
 * [`_trackEvent` documentation](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking#_gat.GA_EventTracker_._trackEvent)


