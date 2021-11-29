window.addEventListener('keydown' /* or keyup, see what feels better when you test it */, e => {
    switch (e.code) {
      case "ArrowUp":
        scrollLeft();
        break;
      case "ArrowDown":
        scrollRight();
        break;
      default:
        /* don't do anything */
    }
  });
  
  window.addEventListener('wheel', e => {
    if (e.deltaY < 0 /* or some negative number so it doesn't fire on the slightest touch*/) {
      // scrolled up
      scrollLeft();
    } else if (e.deltaY > 0 /* or some positive number so it doesn't fire on the slightest touch*/) {
      // scrolled down
      scrollRight();
    }
  });