/*=========================================================

  OI THEMES - OI Hotel theme java script
  by www.oithemes.com

  01. #VARIABLES
  02. #HELPERS
      - Detect Firefox
      - Foundation Media Queries
  03. #FUNCTIONS
      - Side navigation
      - Mobile sub-menu collapse
      - BX Main slider
      - Social Sharing
      - 0 BEFORE NUMBER
      - BX Slider Awards Vertical
      - Waypoints
      - Sticky Header
  04. #INITIALISATION
  05. #Comment functionality


=========================================================*/

/*=========================================================
  01. #VARIABLES
=========================================================*/

sidenav = {
  navTrigger:     jQuery('#js-trigger-navi, #js-close-navi'),
  navContainer:   jQuery('.side-navigation'),
  pushLeft:       jQuery('.top-head, .top-bar, .main-footer'),
  navClose:       jQuery('#js-close-navi')
};


/*=========================================================
  02. #HELPERS
=========================================================*/

// DETECT FIREFOX
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

// Meadia Queries
var isLarge, isMedium, isSmall;

isSmall = function() {
  return matchMedia(Foundation.media_queries['small']).matches && !matchMedia(Foundation.media_queries.medium).matches;
};

isMedium = function() {
  return matchMedia(Foundation.media_queries['medium']).matches && !matchMedia(Foundation.media_queries.large).matches;
};

isLarge = function() {
  return matchMedia(Foundation.media_queries['large']).matches;
};



/*=========================================================
  03. #FUNCTIONS
=========================================================*/

// Side navigation
function initializeSideNav() {
  "use strict";
  sidenav.navTrigger.on('click', function(e) {

    sidenav.navClose.toggleClass('is-visible');
    sidenav.pushLeft.toggleClass('is-pushed-left');
    sidenav.navContainer.toggleClass('active');

    if (sidenav.navContainer.hasClass('overflow-hidden')) {
      sidenav.navContainer.removeClass('overflow-hidden');
    } else {
      sidenav.navContainer.addClass('overflow-hidden');
    }

    if( is_firefox ) {
      jQuery('.content-wrapper').toggleClass('is-pushed-left').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        jQuery('body').toggleClass('overflow-hidden');
      });
    } else {
      jQuery('.content-wrapper').toggleClass('is-pushed-left');
      jQuery('body').toggleClass('overflow-hidden');
    }
    e.preventDefault();

  });
}


// MOBILE SUB-MENU COLLAPSE
function mobileAccordion(repeated) {
  "use strict";
    var nav             = sidenav.navContainer;
    var allPanels       = nav.find('.sub-menu').hide();
    var clickableItems  = nav.find('.np-side li.menu-item-has-children > a');


    if(clickableItems.parent('li.current-menu-item.menu-item-has-children').length) {
        clickableItems.parent('li.current-menu-item.menu-item-has-children').addClass('open');
    } else {
        clickableItems.parent('li.current-menu-ancestor').addClass('open');
    }


    clickableItems.parent('li.open').children('.sub-menu').slideDown();


    nav.find('.arrow').on('click', function (e) {
        e.stopPropagation();


        var element     = jQuery(this).parent('li');
        var is_open     = element.hasClass('open');
        var exclude     = element.parentsUntil('.menu-main-menu-container', '.sub-menu');


        allPanels.not(exclude).slideUp(); // close
        nav.find('.open').not(exclude.parent().parent().find('.open')).removeClass('open');


        if(!is_open) {
            element.addClass('open').children('.sub-menu').slideDown();
        }


        return false;
    });
}


// BX slider
function mainSlider() {
  "use strict";
// create an options object to store your slider settings

	var slider_config = {
    mode: 'horizontal', // place all slider options here
    auto: true,
    pause: 4000,
    pager: false,
    nextText: '',
    prevText: '',
    touchEnabled: true,

        onSlideBefore: function(jQueryslideElement, oldIndex, newIndex){
            var jQuerylazy = jQueryslideElement.find(".lazy");
            var jQueryload = jQuerylazy.attr("data-src");
            jQuerylazy.attr("src",jQueryload).removeClass("lazy");
        },

        onSliderLoad: function(){
            jQuery(".slider-big").css("visibility", "visible");
        }
	};

  // init the slider with your options
	var slider = jQuery('.main-slider').bxSlider(slider_config);

}

// SHARING
function initializeShare() {
  "use strict";
    jQuery('.js-share-trigger').on('click', function () {

        var sharecontainer = jQuery(this).parent().find('.share-group');

        if (sharecontainer.hasClass('hidden')) {

            sharecontainer.removeClass('hidden');
            setTimeout(function () {
                sharecontainer.addClass('active');
            }, 20);

        } else {

            sharecontainer.removeClass('active');

            sharecontainer.one('transitionend', function (e) {

                sharecontainer.addClass('hidden');

            });

        }
    });


    new GetShare({
        root: jQuery('.facebook'),
        network: 'facebook',
        share: {url: jQuery('.facebook').data('share-url')}
    });


    new GetShare({
        root: jQuery('.googleplus'),
        network: 'googleplus',
        share: {url: jQuery('.googleplus').data('share-url')}
    });


    new GetShare({
        root: jQuery('.linkedin'),
        network: 'linkedin',
        share: {url: jQuery('.linkedin').data('share-url')}
    });
}

// 0 BEFORE NUMBER
function pad (str, max) {
  "use strict";
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

// BX Slider Awards Vertical
function awardsSlider() {
  "use strict";
// create an options object to store your slider settings
  var award_mode = 'vertical';
  if (isLarge()) {
    var award_mode = 'vertical';
  } else {
    var award_mode = 'horizontal';
  }

	var slider_config = {
		mode: award_mode, // place all slider options here
    pager: true,
    adaptiveHeight: true,
    nextText: '<span class="icon-arrow-down show-for-large-up"></span><span class="icon-arrow-right hide-for-large-up"></span>',
    prevText: '<span class="icon-arrow-up show-for-large-up"></span><span class="icon-arrow-left hide-for-large-up"></span>',
    nextSelector: '#awards-next',
    prevSelector: '#awards-prev',
    touchEnabled: false,
    infiniteLoop: false,

    onSliderLoad: function (currentIndex, jQueryslideElement, oldIndex, newIndex){
      var cur = currentIndex + 1;
      jQuery('.slider-navi .current-index').text(pad(cur,2));
    },

    onSlideBefore: function (jQueryslideElement, oldIndex, newIndex){
      var newie = newIndex + 1;
      jQuery('.slider-navi .current-index').text(pad(newie,2));

      if (newie == slider.getSlideCount()) {
        jQuery('#awards-next').addClass('active');
      } else if (newie == 1) {
        jQuery('#awards-prev').addClass('active');
      } else {
        jQuery('#awards-next, #awards-prev').removeClass('active');
      }
    }

	};

  // init the slider with your options
	var slider = jQuery('.awards-slider').bxSlider(slider_config);
  var slideQty = slider.getSlideCount();
  jQuery('.slider-navi .counter__total').text(slideQty);


}


// waypoints
function initStats() {
  "use strict";
  new Waypoint({
      element: document.getElementById('way-numbers'),
      handler: function(direction) {
        jQuery('.js-count').countTo({speed: 700});
      },

      offset: 'bottom-in-view'
  });
}

// Accordion animation
function accordionAnimation(accordion){
  "use strict";
  var jQuerythis = jQuery(accordion);
  var jQuerylink = jQuerythis.find('li > a');

  jQuerythis.find('.content.active').css('height', jQuerythis.find('.content.active').children().outerHeight() + 20);

  jQuerylink.on('click', function(){
    if( jQuery(this).attr('href') == '#' + jQuerythis.find('.content.active').attr('id') ) {
      jQuery(this).next().css('height', 0);
    } else {
      jQuerythis.find('.content.active').css('height', 0);
      jQuery(this).next().css('height', jQuery(this).next().children().outerHeight() + 20);
    }

  });
}

// Sticky Header
function stickyMenu(){
  "use strict";
  var top_head_height = jQuery('.top-head').height();

  if (jQuery(window).scrollTop() > 200){
    jQuery('.main-header').addClass("sticky");
    jQuery('.main-header').css("padding-top", top_head_height);
  }
  else{
    jQuery('.main-header').removeClass("sticky");
    jQuery('.main-header').css("padding-top", "0");
  }
}

jQuery(window).scroll(function() {
  if(jQuery(".sticky-on").length) {
    stickyMenu();
  }
});

/*=========================================================
  04. #INITIALISATION
=========================================================*/
jQuery(document).ready(function() {

  initializeSideNav();
  mobileAccordion();

  // Swipebox
  jQuery('.swipebox').swipebox();

  // Datepicker
  jQuery('.datepicker').datepicker({
        weekStart: 1,
        orientation: "auto",
        autoclose: true,
        todayHighlight: false,
        format: 'dd/mm/yyyy'
  });

  // MAP MODE
  if(jQuery("#directions-form").length) {
    jQuery(".maps__travel-mode").find("label").on("click", function(){
       jQuery(".maps__travel-mode").find("label").removeClass("active");
       jQuery(this).addClass("active");
    });
  }

  // SHARING
  if(jQuery(".share").length) {
    initializeShare();
  }


  // DATEPICKER
  if(jQuery("input.datepicker").length) {
      jQuery("input.datepicker").attr("readonly", true);
  }


  // CHECK WIDTH FOR EQUALIZER
  if (jQuery(window).width() < 640) {
     var equalizeswitch = false;
  }
  else {
     var equalizeswitch = true;
  }

  //INITIALIZE FOUNDATION
  jQuery(document).foundation({
    equalizer : {
      // Specify if Equalizer should make elements equal height once they become stacked.
      equalize_on_stack: equalizeswitch
    }
  });

  // Accordion animation
  accordionAnimation(jQuery('.accordion.animated'));

});


jQuery(document).on('replace', 'img', function() {
  jQuery(document).foundation('equalizer', 'reflow');
});

window.onload = function() {

  if (jQuery('.main-slider').length) {
    mainSlider();
  }

  if (jQuery('.awards-slider').length) {
    awardsSlider();
  }

  if (jQuery('#way-numbers').length) {
    initStats();
  }

};

// Google WEB Font
WebFont.load({
    google: {
        families: font_families
    }
});

/*=========================================================
 05. #Comment functionality
 =========================================================

 To show title reply to, and clear reply links +_
 reply links without reloading.
 */

var comment_orriginal_title = "";
function cancel_reply(){

    jQuery('#reply-title').html(comment_orriginal_title);
    jQuery('#comment_parent').val("");
}

jQuery(document).ready(function(){

    jQuery('.reply-link').click(function(e){
        var self = jQuery(this);

        if (comment_orriginal_title.length==0){
            comment_orriginal_title=jQuery('#reply-title').html();
        }

        jQuery('#reply-title').html(self.attr('data-reply-title'));
        jQuery('#comment_parent').val(self.attr('data-comment-id'));
    });

});


document.addEventListener('DOMContentLoaded', function() {

  // ---- CSS ----
  const style = document.createElement('style');
  style.innerHTML = `
    .chat-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      cursor: grab;
      user-select: none;
      touch-action: none;
    }
    .chat-container.dragging {
      cursor: grabbing;
    }
    .chat-main-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #002b52;
      border: none;
      color: white;
      font-size: 30px;
      cursor: grab;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .chat-main-btn:active { transform: scale(0.9); }
    .chat-main-btn .icon-close { display: none; }
    .chat-container.active .icon-open { display: none; }
    .chat-container.active .icon-close {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .chat-container.active .chat-options {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .chat-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    .chat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      text-decoration: none;
    }
    .chat-icon img { width: 60%; height: 60%; }
    .chat-icon:hover { transform: scale(1.1); }
    .telegram  { background: #0088cc; }
    .messenger { background-color: #0084ff; }
    .whatsapp  { background-color: #25d366; }

  `;
  document.head.appendChild(style);

  // ---- HTML ----
  const chatHTML = `
    <div class="chat-container" id="chatContainer">
      <div class="chat-options" id="chatOptions">
        <a href="https://t.me/yourpage" target="_blank" class="chat-icon telegram" title="Telegram">
          <img src="residia/images/telegram.png" alt="TG">
        </a>
        <a href="https://m.me/yourpage" target="_blank" class="chat-icon messenger" title="Messenger">
          <img src="../images/messenger.png" alt="FB">
        </a>
        <a href="https://wa.me/yourphonenumber" target="_blank" class="chat-icon whatsapp" title="WhatsApp">
          <img src="../images/whatapp.png" alt="WA">
        </a>

      </div>
      <button class="chat-main-btn" id="chatMainBtn">
        <span class="icon-open">💬</span>
        <span class="icon-close">✕</span>
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // ---- Toggle Open/Close ----
  const chatContainer = document.getElementById('chatContainer');
  const chatMainBtn   = document.getElementById('chatMainBtn');

  chatMainBtn.addEventListener('click', function() {
    if (!wasDragged) {
      chatContainer.classList.toggle('active');
    }
  });

  window.addEventListener('click', function(event) {
    if (!chatContainer.contains(event.target) && chatContainer.classList.contains('active')) {
      chatContainer.classList.remove('active');
    }
  });

  // ---- DRAG (Easy Touch Style) ----
  let isDragging = false;
  let wasDragged = false;
  let startX, startY, startRight, startBottom;

  function clampPosition(right, bottom) {
    const headerHeight = 100;
    const maxBottom = window.innerHeight - headerHeight - 70;
    return {
      right:  Math.max(10, Math.min(window.innerWidth  - 70, right)),
      bottom: Math.max(10, Math.min(maxBottom, bottom))
    };
  }

  // --- Mouse ---
  chatContainer.addEventListener('mousedown', function(e) {
    // មិន drag ពី link icon
    if (e.target.closest('a')) return;
    isDragging = true;
    wasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    startRight  = parseInt(chatContainer.style.right  || '30', 10);
    startBottom = parseInt(chatContainer.style.bottom || '30', 10);
    chatContainer.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const dx = startX - e.clientX;
    const dy = startY - e.clientY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) wasDragged = true;
    if (!wasDragged) return;

    const pos = clampPosition(startRight + dx, startBottom + dy);
    chatContainer.style.right  = pos.right  + 'px';
    chatContainer.style.bottom = pos.bottom + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    chatContainer.classList.remove('dragging');
    setTimeout(function(){ wasDragged = false; }, 150);
  });

  // --- Touch (Mobile) ---
  chatContainer.addEventListener('touchstart', function(e) {
    // មិន drag ពី link icon — ឲ្យ click link ធម្មតា
    if (e.target.closest('a')) return;
    const touch = e.touches[0];
    isDragging  = true;
    wasDragged  = false;
    startX = touch.clientX;
    startY = touch.clientY;
    startRight  = parseInt(chatContainer.style.right  || '30', 10);
    startBottom = parseInt(chatContainer.style.bottom || '30', 10);
    // មិន preventDefault នៅទីនេះ — ឲ្យ click ប៊ូតុងដំណើរការ
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = startX - touch.clientX;
    const dy = startY - touch.clientY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) wasDragged = true;
    if (!wasDragged) return;

    const pos = clampPosition(startRight + dx, startBottom + dy);
    chatContainer.style.right  = pos.right  + 'px';
    chatContainer.style.bottom = pos.bottom + 'px';
    e.preventDefault(); // block page scroll តែពេល drag ប៉ុណ្ណោះ
  }, { passive: false });

  document.addEventListener('touchend', function() {
    isDragging = false;
    setTimeout(function(){ wasDragged = false; }, 150);
  });

});