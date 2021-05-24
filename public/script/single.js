let addUpQty = document.querySelectorAll(".add")
let subUpQty = document.querySelectorAll(".sub")
let qtty = document.querySelector("#qty")

addUpQty.forEach(add =>{
    add.addEventListener("click", (e)=>{
        
        let input = e.target.parentElement.children[1];
         let inputValue = input.value
         let newValue = parseInt(inputValue) + 1
         input.value = newValue
        

       })
       
        
        
    })

    subUpQty.forEach(sub =>{
        sub.addEventListener("click", (e)=>{
       
     let input = e.target.parentElement.children[1];
     let inputValue = input.value
     let newValue = parseInt(inputValue) - 1
     input.value = newValue
            
     if(newValue < 1){
     input.value = 1

     }
       })
       
        
        
    })


    const infoBtnss = document.querySelectorAll(".des1")
    const showInfoss = document.querySelectorAll(".showInfo")
    const info = document.querySelector(".infoBtn")
   

  
    window.onload=function(){
document.querySelector(".description").click();
};
    infoBtnss.forEach(infoBtn =>{
        infoBtn.addEventListener("click", (e) =>{
            info.querySelector(".active").classList.remove("active")
            infoBtn.classList.add("active")
            showInfoss.forEach(showInfo =>{
                let infoBtnAttr = infoBtn.getAttribute("data-select")
                let showInfoAttr = showInfo.getAttribute("data-select")

                if(infoBtnAttr == showInfoAttr || infoBtnAttr === "all"){
                    showInfo.classList.remove("hide")
                    showInfo.classList.add("show")
                }
                else{
                    showInfo.classList.remove("show")
                    showInfo.classList.add("hide")
                }
                // if(infoBtnAttr == "all"){
                //     console.log(all);
                // }

            })
        })
    })



    const liInfo = document.querySelectorAll("li")
    const newInfo = document.querySelectorAll(".des")
    const descIcon = document.querySelector("#descIcon")
    const descBtn = document.querySelector(".descriptions")
    const shipBtn = document.querySelector(".shippings")
    const shipIcon = document.querySelector(".ship")
    const returnBtn = document.querySelector(".returns")
    const waraBtn = document.querySelector(".warantys")
    const waraIcon = document.querySelector("#wara")
    const returnIcon = document.querySelector("#return")
    const revIcon = document.querySelector("#rew")
    const revBtn = document.querySelector(".reviews")
    

    
    const newIcon = document.querySelectorAll(".showProductInfoOnmobile i")

    liInfo.forEach(eachLi =>{
        eachLi.addEventListener("click", (e) =>{
            newInfo.forEach(showMobile =>{
                newIcon.forEach(changeIcon =>{

                    let mobileSelect = eachLi.getAttribute("data-select")  
                    let newAttr  = showMobile.getAttribute("data-select")
                    let changeAttr  = showMobile.getAttribute("data-select")
                    
                    if(mobileSelect === newAttr){
                        showMobile.classList.toggle("showInfo")
                    }
                   
                    
                })
                
            })
        })
    })
    
    descBtn.addEventListener("click", (e) =>{
               descIcon.classList.toggle("fa-minus")     
        })

        shipBtn.onclick =()=>{
            shipIcon.classList.toggle("fa-minus")
        }
        waraBtn.onclick =()=>{
            waraIcon.classList.toggle("fa-minus")
        }
        returnBtn.onclick =()=>{
            returnIcon.classList.toggle("fa-minus")
        }
        revBtn.onclick =()=>{
            revIcon.classList.toggle("fa-minus")
        }