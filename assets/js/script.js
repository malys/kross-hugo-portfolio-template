(function ($) {
  'use strict'

  // Preloader js
  $(window).on('load', function () {
    $('.preloader').fadeOut(100)
  })

  // Sticky Menu
  $(window).scroll(function () {
    if ($('.navigation').offset().top > 100) {
      $('.navigation').addClass('nav-bg')
    } else {
      $('.navigation').removeClass('nav-bg')
    }
  })

  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    })
  })

  // background color
  $('[data-color]').each(function () {
    $(this).css({
      'background-color': $(this).data('color')
    })
  })

  // progress bar
  $('[data-progress]').each(function () {
    $(this).css({
      'bottom': $(this).data('progress')
    })
  })

  /* ########################################### hero parallax ############################################## */
  window.onload = function () {
    var parallaxBox = document.getElementById('parallax')
    var
      /* c1left = document.getElementById('l1').offsetLeft,
            c1top = document.getElementById('l1').offsetTop, */
      c2left = document.getElementById('l2').offsetLeft

    var c2top = document.getElementById('l2').offsetTop

    var c3left = document.getElementById('l3').offsetLeft

    var c3top = document.getElementById('l3').offsetTop

    var c4left = document.getElementById('l4').offsetLeft

    var c4top = document.getElementById('l4').offsetTop

    var c5left = document.getElementById('l5').offsetLeft

    var c5top = document.getElementById('l5').offsetTop

    var c6left = document.getElementById('l6').offsetLeft

    var c6top = document.getElementById('l6').offsetTop

    var c7left = document.getElementById('l7').offsetLeft

    var c7top = document.getElementById('l7').offsetTop

    var c8left = document.getElementById('l8').offsetLeft

    var c8top = document.getElementById('l8').offsetTop

    var c9left = document.getElementById('l9').offsetLeft

    var c9top = document.getElementById('l9').offsetTop

    parallaxBox.onmousemove = function (event) {
      event = event || window.event
      var x = event.clientX - parallaxBox.offsetLeft

      var y = event.clientY - parallaxBox.offsetTop

      /*  mouseParallax('l1', c1left, c1top, x, y, 5); */
      mouseParallax('l2', c2left, c2top, x, y, 25)
      mouseParallax('l3', c3left, c3top, x, y, 20)
      mouseParallax('l4', c4left, c4top, x, y, 35)
      mouseParallax('l5', c5left, c5top, x, y, 30)
      mouseParallax('l6', c6left, c6top, x, y, 45)
      mouseParallax('l7', c7left, c7top, x, y, 30)
      mouseParallax('l8', c8left, c8top, x, y, 25)
      mouseParallax('l9', c9left, c9top, x, y, 40)
    }
  }

  function mouseParallax (id, left, top, mouseX, mouseY, speed) {
    var obj = document.getElementById(id)
    var parentObj = obj.parentNode

    var containerWidth = parseInt(parentObj.offsetWidth)

    var containerHeight = parseInt(parentObj.offsetHeight)
    obj.style.left = left - (((mouseX - (parseInt(obj.offsetWidth) / 2 + left)) / containerWidth) * speed) + 'px'
    obj.style.top = top - (((mouseY - (parseInt(obj.offsetHeight) / 2 + top)) / containerHeight) * speed) + 'px'
  }
  /* ########################################### /hero parallax ############################################## */

  // testimonial-slider
  $('.testimonial-slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: false,
    adaptiveHeight: true
  })

  // clients logo slider
  $('.client-logo-slider').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    ]
  })

  // Shuffle js filter and masonry
  var containerEl = document.querySelector('.shuffle-wrapper')
  if (containerEl) {
    var Shuffle = window.Shuffle
    var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
      itemSelector: '.shuffle-item',
      buffer: 1
    })

    jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
      var input = evt.currentTarget
      if (input.checked) {
        myShuffle.filter(input.value)
      }
    })
  }
})(jQuery)

var lunrIndex, $results, pagesIndex

function getQueryVariable (variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'))
    }
  }
}

var searchTerm = getQueryVariable('query')

// Initialize lunrjs using our generated index file
function initLunr () {
  // First retrieve the index file
  $.getJSON('/index.json')
    .done(function (index) {
      pagesIndex = index
      lunrIndex = lunr(function () {
        this.field('title', { boost: 10 })
        this.field('tags', { boost: 5 })
        this.field('summary')
        this.ref('uri')

        pagesIndex.forEach(function (page) {
          this.add(page)
        }, this)
      })
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ', ' + error
      console.error('Error getting Hugo index file:', err)
    })
}

// Nothing crazy here, just hook up a listener on the input field
function initUI () {
  $results = $('#blog-listing-medium')
  $('#searchinput').keyup(function () {
    $results.empty()

    // Only trigger a search when 2 chars. at least have been provided
    var query = $(this).val()
    if (query.length < 2) {
      return
    }

    var results = search(query)

    renderResults(results)
  })
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search (query) {
  return lunrIndex.search(query, {
    wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
  }).map(function (result) {
    return pagesIndex.filter(function (page) {
      return page.uri === result.ref
    })[0]
  })
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults (results) {
  if (!results.length) {
    $results.append('<p>No results found</p>')
    return
  }

  results.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date)
  })

  // Only show the ten first results
  results.slice(0, 100).forEach(function (result) {
    var $resultstring =

            "<article class='card shadow'>" +
            // "<img class='rounded card-img-top' src='" + result.image + "' style='max-width: 100px; height: auto; ' alt='" + result.title + "'>" +
            "<div class='card-body'>" +
            "<h4 class='card-title'><a class='text-dark' href=' " + result.uri + "'>" + result.title + '</a>' +
            '</h4>' +
            "<p class='cars-text'>" + result.summary + '</p>'
    for (i = 0; i < result.tags.length; i++) {
      $resultstring += "<a href='/tags/" + result.tags[i] + "'>" + result.tags[i] + '</a>'
      if ((i + 1) < result.tags.length) {
        $resultstring += ', '
      }
    }

    $resultstring += '</div>' +
    '</article>'

    var $result = ($resultstring)
    $results.append($result)
  })
}

initLunr()

$(document).ready(function () {
  initUI()
})
