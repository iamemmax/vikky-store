const displayImg = document.getElementById("show_img")
const selectImg = document.querySelectorAll(".select_img")

selectImg.forEach(myImg =>{
    myImg.addEventListener("click", (e)=>{
       displayImg.src = e.target.src
       displayImg.className = "animateImg";
    })
})



// add to cart funtionality
const addBtn = document.querySelectorAll(".addBtn");
let pushProducts = [];
addBtn.forEach(addToCartBtn =>{
    addToCartBtn.addEventListener("click", addtocart);
})

function addtocart(e){
    // get product info by clicking on the add to cart btn
let productImg = e.target.parentElement.children[0].children[0].src;
let productId = e.target.parentElement.children[3].value;
let productName = e.target.parentElement.children[0].children[1].innerText;
let productPrice = e.target.parentElement.children[2].innerText.replace("$", "");
let totalPrice = e.target.parentElement.children[2].innerText.replace("$", "");
let productQty = 1
let ProductSize =  e.target.parentElement.children[6].value;
let productColor = e.target.parentElement.children[7].value;





let product = {
    productId,
    productImg,
    productImg,
    productName,
    productPrice,
    productQty,
    productColor,
    ProductSize,
    totalPrice
}

let cartItems = JSON.parse(localStorage.getItem("carts"))
    if(cartItems === null){
        pushProducts.push(product)
    }else{
        cartItems.forEach(items =>{
            if(product.productId == items.productId){
                product.productQty = items.productQty += 1,
                product.totalPrice = Number(items.productPrice * items.productQty)
            }else{
                pushProducts.push(items)
            }
        })
        pushProducts.push(product)
    }
    window.location.reload()
    localStorage.setItem("carts", JSON.stringify(pushProducts))
}




// get total number of qty in the cart
function getCartNumber(){
    let cartNumber = document.querySelector(".cartNumber span")
        let tot = 0
            let cartItems = JSON.parse(localStorage.getItem("carts"))
                cartItems.forEach(items =>{
                    tot += items.productQty
                })

                    cartNumber.innerText = tot

            }
            getCartNumber()


    
// display products added in the cart 

let table = document.getElementsByTagName("tbody")[0]
const  displayCart = () =>{
  

    let cartItems = JSON.parse(localStorage.getItem("carts"))
    
    
    
    cartItems.forEach(items =>{
        let tr = document.createElement("tr")
        
        tr.innerHTML =  `   
         <td"></td>
         <td><input type="hidden" value="${items.productId}" id=""> </td>   
        <td>  <img src="${items.productImg}" alt=""> </td>
        <td> <p>${items.productName}</p></td>
        <td><p>$${items.productPrice}</p></td>
        <td> <p>${items.productColor}</p></td>
        <td> <p>${items.ProductSize}</p></td>
        
        
        <td><input type="number"  value="${items.productQty}" name="quantity" class="show-count" id="qty"></td>
        
        
        <td> <p class="totalprice">$${items.totalPrice}</p></td>
        
        <td>  <button type="Button" class="removeButton"><i class="lni lni-close"></i></button></td>
        
               
                `
                table.append(tr)
            })

   
    // increase()
}


displayCart()



// remove cart

let removeButton = document.querySelectorAll(".removeButton")
removeButton.forEach(removeBtn => {
    removeBtn.addEventListener("click", (e)=>{
        
        let cartItems = JSON.parse(localStorage.getItem("carts"))
        console.log( );
         
            cartItems.forEach(items =>{
            
                if( e.target.parentElement.parentElement.parentElement.children[1].children[0].value != items.productId ){
                   pushProducts.push(items)
                }
            })
               
                localStorage.setItem("carts", JSON.stringify(pushProducts))
                window.location.reload()
                
            })
            getCartNumber()
        })
        
    






// update total price

function updateQty(){
    const totalContent = document.querySelectorAll(".show-count")
    
   
    totalContent.forEach(allTotherPrice =>{
        allTotherPrice.addEventListener("change", (e)=>{
            
            let priceContent = e.target.parentElement.children[7]
            let cartItems = JSON.parse(localStorage.getItem("carts"))
            console.log(priceContent);
            cartItems.forEach(items =>{
               
               if(items.productId == e.target.parentElement.children[0].value){
                   
                 priceContent.innerText = "$"+items.productPrice * e.target.value;
                 items.productQty = e.target.value
                 pushProducts.push(items)
                
                 if(isNaN(e.target.value) || e.target.value <= 0){
                     e.target.value = 1
                  }
                  
               }
            })
            grandTotal()
        })
            
    })

      }
      
      
      
      updateQty()



let grandtotal = document.querySelector(".total")
console.log(grandtotal.children);

      function grandTotal(){
        let tot = 0
    
    
    
           let totalprice = document.querySelectorAll(".totalprice")
           totalprice.forEach(addGrandTotal =>{
               
               grandtotalContent = Number(addGrandTotal.innerText.replace("$", ""))
               tot += grandtotalContent
               
            })
            // console.log(tot);
       
            grandtotal.innerHTML = "$"+ tot
    }
    grandTotal()








    