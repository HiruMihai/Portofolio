
$(document).ready(function () {
    function handleScrollAnimations() {
        let windowHeight = $(window).height();
        let scrollTop = $(window).scrollTop();

        $('.contact-text, .contact-buttons, .contact-details, .contact-image, .contact-info, .basic-plan, .standard-plan, .premium-plan, .left-column, .right-column, .text-plans').each(function () {
            let elementOffset = $(this).offset().top;
            let distanceFromBottom = elementOffset - scrollTop - windowHeight;

            let delay = 200;
            if (distanceFromBottom < -delay && !$(this).hasClass('animate__animated')) {
                $(this).addClass('animate__animated animate__bounceInLeft');
                $(this).css('opacity', '1');
            }
        });
    }

    handleScrollAnimations();

    $(window).scroll(function () {
        handleScrollAnimations();
    });
});


$(document).ready(function () {

    $('#email').click(function () {
        window.location.href = 'mailto:contact@stayfitgym.ro';
    });

    $('#phone').click(function () {
        window.location.href = 'tel:070%5795503';
    });

    $('#adress').click(function () {
        window.location.href = 'https://maps.google.com/?q=Str. Sfanta Vineri, nr. 16';
    });
});


$(document).ready(function () {
    const $inaltimeInput = $('#inaltime');
    const $greutateInput = $('#greutate');
    const $textInaltime = $('.text-form-top');
    const $textGreutate = $('.text-form-bot');

    function updateTextAndStorage() {
        const inaltime = $inaltimeInput.val();
        const greutate = $greutateInput.val();

        $textInaltime.text(`${inaltime}cm`);
        $textGreutate.text(`${greutate}kg`);

        localStorage.setItem('inaltime', inaltime);
        localStorage.setItem('greutate', greutate);
    }

    const inaltime = localStorage.getItem('inaltime');
    const greutate = localStorage.getItem('greutate');

    if (inaltime) {
        $inaltimeInput.val(inaltime);
        $textInaltime.text(`${inaltime}cm`);
    }

    if (greutate) {
        $greutateInput.val(greutate);
        $textGreutate.text(`${greutate}kg`);
    }

    $inaltimeInput.on('input', updateTextAndStorage);
    $greutateInput.on('input', updateTextAndStorage);
});


$(document).ready(function () {
    function updateImages() {
        let tipSomatic = $('#tip_somatic').val();
        let greutate = parseFloat($('#greutate').val());
        let zileSaptamana = parseInt($('#zile_saptamana').val(), 10);
        let frecventaAntrenament = parseInt($('#frecventa_antrenament').val(), 10);
        let imageType;

        let imageSrcMap = {
            'ectomorf': {
                '<80': { 'front': './assets/body types/XS.png', 'side': './assets/body types/XS Side.png', 'type': 'XS' },
                '80-90': { 'front': './assets/body types/S.png', 'side': './assets/body types/S Side.png', 'type': 'S' },
                '>=90': { 'front': './assets/body types/M.png', 'side': './assets/body types/M Side.png', 'type': 'M' }
            },
            'mezomorf': {
                '<90': { 'front': './assets/body types/S.png', 'side': './assets/body types/S Side.png', 'type': 'S' },
                '>=90': { 'front': './assets/body types/M.png', 'side': './assets/body types/M Side.png', 'type': 'M' }
            },
            'endomorf': {
                '<80': { 'front': './assets/body types/M.png', 'side': './assets/body types/M Side.png', 'type': 'M' },
                '>=80': { 'front': './assets/body types/L.png', 'side': './assets/body types/L Side.png', 'type': 'L' }
            },
            'above150': {
                'front': './assets/body types/XL.png',
                'side': './assets/body types/XL Side.png',
                'type': 'XL'
            }
        };

        let selectedImages;

        if (greutate > 150) {
            selectedImages = imageSrcMap['above150'];
        } else {
            if (tipSomatic === 'ectomorf') {
                if (greutate < 80) {
                    selectedImages = imageSrcMap['ectomorf']['<80'];
                } else if (greutate >= 80 && greutate < 90) {
                    selectedImages = imageSrcMap['ectomorf']['80-90'];
                } else if (greutate >= 90) {
                    selectedImages = imageSrcMap['ectomorf']['>=90'];
                }
            } else if (tipSomatic === 'mezomorf') {
                if (greutate < 90) {
                    selectedImages = imageSrcMap['mezomorf']['<90'];
                } else if (greutate >= 90) {
                    selectedImages = imageSrcMap['mezomorf']['>=90'];
                }
            } else if (tipSomatic === 'endomorf') {
                if (greutate < 80) {
                    selectedImages = imageSrcMap['endomorf']['<80'];
                } else if (greutate >= 80) {
                    selectedImages = imageSrcMap['endomorf']['>=80'];
                }
            }
        }

        if (selectedImages) {
            imageType = selectedImages.type;
            $('.before img').eq(0).attr('src', selectedImages.front);
            $('.before img').eq(1).attr('src', selectedImages.side);
            localStorage.setItem('tip_somatic', tipSomatic);
            localStorage.setItem('greutate', greutate);
            localStorage.setItem('image_type', imageType);
        }

        let afterImages;

        if (zileSaptamana >= 2) {
            if (imageType === 'XS' || imageType === 'M') {
                afterImages = { front: './assets/body types/S.png', side: './assets/body types/S Side.png' };
                imageType = 'S';
            } else if (imageType === 'L') {
                afterImages = { front: './assets/body types/M.png', side: './assets/body types/M Side.png' };
                imageType = 'M';
            } else if (imageType === 'XL') {
                afterImages = { front: './assets/body types/L.png', side: './assets/body types/L Side.png' };
                imageType = 'L';
            }
        }

        if (frecventaAntrenament >= 2) {
            if (imageType === 'XS' || imageType === 'M' || imageType === 'L') {
                afterImages = { front: './assets/body types/S.png', side: './assets/body types/S Side.png' };
            } else if (imageType === 'XL') {
                afterImages = { front: './assets/body types/M.png', side: './assets/body types/M Side.png' };
            }
        }

        if (!afterImages) {
            afterImages = {
                front: $('.before img').eq(0).attr('src'),
                side: $('.before img').eq(1).attr('src')
            };
        }

        $('.after img').eq(0).attr('src', afterImages.front);
        $('.after img').eq(1).attr('src', afterImages.side);
    }

    $('#tip_somatic, #greutate, #zile_saptamana, #frecventa_antrenament').on('input change', updateImages);

    if (localStorage.getItem('tip_somatic')) {
        $('#tip_somatic').val(localStorage.getItem('tip_somatic'));
    }
    if (localStorage.getItem('greutate')) {
        $('#greutate').val(localStorage.getItem('greutate'));
    }
    if (localStorage.getItem('zile_saptamana')) {
        $('#zile_saptamana').val(localStorage.getItem('zile_saptamana'));
    }
    if (localStorage.getItem('frecventa_antrenament')) {
        $('#frecventa_antrenament').val(localStorage.getItem('frecventa_antrenament'));
    }
    updateImages();
});


