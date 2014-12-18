# Analytics Events

The Widgets may emit tracking events that can be used to integrate with data analytics services.


## pageTrack

### Summary

The `'pageTrack'` event is emitted by the Widget as the user navigates through the Widget.



### Listener

`_wiwo.push('on', 'pageTrack', function handler(e, path){...}])`

#### Handler Parameters

Parameter | Type | Description
--------- | ---- | -----------
e | [FrameEvent](#frameevent) | Information about the Widget that emitted the event.
path | string | The URL path fragment that identifies the 



## eventTrack


## EventTrackProperties


```javascript
interface EventTrackProperties {
	category: string,
	action: string,
	label: string,
	
	/*
	Optional. If present then this is the numeric value associated with
	this event.
	
	e.g. For a numeric input this will be the value of that input.
	*/
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

Formerly Omniture and SiteCatalyst.



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
	_gaq.push(['_trackPageview', path]);
}]);
```


See the [Google Analytics documentation](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._trackPageview) for more detail.


