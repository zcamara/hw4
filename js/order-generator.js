//On load
$(function(){ 
	//Make cart follow scrolling 
	 $("#cartbox").sticky({topSpacing:200});
	//Display pizza menu
	renderPizza();
	//Handle button clicks
	$('.menu-ui .btn').click(function(){
		var menuBtn = $(this);
		var type = menuBtn.attr('data-type');
		clearMenu();
		if(type === "pizzas")
			renderPizza();
		else
			render(type);
		menuBtn.siblings().removeClass("active");
		menuBtn.addClass("active");
		//Set Menu title
		$('.menuType').text(type+":");
		$('.menu').fadeIn(500);
	});

//create a cart model as a simple object with
    //the properties we eventually need to post to
    //the server
    var cart = {
        name: null,
        address1: null,
        zip: null,
        phone: null,
        items: [] //empty array
    }; //cart data


    //click event handler for all buttons with the
    //style class 'add-to-cart'
    $('.add-to-cart').click(function(){
        //use the attributes on the button to construct
        //a new cart item object that we can add to the
        //cart's items array
        var newCartItem = {
            type: this.getAttribute('data-type'),
            name: this.getAttribute('data-name'),
            size: this.getAttribute('data-size'),
            price: this.getAttribute('data-price'),
            quantity: 1
        };


        //push the new item on to the items array
        var quantity = $.inArray(newCartItem, cart.items);
        console.log(newCartItem);
        console.log(cart.items)
        if(contains(cart.items, newCartItem.name)) 
        	alert(yay);
        else 
        	cart.items.push(newCartItem);
        
        


        //render the cart's contents to the element
        //we're using to contain the cart information
        //note that you would need a <div> or some
        //other grouping element on the page that has a
        //style class of 'cart-container'
        renderCart(cart, $('.cart-container'));
        console.log(cart.items)
    });


    $('.place-order').click(function(){
        
        //TODO: validate the cart to make sure all the required
        //properties have been filled out, and that the 
        //total order is greater than $20 (see homework 
        //instructions) 


        postCart(cart, $('.cart-form'));
    });


}); //doc ready

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].name === obj.name) {
            return true;
        }
    }
    return false;
}

//renders the pizza menu
function renderPizza(){	
	var idx;
	var pizza;
	var instance;
	var template = $('.pizza');
	var meatContainer = $('.meat-pizza');
	var veggieContainer = $('.veggie-pizza');
	var pizzaContainer = $('.pizza-menu');
	$('.pizzabutton').show();
	//remove small id so container expands
	for (idx = 0; idx < com.dawgpizza.menu.pizzas.length; ++idx) {
		pizza = com.dawgpizza.menu.pizzas[idx];
		instance = template.clone();
		instance.find('.pizzaname').html(pizza.name);
		instance.find('.description').html(pizza.description);
		instance.find('.smallprice').html(pizza.prices[0]);
		//add attributes for pizza and format so we know
        //which pizza and size to add to the user's cart
		instance.find('.small-pizza').attr({
			'data-type': "Pizza",
			'data-name': pizza.name,
			'data-size': "Small",
			'data-price': pizza.prices[0]
        });
		instance.find('.mediumprice').html(pizza.prices[1]);
		instance.find('.medium-pizza').attr({
			'data-type': "Pizza",
			'data-name': pizza.name,
			'data-size': "Medium",
			'data-price': pizza.prices[1]
        });
		instance.find('.largeprice').html(pizza.prices[2]);
		instance.find('.large-pizza').attr({
			'data-type': "Pizza",
			'data-name': pizza.name,
			'data-size': "Large",
			'data-price': pizza.prices[2]
        });
		instance.removeClass('template');
		if (pizza.vegetarian)
			var container = veggieContainer;
		else
			var container = meatContainer;
		container.append(instance);
	}
	pizzaContainer.fadeIn(500);
}

//Renders drink and dessert menus
function render(type) {
	var idx;
	var instance;
	var template = $('.template');
	var container = $('.menu');
	var item;
	//Add small id so container shrinks
	var address = com.dawgpizza.menu.drinks;
	if (type === "desserts")
		address = com.dawgpizza.menu.desserts;
	for (idx = 0; idx < address.length; ++idx) {
		item = address[idx];
		instance = template.clone();
		instance.find('.name').html(item.name);
		instance.find('.itemprice').html(item.price);
		instance.removeClass('template');
		container.append(instance);
	}
	container.fadeIn(500);
}

//Empties the menu for recreation
function clearMenu() {
	$('.pizzabutton').hide();
	$('.pizza-menu').hide();
	$('.meat-pizza').empty();
	$('.veggie-pizza').empty();
	$('.menu').empty();
	$('.menu').hide();
	$('.menuType').hide();
	$('.menuType').fadeIn(500);
}

// renderCart()
// renders the current cart information to the screen
// parameters are:
//  - cart (object) reference to the cart model
//  - container (jQuery object) reference to the container <div>
//
function renderCart(cart, container) {
    var idx, item, instance;
    var template = $('.cart-item-template');
    
    //empty the container of whatever is there currently
    container.empty();


    //for each item in the cart...
    for (idx = 0; idx < cart.items.length; ++idx) {
        item = cart.items[idx];
        instance = template.clone();
        instance.find('.name').html(item.quantity + ": "+ item.name);
		instance.find('.price').html(item.price);
		if(item.size)
			instance.find('.size').html("("+item.size+")");
		instance.removeClass('cart-item-template');
		container.append(instance);


    } //for each cart item


    //TODO: code to render sub-total price of the cart
    //the tax amount (see instructions), 
    //and the grand total


} //renderCart()


// postCart()
// posts the cart model to the server using
// the supplied HTML form
// parameters are:
//  - cart (object) reference to the cart model
//  - cartForm (jQuery object) reference to the HTML form
//
function postCart(cart, cartForm) {
    //find the input in the form that has the name of 'cart'    
    //and set it's value to a JSON representation of the cart model
    cartForm.find('input[name="cart"]').val(JSON.stringify(cart));


    //submit the form--this will navigate to an order confirmation page
    cartForm.submit();


} //postCart()