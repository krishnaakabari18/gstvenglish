/**
 * City Selection Modal Functionality
 */

$(document).ready(function() {
   

    // Function to fetch user's selected cities
    function fetchUserSelectedCities(userId) {
        return new Promise((resolve, reject) => {
   
            
            // Prepare FormData for the API call
            let formData = new FormData();
            formData.append('user_id', userId);
            
            $.ajax({
                url: 'https://english.gstv.in/backend2/api/v12/mobile/getcategorycity',//getApiEndpoint('GET_CATEGORY_CITY'),
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'GSTV-NextJS-App/1.0'
                },
                success: function(response) {
   
                    // Return the city array from response
                    resolve(response.city || []);
                },
                error: function(xhr, status, error) {
   
                    resolve([]); // Return empty array on error
                }
            });
        });
    }

    // Function to load cities using the correct API
    async function loadCities() {
        // Get user ID first
        let userId = null;
        try {
            const userSession = localStorage.getItem('userSession');
            if (userSession) {
                const sessionData = JSON.parse(userSession);
                userId = sessionData.userData?.user_id || sessionData.userData?.id || sessionData.user_id || sessionData.id;
            }
        } catch (e) {
            console.error('Error parsing user session:', e);
        }

        // Use the correct API endpoint for category settings (cities with parentID = 1)
        let url = 'https://english.gstv.in/backend2/api/v12/mobile/categorysettingweb';//getApiEndpoint('CATEGORY_SETTING');

        // Show loading state
        $('.cityList').html('<div class="loading-cities" style="text-align: center; padding: 40px;"><div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #8B0000; border-radius: 50%; animation: spin 1s linear infinite;"></div><br><br>Loading Cities.</div>');
        $('.no-results').hide();

        // Fetch user's selected cities if user is logged in
        let userSelectedCities = [];
        if (userId) {
            userSelectedCities = await fetchUserSelectedCities(userId);

        }

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            success: function(response) {

                $('.loading-cities').remove();

                let cityHTML = '';

                // Filter cities with parentID: 1 and status: "Active"
                if (response.category && response.category.length > 0) {
                    const activeCities = response.category.filter(function(city) {
                        return city.parentID === 1 && city.status === 'Active';
                    });



                    if (activeCities.length > 0) {
                        activeCities.forEach(function(city) {
                            // Check if this city is in user's selected cities
                            const isSelected = userSelectedCities.includes(city.id);
                            const checkedAttr = isSelected ? 'checked' : '';
                            
                          
                            
                            // Use the title field from the API response
                            cityHTML += `<div class="cityBtn">
                                    <label>
                                        <input type="checkbox" name="city[]" value="${city.id}" ${checkedAttr}>
                                        <span>${city.category_name}</span>
                                    </label>
                                </div>`;
                        });
                    } else {
                        cityHTML = '<div class="no-cities" style="text-align: center; padding: 40px; color: #666; font-size: 16px;">'+ LOADING_MESSAGES.NO_CITY_FOUND +'</div>';
                    }
                } else {
                    cityHTML = '<div class="no-cities" style="text-align: center; padding: 40px; color: #666; font-size: 16px;">'+ LOADING_MESSAGES.NO_CITY_FOUND +'</div>';
                }

                $('.cityList').html(cityHTML);

                // Add city search functionality
                $("#citySearch").off("keyup").on("keyup", function() {
                    var value = $(this).val().toLowerCase();
                    let hasVisibleCity = false;
                    
                    $(".cityBtn").filter(function() {
                        let isVisible = $(this).text().toLowerCase().indexOf(value) > -1;
                        $(this).toggle(isVisible);
                        if (isVisible) hasVisibleCity = true;
                    });
                    
                    if (hasVisibleCity) {
                        $(".no-results").hide();
                    } else {
                        $(".no-results").show();
                    }
                });
            },
            error: function(xhr, status, error) {
                $('.loading-cities').remove();
                $('.cityList').html('<div class="error-message" style="text-align: center; padding: 40px; color: #dc3545; font-size: 16px;">'+LOADING_MESSAGES.LOADING_ERROR_CITY+'</div>');
            }
        });
    }

    // Handle modal show event (this will work when modal is opened from React)
    $('#myCityModal').on('show.bs.modal', function() {

        loadCities();
    });

    // Also handle direct click (backup method)
    $(document).on('click', '#myCity', function(e) {

        e.preventDefault();
        $('#myCityModal').modal('show');
        loadCities();
    });

    // Handle city form submission
    $('#btnSubmitCity').click(function(e) {
        e.preventDefault();
        


        // Get selected cities
        let selectedCities = [];
        $('input[name="city[]"]:checked').each(function() {
            selectedCities.push(parseInt($(this).val()));
        });



        if (selectedCities.length === 0) {
            alert(LOADING_MESSAGE.ATLEAST_ONE_CITY);
            return;
        }

        // Get user ID from session/localStorage
        let userId = null;
        
        // Try to get user ID from localStorage
        try {
            const userSession = localStorage.getItem('userSession');
            if (userSession) {
                const sessionData = JSON.parse(userSession);
                userId = sessionData.userData?.user_id || sessionData.userData?.id || sessionData.user_id || sessionData.id;
            }
        } catch (e) {
            console.error('Error parsing user session:', e);
        }

        if (!userId) {
            alert(LOADING_MESSAGE.BEFORE_LOGIN);
            return;
        }



        // Submit directly to staging API
        let url = 'https://english.gstv.in/backend2/api/v12/mobile/usercity';//getApiEndpoint('USER_CITY');

        // Prepare FormData for staging API
        let formData = new FormData();
        formData.append('user_id', userId);
        formData.append('city_id', JSON.stringify(selectedCities));

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'GSTV-NextJS-App/1.0'
            },
            success: function(response) {

                
                // Close modal
                $('#myCityModal').modal('hide');
                
                // Show success message
                // alert('શહેર સફળતાપૂર્વક અપડેટ થઈ ગયું!');
            },
            error: function(xhr, status, error) {

                let errorMessage = LOADING_MESSAGE.UPDATE_CITY_ERROR;
                
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        errorMessage = response.error;
                    }
                } catch (e) {
                    // Use default error message
                }
                
                alert(errorMessage);
            }
        });
    });
});
