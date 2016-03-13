jQuery(function($) {

	//Preloader
	var preloader = $('.preloader');
	$(window).load(function(){
		preloader.remove();
	});

	//#main-slider
	var slideHeight = $(window).height();
	$('#home-slider .item').css('height',slideHeight);

	$(window).resize(function(){'use strict',
		$('#home-slider .item').css('height',slideHeight);
	});
	
	//Scroll Menu
	$(window).on('scroll', function(){
		if( $(window).scrollTop()>slideHeight ){
			$('.main-nav').addClass('navbar-fixed-top');
		} else {
			$('.main-nav').removeClass('navbar-fixed-top');
		}
	});
	
	// Navigation Scroll
	$(window).scroll(function(event) {
		Scroll();
	});

	$('.navbar-collapse ul li a').on('click', function() {  
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
		return false;
	});

	// User define function
	function Scroll() {
		var contentTop      =   [];
		var contentBottom   =   [];
		var winTop      =   $(window).scrollTop();
		var rangeTop    =   200;
		var rangeBottom =   500;
		$('.navbar-collapse').find('.scroll a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top);
			contentBottom.push( $( $(this).attr('href') ).offset().top + $( $(this).attr('href') ).height() );
		})
		$.each( contentTop, function(i){
			if ( winTop > contentTop[i] - rangeTop ){
				$('.navbar-collapse li.scroll')
				.removeClass('active')
				.eq(i).addClass('active');			
			}
		})
	};

	$('#tohash').on('click', function(){
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
		return false;
	});
	
	//Initiat WOW JS
	new WOW().init();
	//smoothScroll
	smoothScroll.init();
	
	// Progress Bar
	$('#about-us').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$.each($('div.progress-bar'),function(){
				$(this).css('width', $(this).attr('aria-valuetransitiongoal')+'%');
			});
			$(this).unbind('inview');
		}
	});

	//Countdown
	$('#features').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$(this).find('.timer').each(function () {
				var $this = $(this);
				$({ Counter: 0 }).animate({ Counter: $this.text() }, {
					duration: 2000,
					easing: 'swing',
					step: function () {
						$this.text(Math.ceil(this.Counter));
					}
				});
			});
			$(this).unbind('inview');
		}
	});

	// Portfolio Single View
	$('#portfolio').on('click','.folio-read-more',function(event){
		event.preventDefault();
		var link = $(this).data('single_url');
		var full_url = '#portfolio-single-wrap',
		parts = full_url.split("#"),
		trgt = parts[1],
		target_top = $("#"+trgt).offset().top;

		$('html, body').animate({scrollTop:target_top}, 600);
		$('#portfolio-single').slideUp(500, function(){
			$(this).load(link,function(){
				$(this).slideDown(500);
			});
		});
	});

	// Close Portfolio Single View
	$('#portfolio-single-wrap').on('click', '.close-folio-item',function(event) {
		event.preventDefault();
		var full_url = '#portfolio',
		parts = full_url.split("#"),
		trgt = parts[1],
		target_offset = $("#"+trgt).offset(),
		target_top = target_offset.top;
		$('html, body').animate({scrollTop:target_top}, 600);
		$("#portfolio-single").slideUp(500);
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
		}).done(function(data){
			form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
		});
	});

	//Google Map
	var latitude = $('#google-map').data('latitude')
	var longitude = $('#google-map').data('longitude')
	function initialize_map() {
		var myLatlng = new google.maps.LatLng(latitude,longitude);
		var isDraggable = (($(window).width() > 480) && ($(window).height()  >  480)) ? true : false;
		//alert ($(window).height()); 
		var mapOptions = {
			zoom: 17,
			draggable: isDraggable,
			scrollwheel: false,
			center: myLatlng,
			mapTypeControlOptions: {
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			styles: [{
			    stylers: [{
 			          saturation: -100
			    }]
			}]
		};
		var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
		var contentString = "Geek Label, <br> 4th Floor, <br> 27-33 Bethnal Green Road, <br> Shoreditch, <br> London, <br>E1 6LA";
		var infowindow = new google.maps.InfoWindow({
			content: '<div class="map-content"><ul class="address">' + contentString + '</ul></div>'
		});
/*		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			icon: ' ',
			draggable: true,
			raiseOnDrag: true,
			labelContent:'<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
			labelAnchor: new google.maps.Point(22, 50),
			labelClass: "labels"
		});
		marker.setMap(map);*/
		var marker = new MarkerWithLabel({
			position: myLatlng,
			map: map,
			icon: ' ',
			draggable: false,
			raiseOnDrag: true,
			labelContent: '<div class="icon-gk service-icon-map" style="text-align:center"> <i class="fa fa-code"></i></div>',
			//labelContent:'<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
			labelAnchor: new google.maps.Point(22, 50),
			labelClass: "icon-gk"
		});
		marker.setMap(map);
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			 center = map.getCenter();
			 google.maps.event.trigger(map, "resize");
			  map.setCenter(center); 
		});
			infowindow.open(map,marker);
	}
	google.maps.event.addDomListener(window, 'load', initialize_map);


	//Presets
	var presets = $('.style-chooser ul li');

	$('.style-chooser .toggler').on('click', function(event){
		event.preventDefault();
		$(this).closest('.style-chooser').toggleClass('opened');
	});

	$('.style-chooser ul li a').on('click', function(event){
		event.preventDefault();
		presets.removeClass('active');
		$(this).parent().addClass('active');
		$('#css-preset').removeAttr('href').attr('href', 'css/presets/preset' + $(this).parent().data('preset') + '.css');
	})


});

