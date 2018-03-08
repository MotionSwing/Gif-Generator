$(document).ready(function(){

	const app = {
		topics: ["dog","cat","rabbit","hamster","skunk","goldfish","bird","ferret",
			"turtle","sugar glider","chinchilla","hedgehog","hermit crab","gerbil","pygmy goat",
			"chicken","capybara","teacup pig","serval","salamander","frog"
		],
		selectedTheme: 0,
		footerStatus: "closed",
		initialize: function() {
			// Display the first theme
			app.switchToTheme(app.selectedTheme);

			// Add buttons that allow the user to switch between themes
			app.updateFooter();
		},
		switchToTheme: function(themeNum){
			$("#topic-input").val('');
			$("#gifContent").empty();
			$('.buttons').empty();
			$("#input-form label").text(themes[app.selectedTheme].prompt);
			$("#input-form input[type='text']").attr('placeholder',themes[app.selectedTheme].suggestion);
			for (var i = 0; i < themes[app.selectedTheme].topics.length; i++) {
				// app.addTopicButton(app.topics[i]);
				app.addTopicButton(themes[app.selectedTheme].topics[i]);
			}
		},
		addTopicButton: function(topic) {
			const newButton = $("<button>").text(topic);
			const newDiv = $("<div>").append(newButton);
			$('.buttons').append(newDiv);
			$("#topic-input").val('');

			// Remove listener from existing buttons and setup new listener on all buttons
			$('.buttons button').off().on('click touchstart', function(event) {
				event.preventDefault();
				$("#gifContent").empty();
				$('.buttons button').removeClass('active');
				$(this).addClass('active');
				app.getGifsOf($(this).text(),10);
			});
		},
		getGifsOf: function(item,count){
			// Setup Query String
			const api = "GNMNbc2t00Lgf7QWChNs9lquU7xNpDdp";
			let offset = Math.floor(Math.random() * 101);
			// let rating = "g";
			let queryURL = "https://api.giphy.com/v1/gifs/search?q="+ item;
			// queryURL += "+" + themes[app.selectedTheme].name;
			queryURL += "&api_key="+ api;
			queryURL += "&limit=" + count;
			queryURL += "&offset=" + offset;
			// queryURL += "&rating=" + rating;

			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function(response) {
				// console.log(response);
				for (var i = 0; i < response.data.length; i++) {
					// Setup still image
					const img = $("<img>").attr({
						"src": response.data[i].images.fixed_width_still.url,
						"alt": response.data[i].slug,
						"title": response.data[i].title
					});

					// Play/Pause the gif when the image is clicked
					img.data({
						"play-url": response.data[i].images.fixed_width.url,
						"pause-url": response.data[i].images.fixed_width_still.url,
						"status": "paused"
					});
					img.on('click touchstart', function(event) {
						event.preventDefault();
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
					$("#gifContent").append(fig);

				}
			});	
		},
		setBackgroundAsGif: function(item, el){
			const api = "GNMNbc2t00Lgf7QWChNs9lquU7xNpDdp";
			let offset = Math.floor(Math.random() * 101);
			let queryURL = "https://api.giphy.com/v1/gifs/search?q="+ item;
			// queryURL += "+" + themes[app.selectedTheme].name;
			queryURL += "&api_key="+ api;
			queryURL += "&limit=" + 1;
			queryURL += "&offset=" + offset;

			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function(response) {
				console.log(response);
				console.log(response.data[0].images.fixed_width_small_still.url);
				el.css({
					'background-image': 'url('+ response.data[0].images.fixed_width_small_still.url +')',
					'background-size': 'cover'
				});
			});
		},
		showThemeButtons: function(){
			const themesWrapper = $("<div class='themes'>");
			const themesList = $("<ul class='themes-list'>");
			themesWrapper.append(themesList);
			$(".link-details").append(themesWrapper);
			var launch;
			for (let i = 0; i < themes.length; i++) {
				launch = setTimeout(function(){
					const theme = $("<li class='theme-option' data-theme-name='"+ themes[i].name.toUpperCase() +"' data-theme='"+ i +"'>");
					themesList.append(theme);
					app.setBackgroundAsGif(themes[i].topics[Math.floor(Math.random() * themes[i].topics.length)], $(".theme-option[data-theme='"+ i +"']"));
					$(".theme-option[data-theme='"+ i +"']").animate({"right": 310 - (i * 100)}, 1000);
				
					$(".theme-option").on('click touchstart', function(event) {
						event.preventDefault();
						app.selectedTheme = $(this).attr('data-theme');
						$("body").removeClass().addClass(themes[app.selectedTheme].name);
						app.switchToTheme(app.selectedTheme);
					});
				},750 * i);
			}
		},
		updateFooter: function(){
			$("footer a").wrap('<div class="main-footer"></div>');
			$(".main-footer a").wrap('<div class="copyright"></div>');
			var linksDiv = $("<div class='links'>");
			const list = $("<ul>");
			const aboutLink = $("<li id='about-link'>").text("About");
			const themesLink = $("<li id='themes-link'>").text("Themes");
			list.append(aboutLink,themesLink);
			linksDiv.append(list);
			$(".main-footer").append(linksDiv);
			var expandedDiv = $("<div class='link-details'>");
			$("footer").prepend(expandedDiv);

			$("#themes-link").on('click touchstart', function(event) {
				event.preventDefault();
				if(app.footerStatus === "closed"){
					$(".link-details").addClass('expand');
					app.showThemeButtons();
					app.footerStatus = "expanded";
				}else {
					$(".link-details").removeClass('expand').empty();
					app.footerStatus = "closed";
				}
			});
		}
	};

	app.initialize();

	// Event Handler for adding a new Animal
	$('#addTopic').on('click', function(event) {
		event.preventDefault();
		const selectedTopic = $('#topic-input').val();
		if (selectedTopic){
			app.addTopicButton(selectedTopic);
		}
	});
});

const themes = [
	{
		"name": "animal",
		"topics": ["dog","cat","rabbit","hamster","skunk","goldfish","bird",
			"ferret","turtle","sugar glider","chinchilla","hedgehog",
			"hermit crab","gerbil","pygmy goat","chicken","capybara","teacup pig",
			"serval","salamander","frog"],
		"prompt": "Add an Animal",
		"suggestion": "Enter an animal"
	},
	{
		"name": "marvel",
		"topics": ["Iron Man","Hulk","Captain America","Thor","Star Lord","Groot",
			"Winter Soldier","Ant-Man","Dr. Strange","Spider-Man","Black Panther"],
		"prompt": "Add a Marvel Character",
		"suggestion": "Enter a character name"
	},
	{
		"name": "movie",
		"topics": ["Men in Black","Jurassic Park","Mad Max","Star Wars","Jumanji","Frozen"],
		"prompt": "Add a Movie",
		"suggestion": "Enter a movie"
	},
	{
		"name": "game",
		"topics": ["Mario","Tomb Raider","Halo","Metal Gear Solid","Final Fantasy",
			"Portal","Minecraft","Grand Theft Auto","Sonic The Hedgehog","Donkey Kong"],
		"prompt": "Add a Video Game",
		"suggestion": "Enter a video game"
	}
];
