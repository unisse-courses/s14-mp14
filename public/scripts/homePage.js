
let slidePos = 0;

const slides = document.getElementsByClassName('carosel-item');

const totalSlides = slides.length;

const caroselBg = document.getElementsByClassName('carosel')[0];



const bgColors = ["#C40B0B", "#074988", "#575083", "#480C0C"]

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

    if (slidePos === 0) {
        caroselBg.style.backgroundColor = '#C40B0B'
    } else if (slidePos === 2){
        caroselBg.style.backgroundColor = "#074988"
    } else if (slidePos === 3){
        caroselBg.style.backgroundColor = "#575083"
    } else {
        caroselBg.style.backgroundColor = "#480C0C"
    }
    
    slides[slidePos].classList.add('carosel-item-visible')

    
    

}

const nextSlide = () => {
    if (slidePos === totalSlides - 1) {
        slidePos = 0;
    } else {
        slidePos++;
    }
    console.log(slidePos);
    updateSlide();
    
}

const prevSlide = () => {
    if (slidePos === 0) {
        slidePos = totalSlides - 1;
    } else {
        slidePos--;
    }

    console.log(slidePos);
    updateSlide();
    
    
}