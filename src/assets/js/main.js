/**  Main JS File  **/
(function ($) {
  "use strict";

  /*----------------------------- Site Loader & Popup --------------------*/
  $(window).on("load", function () {
    $("#gi-overlay").fadeOut("slow");
  });

  /*----------------------------- Scroll animation -------------------------------- */
  // new WOW().init();

  /*--------------------- Mobile menu sidebar JS -------------------------------- */
  $('.gi-site-menu-icon').on("click", function () {
    $('.gi-mobile-menu-overlay').fadeIn();
    $('.gi-mobile-menu').addClass("gi-menu-open");
  });

  $('.gi-mobile-menu-overlay, .gi-close-menu').on("click", function () {
    $('.gi-mobile-menu-overlay').fadeOut();
    $('.gi-mobile-menu').removeClass("gi-menu-open");
  });

  function ResponsiveMobilemsMenu() {
    var $msNav = $(".gi-menu-content, .overlay-menu"),
      $msNavSubMenu = $msNav.find(".sub-menu");
    $msNavSubMenu.parent().prepend('<span class="menu-toggle"></span>');

    $msNav.on("click", "li a, .menu-toggle", function (e) {
      var $this = $(this);
      if ($this.attr("href") === "#" || $this.hasClass("menu-toggle")) {
        e.preventDefault();
        if ($this.siblings("ul:visible").length) {
          $this.parent("li").removeClass("active");
          $this.siblings("ul").slideUp();
          $this.parent("li").find("li").removeClass("active");
          $this.parent("li").find("ul:visible").slideUp();
        } else {
          $this.parent("li").addClass("active");
          $this.closest("li").siblings("li").removeClass("active").find("li").removeClass("active");
          $this.closest("li").siblings("li").find("ul:visible").slideUp();
          $this.siblings("ul").slideDown();
        }
      }
    });
  }

  ResponsiveMobilemsMenu();

  /*----------------------------- Category Sidebar js | Toggle Icon OnClick Open sidebar  -----------------------------------*/
  $(".gi-category-toggle").on("click", function () {
    $(".gi-side-cat-overlay").fadeIn();
    $(".gi-category-sidebar").addClass("gi-open-cat");
  });

  $(".gi-close").on("click", function () {
    $(".gi-category-sidebar").removeClass("gi-open-cat");
    $(".gi-side-cat-overlay").fadeOut();
  });

  $(".gi-side-cat-overlay").on("click", function () {
    $(".gi-category-sidebar").removeClass("gi-open-cat");
    $(".gi-side-cat-overlay").fadeOut();
  });

  /*----------------------------- Product & shop page category Toggle -------------------------------- */
  $(document).ready(function () {
    $(".gi-sidebar-block.drop .gi-sb-block-content ul li ul").addClass("gi-cat-sub-dropdown");

    $(".gi-sidebar-block.drop .gi-sidebar-block-item").on("click", function () {
      var $this = $(this).closest('.gi-sb-block-content').find('.gi-cat-sub-dropdown');
      $this.slideToggle('slow');
      $('.gi-cat-sub-dropdown').not($this).slideUp('slow');
    });
  });
  
  /*--------------------- Cart sidebar JS -------------------------------- */
  $('.gi-cart-toggle').on("click", function (e) {
    e.preventDefault();
    $(".gi-side-cart-overlay").fadeIn();
    $('.gi-side-cart').addClass("gi-open-cart");
  });
  $('.gi-side-cart-overlay, .gi-cart-close').on("click", function (e) {
    e.preventDefault();
    $(".gi-side-cart-overlay").fadeOut();
    $('.gi-side-cart').removeClass("gi-open-cart");
  });

  /*--------------------- location Toggle MenuBar ---------------------- */
  $('.loc-list').on('click', function () {
    var mslocname = $(this).find('.gi-detail').html();
    $(".gi-location-title").html(mslocname);
    $(".gi-location-title").parent().attr("title", mslocname);
  });

  /*----------------------------- Qty Plus Minus Button  ------------------------------ */
  var QtyPlusMinus = $(".qty-plus-minus");
  QtyPlusMinus.prepend('<div class="dec gi-qtybtn">-</div>');
  QtyPlusMinus.append('<div class="inc gi-qtybtn">+</div>');

  $("body").on("click", ".gi-qtybtn", function () {

    var $qtybutton = $(this);
    var QtyoldValue = $qtybutton.parent().find("input").val();
    if ($qtybutton.text() === "+") {
      var QtynewVal = parseFloat(QtyoldValue) + 1;
    } else {

      if (QtyoldValue > 1) {
        var QtynewVal = parseFloat(QtyoldValue) - 1;
      } else {
        QtynewVal = 1;
      }
    }
    $qtybutton.parent().find("input").val(QtynewVal);
  });

  /*----------------------------- Filter Icon OnClick Open filter Sidebar on shop page -----------------------------------*/
  $(".filter-toggle-icon").on("click", function () {
    $(".filter-sidebar-overlay").fadeIn();
    $(".gi-filter-sidebar").addClass("filter-sidebar-open");
  });

  $(".filter-close, .filter-sidebar-overlay").on("click", function () {
    $(".gi-filter-sidebar").removeClass("filter-sidebar-open");
    $(".filter-sidebar-overlay").fadeOut();
  });

  /*--------------------- Footer Toggle -------------------------------- */
  $(document).ready(function () {
    $(".gi-footer-links").addClass("gi-footer-dropdown");

    $('.gi-footer-heading').append("<div class='gi-heading-res'><i class='fi-rr-angle-small-down' aria-hidden='true'></i></div>");

    $(".gi-footer-heading .gi-heading-res").on("click", function () {
      var $this = $(this).closest('.footer-top .col-sm-12').find('.gi-footer-dropdown');
      $this.slideToggle('slow');
      $('.gi-footer-dropdown').not($this).slideUp('slow');
    });
  });

  /*--------------------- Wishlist notify js ---------------------- */
  $('.wishlist').on("click", function () {
    $('.gi-wish-notify').remove();
    $('.gi-compare-notify').remove();
    $('.gi-cart-notify').remove();

    var isWishlist = $(this).hasClass("active");
    if (isWishlist) {
      $(this).removeClass("active");
      $('footer').after('<div class="gi-wish-notify"><p class="wish-note">Remove product on <a href="wishlist.html"> Wishlist</a> Successfully!</p></div>');
    } else {
      $(this).addClass("active");
      $('footer').after('<div class="gi-wish-notify"><p class="wish-note">Add product in <a href="wishlist.html"> Wishlist</a> Successfully!</p></div>');
    }

    setTimeout(function () {
      $('.gi-wish-notify').fadeOut();
    }, 2000);
  });

  /*--------------------- Compare notify js ---------------------- */
  $('.compare').on("click", function () {
    $('.gi-wish-notify').remove();
    $('.gi-compare-notify').remove();
    $('.gi-cart-notify').remove();

    var isCompare = $(this).hasClass("active");
    if (isCompare) {
      $(this).removeClass("active");
      $('footer').after('<div class="gi-compare-notify"><p class="compare-note">Remove product on <a href="compare.html"> Compare list</a> Successfully!</p></div>');
    } else {
      $(this).addClass("active");
      $('footer').after('<div class="gi-compare-notify"><p class="compare-note">Add product in <a href="compare.html"> Compare list</a> Successfully!</p></div>');
    }

    setTimeout(function () {
      $('.gi-compare-notify').fadeOut();
    }, 2000);
  });

  /*--------------------- Add to cart button notify js ---------------------- */
  $('.add-to-cart').on("click", function () {
    $('.gi-wish-notify').remove();
    $('.gi-compare-notify').remove();
    $('.gi-cart-notify').remove();
    $('footer').after('<div class="gi-cart-notify"><p class="compare-note">Add product in <a href="cart.html"> Cart</a> Successfully!</p></div>');
    setTimeout(function () {
      $('.gi-cart-notify').fadeOut();
    }, 2000);
  });

  /*----------------------------- Cart page Shipping Toggle -------------------------------- */
  $(document).ready(function () {
    $(".gi-sb-block-content .gi-ship-title").on("click", function () {
      $('.gi-sb-block-content .gi-cart-form').slideToggle('slow');
    });
  });

  /*----------------------------- Cart page Apply Coupan Toggle -------------------------------- */
  $(document).ready(function () {
    $(".gi-cart-coupan").on("click", function () {
      $('.gi-cart-coupan-content').slideToggle('slow');
    });
    $(".gi-checkout-coupan").on("click", function () {
      $('.gi-checkout-coupan-content').slideToggle('slow');
    });
  });

  /*----------------------------- Cart Page Qty Plus Minus Button  ------------------------------ */
  var CartQtyPlusMinus = $(".cart-qty-plus-minus");
  CartQtyPlusMinus.append('<div class="ms_cart_qtybtn"><div class="inc ms_qtybtn">+</div><div class="dec ms_qtybtn">-</div></div>');
  $(".cart-qty-plus-minus .ms_cart_qtybtn .ms_qtybtn").on("click", function () {
    var $cartqtybutton = $(this);
    var CartQtyoldValue = $cartqtybutton.parent().parent().find("input").val();
    if ($cartqtybutton.text() === "+") {
      var CartQtynewVal = parseFloat(CartQtyoldValue) + 1;
    } else {

      if (CartQtyoldValue > 1) {
        var CartQtynewVal = parseFloat(CartQtyoldValue) - 1;
      } else {
        CartQtynewVal = 1;
      }
    }
    $cartqtybutton.parent().parent().find("input").val(CartQtynewVal);
  });

  /*----------------------------- Sidebar Block Toggle (Checkout & Cart page) -------------------------------- */
  $(document).ready(function () {
    $(".gi-shop-sidebar .gi-sidebar-block .gi-sb-block-content,.gi-shop-sidebar-2 .gi-sidebar-block .gi-sb-block-content, .gi-blogs-leftside .gi-sidebar-block .gi-sb-block-content, .gi-cart-rightside .gi-sidebar-block .gi-sb-block-content, .gi-checkout-rightside .gi-sidebar-block .gi-sb-block-content").addClass("gi-sidebar-dropdown");

    $('.gi-sidebar-title').append("<div class='gi-sidebar-res'><i class='gicon gi-angle-down'></i></div>");

    $(".gi-sidebar-title .gi-sidebar-res").on("click", function () {
      // alert();
      var $this = $(this).closest('.gi-shop-sidebar .gi-sidebar-block, .gi-shop-sidebar-2 .gi-sidebar-block, .gi-blogs-leftside .gi-sidebar-block, .gi-cart-rightside .gi-sidebar-block, .gi-checkout-rightside .gi-sidebar-wrap').find('.gi-sidebar-dropdown, .gi-sb-block-content');
      $this.slideToggle('slow');
    });
  });

  /*----------------------------- Remove Product (Compare page) -------------------------------- */
  $('.remove-compare-product').on("click", function () {
    $(this).parent().fadeOut();
  });

  /*----------------------------- Accordians toggle (faq page) -------------------------------- */
  $('.gi-accordion-header').on("click", function () {
    $(this).parent().siblings().children(".gi-accordion-body").slideUp();
    $(this).parent().find(".gi-accordion-body").slideToggle();
  });

  /*----------------------------- List Grid View -------------------------------- */
  $('.gi-gl-btn').on('click', 'button', function () {
    var $this = $(this);
    $this.addClass('active').siblings().removeClass('active');
  });

  // for 100% width list view
  function showList(e) {
    var $gridCont = $('.shop-pro-inner');
    var $listView = $('.pro-gl-content');
    e.preventDefault();
    $gridCont.addClass('list-view');
    $listView.addClass('width-100');
  }

  function gridList(e) {
    var $gridCont = $('.shop-pro-inner');
    var $gridView = $('.pro-gl-content');
    e.preventDefault();
    $gridCont.removeClass('list-view');
    $gridView.removeClass('width-100');
  }

  $(document).on('click', '.btn-grid', gridList);
  $(document).on('click', '.btn-list', showList);

  // for 50% width list view
  function showList50(e) {
    var $gridCont = $('.shop-pro-inner');
    var $listView = $('.pro-gl-content');
    e.preventDefault();
    $gridCont.addClass('list-view-50');
    $listView.addClass('width-50');
  }

  function gridList50(e) {
    var $gridCont = $('.shop-pro-inner');
    var $gridView = $('.pro-gl-content');
    e.preventDefault();
    $gridCont.removeClass('list-view-50');
    $gridView.removeClass('width-50');
  }

  $(document).on('click', '.btn-grid-50', gridList50);
  $(document).on('click', '.btn-list-50', showList50);

  /*----------------------------- Price Range slider ( Shop page ) -------------------------------- */
  const slider = document.getElementById('gi-sliderPrice');
  if (slider) {
    const rangeMin = parseInt(slider.dataset.min);
    const rangeMax = parseInt(slider.dataset.max);
    const step = parseInt(slider.dataset.step);
    const filterInputs = document.querySelectorAll('input.filter__input');

    noUiSlider.create(slider, {
      start: [rangeMin, rangeMax],
      connect: true,
      step: step,
      range: {
        'min': rangeMin,
        'max': rangeMax
      },

      // make numbers whole
      format: {
        to: value => value,
        from: value => value
      }
    });

    // bind inputs with noUiSlider 
    slider.noUiSlider.on('update', (values, handle) => {
      filterInputs[handle].value = values[handle];
    });

    filterInputs.forEach((input, indexInput) => {
      input.addEventListener('change', () => {
        slider.noUiSlider.setHandle(indexInput, input.value);
      })
    });
  }

  // /*----------------------------- Product Image Zoom --------------------------------*/
  // $('.zoom-image-hover').zoom();

  // /*----------------------------- single product Slider  ------------------------------ */
  // $('.single-product-cover').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   fade: false,
  //   asNavFor: '.single-nav-thumb',
  // });

  // $('.single-nav-thumb').slick({
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   asNavFor: '.single-product-cover',
  //   dots: false,
  //   arrows: true,
  //   focusOnSelect: true
  // });

  /*----------------------------- Single Product Color and Size Click to Active -------------------------------- */
  $(document).ready(function () {
    $(".gi-pro-variation-content ul li").on("click", function () {
      $(this).addClass('active').siblings().removeClass('active');
    });
  });

  /*----------------------------- Back to top button  ------------------------------ */
  var btn = $('.gi-back-to-top');

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
  });

  /*----------------------------- Tools Sidebar  ------------------------------ */
  $('.gi-tools-sidebar-toggle').on("click", function () {
    $('.gi-tools-sidebar').addClass("open-tools");
    $('.gi-tools-sidebar-overlay').fadeIn();
    $('.gi-tools-sidebar-toggle').hide();

  });
  $('.gi-tools-sidebar-overlay, .close-tools').on("click", function () {
    $('.gi-tools-sidebar').removeClass("open-tools");
    $('.gi-tools-sidebar-overlay').fadeOut();
    $('.gi-tools-sidebar-toggle').fadeIn();

  });

  /*========== color show ===========*/

  $(".gi-color li").on("click", function () {
    $("li").removeClass("active-variant");
    $(this).addClass("active-variant");
  });

  $(".color-primary").on("click", function () {
    $("#add_class").remove();
  });

  $(".color-1").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-1.css" id="add_class">'
    );
  });
  $(".color-2").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-2.css" id="add_class">'
    );
  });
  $(".color-3").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-3.css" id="add_class">'
    );
  });
  $(".color-4").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-4.css" id="add_class">'
    );
  });
  $(".color-5").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-5.css" id="add_class">'
    );
  });
  $(".color-6").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-6.css" id="add_class">'
    );
  });
  $(".color-7").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-7.css" id="add_class">'
    );
  });
  $(".color-8").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-8.css" id="add_class">'
    );
  });
  $(".color-9").on("click", function () {
    $("#add_class").remove();
    $("head").append(
      '<link rel="stylesheet" href="assets/css/color-9.css" id="add_class">'
    );
  });

  /*========== RTL-LTR Modes ===========*/
  $(".gi-tools-rtl .gi-tools-item").on("click", function () {
    $(".rtl-mode").removeClass("active-mode");
    $(this).addClass("active-mode");
  });
  $(".ltr").on("click", function () {
    $("#add_rtl").remove();
  });
  $(".rtl").on("click", function () {
    $("head").append(
      '<link rel="stylesheet" href="assets/css/rtl.css" id="add_rtl">'
    );
  });

  /*========== Dark Light Modes ===========*/
  $(".gi-tools-dark .gi-tools-item").on("click", function () {
    $(".mode-dark").removeClass("active-mode");
    $(this).addClass("active-mode");
  });
  $(".light").on("click", function () {
    $("#add_dark").remove();
  });
  $(".dark").on("click", function () {
    $("head").append(
      '<link rel="stylesheet" href="assets/css/dark.css" id="add_dark">'
    );
  });

  /*========== Wishlist 3 remove product ===========*/
  $(".remove-product").on("click", function () {
    $(this).parent(".gi-product-box").remove();
  });

  /*======== Product Image Change on Upload ========*/
  $("body").on("change", ".gi-image-upload", function (e) {
    var lkthislk = $(this);

    if (this.files && this.files[0]) {

      var reader = new FileReader();
      reader.onload = function (e) {

        var ec_image_preview = lkthislk.parent().parent().children('.gi-preview').find('.gi-image-preview').attr('src', e.target.result);

        ec_image_preview.hide();
        ec_image_preview.fadeIn(650);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });

})(jQuery);
