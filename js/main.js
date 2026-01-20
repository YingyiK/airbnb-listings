let listings = [];

async function loadListings(){
    try {
        const response = await fetch('./airbnb_sf_listings_500.json')

        const data = await response.json();

        listings = data.slice(0, 50);

        displayListings(listings);
    } catch (error){
        console.error('Loading Failed', error);
    }
}

// display listings
function displayListings(listings) {
    const container = document.getElementById('listings-container');
    
    // clear container
    container.innerHTML = '';
    
    // loop through each listing and create HTML
    listings.forEach(listing => {
        const listingHTML = createListingCard(listing);
        container.innerHTML += listingHTML;
    });
}

function sortListings(sortBy) {
    const sortedListings = [...listings];
    
    if (sortBy === 'price') {
        sortedListings.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[$,]/g, '')) || 0;
            const priceB = parseFloat(b.price.replace(/[$,]/g, '')) || 0;
            return priceA - priceB;
        });
    } else if (sortBy === 'rating') {
        sortedListings.sort((a, b) => {
            const ratingA = parseFloat(a.review_scores_rating) || 0;
            const ratingB = parseFloat(b.review_scores_rating) || 0;
            return ratingB - ratingA;
        });
    }
    displayListings(sortedListings);
}

// create single listing card
function createListingCard(listing) {
    // parse amenities (it is a stringified array)
    const amenities = JSON.parse(listing.amenities);
    
    // generate amenities list HTML
    const amenitiesHTML = amenities.slice(0, 5).map(amenity => 
        `<li>${amenity}</li>`
    ).join('');

    return `
        <div class="listing col-6 mb-4">
            <article class="card">
                <img src="${listing.picture_url}" 
                     alt="${listing.name}" 
                     class="card-img-top" 
                     style="height: 250px; object-fit: cover;" />
                <div class="card-body">
                    <h3 class="card-title">${listing.name}</h3>
                    <div class="host">
                        <img src="${listing.host_picture_url}" 
                             alt="Host: ${listing.host_name}" 
                             class="host-photo" 
                             style="width: 40px; height: 40px; border-radius: 50%;" />
                        Hosted by ${listing.host_name}
                    </div>
                    <div class="price">${listing.price}/night</div>
                    <div class="rating">★${listing.review_scores_rating || 'N/A'}</div>
                    <div class="amenities">
                        <ul class="amenities-list">
                            ${amenitiesHTML}
                        </ul>
                    </div>
                    <div class="description overflow-auto" style="max-height: 200px;">
                        ${listing.description}
                    </div>
                    <div class="actions mt-3">
                        <button class="btn btn-primary">Rent</button>
                    </div>
                </div>
            </article>
        </div>
    `;
}

// load data when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadListings();
    
    document.getElementById('sort-by-price').addEventListener('click', () => {
        sortListings('price');
    });
    
    document.getElementById('sort-by-rating').addEventListener('click', () => {
        sortListings('rating');
    });
});