/***************************************************
==================== JS INDEX ======================
****************************************************

01. PreLoader Js
02. Sticky Js
03. Menu Controls JS
04. offcanvas Menu JS
05. offcanvas two Menu JS
06. Sidebar Js
07. AOS Js
08. Backtotop Js
09. Magnific Popup Js
10. Counter Js
11. Feature Widget Animation Js
12. Service Two Images Hover Animation Js
13. Bg Image For Attribute  Js
14. Mouse active Js





****************************************************/



(function ($) {
	"use strict";

   /*----------------------------------------------
        # Image Trail Animation
        ----------------------------------------------*/
        if ($(".image-trail-animation").length && typeof gsap !== "undefined") {

            const MathUtils = {
                lerp: (a, b, n) => (1 - n) * a + n * b,
                distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
            };

            $(".image-trail-animation").each(function () {

                const section = this;
                const imagesWrapper = section.querySelector(".image-trail-images");
                if (!imagesWrapper) return;

                const images = [...imagesWrapper.querySelectorAll("img")];

                let mouse = { x: 0, y: 0 };
                let lastMouse = { x: 0, y: 0 };
                let cachedMouse = { x: 0, y: 0 };

                const threshold = 80;
                let zIndex = 1;
                let imgIndex = 0;

                const getMousePos = (e) => {
                    const rect = section.getBoundingClientRect();
                    return {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                };

                section.addEventListener("mousemove", (e) => {
                    mouse = getMousePos(e);
                });

                class ImageTrail {
                    constructor() {
                        requestAnimationFrame(() => this.render());
                    }

                    render() {

                        const distance = MathUtils.distance(
                            mouse.x, mouse.y,
                            lastMouse.x, lastMouse.y
                        );

                        cachedMouse.x = MathUtils.lerp(
                            cachedMouse.x || mouse.x,
                            mouse.x,
                            0.15
                        );

                        cachedMouse.y = MathUtils.lerp(
                            cachedMouse.y || mouse.y,
                            mouse.y,
                            0.15
                        );

                        if (distance > threshold) {
                            this.showImage();
                            lastMouse = { ...mouse };
                        }

                        requestAnimationFrame(() => this.render());
                    }

                    showImage() {

                        const img = images[imgIndex];
                        if (!img) return;

                        gsap.killTweensOf(img);

                        const rect = img.getBoundingClientRect();

                        gsap.set(img, {
                            opacity: 1,
                            scale: 1,
                            zIndex: zIndex++,
                            x: cachedMouse.x - rect.width / 2,
                            y: cachedMouse.y - rect.height / 2
                        });

                        gsap.to(img, {
                            duration: 0.8,
                            ease: "expo.out",
                            x: mouse.x - rect.width / 2,
                            y: mouse.y - rect.height / 2
                        });

                        gsap.to(img, {
                            duration: 0.9,
                            delay: 0.3,
                            opacity: 0,
                            scale: 0.25,
                            ease: "power2.out"
                        });

                        imgIndex = (imgIndex + 1) % images.length;
                    }
                }

                new ImageTrail();

            });
        }

        if ($('.mission-tabs-section').length > 0) {

        $('.mission-tab').on('click', function () {

            const $this = $(this);
            const index = $this.index();

            $('.mission-tab').removeClass('active');
            $this.addClass('active');

            $('.mission-tab-content').removeClass('active');
            $('.mission-tab-content').eq(index).addClass('active');

        });

    }

      /* ================================
       Funfact Panel Js Start
    ================================ */

    if ($('.tp-funfact-panel-wrap').length) {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 1200px)", () => {
            let sections = gsap.utils.toArray(".tp-funfact-panel");

            gsap.to(sections, {
                xPercent: -80 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    start: "top 120px",
                    trigger: ".tp-funfact-panel-wrap",
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + document.querySelector(".tp-funfact-panel-wrap").offsetWidth
                }
            });
        });
    }

      ////////////////////////////////////////////////////
	    // 01. PreLoader Js
      document.addEventListener("DOMContentLoaded", () => {
          // Create GSAP timeline
          const tl = gsap.timeline();
          const svg = document.getElementById("preloaderSvg");
          const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
          const flat  = "M0 2S175 1 500 1s500 1 500 1V0H0Z";
          // Text animation
          tl.to(".preloader-heading .load-text, .preloader-heading .cont", {
              delay: 1,
              y: -80,
              opacity: 0,
              duration: 0.6
          })
          // SVG curve animation
          .to(svg, {
              duration: 0.6,
              attr: { d: curve },
              ease: "power2.inOut"
          })
          // Flatten SVG
          .to(svg, {
              duration: 0.6,
              attr: { d: flat },
              ease: "power2.inOut"
          })
          // Slide preloader up
          .to(".preloader", {
              y: "-130%",
              duration: 0.8,
              ease: "power4.inOut"
          })
          // Remove from DOM flow
          .set(".preloader", {
              display: "none",
              zIndex: -1
          });
      });



      ////////////////////////////////////////////////////
	    // 02. Sticky Js
      $(window).on("scroll", function () {
        if ($(window).scrollTop() >= 260) {
          $(".header").addClass("fixed-header");
        } else {
          $(".header").removeClass("fixed-header");
        }
      });

       if ($('.test-slider-6').length > 0) {
    const testSlider6 = new Swiper(".test-slider-6", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
    });
   }


    if ($('.brand-sec-slider-4').length > 0) {
    const brandSecSlider4 = new Swiper(".brand-sec-slider-4", {
        spaceBetween: 15,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        
        breakpoints: {
            1399: {
                slidesPerView: 6,
            },
            1199: {
                slidesPerView: 5.5,
            },
            991: {
                slidesPerView: 4.5,
            },
            767: {
                slidesPerView: 3.3,
            },
            575: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1.6,
            },
        },
    });
   }

    if ($(".service-sec-4").length) {

            var $serviceItems = $(".service-box-new-4");
            var $leftImage = $(".service-left-img");
            var $rightImage = $(".service-right-img");

            $serviceItems.on("mouseenter", function () {

                var $this = $(this);

                var leftImage = $this.attr("data-left");
                var rightImage = $this.attr("data-right");

                if (!leftImage || !rightImage) {
                    return;
                }

                // Active service
                $serviceItems.removeClass("active");
                $this.addClass("active");

                // Image transition
                $(".service-sec-4__image").addClass("is-changing");

                setTimeout(function () {

                    $leftImage.attr("src", leftImage);
                    $rightImage.attr("src", rightImage);

                    $(".service-sec-4__image").removeClass("is-changing");

                }, 220);
            });

        }

       //==================================================
// Statistics Section Check
//==================================================
if (
    $(".stats-section").length > 0 &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
) {

    gsap.registerPlugin(ScrollTrigger);


    //==================================================
    // Smooth Counter Animation
    // Counter will work on ALL devices
    //==================================================
    $(".stats-item").each(function () {

        var $item = $(this);
        var $counter = $item.find(".counter-number");

        if (!$counter.length) {
            return;
        }

        var targetNumber = parseInt(
            $counter.attr("data-count"),
            10
        );

        if (isNaN(targetNumber)) {
            return;
        }

        var counterValue = {
            value: 0
        };


        gsap.to(counterValue, {

            value: targetNumber,

            // Smooth counter speed
            duration: 2.8,

            ease: "power1.out",

            scrollTrigger: {

                trigger: $item,

                // Counter works on every screen size
                start: "top 80%",

                toggleActions: "play none none reverse",

                invalidateOnRefresh: true
            },

            onUpdate: function () {

                $counter.text(
                    Math.round(counterValue.value)
                );

            },

            onComplete: function () {

                $counter.text(targetNumber);

            },

            onReverseComplete: function () {

                $counter.text("0");

            }

        });

    });


    //==================================================
    // LEFT / RIGHT ANIMATION
    // Only works on XL and above
    // XL = 1200px+
    //==================================================
    ScrollTrigger.matchMedia({

        //==================================================
        // XL / Desktop
        //==================================================
        "(min-width: 1200px)": function () {


            //==================================================
            // 01 - LEFT TO RIGHT
            //==================================================
            if ($(".stats-item-1").length) {

                gsap.fromTo(
                    ".stats-item-1",

                    {
                        x: -150
                    },

                    {
                        x: 150,

                        ease: "none",

                        scrollTrigger: {
                            trigger: ".stats-item-1",

                            start: "top bottom",
                            end: "bottom top",

                            scrub: 1.5,

                            invalidateOnRefresh: true
                        }
                    }
                );

            }


            //==================================================
            // 02 - RIGHT TO LEFT
            //==================================================
            if ($(".stats-item-2").length) {

                gsap.fromTo(
                    ".stats-item-2",

                    {
                        x: 150
                    },

                    {
                        x: -150,

                        ease: "none",

                        scrollTrigger: {
                            trigger: ".stats-item-2",

                            start: "top bottom",
                            end: "bottom top",

                            scrub: 1.5,

                            invalidateOnRefresh: true
                        }
                    }
                );

            }


            //==================================================
            // 03 - LEFT TO RIGHT
            //==================================================
            if ($(".stats-item-3").length) {

                gsap.fromTo(
                    ".stats-item-3",

                    {
                        x: -150
                    },

                    {
                        x: 150,

                        ease: "none",

                        scrollTrigger: {
                            trigger: ".stats-item-3",

                            start: "top bottom",
                            end: "bottom top",

                            scrub: 1.5,

                            invalidateOnRefresh: true
                        }
                    }
                );

            }


            //==================================================
            // 04 - RIGHT TO LEFT
            //==================================================
            if ($(".stats-item-4").length) {

                gsap.fromTo(
                    ".stats-item-4",

                    {
                        x: 150
                    },

                    {
                        x: -150,

                        ease: "none",

                        scrollTrigger: {
                            trigger: ".stats-item-4",

                            start: "top bottom",
                            end: "bottom top",

                            scrub: 1.5,

                            invalidateOnRefresh: true
                        }
                    }
                );

            }

        }

    });


    //==================================================
    // Refresh ScrollTrigger
    //==================================================
    $(window).on("load", function () {

        ScrollTrigger.refresh();

    });

}
    
      //==================================================
            // Award Text - Left To Right Scroll Animation
            //==================================================
            if (
                $(".left-center-ani").length > 0 &&
                typeof gsap !== "undefined" &&
                typeof ScrollTrigger !== "undefined"
            ) {

                gsap.registerPlugin(ScrollTrigger);

                $(".left-center-ani").each(function () {

                    var $item = $(this);

                    gsap.fromTo(
                        $item[0],
                        {
                            x: -300
                        },
                        {
                            x: 300,
                            ease: "none",
                            scrollTrigger: {
                                trigger: $item[0],
                                start: "top 90%",
                                end: "bottom 10%",
                                scrub: 1.5
                            }
                        }
                    );

                });

            }


             if (document.querySelectorAll(".award-list-items-10").length) {
            const awardListItems10 = document.querySelectorAll(".award-list-items-10");

            awardListItems10.forEach((box) => {
                const hoverImg = box.querySelector(".hover-image");
                if (!hoverImg) return;

                box.addEventListener("mousemove", (event) => {
                const rect = box.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                hoverImg.style.opacity = "1";
                hoverImg.style.visibility = "visible";
                hoverImg.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
                });

                box.addEventListener("mouseleave", () => {
                hoverImg.style.opacity = "0";
                hoverImg.style.visibility = "hidden";
                hoverImg.style.transform = `translateY(-50%) rotate(0deg)`;
                });
            });
            }


             /*=============================================
        Testimonial Effect
        =============================================*/
      gsap.registerPlugin(ScrollTrigger);

let mmw = gsap.matchMedia();

mmw.add("(min-width: 1400px)", function () {

    const section = document.querySelector(".client-testimonial");

    if (!section) return;

    const title = section.querySelector(".section-3-title-wrapper");
    const items = gsap.utils.toArray(
        section.querySelectorAll(".client-testimonial__item")
    );

    if (!items.length) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // Title animation
    if (title) {
        tl.to(title, {
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.5,
            ease: "power1.out"
        });
    }

    // Items start immediately after title animation
    tl.fromTo(
        items,
        {
            xPercent: 100,
            opacity: 0
        },
        {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        },
        title ? "-=0.1" : 0
    );

    // Short end hold
    tl.to({}, {
        duration: 0.2
    });

    return function () {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
    };

});

    
    


      ////////////////////////////////////////////////////
      // 03. Menu Controls JS
      $('.tw-hamburger-toggle').on('click', function(){
        $('.tw-header-side-menu').slideToggle('tw-header-side-menu');
      });
      if($('.tw-main-menu-content').length && $('.tw-main-menu-mobile').length){
        let navContent = document.querySelector(".tw-main-menu-content").outerHTML;
        let mobileNavContainer = document.querySelector(".tw-main-menu-mobile");
        mobileNavContainer.innerHTML = navContent;
        let arrow = $(".tw-main-menu-mobile .has-dropdown > a");
        arrow.each(function () {
          let self = $(this);
          let arrowBtn = document.createElement("BUTTON");
          arrowBtn.classList.add("dropdown-toggle-btn");
          arrowBtn.innerHTML = "<i class='ph ph-caret-right'></i>";
          self.append(function () {
            return arrowBtn;
          });
          self.find("button").on("click", function (e) {
            e.preventDefault();
            let self = $(this);
            self.toggleClass("dropdown-opened");
            self.parent().toggleClass("expanded");
            self.parent().parent().addClass("dropdown-opened").siblings().removeClass("dropdown-opened");
            self.parent().parent().children(".tw-submenu").slideToggle();
          });
          });
      }



      ////////////////////////////////////////////////////
      // 04. offcanvas Menu JS
      $(".tw-offcanvas-open-btn").on("click", function () {
        $(".tw-offcanvas-2-area").addClass("opened");

        setTimeout(() => {
          $('.tw-text-hover-effect-word').addClass('animated-text');
        }, 900);
      });


      ////////////////////////////////////////////////////
      // 05. offcanvas two Menu JS
      $(".tw-offcanvas-2-close-btn").on("click", function () {
        setTimeout(() => {
          $('.tw-text-hover-effect-word').removeClass('animated-text');
        }, 1200);

        $(".tw-offcanvas-2-area").removeClass("opened");
        $(".body-overlay").removeClass("opened");

      });



      ////////////////////////////////////////////////////
      // 06. Sidebar Js
      $(".tw-menu-bar").on("click", function () {
        $(".twoffcanvas").addClass("opened");
        $(".body-overlay").addClass("apply");
      });
      $(".close-btn").on("click", function () {
        $(".twoffcanvas").removeClass("opened");
        $(".body-overlay").removeClass("apply");
      });
      $(".body-overlay").on("click", function () {
        $(".twoffcanvas").removeClass("opened");
        $(".body-overlay").removeClass("apply");
      });










    ////////////////////////////////////////////////////
    // 07. AOS Js
    AOS.init({
      once: false, // animation will happen every time you scroll
      offset: 0, // start animation when element enters the viewport
      anchorPlacement: "top-bottom", // when the bottom of the element hits the bottom of the screen
    });




  	// 08. Backtotop Js
    function back_to_top() {
      var btn = $('#back_to_top');
      var btn_wrapper = $('.back-to-top-wrapper');
      $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
          btn_wrapper.addClass('back-to-top-btn-show');
        } else {
          btn_wrapper.removeClass('back-to-top-btn-show');
        }
      });

      btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 300);
      });
    }
    back_to_top();





      ////////////////////////////////////////////////////
      // 09. Magnific Popup Js
      $('.open-popup').magnificPopup({
          type: 'iframe',
          removalDelay: 300,
          mainClass: 'mfp-fade',
      });



      
    ////////////////////////////////////////////////////
    // 10. Counter Js
    new PureCounter();
    new PureCounter({
        filesizing: true,
        selector: ".filesizecount",
        pulse: 2,
    });

     /* ================================
      Custom Accordion Js Start
    ================================ */

   if ($('.accordion-box').length) {
        $(".accordion-box").on('click', '.acc-btn', function () {
            var outerBox = $(this).closest('.accordion-box');
            var target = $(this).closest('.accordion');
            var accBtn = $(this);
            var accContent = accBtn.next('.acc-content');

            if (target.hasClass('active-block')) {
                // Already open, so close it
                accBtn.removeClass('active');
                target.removeClass('active-block');
                accContent.slideUp(300);
            } else {
                // Close all others
                outerBox.find('.accordion').removeClass('active-block');
                outerBox.find('.acc-btn').removeClass('active');
                outerBox.find('.acc-content').slideUp(300);

                // Open clicked one
                accBtn.addClass('active');
                target.addClass('active-block');
                accContent.slideDown(300);
            }
        });
    }


	//>> Banner Pinned Image Start <<//
    if (
        $(".pinned-3").length > 0 &&
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
    ) {
        var isDesktop = window.matchMedia("(min-width: 1400px)").matches;

        if (isDesktop) {
            gsap.registerPlugin(ScrollTrigger);

            var tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".pinned-3",
                    pin: true,
                    pinSpacing: false,
                    scrub: 2.1,
                    start: "top top",
                    endTrigger: ".banner-section-3__video__wrapper",
                    end: "bottom bottom",
                    markers: false
                }
            });

            tl.to(".pinned-3", {
                width: "100vw",
                height: "100vh",
                marginLeft: 0,
                left: 0,
                x: 0,
                borderRadius: 0,
                ease: "none"
            }, 0);

            tl.to(".pinned-3 #myImage", {
                width: "110vw",
                height: "100vh",
                marginLeft: 0,
                borderRadius: 0,
                x: 0,
                xPercent: -7,
                ease: "none"
            }, 0);
        }
    }

//>> Brand Box Sequential Animation Start <<//
if (
    $(".brand-section-5 .brand-box").length > 0 &&
    typeof gsap !== "undefined"
) {

    var $brandBoxes = $(".brand-section-5 .brand-box");

    gsap.set($brandBoxes, {
        transformPerspective: 1000,
        transformOrigin: "center center",
        rotateX: 0,
        opacity: 1
    });

    var brandTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.3
    });

    $brandBoxes.each(function () {

        brandTl.fromTo(this,
            {
                rotateX: 180
            },
            {
                rotateX: 0,
                duration: 0.4,
                ease: "power2.out"
            }
        );

    });

}
//>> Brand Box Sequential Animation End <<//




	  ////////////////////////////////////////////////////
    // 11. Feature Widget Animation Js
		function service_animation() {
			var active_bg = $(".feature-widget .active-bg");
			var element = $(".feature-widget .current");
			$(".feature-widget .feature-2-item").on("mouseenter", function () {
				var e = $(this);
				activeService(active_bg, e);
			});
			$(".feature-widget").on("mouseleave", function () {
				element = $(".feature-widget .current");
				activeService(active_bg, element);
				element.closest(".feature-2-item").siblings().removeClass("mleave");
			});
			activeService(active_bg, element);
		}
		service_animation();
		function activeService(active_bg, e) {
			if (!e.length) {
				return false;
			}
			var topOff = e.offset().top;
			var height = e.outerHeight();
			var menuTop = $(".feature-widget").offset().top;
			e.closest(".feature-2-item").removeClass("mleave");
			e.closest(".feature-2-item").siblings().addClass("mleave");
			active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
		}
		$(".feature-widget .feature-2-item").on("click", function () {
			$(".feature-widget .feature-2-item").removeClass("current");
			$(this).addClass("current");
		});



    ////////////////////////////////////////////////////
    // 12. Service Two Images Hover Animation Js
    $('.service-two-list-wrap .service-two-list-item').on("mouseenter", function () {
        $('#service-two-thumb').removeClass().addClass($(this).attr('rel'));
        $(this).addClass('active').siblings().removeClass('active');
    });




      ////////////////////////////////////////////////////
      // 13. Bg Image For Attribute  Js
      $(".bg-img").each(function () {
          var img = $(this).data("background-image");
          if (img) {
              $(this).css("background-image", "url('" + img + "')");
          }
      });




    ////////////////////////////////////////////////////
    // 14. Mouse active Js 
    $(document).ready(function () {
        $(
        ".service-ip-wrapper"
        ).on("mouseenter", function () {
        $(this).addClass("active").siblings().removeClass("active");
        });

        $(
        ".service-ip-wrapper"
        ).on("mouseenter", function () {
        $(this).addClass("active");
        $(this)
            .parent()
            .siblings()
            .find(
            ".service-ip-wrapper"
            )
            .removeClass("active");
        });
    });





$(document).ready(function () {

  function initRipples() {
    $(".ripple-image").each(function () {
      var $container = $(this);
      var $img = $container.find("img").first();

      if ($img.length === 0) return;

      var img = new Image();
      img.src = $img.attr("src");

      img.onload = function () {
        var imgURL = img.src;

        $container.css({
          "background-image": "url(" + imgURL + ")",
          "background-size": "cover",
          "background-position": "center center"
        });

        // init ripples plugin
        if (typeof $container.ripples === "function") {
          $container.ripples({
            resolution: 400,
            perturbance: 0.03,
            imageUrl: imgURL
          });
        }

        $img.hide();
      };
    });
  }

  initRipples();

});




})(jQuery);
