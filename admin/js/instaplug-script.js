/**
 * Retrieves the access token from localStorage.
 * @returns {string|null} The access token if present, or null if not found.
 */
function getAccessToken() {
    return localStorage.getItem('accessToken');
}

/**
 * Retrieves the 'feed_id' parameter value from the URL query string.
 * @returns {string|null} The value of 'feed_id' if present in the URL, or null if not found.
 */
function getWidgetId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('feed_id');
}

//Check that user is logged in or not 
function validateUserLogin(actionType) {
    const action = 'lwip_validate_loggedIn_user';

    // Send AJAX request to server
    jQuery.ajax({
        type: 'POST',
        url: lwip_admin_ajax_object.ajax_url,
        data: {
            action: action,
            validate_loggedIn_user_nonce: lwip_admin_ajax_object.validate_loggedIn_user_nonce,
        },
        success: function (response) {
            if (response.success) {
                const accessToken = response.data.access_token;
                const usermail = response.data.usermail;
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }

                if (usermail) {
                    localStorage.setItem('usermail', usermail);
                }

                //Handle action request
                switch (actionType) {
                    case 'EDIT_WIDGET':
                        window.location.reload(true);
                        break;
                    case 'CREATE_WIDGET':
                        jQuery('#lwip-create-new-widget-frm').submit();
                        break;
                    case 'GENERATE_SHORTCODE':
                        jQuery("#lwip-generate-shortcode").submit();
                        break;
                    default:
                        break;
                }

            } else {
                // Handle error
            }
        },
        error: function (xhr, status, error) {
            // Handle error
        }
    });
}

// Check if the user is logged in by retrieving user data from localStorage
const isUserLoggedIn = localStorage.getItem('USER');

// Proceed only if user data is found in localStorage
if (isUserLoggedIn) {

    // Parse the JSON string from localStorage to get user data
    const userData = JSON.parse(isUserLoggedIn);
    const authProvider = userData.authProvider;
    const widgetQuota = userData.userWidgetQuota;

    const plan = userData.subscriptionPlan;

    // Handle subscription plan details
    if (plan) {
        const key = plan.key;
        if (key === 'FREE_PLAN') {
            jQuery("#lwip-free-user-icon").show();
            jQuery("#lwip-free-widget-batch").show();
        } else if (key === 'PRO_LIFE_TIME_DEAL') {
            jQuery("#lwip-life-time-deal-widget-batch").show();
        }
    }

    // Handle widget quota details
    if (widgetQuota) {

        const userWidgetLimit = widgetQuota.limit;
        const userWidgeUsage = widgetQuota.usage;

        jQuery("#lwip-widget-limit").text(userWidgetLimit);
        jQuery("#lwip-widget-usage").text(userWidgeUsage);

    }

    // Handle custom authentication provider details
    if (authProvider === 'CUSTOM') {
        var changePWdFrm = document.getElementById('lwip-change-password-frm');
        if (changePWdFrm) {
            changePWdFrm.style.display = 'block';
        }
    }

}

//Initiallly check instagram conncted account
function fetchDefualtConnectedAccount() {
    const accessToken = getAccessToken();
    const widgetId = getWidgetId();

    if (!widgetId) {
        return;
    }

    if (!accessToken) {
        validateUserLogin('EDIT_WIDGET');
    }

    const query = `
        query GetWidget($widgetId: ID!) {
            getWidget(widgetId: $widgetId) {
                selectedSourceType
                published
            }
        }
    `;

    const variables = {
        widgetId: widgetId
    };

    var apiUrl = lwip_connect.graphqlEndpoint;
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({ query, variables }),
    };

    fetch(apiUrl, options)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                //Handle error
            } else {
                defaultSelectedSourceType = data.data.getWidget.selectedSourceType;
                const publishButtonStatus = data.data.getWidget.published;

                if (publishButtonStatus === true) {
                    jQuery("#lwip-publish-account-btn").addClass('lwip-disable-publish-button');
                }

                if (defaultSelectedSourceType !== 'undefined') {
                    if (defaultSelectedSourceType === 'PERSONAL_ACCOUNT') {
                        document.getElementById('personal').checked = true;
                        sendApiRequest(defaultSelectedSourceType);
                    } else if (defaultSelectedSourceType === 'BUSINESS_ACCOUNT') {
                        document.getElementById('business').checked = true;
                        sendApiRequest(defaultSelectedSourceType);
                    }
                } else {
                    document.getElementById('personal').checked = true;
                }
            }
        })
        .catch(/*Handle error*/);
}
fetchDefualtConnectedAccount();

//Get Subscription status
function getSubscriptionStatus() {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }
    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
                    query UserProfile {
                        userProfile {
                            subscriptionPlan
                            userWidgetQuota {
                                limit
                                usage
                            }
                        }
                    }
                `;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
        })
    };
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                //Handle error
            } else {

                const userWidgetLimit = data.data.userProfile.userWidgetQuota.limit;
                const userWidgeUsage = data.data.userProfile.userWidgetQuota.usage;

                jQuery("#lwip-widget-limit").text(userWidgetLimit);
                jQuery("#lwip-widget-usage").text(userWidgeUsage);

                const subscriptionPlanKey = data.data.userProfile.subscriptionPlan.key;

                isLifetimeDeal = subscriptionPlanKey === 'PRO_LIFE_TIME_DEAL';

                if (isLifetimeDeal === true) {
                    jQuery(".lwip-filter-svg").hide();

                    var buyNowButton = document.querySelector('.instaplug-buy-premium-button');
                    var buyNowButtons = document.querySelector('.instaplug-buy-premium-buttons');
                    var activePlanButton = document.querySelector('.instaplug-active-plan-button');
                    var activedPlanButton = document.querySelector('.instaplug-activated-premium-button');

                    if (buyNowButton !== null && activePlanButton !== null) {
                        buyNowButtons.style.display = 'none';
                        activePlanButton.style.display = 'none';
                        buyNowButton.style.display = 'none';
                        activedPlanButton.style.display = '';
                    }
                    jQuery("#lwip-life-time-deal-widget-batch").show();

                } else {

                    var removeTickColor = document.getElementsByClassName('removeTickColor');

                    for (var i = 0; i < removeTickColor.length; i++) {
                        removeTickColor[i].classList.add('isLifeTimeDeal');
                    }
                    jQuery("#lwip-free-widget-batch").show();
                    jQuery("#lwip-free-user-icon").show();
                    jQuery(".lwip-watermark img").css('display', 'block');
                    jQuery(".lwip-masonry-svg").addClass('lwip-premium-masonry-svg');


                }
            }
        })
        .catch(error => {
        });
}
getSubscriptionStatus();

// Loader for document
document.addEventListener("DOMContentLoaded", function () {
    // Hide loader and show main content
    var loaderWrapper = document.getElementById("lwip-loader-wrapper");
    var mainDiv = document.getElementById("lwip-main-div");

    if (loaderWrapper && mainDiv) {
        loaderWrapper.style.display = "none";
        mainDiv.style.visibility = "visible";
    }
});

// Automatically start the timer when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
    startTimer(true);
});

// Event listener for the "Create" button in the popup
document.addEventListener("DOMContentLoaded", function () {
    var createButton = document.getElementById("lwip-create-widget-save-btn");
    if (typeof createsWidget === "function" && createButton) {
        createButton.addEventListener("click", createsWidget);
    }
});

// Event listener for the "Create Widget" button to open the popup
document.addEventListener("DOMContentLoaded", function () {
    var openPopupButton = document.getElementById("lwip-open-create-widget-popup");
    if (typeof openPopup === "function" && openPopupButton) {
        openPopupButton.addEventListener("click", openPopup);
    }
});

jQuery(document).ready(function ($) {

    //Handle logout reqeust
    window.logout = function () {
        const action = 'lwip_user_logout';
        const email = localStorage.getItem('usermail');
        if (!email) {
            return;
        }

        // Send AJAX request to server
        $.ajax({
            type: 'POST',
            url: lwip_admin_ajax_object.ajax_url,
            data: {
                action: action,
                logout_nonce: lwip_admin_ajax_object.logout_nonce,
                email: email,
            },
            success: function (response) {
                if (response.success) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('usermail');
                    localStorage.removeItem('connectStatus');
                    localStorage.removeItem('callToActionData');
                    localStorage.removeItem('widgetId');
                    localStorage.removeItem('USER');
                    window.location.href = "admin.php?page=lwip_feed_builder";
                }
            },
            error: function (xhr, error) {
                //Handle error
            }
        });

        // Wait 1 second and then reload the page
        setTimeout(function () {
            location.reload();
        }, 1000);
    };

    //Handle login proccess
    $('#lwip-user-login-frm').on('submit', function (event) {
        event.preventDefault();
        var email = $('#lwip-user-login-email').val().trim();
        var password = $('#lwip-user-login-password').val();

        // Validate email format
        if (!isValidEmail(email)) {
            $('#login-error-message-email').text('Please enter a valid email address.');
            event.preventDefault();
            return;
        } else {
            $('#login-error-message-email').text('');
        }

        // Construct GraphQL mutation for login
        var mutation = `
            mutation UserLogin($input: userLoginInput!) {
                userLogin(input: $input) {
                    user {
                    firstName
                    lastName
                    dateOfBirth
                    occupation
                    phoneNo
                    id
                    email
                    roles
                    authProvider
                    authRefData
                    authRefId
                    subscriptionFeatures
                    subscriptionPlan
                    isRegisteredCustomer
                    userSubscription
                    userUpgradedSubscription {
                        key
                        status
                    }
                    userWidgetQuota {
                        limit
                        usage
                    }
                    isNewUser
                    }
                    message
                    accessToken
                    refreshToken
                }
                }
        `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            'input': {
                'email': email,
                'password': password
            }
        };

        // Construct the GraphQL request body
        var postData = {
            'query': mutation,
            'variables': variables
        };

        // Send the POST request using AJAX to store Login data
        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {

                var data = response;

                if (data.data && data.data.userLogin) {

                    var loginData = data.data.userLogin;

                    localStorage.setItem('accessToken', loginData.accessToken);
                    localStorage.setItem('usermail', email);
                    localStorage.setItem('USER', JSON.stringify(loginData.user));

                    var action = 'lwip_store_login_data';

                    //Store data in database
                    $.ajax({
                        type: 'POST',
                        url: lwip_admin_ajax_object.ajax_url,
                        data: {
                            action: action,
                            login_nonce: lwip_admin_ajax_object.login_nonce,
                            login_data: JSON.stringify(loginData),
                            email: email,
                        },
                        success: function (response) {
                            if (response.success) {
                                reload();
                            }
                        },
                        error: function (xhr, status, error) {
                            // handle error
                        }
                    });

                    // Display login successful message
                    $('#login-message').text("Login successful.");
                    hideLoginSuccessPopup();
                    reload();
                } else {
                    $('#login-error-message').text(data.errors[0].message);
                }
            },
            error: function (xhr, status, error) {
                $('#login-message').text('Error hitting API.');
            }
        });
    });

    // Email validation on keyup event
    $('#lwip-user-login-email').on('keyup', function () {
        var email = $(this).val().trim();
        if (email === '') {
            $('#login-error-message-email').text('Please enter email.');
        } else if (!isValidEmail(email)) {
            $('#login-error-message-email').text('Please enter a valid email address.');
        } else {
            $('#login-error-message-email').text('');
        }
    });

    $("#lwip-facebook-account-connect").hide();

    // Function to validate email format
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle signup form submission
    $('#lwip-signup-frm').on('submit', function (event) {
        event.preventDefault();

        var firstName = $('#lwip-signup-user-fname').val().trim();
        var lastName = $('#lwip-signup-user-lname').val().trim();

        var email = $('#lwip-signup-user-email').val().trim();
        var password = $('#lwip-signup-user-password').val();

        // Validate email format
        if (!isValidEmail(email)) {
            $('#signup-error-message-email').text('Please enter a valid email address.');
            event.preventDefault();
            return;
        } else {
            $('#signup-error-message-email').text('');
        }

        // Validate password length
        if (password.length < 8) {
            $('#signup-error-message-password').text('Password must be at least 8 characters long.');
            event.preventDefault();
            return;
        } else {
            $('#signup-error-message-password').text('');
        }

        // Construct GraphQL mutation
        var mutation = `
        mutation Signup($details: signUp!) {
            signup(details: $details) {
                message
                user {
                    firstName
                    lastName
                    dateOfBirth
                    occupation
                    phoneNo
                    id
                    email
                    roles
                    authProvider
                    authRefData
                    authRefId
                }
            }
        }
    `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            'details': {
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'password': password
            }
        };

        // Construct the GraphQL request body
        var postData = {
            'query': mutation,
            'variables': variables
        };

        // Send the POST request using AJAX to store signup data
        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {
                var data = response;
                if (data.data && data.data.signup && data.data.signup.message) {
                    if (data.data.signup.user) {
                        var userDetails = data.data.signup.user;
                        userDetails.password = password;
                        openEmailVerification(userDetails);
                    }
                } else {
                    $('#lwip-signup-account-error').text(data.errors[0].message);
                }
            },
            error: function (xhr, status, error) {
                var message = 'Error hitting API.';
                $('#signup-message').text(message);
            }
        });
    });

    // Email validation on keyup event
    $('#lwip-signup-user-email').on('keyup', function () {
        var email = $(this).val().trim();
        if (email === '') {
            $('#signup-error-message-email').text('Please enter email.');
        } else if (!isValidEmail(email)) {
            $('#signup-error-message-email').text('Please enter a valid email address.');
        } else {
            $('#signup-error-message-email').text('');
        }
    });

    // Password validation on keyup event
    $('#lwip-signup-user-password').on('keyup', function () {
        var password = $(this).val();
        if (password === '') {
            $('#signup-error-message-password').text('Please enter password.');
        } else if (password.length < 8) {
            $('#signup-error-message-password').text('Password must be at least 8 characters long.');
        } else {
            $('#signup-error-message-password').text('');
        }
    });

    //First name validation on keyup event
    $('#lwip-signup-user-fname').on('keyup', function () {
        var firstName = $(this).val().trim();
        var regex = /^[a-zA-Z]+$/; // Regex to match only letters

        if (firstName === '') {
            $('#name-error-message-first').text('Please enter valid name');
        } else if (!regex.test(firstName)) {
            $('#name-error-message-first').text('Please enter valid name');
        } else {
            $('#name-error-message-first').text('');
        }
    });

    //Last name validation on keyup event
    $('#lwip-signup-user-lname').on('keyup', function () {
        var lastName = $(this).val().trim();
        var regex = /^[a-zA-Z]+$/; // Regex to match only letters

        if (lastName === '') {
            $('#name-error-message-last').text('Please enter valid name');
        } else if (!regex.test(lastName)) {
            $('#name-error-message-last').text('Please enter valid name');
        } else {
            $('#name-error-message-last').text('');
        }
    });

    // Function to validate email format
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle Otp verification
    $('#lwip-otp-verification-frm').on('submit', function (event) {
        event.preventDefault();
        var userDataJSON = $('#lwip-user-data').val();
        var userData = JSON.parse(userDataJSON);
        var otp = $('#lwip-otp').val();
        var userId = userData.id;

        // Construct GraphQL mutation
        var mutation = `
                mutation VerifyUserAccount($data: VerifyUserAccountInput!) {
                    verifyUserAccount(data: $data) {
                        message
                        accessToken
                        refreshToken
                    }
                }
            `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            data: {
                otp: otp,
                userId: userId
            }
        };

        // Construct the GraphQL request body
        var postData = JSON.stringify({
            query: mutation,
            variables: variables
        });

        // Set up the arguments for the POST request
        var apiUrl = lwip_connect.graphqlEndpoint;
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: postData
        };

        // Send the POST request using Fetch API
        fetch(apiUrl, options)
            .then(response => {
                // Check if the request was successful
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error hitting API.');
                }
            })
            .then(data => {
                // Check if verification was successful
                if (data.data && data.data.verifyUserAccount) {

                    openLoginPopup();
                    hideLoginSuccessPopup();
                    var verificationData = data.data.verifyUserAccount;
                    var action = 'lwip_store_signup_data';

                    //On sucess of otp verification store user data in database
                    $.ajax({
                        type: 'POST',
                        url: lwip_admin_ajax_object.ajax_url,
                        data: {
                            action: action,
                            user_data: JSON.stringify(userData),
                            lwip_nonce: lwip_admin_ajax_object.signup_nonce,
                            verification_data: JSON.stringify(verificationData)
                        },
                        success: function (response) {
                            if (response.success) {
                                reload();
                                localStorage.setItem('accessToken', verificationData.accessToken);
                                localStorage.setItem('usermail', userData.email);
                            }
                        },
                        error: function (xhr, status, error) {
                            //Handle error
                        }
                    });
                } else {
                    $('#otp-error-message').text(data.errors[0].message);
                    //Handle error
                }
            })
            .catch(error => {
                //Handle error
            });
    });

    //Handle resend otp form submission
    $('#lwip-user-resend-otp').on('click', function (event) {
        event.preventDefault();

        var emailToValide = $('#lwip-signup-user-email').val();

        // Construct GraphQL mutation
        var mutation = `
            mutation ResendVerificationOtp($email: String!) {
                resendVerificationOtp(email: $email) {
                    message
                }
            }
        `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            email: emailToValide
        };

        // Construct the GraphQL request body
        var postData = JSON.stringify({
            query: mutation,
            variables: variables
        });

        // Set up the arguments for the POST request
        var apiUrl = lwip_connect.graphqlEndpoint;
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: postData
        };

        // Send the POST request using Fetch API
        fetch(apiUrl, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error hitting API.');
                }
            })
            .then(data => {
                if (data.data && data.data.resendVerificationOtp) {

                    var resendData = data.data.resendVerificationOtp;
                    var message = resendData.message;
                }
            })
            .catch(error => {
                // Request failed, handle the error
            });

    });

    //Handle reset passowrd form submission
    $('#lwip-user-reset-password-frm').on('submit', function (event) {
        event.preventDefault();
        var email = $('#lwip-user-reset-email').val().trim();

        // Validate email format
        if (!isValidEmail(email)) {
            $('#reset-error-message-email').text('Please enter a valid email address.');
            event.preventDefault();
            return;
        } else {
            $('#reset-error-message-email').text('');
        }

        // Construct GraphQL mutation for password reset request
        var mutation = `
            mutation ResetRequest($email: String) {
                resetRequest(email: $email) {
                    message
                }
            }
        `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            'email': email
        };

        // Construct the GraphQL request body
        var postData = {
            'query': mutation,
            'variables': variables
        };

        // Send the POST request using AJAX
        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {
                // Handle successful response
                var data = response;
                if (data.data && data.data.resetRequest) {
                    var resetData = data.data.resetRequest;
                    $('#reset-message').text(resetData.message);
                } else {
                    $('#reset-error-message').text(data.errors[0].message);

                }
            },
            error: function (xhr, status, error) {
                // Handle error
                $('#reset-message').text('Error hitting API.');
            }
        });
    });

    $('#lwip-user-reset-email').on('keyup', function () {
        var email = $(this).val().trim();
        if (email === '') {
            $('#reset-error-message-email').text('Please enter email.');
        } else if (!isValidEmail(email)) {
            $('#reset-error-message-email').text('Please enter a valid email address.');
        } else {
            $('#reset-error-message-email').text('');
        }
    });

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    //Handle create new widget form submission
    $('#lwip-create-new-widget-frm').submit(function (event) {
        event.preventDefault();

        var widgetName = $('#lwip-widget-name').val();
        var accessToken = getAccessToken();
        if (!accessToken) {
            validateUserLogin('CREATE_WIDGET');
        }

        // Clear error message
        $('#create-widget-error-message').text('');
        $('#lwip-buy-premium-btn').hide();

        // Check if widget name is empty
        if (widgetName === '') {
            $('#create-widget-error-message').text('Please enter widget name.');
            return;
        }
        if (!isValidWidgetName(widgetName)) {
            $('#create-widget-error-message').text('Widget name cannot contain special characters.');
            return;
        }

        // Prepare GraphQL mutation input data
        var mutationData = {
            data: {
                name: widgetName
            }
        };

        // Perform GraphQL mutation using AJAX
        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: `mutation createWidget($data: CreateWidgetInput!) {
                        createWidget(data: $data) {
                            data {
                                id
                                name
                                filters {
                                    hide
                                    show
                                    totalNumberOfPost
                                }
                                template
                                createdAt
                                updatedAt
                            }
                            message
                        }
                    }`,
                variables: mutationData
            }),
            success: function (response) {
                if (response.errors && response.errors.length > 0) {
                    if (response.errors[0].extensions.code === 'INVALID_TOKEN') {
                        return;
                    }

                    const errorMessage = response.errors[0].message;
                    if (errorMessage === 'Invalid token!') {
                        $('#create-widget-error-message').text('');
                    } else {
                        $('#create-widget-error-message').text(errorMessage);
                    }

                    if (errorMessage == 'Usage limit is reached!') {
                        $("#lwip-buy-premium-btn").show();
                        $('#lwip-buy-premium-btn').on('click', function () {
                            event.preventDefault();
                            window.open($(this).attr('href'), '_blank');
                        });
                    }
                } else {

                    const widgetData = response.data.createWidget.data;
                    localStorage.setItem('widgetId', widgetData.id);
                    const email = localStorage.getItem('usermail');
                    if (!email) {
                        return;
                    }
                    const action = 'lwip_create_shortcode';

                    $.ajax({
                        type: 'POST',
                        url: lwip_admin_ajax_object.ajax_url,
                        data: {
                            action: action,
                            create_shortcode_nonce: lwip_admin_ajax_object.create_shortcode_nonce,
                            data: JSON.stringify(widgetData),
                            email: email
                        },
                        success: function (response) {
                        },
                        error: function (xhr, status, error) {
                            // Handle error
                        }
                    });

                    $('#create-widget-success-message').text('Widget created successfully!');

                    setTimeout(function () {
                        closePopupByButton();
                        $('#create-widget-success-message').text('');

                        // Extract the current base URL
                        const url = new URL(window.location.href);
                        // Set the new search parameters
                        url.searchParams.set('page', 'lwip_feed_builder_settings');
                        url.searchParams.set('action', 'edit');
                        url.searchParams.set('feed_id', widgetData.id);

                        // Redirect to the new URL with parameters
                        window.location.href = url.toString();
                    }, 1000);
                }
            },
            error: function (error) {
                alert('Error creating widget. Please try again.');
            }
        });
    });

    // Event listener for input change
    $('#lwip-widget-name').on('keyup', function () {
        var name = $(this).val().trim();
        if (name === '') {
            $('#lwip-create-widget-save-btn').prop('disabled', true);
            $('#create-widget-error-message').text('Please enter widget name');
        } else if (!isValidWidgetName(name)) {
            $('#lwip-create-widget-save-btn').prop('disabled', true);
            $('#create-widget-error-message').text('Widget name cannot contain special characters.');
        } else {
            $('#lwip-create-widget-save-btn').prop('disabled', false);
            $('#create-widget-error-message').text('');
        }
    });

    function isValidWidgetName(name) {
        var pattern = /^[a-zA-Z0-9\s]*$/;
        return pattern.test(name);
    }

    $('.lwip-label-icon-title').not('#lwip-connect-action-source').hide();

    // Attach click event handler to all icons 
    $('.lwip-side-menu-icons').click(function (e) {
        e.preventDefault();
        var targetId = $(this).data('target');
        $('.lwip-label-icon-title').hide();
        $(targetId).show();
    });

    //Handle widget delete 
    $('.delete-widget').click(function (event) {
        event.preventDefault();

        var accessToken = getAccessToken();
        if (!accessToken) {
            return;
        }
        var widgetId = $(this).data('widget-id');

        // Perform GraphQL mutation using AJAX for the selected widget
        var mutationData = {
            where: {
                id: widgetId
            }
        };

        // Perform GraphQL mutation using AJAX
        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: `mutation removeWidget($where: WidgetWhereUniqueInput!) {
                    removeWidget(where: $where) {
                        message
                    }
                }`,
                variables: mutationData
            }),
            success: function (response) {
                const action = 'lwip_delete_user_widget';
                $.ajax({
                    type: 'POST',
                    url: lwip_admin_ajax_object.ajax_url,
                    data: {
                        action: action,
                        delete_widget_nonce: lwip_admin_ajax_object.delete_widget_nonce,
                        data: widgetId
                    },
                    success: function (response) {
                        if (response.success) {
                            window.location.reload();
                        }
                    },
                    error: function (xhr, status, error) {
                    }
                });
            },
            error: function (error) {
                // Handle error if needed
            }
        });
    });

    //Handle close widget using button
    $("#lwip-close-widget-btn").on("click", function () {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('page', 'lwip_feed_builder');
        window.location.href = url.toString();
    });

    //Handle close widget using logo
    $("#lwip-close-widget-logo").on("click", function () {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('page', 'lwip_feed_builder');
        window.location.href = url.toString();
    });

    //Handle close widget using back button
    $(".lwip-back-btn").on("click", function () {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('page', 'lwip_feed_builder');
        window.location.href = url.toString();
    });

    //Handle generate shortcode form submission
    $("#lwip-generate-shortcode").submit(function (event) {
        $('#generate-error-message').text('');
        event.preventDefault();

        const widgetID = $("#lwip-generate-widget-id").val();
        const newShortcode = $('#lwip-new-shortcode').val();

        //Prepare data
        const widgetData = {
            id: widgetID,
            shortcode: newShortcode
        };

        const email = localStorage.getItem('usermail');
        if (!email) {
            validateUserLogin('GENERATE_SHORTCODE');
        }
        const action = 'lwip_generate_shortcode';

        //Store data in database
        $.ajax({
            type: 'POST',
            url: lwip_admin_ajax_object.ajax_url,
            data: {
                action: action,
                generate_shortcode_nonce: lwip_admin_ajax_object.generate_shortcode_nonce,
                data: JSON.stringify(widgetData),
                email: email
            },
            success: function (response) {
                if (response.success) {
                    $('#generate-success-message').text(response.data.message);
                    setTimeout(function () {
                        closeGeneratePopup();
                        $('#generate-success-message').text('');
                        location.reload();
                    }, 1000);
                } else {
                    $('#generate-error-message').text(response.data.message);
                }
            },
            error: function (xhr, status, error) {
                //Handle error
                $('#generate-error-message').text('Error generating shortcode. Please try again.');
            }
        });
    });

    $("#lwip-user-profile").on('click', function () {
        // Redirect to the user profile page
        window.location.href = 'admin.php?page=lwip_user_profile';

    });

    $(document).ready(function () {
        // Retrieve stored data from localStorage
        const userArrayString = localStorage.getItem('USER');
        if (userArrayString) {
            const userArray = JSON.parse(userArrayString);
            // Set values to the form fields
            $("#lwip-user-profile-first-name").val(userArray.firstName);
            $("#lwip-user-profile-last-name").val(userArray.lastName);
            $("#lwip-user-profile-email").val(userArray.email);
        }
    });

    // Disable save button initially
    $('#lwip-save-user-updated-data').addClass('lwip-btn-disabled', true);

    //Update user Profile
    $('#lwip-user-profile-first-name').on('keyup', function () {
        var firstName = $(this).val().trim();
        var regex = /^[a-zA-Z]+$/;

        if (firstName === '') {
            $('#update-fname-error-message').text('Please enter valid name')
            $('#lwip-save-user-updated-data').addClass('lwip-btn-disabled');
            $('#lwip-user-profile-first-name').css('border', '1px solid #ff4d4f');
        } else if (!regex.test(firstName)) {
            $('#update-fname-error-message').text('Please enter valid name');
            $('#lwip-save-user-updated-data').addClass('lwip-btn-disabled');
            $('#lwip-user-profile-first-name').css('border', '1px solid #ff4d4f');
        } else {
            $('#update-fname-error-message').text('');
            $('#lwip-save-user-updated-data').removeClass('lwip-btn-disabled');
            $('#lwip-user-profile-first-name').css('border', '1px solid #27c4cf');
        }
    });

    $('#lwip-user-profile-last-name').on('keyup', function () {
        const lastname = $(this).val().trim();
        var regex = /^[a-zA-Z]+$/;

        if (lastname === '') {
            $('#update-lname-error-message').text('Please enter valid name');
            $('#lwip-save-user-updated-data').addClass('lwip-btn-disabled');
            $('#lwip-user-profile-last-name').css('border', '1px solid #ff4d4f');

        } else if (!regex.test(lastname)) {
            $('#update-lname-error-message').text('Please enter valid name');
            $('#lwip-save-user-updated-data').addClass('lwip-btn-disabled');
            $('#lwip-user-profile-last-name').css('border', '1px solid #ff4d4f');

        } else {
            $('#update-lname-error-message').text('');
            $('#lwip-save-user-updated-data').removeClass('lwip-btn-disabled');
            $('#lwip-user-profile-last-name').css('border', '1px solid #27c4cf');

        }
    });

    // Handle user update user profile form submission
    $("#lwip-user-profile-frm").on('submit', function (event) {
        event.preventDefault(); // Prevent actual form submission 

        const accessToken = getAccessToken();
        if (!accessToken) {
            return;
        }

        const firstName = $('#lwip-user-profile-first-name').val().trim();
        const lastName = $('#lwip-user-profile-last-name').val().trim();

        // Construct GraphQL mutation
        var mutation = `
                mutation EditProfile($details: UpdateUserInput!) {
                    editProfile(details: $details) {
                        message
                        details {
                        firstName
                        lastName
                        dateOfBirth
                        occupation
                        phoneNo
                        id
                        email
                        roles
                        authProvider
                        authRefData
                        authRefId
                        subscriptionFeatures
                        subscriptionPlan
                        isRegisteredCustomer
                        userSubscription
                        userUpgradedSubscription {
                            key
                            status
                        }
                        userWidgetQuota {
                            limit
                            usage
                        }
                        isNewUser
                        }
                    }
                }
            `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            'details': {
                'firstName': firstName,
                'lastName': lastName,
            }
        };

        // Construct the GraphQL request body
        var postData = {
            'query': mutation,
            'variables': variables
        };

        // Send the POST request using AJAX to update user data
        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (response) {
                var data = response;

                if (data.data && data.data.editProfile) {
                    localStorage.setItem('USER', JSON.stringify(data.data.editProfile.details));
                    showMessage(data.data.editProfile.message, 'success')
                }
            },
            error: function (xhr, status, error) {
                // Handle error
            }

        });
    });

    //Validation Handling 
    $("#lwip-user-new-password").on('keyup', function () {
        var password = $(this).val();
        if (password === '') {
            $('#lwip-changed-password-error-message').text('Please enter password.');
            $('#lwip-user-new-password').css('border', '1px solid #ff4d4f');
        } else if (password.length < 8) {
            $('#lwip-changed-password-error-message').text('Password must be at least 8 characters long.');
            $('#lwip-user-new-password').css('border', '1px solid #ff4d4f');
        } else {
            $('#lwip-changed-password-error-message').text('');
            $('#lwip-user-new-password').css('border', '1px solid #27c4cf');
        }
    });

    $("#lwip-user-confirm-password").on('keyup', function () {
        var confirmPassword = $(this).val();
        var password = $("#lwip-user-new-password").val();

        if (confirmPassword === '') {
            $('#lwip-confirm-password-error-message').text('Please confirm password.');
            $('#lwip-user-confirm-password').css('border', '1px solid #ff4d4f');
        } else if (password !== confirmPassword) {
            $('#lwip-confirm-password-error-message').text('Passwords do not match.');
            $('#lwip-user-confirm-password').css('border', '1px solid #ff4d4f');
        } else {
            $('#lwip-confirm-password-error-message').text('');
            $('#lwip-user-confirm-password').css('border', '1px solid #27c4cf');
        }
    });

    $("#lwip-user-new-password, #lwip-user-confirm-password").on('keyup', function () {
        var inputValue = $(this).val();
        var clearButton = $(this).next('.lwip-clear-input-password');
        if (inputValue.length > 0) {
            clearButton.css('display', 'flex');
        } else {
            clearButton.css('display', 'none');
        }
    });

    //Clear input  
    function clearInput(fieldId) {
        document.getElementById(fieldId).value = '';
    }

    //On click handle clear input event
    $("#lwip-clear-fname").on('click', function () {
        clearInput('lwip-user-profile-first-name');
    })

    $("#lwip-clear-lname").on('click', function () {
        clearInput('lwip-user-profile-last-name');
    })

    $("#lwip-clear-password").on('click', function () {
        clearInput('lwip-user-new-password');
    })

    $("#lwip-clear-confirm-password").on('click', function () {
        clearInput('lwip-user-confirm-password');
    })

    //Handle password visibility
    const newPasswordVisibilityElement = document.getElementById('lwip-toggle-password-visibility');
    if (newPasswordVisibilityElement) {
        newPasswordVisibilityElement.addEventListener('click', function () {
            togglePasswordVisibility('lwip-user-new-password', this);
        });
    }

    const confirmPasswordVisibilityelement = document.getElementById('lwip-toggle-confirm-password-visibility');
    if (confirmPasswordVisibilityelement) {
        confirmPasswordVisibilityelement.addEventListener('click', function () {
            togglePasswordVisibility('lwip-user-confirm-password', this);
        });
    }

    //Handle password visibility
    function togglePasswordVisibility(fieldId, toggleElement) {
        var field = document.getElementById(fieldId);
        var icon = toggleElement.querySelector('i');

        if (field.type === 'password') {
            field.type = 'text';

            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            field.type = 'password';

            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }

    //Handle Change password form submission
    $("#lwip-change-user-password-frm").on('submit', function (event) {

        event.preventDefault();
        const accessToken = getAccessToken();

        if (!accessToken) {
            return;
        }

        const changedPwd = $("#lwip-user-new-password").val();

        // Construct GraphQL mutation
        var mutation = `
               mutation ChangePassword($data: ChangePassword!) {
                    changePassword(data: $data) {
                        message
                    }
                }
            `;

        // Prepare variables for the GraphQL mutation
        var variables = {
            "data": {
                "newPassword": changedPwd
            }
        };

        // Construct the GraphQL request body
        var postData = {
            'query': mutation,
            'variables': variables
        };

        // Send the POST request using AJAX
        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (response) {
                var data = response.data;

                if (data.changePassword && data.changePassword.message) {
                    // Success message
                    showMessage(data.changePassword.message, 'success');
                } else {
                    // Handle other success scenarios if needed
                    showMessage(response.errors[0].message, 'error');
                }
            },
            error: function (xhr, status, error) {
            }
        });
    });

    //Handle Premium View plan
    $("#lwip-widget-view-plan-container ,#lwip-free-user-icon,#lwip-view-purchase-plan-btn").on('click', function () {
        window.location.href = "admin.php?page=lwip_feed_builder_premium";
    });

});

//Close Button
function closePopupByButton() {
    var loginPopup = document.getElementById('lwip-login-popup-container');
    var signupPopup = document.getElementById('lwip-signup-popup-container');
    var resetPopup = document.getElementById('lwip-reset-password-container');
    var popup = document.getElementById('lwip-popup');

    if (loginPopup) loginPopup.style.display = 'none';
    if (signupPopup) signupPopup.style.display = 'none';
    if (resetPopup) resetPopup.style.display = 'none';
    if (popup) popup.style.display = 'none';
}

//Timer Counting for resend link
function startTimer(start) {
    var timerDisplay = document.getElementById("lwip-timer-container");

    // Check if the element exists
    if (timerDisplay) {
        var resendLink = document.getElementById("lwip-user-resend-otp");
        var resendSection = document.getElementById("lwip-resent-otp-section");
        var timerInterval; // Declare timerInterval outside the if statement to access it later

        // Calculate total seconds for 2 minutes
        var totalSeconds = 150;

        if (start) {
            timerInterval = setInterval(function () {
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = totalSeconds % 60;

                // Display the timer
                timerDisplay.style.display = "block";
                timerDisplay.textContent = "Resend OTP in: " + minutes + " minutes " + seconds + " seconds";

                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    resendLink.removeAttribute("disabled");
                    timerDisplay.style.display = "none";
                    resendSection.style.display = "block";
                } else {
                    totalSeconds--;
                }
            }, 1000);
        } else {
            timerDisplay.style.display = "none";
            timerDisplay.textContent = "";
            clearInterval(timerInterval);
        }
    }
}

//Login Form Popup Event handler
function openLoginPopup() {
    var loginPopup = document.getElementById("lwip-login-popup-container");
    loginPopup.style.display = "block";
    var signupPopup = document.getElementById("lwip-signup-popup-container");
    signupPopup.style.display = "none";
    var resetPopup = document.getElementById("lwip-reset-password-container");
    resetPopup.style.display = "none";
    var emailVerificationPopup = document.getElementById("lwip-otp-verification-popup-container");
    emailVerificationPopup.style.display = "none";
}

//SignUp Form Popup Event handler
function openSignupPopup() {
    var signupPopup = document.getElementById("lwip-signup-popup-container");
    signupPopup.style.display = "block";
    var loginPopup = document.getElementById("lwip-login-popup-container");
    loginPopup.style.display = "none";
    var resetPopup = document.getElementById("lwip-reset-password-container");
    resetPopup.style.display = "none";
    var emailVerificationPopup = document.getElementById("lwip-otp-verification-popup-container");
    emailVerificationPopup.style.display = "none";
}

//Email verification Form Popup Event handler
function openEmailVerification(userDetails) {

    // Set user data in the form
    var userDataInput = document.getElementById("lwip-user-data");
    if (userDataInput) {
        userDataInput.value = JSON.stringify(userDetails);
    } else {
        //Handle error
    }

    // Show email verification popup
    var emailVerificationPopup = document.getElementById("lwip-otp-verification-popup-container");
    if (emailVerificationPopup) {
        emailVerificationPopup.style.display = "block";
    } else {
        //Handle error
    }

    // Hide other popups
    var popupsToHide = ["lwip-signup-popup-container", "lwip-login-popup-container", "lwip-reset-password-container"];
    popupsToHide.forEach(function (popupId) {
        var popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "none";
        } else {
            console.warn("Popup element with id " + popupId + " not found.");
        }
    });
}

//Reset Password Form Popup Event handler
function openResetPopup() {
    var resetPopup = document.getElementById("lwip-reset-password-container");
    resetPopup.style.display = "block";
    var loginPopup = document.getElementById("lwip-login-popup-container");
    loginPopup.style.display = "none";
    var signupPopup = document.getElementById("lwip-signup-popup-container");
    signupPopup.style.display = "none";
    var emailVerificationPopup = document.getElementById("lwip-otp-verification-popup-container");
    emailVerificationPopup.style.display = "none";
}

// Function to hide the login success popup
function hideLoginSuccessPopup() {
    jQuery('#lwip-login-popup-container').hide();
}

//Reload page
function reload() {
    setTimeout(function () {
        window.location.reload(true);
    }, 1000);
}

//Resend Otp Timer
function resendOtpTimer() {
    var resendLink = document.getElementById("lwip-user-resend-otp");
    var resendSection = document.getElementById("lwip-resent-otp-section");

    resendLink.setAttribute("disabled", "disabled");
    resendSection.style.display = "none";
    startTimer(true);
}

// Function to open the popup
function openPopup() {
    document.getElementById("lwip-popup").style.display = "block";
}

// Function to close the popup
function closePopup() {
    document.getElementById("lwip-popup").style.display = "none";
}

// Function to create widget
function createsWidget() {
    var widgetName = document.getElementById("lwip-widget-name").value;
}

// Copy clipboard function for shortcode copy
function copyToClipboard(event, button) {
    event.preventDefault();
    var shortcode = button.getAttribute("data-shortcode");
    navigator.clipboard.writeText(shortcode).then(function () {
        var tooltip = button.getElementsByClassName("tooltiptext")[0];
        tooltip.innerHTML = "Copied!";
    }).catch(function (error) {
        // handle error
    });
}

// handle clipboard function tooltip message
function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}

//Generate ShortCode Callbacks
function openGeneratePopup(widgetId) {
    document.getElementById('lwip-generate-widget-id').value = widgetId;
    document.getElementById('lwip-generate-widget-custom-shortcode').style.display = 'block';
}

//close popup
function closeGeneratePopup() {
    document.getElementById('lwip-generate-widget-custom-shortcode').style.display = 'none';
    document.getElementById('generate-error-message').textContent = '';
    document.getElementById('lwip-new-shortcode').value = '';
}

/**
 * Updates the premium popup message and triggers its display.
 *
 * @param {string} message - The message to display in the popup.
 */
function dynamicPremiumPopupMessage(message) {
    jQuery('#dynamic-message').text(message);
    jQuery("#lwip-premium-purchase-popup").click();
}

// Handle user profile event listner
document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.querySelector('.lwip-profile-button');
    const dropdownMenu = document.querySelector('.lwip-dropdown-menu');

    if (profileButton && dropdownMenu) {
        profileButton.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    document.addEventListener('click', (event) => {
        if (profileButton && dropdownMenu) {
            if (!profileButton.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        }
    });

});
