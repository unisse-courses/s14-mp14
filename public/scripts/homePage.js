
let slidePos = 0;

const slides = document.getElementsByClassName('carosel-item');

const totalSlides = slides.length;

console.log(totalSlides);

document.getElementById('carosel-btn-next').addEventListener("click", ()=> {
    nextSlide();
})

document.getElementById('carosel-btn-prev').addEventListener("click", ()=> {
    prevSlide();
})


function updateSlide(){
    
    for (let slide of slides){
        slide.classList.remove('carosel-item-visible');
        slide.classList.add('carosel-item-hidden');

    }


    slides[slidePos].classList.add('carosel-item-visible')

}

const nextSlide = () => {
    if (slidePos === totalSlides - 1) {
        slidePos = 0;
    } else {
        slidePos++;
    }

    updateSlide();
    console.log(slidePos);
}

const prevSlide = () => {
    if (slidePos === 0) {
        slidePos = totalSlides - 1;
    } else {
        slidePos--;
    }


    updateSlide();
    console.log(slidePos);
    
}