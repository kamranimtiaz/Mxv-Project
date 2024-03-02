let filterOptionTargets = document.querySelectorAll("[data-target='filter-checkbox']");
const resetAllButton = document.querySelectorAll("[data-element='reset-all']");
const defaultFilter = document.querySelector("[fm-default='true']");

let filterGroup;
resetAllButton.forEach((resetButton) => {
  resetButton.addEventListener("click", () => {
    let activefilters = document.querySelectorAll('.is-active-filter');
    console.log(activefilters.length);

    activefilters.forEach((activeFilter) => {
      activeFilter.classList.remove('is-active-filter');
    });

    defaultFilter.click();
    // if (activefilters.length != 0) {
    //   console.log(activefilters)
    // } else {
    //   console.log("No active Filter")
    // }
  });
})


filterOptionTargets.forEach((filterTarget) => {
  console.log(filterTarget);
  filterTarget.addEventListener("click", (filterTarget) => {
    filterGroup = filterTarget.srcElement.closest("[data-element='filter-dropdown']");

    // filterGroup = filterTarget.srcElement.closest("[data-element='filter-dropdown']").querySelector("[data-element='active-filter-count']");

    console.log(filterGroup);

    countNumberOfActiveFilters(filterGroup);
    // countNumberOfActiveFilters();
  });
})

const countNumberOfActiveFilters = (tagetFilterGroup) => {
  console.log(tagetFilterGroup);
  const filtersActiveCountElement = tagetFilterGroup.querySelector("[data-element='active-filter-count']");
  const filterDropdownToggleElement = tagetFilterGroup.querySelector("[data-element='filter-dropdown-toggle']");
  setTimeout(() => {
    let activeFiltersCount = tagetFilterGroup.querySelectorAll('.filter-checked').length;
    console.log(activeFiltersCount);
    filtersActiveCountElement.innerText = activeFiltersCount;

    if (activeFiltersCount != 0) {
      filterDropdownToggleElement.classList.add('is-active-filter');
    } else {
      if (filterDropdownToggleElement.classList.contains('is-active-filter')) {
        filterDropdownToggleElement.classList.remove('is-active-filter');
      }
    }

  }, 300)
}


let openPopup = document.querySelectorAll("[data-element='open-popup']");


function resetPopupEvent() {
  openPopup.forEach(btn => {
    btn.addEventListener('click', animateOpenPopup.bind(btn));
  });
}
/*CMS LOAD Interaction*/
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    console.log('cmsload Successfully loaded!');
    const [listInstance] = listInstances;

    openPopup = document.querySelectorAll("[data-element='open-popup']");

    console.log(openPopup);
    // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
    resetPopupEvent();

    // The `renderitems` event runs whenever the list renders items after switching pages.
    listInstance.on('renderitems', (renderedItems) => {
      openPopup = document.querySelectorAll("[data-element='open-popup']");
      resetPopupEvent();
    });
  },
]);



const closePopup = document.querySelectorAll(".popup_close");
const popupWrapper = document.querySelector("[data-element='popup-modal']");
const popupContentPlaceholder = document.querySelector("[data-element='popup-data-placeholder']");
const loadMore = document.getElementById("next-button");
const loadLess = document.querySelector("#previous-button");


const animateOpenPopup = (popup) => {
  console.log(popup.currentTarget);
  const targetElement = popup.currentTarget;
  let oldPopupContent = targetElement.querySelector('[data-element="popup-content"]');
  const newContent = oldPopupContent.cloneNode(true);
  console.log(newContent);
  popupContentPlaceholder.innerHTML = "";
  popupContentPlaceholder.appendChild(newContent);

  // Show the popup
  gsap.set(popupWrapper, { display: "flex" });
  gsap.to(popupWrapper, {
    duration: 0.5,
    delay: 0.2,
    ease: "expo.out",
    opacity: 1
  });
  // scrollObserver.disable();
}

const animateClosePopup = () => {
  //smoother.paused(false);
  // gsap.set('body', { overflow: 'auto' });
  console.log("popup opened")
  // scrollObserver.enable();
}



