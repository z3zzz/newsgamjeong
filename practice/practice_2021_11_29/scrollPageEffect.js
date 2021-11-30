const scrollEffectElems = document.querySelectorAll('.scroll-effect')

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return

        entry.target.classList.add('appear')
        observer.unobserve(entry.target)
        
        //console.log(entry.target)
        // console.log(entry.rootBounds)
    })
}, {
    root: null,
    threshold: 0.7,
    rootMargin: "-100px",

})

scrollEffectElems.forEach(elem => observer.observe(elem))