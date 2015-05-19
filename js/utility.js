


/**
* Title screen centering utilities
*/

function centerer (jQuery) {
	$( "#title-container" ).height( $( window ).height() );
}

$(document).ready(centerer);
$(window).resize(centerer);


/**
* Slider function - Makes Anchor Links Slideable 
*/
 
jQuery(document).ready(function($) {
 
	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$('[name="'+this.hash.substring(1)+'"]').offset().top - 50}, 1200);
	});
});


/**
* Lightbox Utilities
*/

$(document).ready(function() {
  $('.image-link').magnificPopup({type:'image'});
});

$('.popupLink').magnificPopup({ 
  type: 'image',
    image: {
	  markup: '<div class="mfp-figure">'+
            '<div class="mfp-close"></div>'+
            '<div class="mfp-img"></div>'+
            '<div class="mfp-bottom-bar">'+
              '<div class="mfp-title"></div>'+
              '<div class="mfp-counter"></div>'+
            '</div>'+
          '</div>',    
    	titleSrc: 'title',
	    verticalFit: true, // Fits image in area vertically
		tError: '<a href="%url%">The image</a> could not be loaded.' // Error message    
  }
});
