// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

UPDATED: mobirise devs:
  added support for requestAnimationFrame

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/
(function( $ ){
    var $window = $(window);

    var uniqNum = 123;
    var parallaxList = [];

    var supportTransform = (function() {
        // FALSE if Mobirise stupid core (Really laggy transform parallax)
        if(/Mobirise/g.test(navigator.userAgent)) {
            return false;
        }

        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
        var div = document.createElement('div');
        for(var i = 0; i < prefixes.length; i++) {
            if(div && div.style[prefixes[i]] !== undefined) {
                return prefixes[i];
            }
        }
        return false;
    }());

    var support3dtransform = (function() {
        if (!window.getComputedStyle) {
            return false;
        }

        var el = document.createElement('p'), 
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }());

    // scroll parallax
    var scroll = function() {
        var wndPos = $window.scrollTop();
        var wndHeight = $window.height();

        for(var k = 0, len = parallaxList.length; k < len; k++) {
            var $this = parallaxList[k].$this;

            //get the starting position of each element to have parallax applied to it
            var top = $this.offset().top;
            var height = parallaxList[k].outerHeight ? $this.outerHeight(true) : $this.height();

            // Check if totally above or totally below viewport
            if (top + height < wndPos || top > wndPos + wndHeight) {
                continue;
            }

            var position = (top - wndPos) * parallaxList[k].speedFactor;

            if(supportTransform) {
                //top
                position = Math.round(wndPos - top + position);
                var transform = 'translateY(' + position + 'px)';
                if(support3dtransform) {
                    transform = 'translate3d(0, ' + position + 'px, 0)';
                }
                parallaxList[k].image.css({
                    WebkitTransform: transform,
                    transform: transform
                });
            } else {
                parallaxList[k].image.css('backgroundPosition', parallaxList[k].xpos + " " + Math.round(position) + "px");
            }
        }
    }

    // cover <img>
    var coverImage = function() {
        var wndW = $window.width();
        var wndH = $window.height();

        for(var k = 0, len = parallaxList.length; k < len; k++) {
            var $parent = parallaxList[k].$this;
            var $img = parallaxList[k].image;
            var parentW = $parent.outerWidth(true);
            var parentH = $parent.outerHeight(true);
            var imgH = $img[0].naturalHeight;
            var imgW = $img[0].naturalWidth;
            var css = {
                width: '',
                height: '',
                marginTop: '',
                marginLeft: ''
            };

            // cover by width
            if(wndW / wndH > imgW / imgH) {
                css.width = wndW;
                css.marginTop = - (wndW * imgH / imgW - parentH) / 2;
            }

            // cover by height
            else {
                css.height = wndH;
                css.marginLeft = - (wndH * imgW / imgH - parentW) / 2;
            }

            $img.css(css);
        }
    }
    $window.on('scroll resize load', function() {
        window.requestAnimationFrame(scroll);
    });
    if(supportTransform) {
        $window.on('resize load', function() {
            window.requestAnimationFrame(coverImage);
        });
    }

    // init parallax
    var parallax = function($this, xpos, speedFactor, outerHeight) {
        uniqNum += 68;
        $this.data('jquery-parallax-instance', 'jqueryparallax' + uniqNum);
        var image = $this;
        var src = $this.css('background-image');

        if(supportTransform) {
            src = src.replace(/^url\(['"]?/g,'').replace(/['"]?\)$/g,'');
            image = $('<div class="jquery-parallax-overflow" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;"><img alt=""></div>').prependTo($this).children('img').attr('src', src);
            $this.css('background-image', '');
        } else {
            $this.css({
                transform: 'translateZ(0)'
            })
        }
        parallaxList.push({
            instance: 'jqueryparallax' + uniqNum,
            $this: $this,
            image: image,
            xpos: xpos,
            speedFactor: speedFactor,
            outerHeight: outerHeight,
            src: src
        });
        if(supportTransform) {
            window.requestAnimationFrame(coverImage);
        }
        window.requestAnimationFrame(scroll);
    };

    // destroy parallax
    var destroy = function($this) {
        var instance = $this.data('jquery-parallax-instance');
        if(instance) {
            $this.removeData('jquery-parallax-instance')
            $this.css({
                backgroundPosition: '',
                transform: ''
            });
            for(var k = 0, len = parallaxList.length; k < len; k++) {
                if(parallaxList[k].instance === instance) {
                    if(supportTransform) {
                        parallaxList[k].src && parallaxList[k].$this.css('background-image', 'url(' + parallaxList[k].src + ')');
                        parallaxList[k].image && parallaxList[k].image.parent().remove();
                    }
                    parallaxList.splice(k, 1);
                    return;
                }
            }
        }
    };

    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        $(this).each(function() {
            if(xpos == 'destroy') {
                destroy($(this));
            } else {
                parallax(
                    $(this),
                    typeof xpos !== 'undefined' ? xpos : '50%',
                    typeof speedFactor !== 'undefined' ? speedFactor : 0.1,
                    typeof outerHeight !== 'undefined' ? outerHeight : true
                );
            }
        })
    };
})(jQuery);
