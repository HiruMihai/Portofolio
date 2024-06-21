document.addEventListener("DOMContentLoaded", function() {
    const headerBtns = document.querySelectorAll(".header-btn");

    headerBtns.forEach(btn => {
        const paragraph = btn.nextElementSibling;
        const expandMoreIcon = btn.querySelector('.material-symbols-outlined:nth-child(2)');
        const expandLessIcon = btn.querySelector('.material-symbols-outlined:nth-child(3)');

        if (paragraph.style.display === "block") {
            expandMoreIcon.style.display = "none";
            expandLessIcon.style.display = "inline";
        } else {
            expandMoreIcon.style.display = "inline";
            expandLessIcon.style.display = "none";
        }

        btn.addEventListener("click", function() {
            const projectBtns = this.parentElement.querySelectorAll(".project-btn");

            if (paragraph.style.display === "none" || paragraph.style.display === "") {
                paragraph.style.display = "block";
                expandMoreIcon.style.display = "none";
                expandLessIcon.style.display = "inline";
                setTimeout(() => {
                    paragraph.style.opacity = "1";
                }, 10);
            } else {
                paragraph.style.opacity = "0";
                expandMoreIcon.style.display = "inline";
                expandLessIcon.style.display = "none";
                setTimeout(() => {
                    paragraph.style.display = "none";
                }, 300);
            }
          
            projectBtns.forEach(btn => {
                if (btn.style.display === "none" || btn.style.display === "") {
                    btn.style.display = "block";
                    setTimeout(() => {
                        btn.style.opacity = "1";
                    }, 10);
                } else {
                    btn.style.opacity = "0";
                    setTimeout(() => {
                        btn.style.display = "none";
                    }, 300);
                }
            });
        });
    });
});
