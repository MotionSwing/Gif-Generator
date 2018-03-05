$(document).ready(function(){

	const app = {
		topics: ["dog","cat","rabbit","hamster","skunk","goldfish","bird","ferret",
			"turtle","sugar glider","chinchilla","hedgehog","hermit crab","gerbil","pygmy goat",
			"chicken","capybara","teacup pig","serval","salamander","frog"
		],
		gifIsPlaying: false,
		initialize: function() {
			$('.buttons').empty();
			for (var i = 0; i < app.topics.length; i++) {
				app.addAnimal(app.topics[i]);
			}
		},
		addAnimal: function(newAnimal) {
			const newButton = $("<button>").text(newAnimal);
			const newDiv = $("<div>").append(newButton);
			$('.buttons').append(newDiv);

			// Remove listener from existing buttons and setup new listener on all buttons
			$('.buttons button').off().on('click', function(event) {
				$("#animals").empty();
				$('.buttons button').removeClass('active');
				$(this).addClass('active');
				app.getGifsOf($(this).text());
			});
		},
		getGifsOf: function(item){
			// Setup Query String
			queryURL = "https://api.giphy.com/v1/gifs/search?q="+ item +"&api_key=GNMNbc2t00Lgf7QWChNs9lquU7xNpDdp&limit=10"
			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function(response) {
				console.log(response);
				for (var i = 0; i < response.data.length; i++) {
					// Setup still image
					const img = $("<img>").attr({
						"src": response.data[i].images.fixed_width_still.url,
						"alt": response.data[i].slug
					});

					// Play/Pause the gif when the image is clicked
					img.data({
						"play-url": response.data[i].images.fixed_width.url,
						"pause-url": response.data[i].images.fixed_width_still.url,
						"status": "paused"
					});
					img.on('click', function() {
						if($(this).data('status') === "paused") {
							$(this).data('status','playing');
							$(this).attr('src', $(this).data('play-url'));

						}else {
							$(this).data('status','paused');
							$(this).attr('src', $(this).data('pause-url'));
						}
					});

					// Create figure caption
					const figCaption = $("<figcaption>").text("Rating: " + response.data[i].rating);
					const fig = $("<figure>").append(figCaption, img);
					$("#animals").append(fig);

				}
			});	
		}
	};

	app.initialize();

	// Event Handler for adding a new Animal
	$('#addAnimal').on('click', function(event) {
		event.preventDefault();
		const selectedAnimal = $('#animal-input').val();
		if (selectedAnimal){
			app.addAnimal(selectedAnimal);
		}
	});

});

