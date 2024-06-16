const cursor = document.querySelector(".cursor")
const container = document.querySelector(".container")
const cursorAnimation = () => {
    container.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            left: e.x - 60,
            top: e.y - 360
        })
    })
}
cursorAnimation()
