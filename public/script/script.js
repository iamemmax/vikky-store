const displayImg = document.getElementById("show_img")
const selectImg = document.querySelectorAll(".select_img")

selectImg.forEach(myImg =>{
    myImg.addEventListener("click", (e)=>{
       displayImg.src = e.target.src
       displayImg.className = "animateImg"
    })
})


