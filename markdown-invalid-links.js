/*
Find invalid (internal) links in a generated markdown document.

Run this code in the console and it will list the text and href
of any link that doesn't match up to an element ID on the page.

i.e. any links output by this code won't link to an element and are broken.
*/

$('a[href^=#]').filter(function(i, el){
    return $(el).attr('href').length > 1
}).each(function(i, el){
    var $el = $(el),
    	href = $el.attr('href');
    if ($(href).length == 0){
        console.log('Invalid link: [%s](%s)', $el.text(), href);
    }
}); void 0;