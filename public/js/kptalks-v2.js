(function($) {

  $.kptalks = function(options) {

    var settings = $.extend({
        api: 'http://api.kptaipei.tw/v1/category/40?accessToken=kp53f568e77303e9.28212837',
        image: [
          'http://goooooooogle.github.io/kp/img/kp.png',
          'http://goooooooogle.github.io/kp/img/kp-2.png'
        ],
        height: 450, // image height
        width: 466, // image width
        effect: 'default', // options: default, fast, slow, veryslow, jump, sneaky
        popup_effect: 'fade', // options: default, fade, slide, zoom
        popup_radius: '8px', // popup radius
        popup_color: 'black', // popup font color
        popup_bgcolor: 'beige', // popup background color
        readmore_color: 'brown', // popup font color
        comein_position: 80, // show kp after scroll more than percent of page height
        default_text: '喵星人駕到~', // the words show in popup before loading done
        enter_from: 'left', // options: left, right
        enter_distance: -130 // the distance to window side

        //left: -130, // remove this option after ver2.0
    }, options);

    createKP(settings);

    var container = $('#kp_come_container'),
        kp_image = $('#kp_come_container img'),
        popup = $('#kp_popup'),
        close = $('#kp_close_popup');

    $(window).scroll(function(){
      var scroll = $(window).scrollTop(),
          window_h = $(window).height(),
          page_h = $(document).height(),
          come_in = {},come_out = {};
      come_in[settings.enter_from] = settings.enter_distance+'px';
      come_out[settings.enter_from] = '-'+(settings.width)+'px';

      if((scroll+window_h) > (page_h*(settings.comein_position/100))) {
        if(container.css(settings.enter_from) == '-'+settings.width+'px') {
          switch(settings.effect) {
            case 'fast':
              container.animate(come_in, 100, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'slow':
              container.animate(come_in, 1000, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'veryslow':
              container.animate(come_in, 10000, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'jump':
              container
                .css('bottom','-'+settings.height+'px')
                .css(settings.enter_from,settings.enter_distance);
              container
                .animate({bottom: 0}, 300)
                .animate({bottom: '-10px'}, 50)
                .animate({bottom: 0}, 50)
                .animate({bottom: '-10px'}, 50)
                .animate({
                  bottom: 0
                }, 300, function() {
                  popupIn(settings.popup_effect);
                });
              break;

            case 'sneaky':
              var sneaky_pos1 = {},
                  sneaky_pos2 = {},
                  sneaky_pos3 = {};
              sneaky_pos1[settings.enter_from] = '-'+(settings.width*0.54)+'px';
              sneaky_pos2[settings.enter_from] = '-'+(settings.width*0.6)+'px';
              sneaky_pos3[settings.enter_from] = '-'+(settings.width*0.7)+'px';

              container
                .animate(sneaky_pos1, 2000).delay(2000)
                .animate(sneaky_pos2, 1000).delay(1000)
                .animate(sneaky_pos1, 1000).delay(2000)
                .animate(sneaky_pos3, 2000).delay(1000)
                .animate(come_in, 3000, function() {
                  popupIn(settings.popup_effect);
                });
              break;

            default:
              container.animate(
                come_in, 500, function() {
                  popupIn(settings.popup_effect);
              });
              break;
          }
        }
      }
      else {
        if(container.css(settings.enter_from) == settings.enter_distance+'px') {
          popup.hide();
          container.animate(come_out, 100);
          //loadData(settings);
        }
      }
    });
    kp_image.click(function(){
      var come_out_forever = {};
      come_out_forever[settings.enter_from] = '-'+(settings.width+10)+'px';
      popup.remove();
      container.animate(come_out_forever, 100);
    });
    close.click(function(){
      popup.hide();
      //loadData(settings);
    });
  };

  function createKP(settings){
    var img_src,arrow_pos;
    if($.isArray(settings.image)==true)
      img_src = settings.image[Math.floor(Math.random()*(settings.image.length))];
    else
      img_src = settings.image;
    if(settings.enter_from == 'left')
      arrow_pos = 'right';
    else
      arrow_pos = 'left';
    var object = '<div id="kp_come_container" style="width:'+settings.width+'px; height:'+settings.height+'px; '+settings.enter_from+':-'+settings.width+'px; bottom:0;"><img src="'+img_src+'" style="width:'+settings.width+'px; height:'+settings.height+'px;"><div id="kp_popup" style="'+settings.enter_from+':'+((settings.width)*0.8)+'px;top:'+(settings.height*0.28)+'px;-webkit-border-radius:'+settings.popup_radius+';-moz-border-radius:'+settings.popup_radius+';border-radius:'+settings.popup_radius+';background-color:'+settings.popup_bgcolor+'"><div id="kp_says" style="color:'+settings.popup_color+'">'+settings.default_text+'<a href="http://kptaipei.tw" target="_blank" class="kp_readmore" style="color:'+settings.readmore_color+'">了解更多柯文哲的政見</a></div><div id="kp_popup_arrow_shadow" style="border-'+arrow_pos+': 40px solid rgba(0,0,0,.1);'+settings.enter_from+': -40px;"></div><div id="kp_popup_arrow" style="border-'+arrow_pos+': 42px solid '+settings.popup_bgcolor+';'+settings.enter_from+': -40px;"></div><div id="kp_close_popup">X</div></div></div>';
    $('body').append(object);
    //loadData(settings);
  }

  /*function loadData(settings){
    var posts = {}, says;
    $.get(settings.api,function(results){
      var i = 0;
      $.each(results.data,function(ind,item){
        posts[i] = item; i++;
      });
      var post = posts[Math.floor(Math.random()*(i-1))]
          link = '<a href="'+post.url+'" target="_blank" class="kp_readmore" style="color:'+settings.readmore_color+'">了解更多柯文哲的政見</a>';

      var title = (post.title).replace(/【柯p新政】/g,"");
      var content = stringReplace(post.plain_content);
      content = content.split('\n');
      if(content[1] == undefined){
        says = '<p id="kp_say_bighi" style="color:'+settings.popup_color+'">'+settings.default_text+'<br>我提出<br>「'+title.substring(2)+'」</p>'+link;
      }
      else {
        says = '<p id="kp_say_hi" style="color:'+settings.popup_color+'">'+settings.default_text+'</p>'+content[3]+content[4]+'...'+link+'</p>';
      }

      $('#kp_says').scrollTop(0).html(says).promise().done(function(){
        $('p').removeAttr("style"); $('span').removeAttr("style");
      });
    });
  }*/

  /*function stringReplace(string){
    return string.replace(/柯文哲/g,'我')
      .replace(/台北市長參選人/g,'')
      .replace(/我表示/g,'我認為')
      .replace(/我指出/g,'我認為')
      .replace('今（29）日','')
      .replace('「','')
      .replace('」','')
      .replace('柯P的主張我的政策主張','我主張');
  }*/

  function popupIn(effect) {
    switch(effect) {

      case 'fade':
        $('#kp_popup').fadeIn('slow');
        break;

      case 'slide':
        $('.kp_readmore').hide(function(){
          $('#kp_popup').slideDown('fast',function(){
            $('.kp_readmore').fadeIn();
          });
        });
        break;

      case 'zoom':
        $('#kp_says').hide(function(){
          $('#kp_popup').show('slow',function(){
            $('#kp_says').fadeIn();
          });
        });
        break;

      default:
        $('#kp_popup').show();
        break;
    }
  }

}(jQuery));
