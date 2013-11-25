var required = ["name","address1","zip","phone"];

//On load
$(function(){ 
	//Make cart follow scrolling 
	if (document.documentElement.clientWidth > 768 ) {
    	$("#cartbox").sticky({topSpacing:50});
	}
	 
	//Display pizza menu
	renderPizza();
	render("drink");
	render("dessert");
	
//create a cart model as a simple object with
    //the properties we eventually need to post to
    //the server
    var cart = {
        name: null,
        address1: null,
        zip: null,
        phone: null,
        nextUrl: 'http://students.washington.edu/zcamara/info343/hw4/',
        items: [] //empty array
    }; //cart data

    $('.start-over').click(function(event) {
	    var cont = confirm('Are you sure you want to empty the cart?');
	    if(cont) {
	        cart.items = []; //make cart empty
			renderCart(cart, $('.cart-container')); //rerender empty cart
	        return true;
	    }
	    // If cancel was clicked button execution will be halted.
	    event.preventDefault();
	});

    //click event handler for all buttons with the
    //style class 'add-to-cart'
    $('.add-to-cart').click(function(){
        //use the attributes on the button to construct
        //a new cart item object that we can add to the
        //cart's items array
        if (this.getAttribute('data-type') === "pizza") {
	        var newCartItem = {
	            type: this.getAttribute('data-type'),
	            name: this.getAttribute('data-name'),
	            size: this.getAttribute('data-size'),
	            price: this.getAttribute('data-price'),
	            quantity: 1
	        };
	        var index = pizzaLookup(cart.items, newCartItem.name, newCartItem.size);
	    } else {
	    	var newCartItem = {
	            type: this.getAttribute('data-type'),
	            name: this.getAttribute('data-name'),
	            price: this.getAttribute('data-price'),
	            quantity: 1
	        };
	        var index = lookup(cart.items, newCartItem.name);
	    }

	    
		//push the new item on to the items array
		
		if(index === -1) //Not already in array
			cart.items.push(newCartItem);
		else //Already in array, let's modify quantity
			cart.items[index].quantity += 1;
		//render the cart's contents to the element
		//we're using to contain the cart information
		//note that you would need a <div> or some
		//other grouping element on the page that has a
		//style class of 'cart-container'
		renderCart(cart, $('.cart-container'));
    });

	//click handler for remove button
	$(document).on('click', '.remove-item', function() {
		var idxToRemove = this.getAttribute('data-index');
	    cart.items.splice(idxToRemove, 1);
		renderCart(cart, $('.cart-container'));
	});


    $('.place-order').click(function(){
        //validate the cart to make sure all the required
        //properties have been filled out, and that the 
        //total order is greater than $20 (see homework 
        //instructions) 
    	var total = $('.total-price').html();
    	var formComplete = true;

    	if (!total) {
    		alert('The shopping cart is empty! Pick some of our delicous pizza');
    		formComplete = false;
    	}

    	if(total < 20  && total) {
    		alert('Our delivery minimum is $20. Your total is currently: $'+total);
	    	formComplete = false;
    	}

    	if(formComplete) {
    		var warning = "";
    		$.each(required, function(){
	    		req = $('input[name='+this+']').val().trim();
	    		if (req.length === 0) {
	    			//required field has no value
	    			warning += " "+this;
	    			formComplete = false;
	    		} else {
	    			cart[this] = req;
	    		}
	    	});
	    	if(warning != "")
	    		alert('Fill out the following field(s): '+warning+'');

    		if(formComplete) {
    			$.cookie("name", cart.name);
    			$.cookie("address1", cart.address1);
    			$.cookie("zip", cart.zip);
    			$.cookie("phone", cart.phone);
				postCart(cart, $('.cart-form'));
    		}
    	}
    });

	var storedName = $.cookie("name");
	var storedAddress = $.cookie("address1");
	var storedZip = $.cookie("zip");
	var storedPhone = $.cookie("phone");
	if(storedName)
		document.getElementById('name').value=storedName;
	if(storedAddress)
		document.getElementById('address1').value=storedAddress;
	if(storedZip)
		document.getElementById('zip').value=storedZip;
	if(storedPhone)
		document.getElementById('phone').value=storedPhone;
	renderCart(cart, $('.cart-container')); //Populate totals

}); //doc ready

//Finds items by name in the cart array and returns the index. Returns -1 if not found
function lookup(cart, newName) {
	for (var i = 0; i < cart.length; i++)
		if (cart[i].name === newName) return i;
	return -1;
}

function pizzaLookup(cart, newName, newSize) {
	for (var i = 0; i < cart.length; i++)
		if (cart[i].name === newName) {
			if(cart[i].size === newSize) return i;
		}
		return -1;
}

//renders the pizza menu
function renderPizza(){	
	var idx;
	var pizza;
	var instance;
	var template = $('.pizza-template');
	var meatContainer = $('.meat-pizza');
	var veggieContainer = $('.veggie-pizza');
	var pizzaContainer = $('.pizza-menu');
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
			'data-type': "pizza",
			'data-name': pizza.name,
			'data-size': "small",
			'data-price': pizza.prices[0]
		});
		instance.find('.mediumprice').html(pizza.prices[1]);
		instance.find('.medium-pizza').attr({
			'data-type': "pizza",
			'data-name': pizza.name,
			'data-size': "medium",
			'data-price': pizza.prices[1]
		});
		instance.find('.largeprice').html(pizza.prices[2]);
		instance.find('.large-pizza').attr({
			'data-type': "pizza",
			'data-name': pizza.name,
			'data-size': "large",
			'data-price': pizza.prices[2]
		});
		instance.removeClass('pizza-template');
		if (pizza.vegetarian)
			var container = veggieContainer;
		else
			var container = meatContainer;
		container.append(instance);
	}
}

//Renders drink and dessert menus
function render(type) {
	var idx;
	var instance;
	var template = $('.template');
	var container = $('.drink-menu');
	var item;
	//Add small id so container shrinks
	var address = com.dawgpizza.menu.drinks;
	if (type === "dessert") {
		address = com.dawgpizza.menu.desserts;
		container = $('.dessert-menu')
	}
	for (idx = 0; idx < address.length; ++idx) {
		item = address[idx];
		instance = template.clone();
		instance.find('.name').html(item.name);
		instance.find('.itemprice').html(item.price);
		instance.find('.item').attr({
			'data-type': type,
			'data-name': item.name,
			'data-price': item.price
        });
		instance.removeClass('template');
		container.append(instance);
	}
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

    var subTotal = 0;

    //for each item in the cart...
    for (idx = 0; idx < cart.items.length; ++idx) {
        item = cart.items[idx];
        instance = template.clone();
        var itemSubTotal = item.price * item.quantity;
        instance.find('.name').html("["+item.quantity+"] : "+ item.name);
		instance.find('.price').html(itemSubTotal);
		if(item.size)
			instance.find('.size').html("("+item.size+")");
		instance.find('.remove-item').attr({
			'data-index': idx
		});
		instance.removeClass('cart-item-template');
		subTotal += itemSubTotal;
		container.append(instance);
    } //for each cart item


    //code to render sub-total price of the cart
    $('.subtotal-price').html(subTotal);
    //the tax amount (see instructions), 
    var tax = subTotal * .095;
    $('.tax-price').html(tax.toFixed(2));
    //and the grand total
    var totalCost = subTotal + tax;
    totalCost = totalCost.toFixed(2);
    $('.total-price').html(totalCost);
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