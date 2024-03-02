gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother);

let openPopup = document.querySelectorAll("[data-element='open-popup']");
const closePopup = document.querySelectorAll(".popup_close");
const popupWrapper = document.querySelector("[data-element='popup-modal']");
const popupContentPlaceholder = document.querySelector("[data-element='popup-data-placeholder']");
const loadMore = document.getElementById("next-button");
const loadLess = document.querySelector("#previous-button");

const pinWrap = document.querySelector(".horizontal-scroll_inner");
const sections = gsap.utils.toArray("[data-element= 'section']");
const container = document.querySelector('.horizontal-scroll_inner');
const disableScrollingTriggers = document.querySelectorAll("[fm-scrolldisable-element='disable']");



window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {

    // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
    const [listInstance] = listInstances;

    // The `renderitems` event runs whenever the list renders items after switching pages.
    listInstance.on('renderitems', (renderedItems) => {
      // console.log(renderedItems);
      renderedItems.forEach((portfolioItem) => {
        // console.log(portfolioItem.element);
        portfolioItem["element"].addEventListener('click', animateOpenPopup.bind(portfolioItem));
      })
    });
  },
]);



const animateOpenPopup = (popup) => {

  console.log(popup.currentTarget);
  const targetElement = popup.currentTarget;
  let oldPopupContent = targetElement.querySelector('[data-element="popup-content"]');

  const newContent = oldPopupContent.cloneNode(true);
  popupContentPlaceholder.innerHTML = "";
  popupContentPlaceholder.appendChild(newContent);

  gsap.to(popupWrapper, {
    duration: 0.5,
    opacity: 1,
    display: 'flex',
    ease: Power3.easeOut
  })

  //smoother.paused(true)
  gsap.set('body', { overflow: 'hidden' });
}

const disableScrolling = () => {
  gsap.set('body', { overflow: 'hidden' });
}
const enableScrolling = () => {
  gsap.set('body', { overflow: 'auto' });
  ScrollTrigger.normalizeScroll(false);
}

const animateClosePopup = () => {

  gsap.set('body', { overflow: 'auto' });
  console.log("popup opened")
  ScrollTrigger.normalizeScroll(false);

}


disableScrollingTriggers.forEach((trigger) => {
  trigger.addEventListener("click", disableScrolling);
});

openPopup.forEach(btn => {
  btn.addEventListener('click', animateOpenPopup.bind(btn));

});

closePopup.forEach(btn => {
  btn.addEventListener('click', animateClosePopup);

});



ScrollTrigger.matchMedia({

  // large
  "(min-width: 991px)": function() {
    // setup animations and ScrollTriggers for screens 960px wide or greater...
    // These ScrollTriggers will be reverted/killed when the media query doesn't match anymore.
    calculateScroll();
  },
  "(max-width: 990px)": function() {

  }
});


function calculateScroll() {

  let maxWidth = 0;
  let horizontalScrollLength = 0;

  const getMaxWidth = () => {

    maxWidth = 0;
    sections.forEach((section) => {
      console.log(section.offsetWidth);
      maxWidth += section.offsetWidth;
      console.log(maxWidth);
    });

    horizontalScrollLength = maxWidth - window.innerWidth;
    pinWrap.style.width = horizontalScrollLength;
    console.log(horizontalScrollLength);
  };

  getMaxWidth();

  /*Horizontal Scroll*/
  let tween = gsap.to(sections, {
    //xPercent: -100 * (sections.length - 1),
    x: () => `-${horizontalScrollLength}`,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: true,
      start: "top top",
      invalidateOnRefresh: true,
      snap: 1 / (sections.length - 1),
      //end: "right right",
      end: () => `+=${maxWidth}`,

    },
  });

  /* Active Scroll Position */
  let sectionEntered = [];
  sections.forEach((section, i) => {
    //console.log(i, section.getAttribute("id"));
    sectionEntered[i] = 0;
    ScrollTrigger.create({
      trigger: section,
      start: "left center",
      end: "right center",
      // markers: true,
      containerAnimation: tween,
      invalidateOnRefresh: true,

      onEnter: () => {
        //sectionEntered[i] += 1;
        console.log(section.getAttribute('id'));
        resetNavigation(section);
      },
      onEnterBack: () => {
        //sectionEntered[i] += 1;
        console.log(section.getAttribute('id'));
        resetNavigation(section);

      }
    });

  });

  /* resetNavigation Function */
  function resetNavigation(section) {
    let sectionId = section.getAttribute('id');
    let currentActiveLink = document.querySelector('.is-active');

    if (sectionId != null) {
      if (currentActiveLink != null) {
        currentActiveLink.classList.remove('is-active');
      }

      sectionId = "#" + sectionId;
      console.log(currentActiveLink, sectionId)
      let targetLink = document.querySelector(`.navbar_link[href = ${CSS.escape(sectionId)}]`);
      console.log(targetLink)
      targetLink.classList.add('is-active')

    } else {
      if (currentActiveLink != null)
        currentActiveLink.classList.remove('is-active');
    }
  }

  /* Scroll To Section */
  let getPosition = getScrollLookup(sections, tween, "left left");

  function getScrollLookup(targets, containerAnimation, position) {
    let triggers = targets.map(section => ScrollTrigger.create({
      trigger: section,
      start: position || "left left",
      containerAnimation: containerAnimation
    })),
      st = containerAnimation.scrollTrigger;
    return target => {
      let t = gsap.utils.toArray(target)[0],
        i = triggers.length;
      while (i-- && triggers[i].trigger !== t) { };
      return i >= 0 ? st.start + (triggers[i].start / containerAnimation.duration()) * (st.end - st.start) : console.warn("target not found", target);
    };
  }


  // console.log(maxWidth, window.innerWidth);

  document.querySelectorAll("[data-element='nav-link']").forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      if (!e.target.getAttribute("data-link-outbound")) {
        e.stopPropagation();
        e.preventDefault();

        let targetElem = document.querySelector(e.target.getAttribute("href"));
        console.log(e.target);

        y = targetElem;
        console.log(targetElem.offsetWidth, y);

        gsap.to(window, {
          scrollTo: {
            y: getPosition(targetElem),
            // y: y,
            autoKill: false
          },
          duration: 1,
          overwrite: "auto"
        });
      }

    });
  });


  //Smooth Scrolling using Gsap Smoother
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.25,
    normalizeScroll: true,
    ignoreMobileResize: true,
    effects: true,
    preventDefault: true
  });


  const founderSectionTimeline = gsap.timeline({
    scrollTrigger: {
      // trigger: "#gsap-bar-animation",
      trigger: "[data-animation = 'gsap-bar-animation']",
      containerAnimation: tween,
      start: "left center",
      invalidateOnRefresh: true,
      toggleActions: "play none none none",
    }
  });
  founderSectionTimeline.to(".bar_track.is-first", {
    x: "0%",
    duration: 2,
    ease: "power1.inOut",
  }, 0);
  founderSectionTimeline.to(".bar_track.is-second", {
    x: "0%",
    duration: 2,
    ease: "power1.inOut",
  }, 0);

  let founderQuoteBlocks = document.querySelectorAll("[data-animate = 'founder-quote']");
  founderQuoteBlocks.forEach((quoteBlock) => {
    console.log("Quote", quoteBlock)
    founderSectionTimeline.fromTo(
      quoteBlock,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: "power1"

      }, 0)
  });

  /**Teams Section Animation Scroll Trigger**/

  const teamsSectionTimeline = gsap.timeline({
    scrollTrigger: {
      // trigger: "#gsap-bar-animation",
      trigger: "[data-animate = 'teams-photo']",
      containerAnimation: tween,
      start: "left 10%",
      invalidateOnRefresh: true,
      toggleActions: "play none none none",
    }
  });

  teamsSectionTimeline.to("[data-element='teams-photo-overlay']", {
    x: "-100%",
    duration: 1.5,
    ease: "power1"
  })

  /**Contact Section Animation Scroll Trigger**/

  gsap.to("#primary-navigation", {
    opacity: 0,
    duration: 1,
    ease: "power1.inOut",
    scrollTrigger: {
      invalidateOnRefresh: true,
      // trigger: "#sidebar",
      // trigger: "[data-animation = 'gsap-sidebar']",
      trigger: "[data-animate='contact-section']",
      containerAnimation: tween,
      start: "left 20%",
      toggleActions: "play none none reverse",
    }
  });


  //ScrollTrigger.addEventListener("refreshInit", getMaxWidth);
  ScrollTrigger.addEventListener("refreshInit", getMaxWidth);
  //window.addEventListener('resize', calculateScroll);
  ScrollTrigger.normalizeScroll({ allowNestedScroll: true });

  // T.Ricks Code
  let customEase = "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1";
  let counter = {
    value: 0
  };
  
  let loaderDuration = 4;

  // If not a first time visit in this tab
  if (sessionStorage.getItem("visited") !== null) {
    loaderDuration = 2;
    counter = {
      value: 75
    };
  }
  sessionStorage.setItem("visited", "true");

  function updateLoaderText() {
    let progress = Math.round(counter.value);
    $(".loader_number").text(progress);
  }
  function endLoaderAnimation() {
    $(".loader_trigger").click();
  }

  let tl = gsap.timeline({
    onComplete: endLoaderAnimation
  });


  tl.to(counter, {
    value: 100,
    onUpdate: updateLoaderText,
    duration: loaderDuration,
    ease: CustomEase.create("custom", customEase)
  });
  tl.to(".loader_progress", {
    width: "144px",
    duration: loaderDuration,
    ease: CustomEase.create("custom", customEase)
  }, 0);

}





