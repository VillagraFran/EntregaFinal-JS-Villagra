//=====VARIABLES=====//
const menu = document.querySelector(".products-menu")
const btnCart = document.getElementsByClassName("btn-product")
const carNumber = document.querySelector(".carrito-number")
const carr = document.querySelector(".offcanvas-body")
const btnPrice = document.querySelector("#btn-price")
const btnName = document.querySelector("#btn-name")

//===FONDO===//

function chooseRandomWallpaper() {
    let options = [
        './img/lomito-scaled.jpg',
        './img/istockphoto-652337878-170667a.jpg', 
        './img/zoom-party-pizza-slice-on-wood-v9b7xqgls5fw0n28.jpg',
    ];
    
    let randomOption = Math.floor(Math.random() * options.length);
    let randomWallpaper = options[randomOption];

    let randomChoice = randomWallpaper;
    
    const wallpaper = document.querySelector(".title-page")
    wallpaper.style.backgroundImage = "url("+`${randomChoice}`+")"
}
chooseRandomWallpaper()

setInterval(() => {
    chooseRandomWallpaper()
}, 10000)


//====MOSTRAR PRODUCTOS====//

const searchBtn = document.getElementById("search-value-input")

let nameOrder = 0
let priceOrder = 0

btnPrice.addEventListener("click", () => {
    nameOrder=0
    if (priceOrder == 1) {
        priceOrder = 0
    } else (
        priceOrder = 1
    )
    showProducts()
})

btnName.addEventListener("click", () => {

    priceOrder=0
    if (nameOrder == 1) {
        nameOrder = 0
    } else {
        nameOrder = 1
    }
        

    showProducts()
})


const showProducts = async () => {
    const resp = await
    fetch("./data.json")
    const products = await resp.json()
    
    menu.innerHTML = ""

    let dataValue = document.querySelector("#form-search").value;

    let prodFilter = products.filter((pr) => pr.name.includes(`${dataValue}`));

    if (priceOrder == 1) {

        btnPrice.style.color = "lightblue"

        prodFilter.sort((a, b) => {
            if (a.price < b.price) {
                return -1;
            } if(a.price > b.price) {
                return +1;
            } else {
                return 0;
            }
        })
    } else {
        btnPrice.style.color = "black"
    }
    
    if (nameOrder == 1) {

        btnName.style.color = "lightblue"

        prodFilter.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } if(a.name > b.name) {
                return +1;
            } else {
                return 0;
            }
        })    
    } else {
        btnName.style.color = "black"
    }

    prodFilter.forEach(pr => {
        
        const filterCard = document.createElement("div")
        filterCard.innerHTML = `
        <div class="card" style="width: 18rem;">
                <img src="${pr.img}" class="card-img-top" alt="${pr.name}">
                <div class="card-body">
                    <h5 class="card-title">${pr.name}</h5>
                    <p class="card-text">Precio: $${pr.price}</p>
                <button class="btn btn-primary btn-product">Añadir al Carrito</button>
            </div>
        </div>
        `
        menu.appendChild(filterCard)
    });

    for (let b = 0; b < btnCart.length; b++) {

        btnCart[b].addEventListener("click", () => {
            let product = prodFilter[b]

            const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id)

            if (repeat === true) {
                carrito.map((prod) => {
                    if (prod.id === product.id) {
                        prod.cantidad++
                        localStorage.setItem("carrito", JSON.stringify(carrito))
                        showCarrito()
                    }
                })
            } else {
                carrito.push(prodFilter[b])
                localStorage.setItem("carrito", JSON.stringify(carrito))
                showCarrito()
            }

        })  
    }
}
showProducts()


searchBtn.addEventListener("click", showProducts)


//====MOSTRAR CARRITO====//

carrito = []

function showCarrito() {

    carr.innerHTML = ""

    if (carrito.length === 0) {
        const emptyCarr = document.createElement("div")
        emptyCarr.className = "emptyCarr"
        emptyCarr.innerHTML = "<p>el carrito esta vacio</p>"

        carr.style.display = "flex"
        carr.style.justifyContent = "center"
        carr.style.alignItems = "center"
        carr.appendChild(emptyCarr)
    } else {
        carr.style.justifyContent = "flex-start"
        carr.style.alignItems = "stretch"
        carr.style.flexDirection = "column"

        carrito.forEach((carProduct) => {

            let carProductCard = document.createElement("div")
            carProductCard.className = "carProductCard"
            carProductCard.innerHTML = `
                <div class="card-content">
                    <img class="img-fluid rounded-start" src="${carProduct.img}">
                    <div class="car-text">
                        <div class="car-card-info" >
                            <p>Cantidad:</p>
                            <button class="btn btn-danger btn-substract" >-</button>
                            <p>${carProduct.cantidad}</p>
                            <button class="btn btn-success btn-add" >+</button>
                        </div>
                        <p>precio:$${carProduct.price * carProduct.cantidad}
                    </div>
                </div>
                <button class="btn btn-danger btn-delete">x</button>
            `
            carr.appendChild(carProductCard)
        })
    
        const substractButtom = document.querySelectorAll(".btn-substract")
    
        for (let sb = 0; sb < substractButtom.length; sb++) {
            
            substractButtom[sb].addEventListener("click", () => {
                if (carrito[sb].cantidad > 1) {
                    carrito[sb].cantidad--
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                    showCarrito()
                } else if(carrito[sb].cantidad = 1) {
                    carrito.splice(sb, 1)
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                    showCarrito()
                }
            })
        }
    
        const addButton = document.querySelectorAll(".btn-add")
    
        for (let ab = 0; ab < addButton.length; ab++) {
            
            addButton[ab].addEventListener("click", () => {
                carrito[ab].cantidad++
                localStorage.setItem("carrito", JSON.stringify(carrito))
                showCarrito()
            })
            
        }
    
        const deleteButton = document.querySelectorAll(".btn-delete")
    
        for (let db = 0; db < deleteButton.length; db++) {
            
            deleteButton[db].addEventListener("click", () => {
                carrito[db].cantidad = 1
                carrito.splice(db, 1)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                showCarrito()
            })
            
        }
    
    }
    const totalProducts = carrito.reduce((ac, el) => ac + el.cantidad, 0)
    carNumber.innerHTML = ""
    carNumber.innerHTML = `<p>${totalProducts}</p>`

    const totalPrice = carrito.reduce((ac, el) => ac + (el.price * el.cantidad), 0)
    const carPrice = document.querySelector(".total-price")
    carPrice.innerHTML = ""
    carPrice.innerHTML = `
    <p>Total: $${totalPrice}</p>
    `
}

//===LOCAL STORAGE===//

function saveCarrito() {
    if (localStorage.length == 1) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        showCarrito()
    }
}
saveCarrito()

//===COMPRAR===//

const modal = document.querySelector(".modal")
const btnBuy = document.querySelector(".btn-buy")

btnBuy.addEventListener("click", () => {

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Su carrito esta vacio',
          })
    } else {
        let formName= document.querySelector("#nb-input").value
        let formLastName= document.querySelector("#ap-input").value
        let formCity= document.querySelector("#inputCity").value
        if (formName !== "" && formLastName !== "" && formCity !== "") {
            buy()
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ingrese bien los datos',
              })
        }
    }

})

function buy() {
    Swal.fire({
        title: '¿Estas seguro de lo que quieres comprar?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        denyButtonText: `Volver`,
      }).then((result) => {
        if (result.isConfirmed) {
            carrito = []
            localStorage.setItem("carrito", JSON.stringify(carrito))
            showCarrito()
          Swal.fire('Su pedido ya esta hecho!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('No se realizo el pedido', '', 'info')
        }
      })
}