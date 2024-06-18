const logo = document.querySelector(".logo")
const searchBlog = document.querySelector("input")
const navlinks = document.querySelector(".navlinks")
gsap.from([logo, searchBlog, navlinks], {
    y: -100,
    stagger: 1
})