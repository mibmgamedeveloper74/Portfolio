// === ☁️ Smooth Scroll Reveal & Background Fade ===
let unityOpacity = 1;
let mobileOpacity = 0;
const fadeSpeed = 0.05;

function smoothFade() {
    const scrollY = window.scrollY;
    const unityTarget = Math.max(0, 1 - scrollY / 400);
    const mobileTarget = Math.min(1, scrollY / 800);

    unityOpacity += (unityTarget - unityOpacity) * fadeSpeed;
    mobileOpacity += (mobileTarget - mobileOpacity) * fadeSpeed;

    document.body.style.setProperty('--unity-opacity', unityOpacity.toFixed(3));
    document.body.style.setProperty('--mobile-opacity', mobileOpacity.toFixed(3));

    requestAnimationFrame(smoothFade);
}

smoothFade();

// === ✨ Scroll Reveal Animation (with Reverse)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach(el => revealObserver.observe(el));

// === 📄 Resume Viewer (Zoom, Pan, Fullscreen)
const resumeThumb = document.getElementById('resume-thumb');
const fullscreenViewer = document.getElementById('resume-fullscreen');
const resumeImg = fullscreenViewer.querySelector("img");

let scale = 1, isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

resumeImg.classList.add("zoomable");

resumeThumb.addEventListener('click', () => {
    fullscreenViewer.classList.add('active');
    resetZoomAndPan();
    lockBodyScroll(true);
});

fullscreenViewer.addEventListener('click', () => {
    fullscreenViewer.classList.remove('active');
    resetZoomAndPan();
    lockBodyScroll(false);
});

resumeImg.addEventListener('click', e => e.stopPropagation());
resumeImg.addEventListener('dragstart', e => e.preventDefault());

fullscreenViewer.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomStep = 0.1;
    scale = Math.min(5, Math.max(1, scale + (e.deltaY < 0 ? zoomStep : -zoomStep)));
    updateTransform();
});

resumeImg.addEventListener('mousedown', (e) => {
    if (scale === 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    resumeImg.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    resumeImg.style.cursor = scale > 1 ? 'grab' : 'default';
});

resumeImg.addEventListener('touchstart', (e) => {
    if (scale === 1) return;
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
}, { passive: false });

resumeImg.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    updateTransform();
}, { passive: false });

resumeImg.addEventListener('touchend', () => {
    isDragging = false;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenViewer.classList.contains('active')) {
        fullscreenViewer.classList.remove('active');
        resetZoomAndPan();
        lockBodyScroll(false);
    }
});

function updateTransform() {
    resumeImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
}

function resetZoomAndPan() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    resumeImg.style.cursor = 'default';
}

function lockBodyScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
}

document.querySelectorAll('.download-btn, .project-card').forEach(el => {
    el.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${e.offsetX}px`;
        ripple.style.top = `${e.offsetY}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    document.querySelectorAll('.floating').forEach(el => {
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});
