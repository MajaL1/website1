
$(document).ready( () => {
	/*************** CONSTANTS *****************/
	const PICTURES_PER_PAGE = 12;
	
	const mainDiv = $('.main-div');
	const jumbotronDiv = $('.jumbotron');
	const homeLink = $('.home-link');
	const picturesCountUrl = "/getPictureCount";
	const pageNavigationMenu = $(".page-navigation-menu");
	const picturesDiv = $('.pictures-div');
	const linksNavLink = $('.links-nav-link');
	const paginationMenu = $('.page-navigation-menu .pagination');
	const linksDiv = $('.links-div');
	const sidebar = $('#sidebar-wrapper');
	/************************************************/



	homeLink.click( () => {
		jumbotronDiv.fadeIn('slow');
		mainDiv.hide();
		sidebar.hide();
		linksDiv.hide();
	});

	linksNavLink.click( () => {
		linksDiv.fadeIn('slow');
		jumbotronDiv.hide();
		mainDiv.hide();
		sidebar.hide();
	});

	/************ handle click on 'next' button ********/
	paginationMenu.on('click', '.next-pagination-btn', (event) => {
		displayImages(event);
	});

	/************ handle click on 'back' button ********/
	paginationMenu.on('click', '.back-pagination-btn', (event) => {
		displayImages(event);
	});

	/************ handle click on page button (1,2,3) ********/
	paginationMenu.on('click', '.page-link.page-number', (event) => {
		displayImages(event);
	});

	/************ handle click on months (1,2,3) ********/
	$('.month-list').on('click', '.image_gallery', (event) => {
		displayImages(event);
	});
		

	/*******************************************************/
	/******* load list of months per year  *****************/
	$('.months-placeholder').on('click', '.image_gallery', (event) => {
	
		let year = event.target.id;
		let url = "/pictures/"+year+"/";
		let monthList = $('.month-list');

		$.ajax({ 
			type: "GET",
			url: url,
			success: (data) => {
				sidebar.show();
				let months = JSON.parse(data);
				monthList.empty();
				jumbotronDiv.fadeOut('slow');
				mainDiv.fadeOut('slow');
				
				$.each(months, (index) => {
					monthList.append('<li><a id="'+months[index]+'"class="image_gallery '+months[index]+'" href="#">'+months[index]+'</a></li>');
				});

			}
		});	
	});

/********   selected link in left menu *********/
$(".sidebar-nav").on('click', 'ul li a' , (event) => {
	let elementId = event.target.id;
	let selectedLink = $('ul').find("[id='" + elementId + "']");
	
    $(".sidebar-nav ul li a").removeClass('selected-link');
    $(selectedLink).addClass('selected-link');
});


/****************** load folder names *******************/
$('.pictures_menu').on('click', (event) => {
	let $this = $(this);
	let monthsPlaceholder = $('.months-placeholder');

	$.ajax({ 
		type: "GET",
		url: "http://localhost:3000/pictures",
		success: (data) => {
			monthsPlaceholder.empty();
			monthsPlaceholder.show();
			picturesDiv.empty();
			pageNavigationMenu.hide();
			linksDiv.hide();
			let jsonData = JSON.parse(data);
			$.each(jsonData, (index) => {
				monthsPlaceholder.append('<li><a class="image_gallery '+jsonData[index]+'" id="'+jsonData[index]+'"href="#">'+jsonData[index]+'</a></li>');
			});
		}
	 });
  });


 /********* event handler for displaying image gallery ************/
	 function displayImages(event){
	 	let selectedPageNum;
	 	let selectedMonth;
		let selectedYear;


	 	if(event.target.id === 'back' || event.target.id ==='next'){
	 		let activeLink = $('.pagination').find('[class*="active"]').children()[0];
	 		selectedPageNum= activeLink.getAttribute('data-page');

	 		if(event.target.id === 'next'){
	 			selectedPageNum++;
	 		}
	 		else{
	 			selectedPageNum--;
	 		}

	 	}
	 	else{
 	 	 	selectedPageNum = event.target.getAttribute('data-page') || 1;
 	 	}
		let selectedElement = $(".month-list li").find(".selected-link");
		let selectedValues = $(".month-list li").find(".selected-link").prop('id');
		

		if(selectedValues){
			selectedMonth = selectedValues.split(' ')[0];
			selectedYear = selectedValues.split(' ')[1];
		}

		else {

			selectedValues = event.target.id;
			selectedMonth = selectedValues.split(' ')[0];
			selectedYear = selectedValues.split(' ')[1];
		}
		let startIndex = (selectedPageNum-1)*PICTURES_PER_PAGE;
		let endIndex = startIndex + PICTURES_PER_PAGE;

		//console.log('startIndex: ', startIndex, ' endIndex: ', endIndex);
		//console.log('selectedMonth: ', selectedMonth, ', selectedYear: ', selectedYear, ', selectedPageNum', selectedPageNum);

		
		let picturesCount;
		$.ajax({
			type: "GET",
			cache: false,
			data: {
				"month" : selectedMonth,
				"year" : selectedYear
			},

			url: picturesCountUrl,
			contentType:"text/json",

			success: (data) => {
				
				picturesCount = data.count;
				let url = "/pictures/"+selectedYear+"/"+selectedMonth+"";
				
				$.ajax({
					type: "GET",
					cache: false,
					url: url,
					data: {
						'fromIndex' : startIndex,
						'toIndex': endIndex
					},
					contentType:"text/json",
					success: (data) => {

						let imagesFolder = data;
						
						/**** calculate how many pages are per gallery ***/
						let pagesPerGalleryCount = Math.ceil(picturesCount/PICTURES_PER_PAGE);

						
						paginationMenu.empty();

						if(pagesPerGalleryCount > 1){
							let disabledBack = 'disabled';
							let disabledNext = 'disabled';

							if(selectedPageNum > 1){
								disabledBack = '';
							}
							if(selectedPageNum < pagesPerGalleryCount){
								disabledNext = '';
							}
							
	                        paginationMenu.append('<li class="page-item '+disabledBack+'"><a id="back" class="page-link back-pagination-btn" href="#" tabindex="-1">Previous</a></li>');    
							
							for (i = 1; i <= pagesPerGalleryCount; i++){
								paginationMenu.append('<li class="page-item"><a class="page-link page-number" data-page="'+i+'" id="page-number-'+(i)+'" href="#">'+i+'</a></li>');
							}
							paginationMenu.append('<li class="page-item '+disabledNext+'"><a id="next" class="page-link next-pagination-btn" href="#">Next</a></li>');
						}

					 	let selectedPage = $('.pagination').find("[id*='" + selectedPageNum + "']").parent();
					 	$(".pagination ul li").removeClass('active');
				    	$(selectedPage).addClass('active');
					 	
					 	
						pageNavigationMenu.show();
						picturesDiv.empty();
						mainDiv.show();
						
						for(index in data){
								picturesDiv.append('<a href="#" class="image-link"> <img class="image" src="data:image/jpg;base64,' + data[index] + '" /></a>');
						}
					},
					error: (err, status, thrownError) => {
						console.log('error getting images: ', thrownError, err, status);
					}
				});
			},
			error: (err, status, thrownError) => {
				console.log('error getting number of images: ', thrownError, err, status);
			}
		});
	}

});
	

