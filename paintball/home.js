window.addEventListener('scroll', function () {
    let scrollPosition = window.scrollY;
    let firstBg = document.querySelector('.first-bg');

    if (scrollPosition < 70) { // Change condition to scrollPosition less than 250
        firstBg.style.backgroundAttachment = 'scroll'; // Change to scroll when at the top
        firstBg.style.backgroundPositionY = "30px, 30px"
      
    } else {
        firstBg.style.backgroundAttachment = 'fixed'; // Change to fixed when scrolled past 250px
        firstBg.style.backgroundPositionY = "150px, 150px"
    }
    if (scrollPosition > 1200) {
        firstBg.style.backgroundPositionY = "bottom, bottom"
        firstBg.style.backgroundAttachment = 'scroll'; // Change to fixed when scrolled past 250px
    }
    else {
        
    }
});