if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",  ready)
    
}else{
    ready()
}

function ready(){
    let addBtn = document.querySelectorAll(".addBtn")
    addBtn.forEach(addtocart => {
        addtocart.addEventListener("click", addItemsToCart)
    });
    loadCart()
    removeCart()
    // updateCartQty()
}

let pushProduct = [];

function addItemsToCart (event){
    let target = event.target.parentElement
    let itemImg = target.getElementsByClassName("product-img")[0].src
    let itemName = target.getElementsByClassName("product-name")[0].innerText
    let itemPrice = target.getElementsByClassName("product-price")[0].innerText.replace("\u20A6", "")
    let itemtotalPrice = target.getElementsByClassName("product-price")[0].innerText.replace("\u20A6", "")
    let itemQty = target.getElementsByClassName("product-quantity")[0].value
    let itemId = target.getElementsByClassName("product-id")[0].value
    let itemColor = target.getElementsByClassName("product-color")[0].value
    let itemSize = target.getElementsByClassName("product-size")[0].value
    // console.log(itemColor, itemId, itemSize);
    
    
    let items = {
        itemId, 
        itemImg, 
        itemName,
        itemPrice, 
        itemQty, 
        itemColor,
        itemSize,
        itemtotalPrice
    }
    addProductToCart(items);
    // getCartNumber(items)
    updateCart()
    grandTotal()
    // removeCart()
    
    // saveItemToStorage(productInfo)
}

function addProductToCart(items){
    let table = document.getElementsByTagName("tbody")[0]
    let html = document.createElement("tr")
    let productId = document.querySelectorAll(".productId")
    for (let i = 0; i < productId.length; i++) {
        const buttonId = productId[i];
    if(buttonId.value == items.itemId){
        return
    }
    
}


html.innerHTML = `
<td"></td>
<td>  <img src="${items.itemImg}" name="myfiles" alt=""> </td>
<td> <p name="productName">${items.itemName}</p></td>
<td><p name="price" class="price">\u20A6 ${items.itemPrice}</p></td>
<td> <select name="color" id="">
<option value="color" ${items.itemColor == 'color' ? 'selected' : ""}>color</option>
<option value="all" ${items.itemColor == 'all' ? 'selected' : ""}>all</option>
<option value="red" ${items.itemColor == 'red' ? 'selected' : ""}>red</option>
<option value="blue" ${items.itemColor == 'blue' ? 'selected' : ""}>blue</option>
<option value="pink" ${items.itemColor == 'pink' ? 'selected' : ""}>pink</option>
<option value="black" ${items.itemColor == 'black' ? 'selected' : ""}>black</option>
<option value="white" ${items.itemColor == 'white' ? 'selected' : ""}>white</option>
<option value="green" ${items.itemColor == 'green' ? 'selected' : ""}>green</option>
</select> </td>

<td> <p name="amount">${items.itemSize}</p></td>


<td><input type="number"  value="${items.itemQty}" name="quantity" class="show-count" id="qty" ></td>


<td> <p class="totalprice">\u20A6${items.itemtotalPrice}</p></td>

<td>  <button type="Button" class="remove-Button"><i class="lni lni-close"></i></button></td>
<td><input type="hidden" name="productName" value="${items.itemName}" id="productId"> </td>   
<td><input type="hidden" name="productId" value="${items.itemId}" id="productId" class="productId"> </td>   
<td><input type="hidden" name="price" value="${items.itemPrice}" id="productId"> </td>   
<td><input type="hidden" name="productImg" value="${items.itemImg}" id="productId"> </td>   
<td><input type="hidden" name="productSizes" value="${items.itemSize}" id="productId"> </td>   
<td><input type="hidden" name="totalPrice" value="${parseInt(items.itemtotalPrice)}" id="productId"> </td>   

`

    table.append(html)
    let products = getProductFromCart()
    pushProduct.push(items)
    localStorage.setItem("carts", JSON.stringify(pushProduct))
    updateCart()
    grandTotal()
    //removeCart(items)
    getCartNumber()
    removeCart(items)
    
    
}

function getProductFromCart(){
    return localStorage.getItem('carts') ? JSON.parse(localStorage.getItem('carts')) : []
    
}

function loadCart(){
    let products = getProductFromCart()
    products.forEach(product => addProductToCart(product))

 }

 

 // // 09079345111

// get total number of qty in the cart




function getCartNumber(){
    let cartNumber = document.querySelector(".cartNumber span")
    let qty = document.querySelectorAll(".show-count")
    let total = 0
    
let cartItems = JSON.parse(localStorage.getItem("carts"))
 let  = cartItems.filter(carts =>{
     console.log(carts.itemQty.length);
     total += parseFloat(carts.itemQty.length)
 })
       
     
       cartNumber.innerText = total


            }
            


    
// display products added in the cart 




function removeCart(){
    let removeCart = document.querySelectorAll(".remove-Button")
    removeCart.forEach(removeBtn =>{
        // console.log(removeBtn);
        removeBtn.addEventListener("click", removeCartItems)
    })
}
// 

function removeCartItems(e){
    let target =  e.target.parentElement.parentElement.parentElement
    let productId = target.getElementsByClassName("productId")[0].value
    // console.log(productId);
   target.remove()
let products = getProductFromCart()
let updateProduct = products.filter(product =>{
   return product.itemId !=  productId
})
localStorage.setItem("carts", JSON.stringify(updateProduct))

   
   updateCart()
   grandTotal()
   getCartNumber()
}

// update cartqty


function updateCart(){

    let qty = document.querySelectorAll(".show-count")
    let total = 0
qty.forEach(itemQtys =>{
    itemQtys.addEventListener("change", changeCartNumber)
    })
}


    function changeCartNumber(event){
        if(isNaN(event.target.value) || event.target.value <= 0){
            event.target.value = 1
        }

        let target = event.target.parentElement.parentElement
        let productId = target.getElementsByClassName("productId")[0].value

        let quantity = target.getElementsByClassName("show-count")[0].value
     

        let price = target.getElementsByClassName("price")[0].innerText.replace("\u20A6", "") 

        total  =  price * quantity
    
        let totalPrice = target.getElementsByClassName("totalprice")[0].innerText = "\u20A6" + total
       
        let cartItems = JSON.parse(localStorage.getItem("carts"))
        if(cartItems){
            cartItems.forEach(mycart =>{
                if(mycart.itemId == productId){
                   mycart.itemQty = event.target.value
                }
            })
            localStorage.setItem("carts", JSON.stringify(cartItems))
        }
        
       
           

   
    // let myprice = itemprice   
    
    grandTotal()
    getCartNumber()

}

function grandTotal(){
        let cartTotal = document.querySelector(".total")
    
        let total = 0
        let totalPrice = document.querySelectorAll(".totalprice")
        totalPrice.forEach(productPrice =>{
          
            tt = Number(productPrice.innerText.replace("\u20A6", ""))
            total += tt
            
        })
       
        cartTotal.innerText = "\u20A6"+ total
    }
 
