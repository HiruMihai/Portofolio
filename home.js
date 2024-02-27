function toggleText() {
    var expandableDiv = document.querySelector('.expandable');
    var additionalText = document.querySelector('.additional-text');

    // Toggle the 'open' class
    expandableDiv.classList.toggle('open');

    // If the div is open, set max-height to the actual height of the content
    if (expandableDiv.classList.contains('open')) {
        additionalText.style.display = 'block';
        expandableDiv.style.maxHeight = additionalText.scrollHeight + 'px';
    } else {
        additionalText.style.display = 'none';

        // Use requestAnimationFrame to ensure a smooth transition when closing
        requestAnimationFrame(function () {
            expandableDiv.style.maxHeight = '50px'; // Set it back to the initial max-height
        });
    }
}
