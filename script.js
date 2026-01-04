// ============================================
// SLIP-SCAN - MAIN JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      const icon = this.querySelector("i");

      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // Close mobile menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll("a");
    navLinksItems.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove("active");
          const icon = mobileMenuBtn.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInside =
        navLinks.contains(event.target) || mobileMenuBtn.contains(event.target);

      if (!isClickInside && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all FAQ items
        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("active");
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // ========================================
  // PRICING LOGIC (PERSONAL / BUSINESS / ENTERPRISE)
  // ========================================

  // DOM Elements
  const pricingToggle = document.getElementById("pricing-toggle"); // Annual/Monthly Switch
  const planTypeRadios = document.querySelectorAll('input[name="plan-type"]'); // Personal/Business Radios
  const switchSelection = document.querySelector(".switch-selection"); // The sliding background

  // Sections
  const personalPlans = document.getElementById("personal-plans");
  const businessPlans = document.getElementById("business-plans");

  // Enterprise Elements
  const enterpriseSlider = document.getElementById("enterprise-slider");
  const userCountDisplay = document.getElementById("user-count-display");
  const enterpriseAmount = document.getElementById("enterprise-amount");
  const enterpriseAnnualText = document.getElementById(
    "enterprise-annual-text"
  );

  // Data for Enterprise Tiers
  const enterpriseData = [
    { users: 20, monthly: 44.99, annual: 269.99 },
    { users: 50, monthly: 114.99, annual: 699.99 },
    { users: 100, monthly: 229.99, annual: 899.99 },
    { users: 500, monthly: 499.99, annual: null }, // null means no annual plan
  ];

  function updatePricing() {
    const isAnnual = pricingToggle.checked;
    const planType = document.querySelector(
      'input[name="plan-type"]:checked'
    ).value;
    const sliderIndex = parseInt(enterpriseSlider.value);

    // 1. Toggle Sections (Personal vs Business)
    if (planType === "personal") {
      personalPlans.classList.remove("hidden");
      businessPlans.classList.add("hidden");
      switchSelection.style.transform = "translateX(0)";
    } else {
      personalPlans.classList.add("hidden");
      businessPlans.classList.remove("hidden");
      switchSelection.style.transform = "translateX(100%)";
    }

    // 2. Update Standard Cards (Plus, Pro, Business)
    // Select all cards that have data-monthly attributes
    const dynamicCards = document.querySelectorAll(
      ".pricing-card .price-amount[data-monthly]"
    );

    dynamicCards.forEach((amountSpan) => {
      const monthlyPrice = parseFloat(amountSpan.getAttribute("data-monthly"));
      const annualTotal = parseFloat(amountSpan.getAttribute("data-annual"));
      const parentCard = amountSpan.closest(".pricing-card");
      const annualText = parentCard.querySelector(".price-annual");

      if (isAnnual) {
        // CONVENTION: Show monthly equivalent (Total / 12)
        const monthlyEquivalent = (annualTotal / 12).toFixed(2);

        amountSpan.textContent = "$" + monthlyEquivalent;
        parentCard.querySelector(".price-period").textContent = "/month";

        if (annualText) {
          annualText.style.display = "block";
          annualText.textContent = `Billed annually at $${annualTotal}`;
        }
      } else {
        amountSpan.textContent = "$" + monthlyPrice;
        parentCard.querySelector(".price-period").textContent = "/month";

        if (annualText) {
          annualText.style.display = "block";
          annualText.textContent = `Billed annually at $${annualTotal}`;
        }
      }
    });

    // 3. Update Enterprise Card
    const tier = enterpriseData[sliderIndex];

    // Update User Count Label
    userCountDisplay.textContent = `${tier.users} Users`;

    // Update Price
    if (tier.users === 500) {
      // Special case: 500 users has NO annual plan
      enterpriseAmount.textContent = "$" + tier.monthly;
      enterpriseAnnualText.style.display = "block";
      enterpriseAnnualText.textContent = "Annual plan not available";
      enterpriseAnnualText.style.color = "var(--text-muted)";

      // Force monthly display
      document.querySelector(
        "#business-plans .featured .price-period"
      ).textContent = "/month";
    } else {
      if (isAnnual) {
        // CONVENTION: Show monthly equivalent for Enterprise too
        const monthlyEquivalent = (tier.annual / 12).toFixed(2);

        enterpriseAmount.textContent = "$" + monthlyEquivalent;
        document.querySelector(
          "#business-plans .featured .price-period"
        ).textContent = "/month";

        enterpriseAnnualText.style.display = "block";
        enterpriseAnnualText.textContent = `Billed annually at $${tier.annual}`;
        enterpriseAnnualText.style.color = "var(--text-muted)";
      } else {
        enterpriseAmount.textContent = "$" + tier.monthly;
        document.querySelector(
          "#business-plans .featured .price-period"
        ).textContent = "/month";

        enterpriseAnnualText.style.display = "block";
        enterpriseAnnualText.textContent = `Billed annually at $${tier.annual}`;
        enterpriseAnnualText.style.color = "var(--text-muted)";
      }
    }
  }

  // Event Listeners
  if (pricingToggle) {
    pricingToggle.addEventListener("change", updatePricing);
  }

  planTypeRadios.forEach((radio) => {
    radio.addEventListener("change", updatePricing);
  });

  if (enterpriseSlider) {
    enterpriseSlider.addEventListener("input", updatePricing);
  }

  // Initialize
  if (pricingToggle || planTypeRadios.length > 0) {
    updatePricing();
  }

  // ========================================
  // APP SUBSCRIPTION MODAL LOGIC (MOVED HERE)
  // ========================================
  const modal = document.getElementById("app-subscription-modal");
  const closeBtn = document.querySelector(".modal-close");
  const overlay = document.querySelector(".modal-overlay");

  // Select all "purchase" buttons in the pricing cards
  const purchaseBtns = document.querySelectorAll('.pricing-card .btn[href="#"]');

  function openModal(e) {
    e.preventDefault();
    if (modal) {
      modal.classList.add("active");
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
    }
  }

  if (modal) {
    // Attach click event to all purchase buttons
    purchaseBtns.forEach((btn) => {
      btn.addEventListener("click", openModal);
    });

    // Close modal when clicking X or the overlay
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);
    
    // Close on Escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
  }

  // ========================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#" or placeholder links 
      // (The Modal logic above will handle href="#" specifically for pricing)
      if (href === "#") {
        e.preventDefault();
        return;
      }
      
      if (href === "#download" || href === "#demo") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.querySelector(".header");
  let lastScroll = 0;

  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
      }

      lastScroll = currentScroll;
    });
  }

  // ========================================
  // FORM VALIDATION (if needed)
  // ========================================
  const contactForm = document.querySelector("form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simple validation example
      const inputs = this.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = "#EF4444";
        } else {
          input.style.borderColor = "#E5E7EB";
        }
      });

      if (isValid) {
        // Show success message
        alert(
          "Thank you for your message! We'll get back to you within 24 hours."
        );
        this.reset();
      } else {
        alert("Please fill in all required fields.");
      }
    });

    // Reset border color on input
    const formInputs = contactForm.querySelectorAll("input, textarea, select");
    formInputs.forEach((input) => {
      input.addEventListener("input", function () {
        this.style.borderColor = "#E5E7EB";
      });
    });
  }

  // ========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for fade-in animations
  const animateElements = document.querySelectorAll(
    ".feature-card, .pain-card, .testimonial-card, .pricing-card, .integration-card"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // ========================================
  // PRICING CARD HOVER EFFECTS
  // ========================================
  const pricingCards = document.querySelectorAll(".pricing-card");
  pricingCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(-8px)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(0)";
      }
    });
  });

  // ========================================
  // CONSOLE LOG
  // ========================================
  console.log("Slip-Scan website loaded successfully!");
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}