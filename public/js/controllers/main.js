angular.module('orderController', [])

	// inject the Order service factory into our controller
	.controller('mainController', ['$scope','$http','Orders', function($scope, $http, Orders) {
		$scope.formData = {};
		$scope.loading = true;

		var menu = {
    'foodList': [{
        'name': 'Kofte Burger',
        'price': '8.49'
    }, {
        'name': 'Ev Yapimi Sucuk',
        'price': '4.99'
    }, {
        'name': 'Tavuk Kanatları',
        'price': '6.99'
    },
		{
				'name': 'Benim Specialim',
				'price': '7.69'
		},
		{
        'name': 'Havuclu Kek',
        'price': '9.89'
    },
		{
				'name': 'Tavuk Corbası',
				'price': '4.79'
		},
		{
				'name': 'Muzlu Pasta',
				'price': '3.49'
		},
		{
				'name': 'Bogurtlenli yogurt',
				'price': '5.49'
		}],
    'valueSelected': {
        'name': 'Meshur sandvic',
        'price': '6.99'
    }
}

		$scope.selectedValue = menu['valueSelected'];
		$scope.foodList = menu['foodList'];

		
		//  get all orders and show them
		
		Orders.get()
			.success(function(data) {
				$scope.orders = data;
				$scope.loading = false;
			});

		
		// when submitting the add form, send the text to the node API
		$scope.createOrder = function() {

			var order = {};
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined) {
				$scope.loading = true;

				for(var i=0; i < menu.foodList.length; i++) {
					if(menu.foodList[i]['name'] == $scope.formData.name) {
						order = menu.foodList[i];
						break;
					}

				}
				// call the create function from our service 
				Orders.create(order)

					// if successful creation, call our get function to get all the new orders
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.orders = data; // assign our new list of orders
					});

					$scope.getTotal();
			}
		};

		
		// delete a order after checking it
		$scope.deleteOrder = function(id) {
			$scope.loading = true;

			Orders.delete(id)
				// if successful creation, call our get function to get all the new orders
				.success(function(data) {
					$scope.loading = false;
					$scope.orders = data; // assign our new list of orders
				});

				$scope.getTotal();
		};

		// calculate Total price using total API
		$scope.getTotal = function() {
			Orders.calculate()
				.success(function(data) {
					var total = 0;
					// sum up all prices of orders
					for(var i=0; i<data.length; i++)
							total += data[i].price;
					// 7.5% tax included
					total = total + total * 0.075;
					$scope.total = total.toFixed(2);

			});
		};

	}]);
