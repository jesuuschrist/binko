const topbar = document.querySelector(".topbar");
const secondSection = document.querySelector("main > section:nth-of-type(2)");
const keepTopbarCtaVisible = topbar?.classList.contains("cta-visible") ?? false;
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".menu a");
const menuBackdrop = document.querySelector(".menu-backdrop");
const faqItems = document.querySelectorAll(".faq-item");
const legalItems = document.querySelectorAll(".legal-item");
const serviceCards = document.querySelectorAll(".service-card");
const heroRotatorImages = document.querySelectorAll(".hero-mobbin-icon .hero-rotator-image");
const reviewsGrid = document.querySelector(".reviews-grid");
const reviewCards = document.querySelectorAll(".review-card");
const reviewDots = document.querySelectorAll(".reviews-dot");
const revealItems = document.querySelectorAll(".reveal-on-scroll");

const syncAnchorOffset = () => {
  if (!topbar) {
    return;
  }

  const topbarStyles = window.getComputedStyle(topbar);
  const stickyTop = Number.parseFloat(topbarStyles.top) || 0;
  const offset = Math.ceil(topbar.offsetHeight + stickyTop + 18);
  document.documentElement.style.setProperty("--header-offset", `${offset}px`);
};

if (menuToggle && topbar) {
  const setMenuState = (isOpen) => {
    topbar.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !topbar.classList.contains("menu-open");
    setMenuState(isOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  menuBackdrop?.addEventListener("click", () => {
    setMenuState(false);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
}

const syncTopbarScrollState = () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("scrolled", window.scrollY > 12);

  if (!keepTopbarCtaVisible) {
    const ctaTrigger = secondSection
      ? secondSection.offsetTop - topbar.offsetHeight - 24
      : 120;

    topbar.classList.toggle("cta-visible", window.scrollY >= ctaTrigger);
  }
};

syncTopbarScrollState();
syncAnchorOffset();
window.addEventListener("scroll", syncTopbarScrollState, { passive: true });
window.addEventListener("resize", () => {
  syncAnchorOffset();
  syncTopbarScrollState();
});

const syncScrollReveal = () => {
  if (!revealItems.length) {
    return;
  }

  const shouldReveal = window.scrollY > 36;

  revealItems.forEach((item) => {
    item.classList.toggle("is-visible", shouldReveal);
  });
};

syncScrollReveal();
window.addEventListener("scroll", syncScrollReveal, { passive: true });

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faqItem) => faqItem.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

legalItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    legalItems.forEach((legalItem) => legalItem.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

serviceCards.forEach((card) => {
  card.setAttribute("tabindex", "0");

  const toggleCard = () => {
    const isOpen = card.classList.contains("is-open");

    serviceCards.forEach((serviceCard) => {
      serviceCard.classList.remove("is-open");
      serviceCard.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }
  };

  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");

  card.addEventListener("click", (event) => {
    const interactiveElement = event.target.closest("a, button, input, textarea");
    if (interactiveElement) {
      return;
    }

    toggleCard();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleCard();
  });
});

if (heroRotatorImages.length === 3) {
  const stackClasses = ["stack-front", "stack-mid", "stack-back"];
  let currentOrder = [0, 1, 2];
  let isHeroStackAnimating = false;

  const applyHeroStack = () => {
    heroRotatorImages.forEach((image) => {
      image.classList.remove(...stackClasses, "stack-exiting");
      image.style.visibility = "";
    });

    currentOrder.forEach((imageIndex, stackIndex) => {
      heroRotatorImages[imageIndex]?.classList.add(stackClasses[stackIndex]);
    });
  };

  const rotateHeroStack = () => {
    if (isHeroStackAnimating) {
      return;
    }

    isHeroStackAnimating = true;

    const exitingIndex = currentOrder[0];
    const nextFrontIndex = currentOrder[1];
    const nextMidIndex = currentOrder[2];

    const exitingImage = heroRotatorImages[exitingIndex];
    const nextFrontImage = heroRotatorImages[nextFrontIndex];
    const nextMidImage = heroRotatorImages[nextMidIndex];

    exitingImage?.classList.remove("stack-front");
    exitingImage?.classList.add("stack-exiting");

    window.setTimeout(() => {
      if (exitingImage) {
        exitingImage.style.visibility = "hidden";
      }

      nextFrontImage?.classList.remove("stack-mid");
      nextFrontImage?.classList.add("stack-front");

      nextMidImage?.classList.remove("stack-back");
      nextMidImage?.classList.add("stack-mid");

      exitingImage?.classList.add("stack-no-transition");
      exitingImage?.classList.remove("stack-exiting");
      exitingImage?.classList.add("stack-back");

      currentOrder = [nextFrontIndex, nextMidIndex, exitingIndex];

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (exitingImage) {
            exitingImage.style.visibility = "";
            exitingImage.classList.remove("stack-no-transition");
          }
          isHeroStackAnimating = false;
        });
      });
    }, 180);
  };

  window.setInterval(rotateHeroStack, 2600);
}

if (reviewsGrid) {
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragDistance = 0;

  const setActiveReviewDot = (index) => {
    reviewDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  const syncReviewDotsToScroll = () => {
    if (!reviewCards.length) {
      return;
    }

    let activeIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    reviewCards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - reviewsGrid.scrollLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = index;
      }
    });

    setActiveReviewDot(activeIndex);
  };

  const scrollToReview = (index) => {
    const targetCard = reviewCards[index];
    if (!targetCard) {
      return;
    }

    reviewsGrid.scrollTo({
      left: targetCard.offsetLeft,
      behavior: "smooth",
    });
  };

  const stopDragging = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    reviewsGrid.classList.remove("dragging");

    let activeIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    reviewCards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - reviewsGrid.scrollLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = index;
      }
    });

    const threshold = 60;
    if (dragDistance > threshold) {
      activeIndex = Math.max(0, activeIndex - 1);
    } else if (dragDistance < -threshold) {
      activeIndex = Math.min(reviewCards.length - 1, activeIndex + 1);
    }

    scrollToReview(activeIndex);
  };

  reviewsGrid.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.pageX;
    startScrollLeft = reviewsGrid.scrollLeft;
    dragDistance = 0;
    reviewsGrid.classList.add("dragging");
  });

  reviewsGrid.addEventListener("mouseleave", stopDragging);
  reviewsGrid.addEventListener("mouseup", stopDragging);

  reviewsGrid.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    const distance = event.pageX - startX;
    dragDistance = distance;
    reviewsGrid.scrollLeft = startScrollLeft - distance;
  });

  reviewsGrid.addEventListener("scroll", syncReviewDotsToScroll, { passive: true });

  reviewDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      scrollToReview(index);
    });
  });

  syncReviewDotsToScroll();
}
