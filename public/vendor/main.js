/***************************************************
==================== JS INDEX ======================
01. Service List Hover Animation
02. Design Showcase Active (Swiper)
03. Project Showcase 2 Animation
04. Text Draw (Split Text Animation)
05. Mouse Parallax Effect
06. Button Text Split Animation
07. Hero Animation (ScrollTrigger)
08. Team List Animation (Hover & Scroll)
09. Thumb Wrapper (Pinned Image Effect)
10. Projects 2 Section Scroll Animation
11. Showcase & Project Sliders (Swiper)
12. Testimonial & Brand Sliders
13. Image Reveal (ClipPath Animation)
14. Service-4 Accordion Interaction
15. Professional-4 Image Switch on Hover
16. Service-7 Hover Active State
17. Showcase Snap Slider (ScrollTrigger)
18. WebGL Hover Image Distortion Effect
19. Achievements Slider with Year Counter
20. Intro Overlay (Path Draw + Scroll Pin)
21. Showcase 13 / Project Showcase 14
22. Interactive Project Section
23. Portfolio Active Slider
24. About Section 10 List Animation
25. Utility Functions & Initialization
****************************************************/


(function ($) {
  "use strict";

  /* === Service list Hover Animation (index 01) === */
  function Team_animation() {
    const wrappers = [".services__wrapper", "award-4-wrapper"];

    wrappers.forEach(wrapperClass => {
      const wrapper = $(wrapperClass);
      const active_bg = wrapper.find(".active-bg");

      function moveBgTo(target) {
        if (!target.length) return;

        const offsetTop = target.offset().top;
        const height = target.outerHeight();
        const wrapperTop = wrapper.offset().top;
        const translateY = offsetTop - wrapperTop;

        active_bg.css({
          transform: `translateY(${translateY}px)`,
          height: `${height}px`,
          opacity: 1
        });
      }

      // On hover
      wrapper.find(`${wrapperClass.replace("services__wrapper", "services__item")}`).on("mouseenter", function () {
        moveBgTo($(this));
      });

      // On leave, hide background
      wrapper.on("mouseleave", function () {
        active_bg.css({
          opacity: 0,
          height: 0
        });
      });
    });
  }

  $(document).ready(function () {
    Team_animation();
  });

  /* === design-showcase__active (index 02) === */
  if ($(".design-showcase__active").length > 0) {
    var design_showcase = new Swiper(".design-showcase__active", {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 10,
      speed: 2000,
      pagination: {
        el: ".design-showcase-pagination",
        clickable: true,
      },
    });
  }

  /* === project-showcase-2 (index 03) === */
  if ($('.project-showcase-2').length) {
    const items = document.querySelectorAll('.project-showcase-2__item');

    const toggleItem = (item, open) => {
      const media = item.querySelector('.project-showcase-2__media');
      const view = item.querySelector('.view-projects');
      item.classList.toggle("active", open);

      gsap.to(media, {
        height: open ? media.scrollHeight : 0,
        marginTop: open ? 30 : 0,
        marginBottom: open ? 26 : 0,
        duration: 0.5, ease: "power2.out"
      });
      gsap.to(view, {
        height: open ? view.scrollHeight : 0,
        marginBottom: open ? 25 : 0,
        duration: 0.5, ease: "power2.out"
      });
    };

    items.forEach(item => {
      const media = item.querySelector('.project-showcase-2__media');
      const view = item.querySelector('.view-projects');
      gsap.set([media, view], { height: 0, margin: 0 });
      media.append(...media.querySelectorAll('.thumb'));
    });

    toggleItem(items[0], true);

    items.forEach(item => {
      item.addEventListener('click', () => {
        const isOpen = item.classList.contains("active");
        items.forEach(i => toggleItem(i, false));
        if (!isOpen) toggleItem(item, true);
      });
    });
  }

  /* === text-drow (index 04) === */
  document.addEventListener("DOMContentLoaded", () => {
    const textEls = document.querySelectorAll(".text-drow");

    textEls.forEach(textEl => {
      const nodes = Array.from(textEl.childNodes);
      textEl.innerHTML = "";

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split("").forEach(char => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.style.opacity = 0;
            textEl.appendChild(span);
          });
        } else if (node.nodeName === "BR") {
          textEl.appendChild(node);
        }
      });

      gsap.to(textEl.querySelectorAll("span"), {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.inOut",
      });
    });
  });

  /* === mouse-parallax (index 05) === */
  const elements = document.querySelectorAll(".mouse-parallax");
  elements.forEach((element) => {
    const inner = element.querySelector(".inner");

    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = offsetX - centerX;
      const deltaY = offsetY - centerY;

      gsap.to(inner, {
        x: deltaX * 0.6,
        y: deltaY * 0.6,
        rotationY: deltaX * 0.25,
        rotationX: -deltaY * 0.25,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(inner, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.7,
        ease: "power4.out",
      });
    });
  });

  /* === mouse-parallax (index 06) === */
  const buttons = document.querySelectorAll(".rr-btn-primary");
  buttons.forEach(button => {
    const textEl = button.querySelector(".text");

    if (!textEl) return;

    const hasIcon = button.querySelector(".left-icon") || button.querySelector("i");
    if (hasIcon) {
      button.classList.add("has-icon");
    }

    const text = textEl.textContent;
    textEl.innerHTML = "";
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      const delay = (text.length - index) * 0.05;
      span.style.transitionDelay = `${delay}s`;
      textEl.appendChild(span);
    });

    button.addEventListener("mouseenter", () => {
      const spans = textEl.querySelectorAll("span");
      spans.forEach(span => {
        span.classList.remove("animate");
        void span.offsetWidth;
        span.classList.add("animate");
      });
    });
  });

  /* === hero animation (index 07) === */
  let mm = gsap.matchMedia();
  if ($('.hero__inner').length > 0) {
    mm.add("(min-width: 992px)", () => {
      gsap.to(".hero__inner", {
        scale: 1,
        rotate: 360,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=1000",
          scrub: 1,
          pin: ".hero",
          pinSpacing: true,
        }
      });

    });
  }

  /* === team-list animation (index 07) === */
  if ($('.thumb-wrapper').length > 0) {
    document.addEventListener("DOMContentLoaded", () => {
      const teamListItems = document.querySelectorAll(".team-list li");
      const thumbWrapper = document.querySelector(".thumb-wrapper");

      function setActiveImage(imgSrc) {
        thumbWrapper.innerHTML = `
        <div class="thumb active">
          <img src="${imgSrc}" alt="Team member image" />
        </div>
      `;
      }

      const firstActive = document.querySelector(".team-list li.active");
      if (firstActive) {
        setActiveImage(firstActive.dataset.img);
      } else if (teamListItems.length > 0) {
        teamListItems[0].classList.add("active");
        setActiveImage(teamListItems[0].dataset.img);
      }

      teamListItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          teamListItems.forEach(i => i.classList.remove("active"));
          item.classList.add("active");
          setActiveImage(item.dataset.img);
        });
      });

      teamListItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center+=200",
          end: "bottom center",
          onEnter: () => setActiveScrollItem(index),
          onEnterBack: () => setActiveScrollItem(index),
        });
      });

      function setActiveScrollItem(index) {
        teamListItems.forEach((el, i) => {
          el.classList.toggle("active", i === index);
        });
        const imgSrc = teamListItems[index].dataset.img;
        if (imgSrc) {
          setActiveImage(imgSrc);
        }
      }
    });
  }

  /* === thumb-wrapper (index 02) === */
  if ($('.thumb-wrapper').length > 0) {
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".pin-area",
        start: "top 20%",
        end: "bottom bottom",
        pin: ".pin-element",
        pinSpacing: false,
      });

      ScrollTrigger.create({
        trigger: ".pin-area",
        start: "top 20%",
        end: "bottom bottom",
        pin: ".thumb-wrapper",
        pinSpacing: false,
      });
    });
  }

  /* === projects-2 (index 02) === */
  if ($('.projects-2').length > 0) {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      gsap.to('.projects-2', {
        opacity: 1,
        scrollTrigger: {
          trigger: '.projects-2',
          scrub: 1,
          start: 'top top',
          end: "bottom 100%",
          pin: '.projects-2__media',
          pinSpacing: false,
          toggleActions: 'play reverse play reverse',
          markers: false,
        }
      });

      const items = gsap.utils.toArray('.projects-2__item');
      const images = gsap.utils.toArray('.projects-2__media .thumb');

      setActiveImage(0);

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top top',
          end: 'bottom bottom',
          onEnter: () => setActiveImage(index),
          onEnterBack: () => setActiveImage(index),
        });
      });

      function setActiveImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
      }
    });
  }

  /* === projects-3__active (index 02) === */
  if ($(".projects-3__active").length > 0) {
    var design_showcase = new Swiper(".projects-3__active", {
      loop: true,
      speed: 2000,
      autoplay: {
        delay: 2500,
      },
      slidesPerView: 4,
      spaceBetween: 20,
      centeredSlides: true,

      breakpoints: {
        0: {
          slidesPerView: 1.2,
          spaceBetween: 10,
          centeredSlides: true
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20
        }
      }
    });
  }

  /* === projects-6__active (index 02) === */
  if ($(".project-6__slider").length > 0) {
    var design_showcase = new Swiper(".project-6__slider", {
      loop: true,
      speed: 2000,
      slidesPerView: 3,
      spaceBetween: 24,
      centeredSlides: false,
      autoplay: {
        delay: 2500,
      },
      pagination: {
        el: ".project-6__pagination",
        dynamicBullets: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        576: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        1200: {
          slidesPerView: 3,
        }
      }
    });
  }

  /* === testimonial-6__active (index 06) === */
  if ($(".testimonial-6__active").length > 0) {
    var design_showcase = new Swiper(".testimonial-6__active", {
      loop: true,
      speed: 2000,
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: ".testimonial-6__swiper-button-next",
        prevEl: ".testimonial-6__swiper-button-prev",
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true
        },
        576: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 1,
          spaceBetween: 20
        }
      }
    });
  }

  /* === testimonial-7__active (index 06) === */
  if ($(".testimonial-7__active").length > 0) {
    var design_showcase = new Swiper(".testimonial-7__active", {
      loop: true,
      speed: 2000,
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: ".testimonial-7__arrow-next",
        prevEl: ".testimonial-7__arrow-prev",
      },
    });
  }

  /* === brand-7 (index 06) === */
  if (document.querySelector(".brand-7__active")) {
    document.addEventListener("DOMContentLoaded", function () {
      const swiper = new Swiper(".brand-7__active", {
        slidesPerView: 'auto',
        spaceBetween: 273,
        centeredSlides: true,
        speed: 3500,
        loop: true,
        freeMode: false,
        allowTouchMove: false,
        autoplay: {
          delay: 0.5,
        },
        breakpoints: {
          0: {
            spaceBetween: 40,
          },
          576: {
            spaceBetween: 80
          },
          768: {
            spaceBetween: 120
          },
          1200: {
            spaceBetween: 150
          },
          1400: {
            spaceBetween: 273,
          }
        }
      });
    });
  }

  /* === reveal (index 06) === */
  function imageReveal() {
    const revealContainers = document.querySelectorAll(".reveal");

    revealContainers.forEach((container) => {
      let clipPath;

      if (container.classList.contains("reveal--left")) {
        clipPath = "inset(0 0 0 100%)";
      }
      if (container.classList.contains("reveal--right")) {
        clipPath = "inset(0 100% 0 0)";
      }
      if (container.classList.contains("reveal--top")) {
        clipPath = "inset(0 0 100% 0)";
      }
      if (container.classList.contains("reveal--bottom")) {
        clipPath = "inset(100% 0 0 0)";
      }

      const image = container.querySelector("img");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reset",
        }
      });

      tl.set(container, { autoAlpha: 1 });
      tl.from(container, {
        clipPath,
        duration: 1,
        delay: 0.3,
        ease: "power4.inOut"
      });
      tl.from(image, {
        scale: 1.3,
        duration: 1.2,
        delay: -1,
        ease: "power2.out"
      });
    });

    ScrollTrigger.refresh();
  }

  imageReveal();

  /* === slider-7__active (index 07) === */
  if ($(".slider-7__active").length > 0) {
    var design_showcase = new Swiper(".slider-7__active", {
      loop: true,
      speed: 2000,
      spaceBetween: 20,
      centeredSlides: true,
      pagination: {
        el: ".slider-7__swipers-pagination",
        clickable: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true
        },
        576: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 1,
          spaceBetween: 20
        }
      }
    });
  }

  /* === service-4__active (index 02) === */
  document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".service-4__item");

    if (items.length > 0) {
      items[0].classList.add("active");
      let icon = items[0].querySelector(".icon i");
      if (icon) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      }
    }

    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        items.forEach(i => {
          i.classList.remove("active");
          let icon = i.querySelector(".icon i");
          if (icon) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
          }
        });

        item.classList.add("active");
        let icon = item.querySelector(".icon i");
        if (icon) {
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        }
      });
    });
  });

  /* === professional-4__list__active (index 02) === */
  if ($(".professional-4__list ").length > 0) {
    const links = document.querySelectorAll(".professional-4__list a");
    const images = document.querySelectorAll(".professional-4__media img");

    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        const index = link.getAttribute("data-index");

        images.forEach((img, i) => {
          img.classList.remove("active");
          img.style.zIndex = 1;
        });

        const target = images[index];
        target.classList.add("active");
        target.style.zIndex = 2;
      });
    });
  }

  /* ===  hover-active (index 02) === */
  let rightItems = document.querySelectorAll('.service-7__list li');
  let leftItems = document.querySelectorAll('.service-7__wrap .service-7__item-box');

  rightItems.forEach((rightItem, index) => {
    rightItem.addEventListener('mouseenter', function () {
      handleHover(rightItem, leftItems[index]);
    });
  });

  function handleHover(rightItem, leftItem) {
    rightItems.forEach(item => {
      item.classList.remove('active');
      item.classList.add('li');
    });
    leftItems.forEach(item => {
      item.classList.remove('active');
      item.classList.add('service-7__item-box');
    });
    rightItem.classList.add('active');
    leftItem.classList.add('active');
  }

  document.addEventListener("DOMContentLoaded", function () {
    ShowcaseSnapSlider();
  });

  function ShowcaseSnapSlider() {
    if ($('.rr-snap-slider-holder').length > 0) {

      const snapSlides = gsap.utils.toArray(".rr-snap-slide");

      snapSlides.forEach((slide, i) => {
        const imageWrappers = slide.querySelectorAll(".img-mask");
        const isLastSlide = i === snapSlides.length - 1;
        const isFirstSlide = i === 0;

        gsap.fromTo(
          imageWrappers,
          {
            y: isFirstSlide ? 0 : -window.innerHeight
          },
          {
            y: isLastSlide ? 0 : window.innerHeight,
            scrollTrigger: {
              trigger: slide,
              scrub: true,
              start: isFirstSlide ? "top top" : "top bottom",
              end: isLastSlide ? "top top" : undefined,
            },
            ease: "none",
          }
        );
      });
    }
  }

  // 18. webgl images hover animation //
  if ($('.rr--hover-item').length) {
    let hoverAnimation__do = function (t, n) {
      let a = new hoverEffect({
        parent: t.get(0),
        intensity: t.data("intensity") || void 0,
        speedIn: t.data("speedin") || void 0,
        speedOut: t.data("speedout") || void 0,
        easing: t.data("easing") || void 0,
        hover: t.data("hover") || void 0,
        image1: n.eq(0).attr("src"),
        image2: n.eq(0).attr("src"),
        displacementImage: t.data("displacement"),
        imagesRatio: n[0].height / n[0].width,
        hover: !1
      });
      t.closest(".rr--hover-item").on("mouseenter", function () {
        a.next()
      }).on("mouseleave", function () {
        a.previous()
      })
    }
    let hoverAnimation = function () {
      $(".rr--hover-img").each(function () {
        let n = $(this);
        let e = n.find("img");
        let i = e.eq(0);
        i[0].complete ? hoverAnimation__do(n, e) : i.on("load", function () {
          hoverAnimation__do(n, e)
        })
      })
    }
    hoverAnimation();
  }

  /* === design-showcase__active (index 02) === */
  if ($(".testimonial-9__active").length > 0) {
    var design_showcase = new Swiper(".testimonial-9__active", {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 10,
      speed: 2000,
      pagination: {
        el: ".testimonial-9-pagination",
        clickable: true,
      },
    });
  }

  /* === porfolio-9__active (index 09) === */
  if ($(".portfolio-9__active").length > 0) {
    var design_showcase = new Swiper(".portfolio-9__active", {
      loop: true,
      speed: 2000,
      autoplay: {
        delay: 2500,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: true,
      pagination: {
        el: ".our-portfolio-9__swiper-pagination",
        clickable: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20,
          centeredSlides: false,
        }
      }

    });
  }

  /* === achievements-slider-9__active (index 09) === */
  if ($(".achievements-year__active").length) {
    const design_showcase = new Swiper(".achievements__active", {
      loop: true,
      speed: 2000,
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: true,
      navigation: {
        nextEl: ".achievements-section-9__swiper-button-next",
        prevEl: ".achievements-section-9__swiper-button-prev",
      },
    });

    const years = ["2025", "2024", "2023", "2022", "2021", "2020"];
    const yearSpan = document.querySelector(".achievements-section-9__year span");

    design_showcase.on("slideChange", () => {
      const year = years[design_showcase.realIndex];
      if (yearSpan && year) {
        gsap.fromTo(
          yearSpan,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", onStart: () => yearSpan.textContent = year }
        );
      }
    });
  }


  /* === intro-overlay (index 09) === */
  if ($('.intro-overlay__inner').length) {
    mm.add("(min-width: 1200px)", () => {
      let path = document.querySelector(".intro-overlay__inner svg path");
      let svg = document.querySelector(".intro-overlay__inner svg");
      let length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      gsap.set(svg, { opacity: 1, visibility: "visible" });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.out"
      });

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section-9",
          start: "top top",
          end: "bottom center",
          scrub: true,
          pin: true,
        }
      });

      tl.to(svg, {
        y: "-100%",
        duration: 1
      });

      tl.to(".hero-section-9__content", {
        opacity: 1,
        y: 0,
        duration: 1
      }, "-=0.5")
        .to(".header-area-11", {
          opacity: 1,
          y: 0,
          duration: 1
        }, "-=0.5");
    });
  }

  /* === achievements-slider-13__active (index 13) === */
  if ($(".showcase-13__active").length > 0) {
    var design_showcase = new Swiper(".showcase-13__active", {
      loop: true,
      speed: 2000,

      slidesPerView: 3,
      spaceBetween: 40,
      centeredSlides: false,
      mousewheel: true,
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1400: {
          slidesPerView: 3,
          spaceBetween: 40,
        }
      }

    });
  }

  // showcase js 

  if (document.querySelector(".project-showcase-14__wrap")) {
    const items = document.querySelectorAll(".project-showcase-14__item");
    const images = document.querySelectorAll(".project-showcase-14__thumb img");

    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        images.forEach((img) => img.classList.remove("active"));
        const targetImg = images[index];
        if (targetImg) targetImg.classList.add("active");
      });
    });
  }

  // interactive-Project
  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".interactive-Project__item");
    const images = document.querySelectorAll(".interactive-Project__thumb img");

    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {

        items.forEach(i => i.classList.remove("active"));
        images.forEach(img => img.classList.remove("active"));


        item.classList.add("active");
        if (images[index]) {
          images[index].classList.add("active");
        }
      });
    });
  });

  // portfolio active Animation
  if ($(".portfolio__active").length > 0) {
    var design_showcase = new Swiper(".portfolio__active", {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 0,
      speed: 2000,
      pagination: {
        el: ".portfolio-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".portfolio-button-next",
        prevEl: ".portfolio-button-prev",
      },

      mousewheel: {
        invert: false,
        sensitivity: 1,
      },

      on: {
        init: function () {
          let total = this.slides.length - this.loopedSlides * 2;
          document.querySelector(".portfolio-counter .total").innerHTML =
            total < 10 ? "0" + total : total;
          document.querySelector(".portfolio-counter .current").innerHTML =
            this.realIndex + 1 < 10
              ? "0" + (this.realIndex + 1)
              : this.realIndex + 1;
        },
        slideChange: function () {
          document.querySelector(".portfolio-counter .current").innerHTML =
            this.realIndex + 1 < 10
              ? "0" + (this.realIndex + 1)
              : this.realIndex + 1;
        },
      },
    });
  }

  // Home 10 about Animation
  const listItems = document.querySelectorAll(".about-section-10__list li");

  listItems.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 50%",
      end: "top 60%",
      onEnter: () => item.classList.add("active"),
      onLeaveBack: () => item.classList.remove("active"),
    });
  });

  // pin-on-bottom
  mm.add("(min-width: 1200px)", () => {
    var pin_on_bottom = document.querySelectorAll(".pin-on-bottom");
    pin_on_bottom.forEach((el) => {
      gsap.to(el, {
        paddingBottom: "500px",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: "bottom 90%",
          end: "bottom top",
          pinSpacing: false,
          scrub: 3,
        },
      });
    });
  });

})(jQuery);


