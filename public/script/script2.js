



       // pageoader
       const loader = document.querySelector(".pageloader")
       window.addEventListener("load", (e) =>{
        loader.classList.add("fadeIn")
       })
     

  // function addToCart(){
 
    const catBtn = document.querySelectorAll(".cart")
    const cartItem = document.querySelectorAll(".mycategory")
    const category = document.querySelector(".categories")
    
    console.log(category);
    catBtn.forEach(categBtn =>{
        categBtn.addEventListener("click", (e)=>{
            category.querySelector(".active").classList.remove("active")
            categBtn.classList.add("active")
            

           let cateAttribute = categBtn.getAttribute("data-name")
           
           cartItem.forEach(items =>{
               let myItemAttrribute = items.getAttribute("data-name")
               if(cateAttribute == myItemAttrribute || cateAttribute === "all"){
               
                items.classList.remove("hide")
                items.classList.add("show")
               }else{
                items.classList.remove("show")
                items.classList.add("hide")


               }
           })
        })
    })






 // my shopping cart script



    function increase(){
     const addUp = document.querySelectorAll(".add")
     const subUp = document.querySelectorAll(".sub")
     const qty = document.querySelector("#qty")
     
     addUp.forEach(add =>{
         add.addEventListener("click", (e)=>{
             
             let input = e.target.parentElement.children[1];
              let inputValue = input.value
              let newValue = parseInt(inputValue) + 1
              input.value = newValue
             
 
            })
            
             
             
         })
 
         subUp.forEach(sub =>{
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
    }
    increase()
 




// show cart items 

    let cartNumber = document.querySelector(".cartNumber")
    let cart_conntaianer = document.querySelector(".cart_conntaianer")
    cartNumber.addEventListener("click", (e) =>{
        cart_conntaianer.classList.add("mm")
          
        })
    
    
    
  // }



  // addToCart()


  
 
  let notLogging = document.getElementById("notLogging")
  let removeSlideShow = document.getElementById("removeSlideShow")
  let loginUser = document.querySelector(".loginUser")

  notLogging.addEventListener("click", (e) =>{
    loginUser.classList.add("showLogin")


  })
  removeSlideShow.addEventListener("click", (e) =>{
    loginUser.classList.remove("showLogin")



  })
