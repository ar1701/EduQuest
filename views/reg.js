    

const images = document.querySelectorAll('.image');
const bullets = document.querySelectorAll('.bullets span');

let currentIndex = 0;
function showImage(index) {
    
    images.forEach((img, idx) => {
        img.classList.remove('show');
        bullets[idx].classList.remove('active');
    });
    
   
    images[index].classList.add('show');
    bullets[index].classList.add('active');
}


function nextImage() {
    currentIndex = (currentIndex + 1) % images.length; 
    showImage(currentIndex);
}


const autoSlideInterval = setInterval(nextImage, 3000);


bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
        clearInterval(autoSlideInterval); 
        currentIndex = index; 
        showImage(currentIndex); 
    });
});


showImage(currentIndex);
