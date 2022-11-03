/* Capturamos datos */
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const tarjetaTemplate = document.getElementById('tarjeta-template').content /*-> para acceder a los elementos  */
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()

let carrito = {}

document.addEventListener('DOMContentLoaded',(/*por lo general se pasa el parametro e pero no lo vamos a usar*/)=>{

    fechData()

})

cards.addEventListener('click',e => {
    agregarCarrito(e)
})

/*Aumentar y disminuir productos  */

items.addEventListener('click',e => {
    btnAccion(e)
})

const fechData = async() => {
    try{
        //esto lo hacemos para que lea esa informacion
        const res = await fetch('api.json')
        //guardamos la data  con el await le decimos esperate por que la respuesta viene en json
        const data = await res.json()
        pintarTarjetas(data)
    }catch(error){
        console.log(error)
    }
}


/* Pintamos Datos */

/*Se ocupa el forEach para recorrer por que la api esta en json*/

const pintarTarjetas = data => {
    data.forEach(producto=>{
        /* accdemos al template*/
        tarjetaTemplate.querySelector('h5').textContent = producto.title

        tarjetaTemplate.querySelector('p').textContent = producto.precio

        /* traemos las imagenes de la api */

        tarjetaTemplate.querySelector('img').setAttribute("src",producto.thumbnailUrl)

        /*le pone el id a cada boton del producto  lo que nos permite vincular el boton a cada id de la tarjeta*/

        tarjetaTemplate.querySelector('.Boton-compra').dataset.id = producto.id

        const clone = tarjetaTemplate.cloneNode(true)
        /*pasamos el clon a nuestro fragment de esta manera -> */
        fragment.appendChild(clone)
    })
    /*con esto evitamos el reflow por que el fragment se guarda en la memoria volatil  */
    cards.appendChild(fragment)
}

/* capturamos la e */

const agregarCarrito = e =>{
    // console.log(e.target)
    // console.log(e.target.classList.contains("Boton-compra"))
    if(e.target.classList.contains("Boton-compra")){
        
        maniCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
/* va a ser todo lo que tenemos seleccionado   */
const maniCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.Boton-compra').dataset.id,
        title:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('p').textContent,
        cantidad:1
    }
    /* en el if se usa el metodo hasOwn ..para comprobar que el producto tenga el id */
    if(carrito.hasOwnProperty(producto.id)){
        /*se va aumentando la cantidad que se vaya a comprar */
        producto.cantidad = carrito[producto.id].cantidad +1
    }
    /*empujamos al carrito el producto 
    estamos haciendo una coleccion de objetos indexado */
    carrito[producto.id]={...producto}
    pintarCarrito()
}

/*Pintamos el carrito en nuestro nodo -- nodo en el DOM : cualquier etiqueta del cuerpo, como un párrafo, el mismo body o incluso las etiquetas de una lista--*/

const pintarCarrito = () => {
    /* esto lo que hace es limpiarme el html y que solo cambie la cantidad  */
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        /*All por que vamos a acceder al td en su primer elemento */
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.agregar').dataset.id = producto.id
        templateCarrito.querySelector('.quitar').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone= templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()
}
/*para que no se sobreescriba la info lo reiniciamos  */

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `

        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        
        
        `
        return
    }

    /*para hacer la suma nesecitamos acceder a el objeto */
    const sumaCantidad = Object.values(carrito).reduce((acumulador,{cantidad})=> acumulador + cantidad,0)

    const sumaPrecio = Object.values(carrito).reduce((acumulador,{cantidad,precio}) => acumulador + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = sumaCantidad
    templateFooter.querySelector('span').textContent = sumaPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciar = document.getElementById('vaciar-carrito')

    vaciar.addEventListener('click',()=>{
        carrito = {}
        /*llamamos a la funcion para volver a pintar el carrito osea hacer de nuevo el ciclo forEach, para que sepa que no tenemos ningun elemento */
        pintarCarrito()
    })
}

/*detectamos los botones que se estan haciendo de forma dinamica utilizando event delegation asi capturamos esos elementos para poder cuando el cliente le de + pues que aumente y cuando le de - pues que disminuya   */

const btnAccion = e => {
    /* aumentar  cant produ +*/
    if(e.target.classList.contains('agregar')){

        console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]

        producto.cantidad = carrito[e.target.dataset.id].cantidad+1

        carrito[e.target.dataset.id]={...producto}

        pintarCarrito()
    }
    if(e.target.classList.contains('quitar')){

        console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]

        producto.cantidad = carrito[e.target.dataset.id].cantidad-1

        carrito[e.target.dataset.id]={...producto}

        if(producto.cantidad ===0){
            delete carrito[e.target.dataset.id]
        }

        pintarCarrito()


    }

    e.stopPropagation()


}