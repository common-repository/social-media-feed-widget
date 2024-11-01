
// Initialize callToActionData if undefined
if (typeof callToActionData === 'undefined') {
    var callToActionData = [];
}

// Global variables for handling various tasks related to user settings, UI state, and application configuration
let popupDisplay;
let hoverOrSimpleStyle;
let currentUpdateIndex = null;
let isProgrammaticClick = false;
let globalBorderWidth;
let globalCustomStyleSelection;

if (hoverOrSimpleStyle === 'undefined') {
    updateStyleSelection(true);
}

// Function to get default post data
function getDefaultPost() {
    const accessToken = getAccessToken();
    const widgetId = getWidgetId();

    if (!accessToken || !widgetId) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
    query GetPostConfig($where: GetPostConfigWhere!) {
        getPostConfig(where: $where) {
          style
          postElement {
            user
            date
            likeCount
            commentCount
            text
            share
            instagramLink
          }
          clickAction
          popUPSettings {
            user
            location
            followButton
            instagramLink
            likesCount
            share
            text
            comments
            date
          }
          callToAction {
            instagramUrl
            buttonUrl
            buttonLabel
          }
          postCustomStyle {
            fontColor
            fontFamily
            margin
            padding
            isDarkMode
            borderStyle
            borderColor
            borderWidth
        }
        }
      }
    `;
    const variables = {
        where: {
            widgetId: widgetId
        }
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => handlePostConfigResponse(data))
        .catch(/*Handle error*/);
}
getDefaultPost();

// Function to handle the response from getPostConfig query
function handlePostConfigResponse(data) {
    if (data.errors) {
        showMessage(data.errors[0].message, 'error');
        return;
    }
    const postConfig = data.data.getPostConfig;

    popupDisplay = postConfig.clickAction;
    globalCustomStyleSelection = postConfig.postCustomStyle;

    updatePostElements(postConfig);
    updatePopUpSettings(postConfig.popUPSettings);
    updateCallToAction(postConfig.callToAction || []);
    updateStyleSelection(postConfig.style);
    updateCustomStyleSection(postConfig.postCustomStyle);

}

// Function to update post elements
function updatePostElements(postConfig) {
    const { postElement } = postConfig;
    document.getElementById("lwip-insta-post-user").checked = postElement.user;
    document.getElementById("lwip-insta-post-date").checked = postElement.date;
    document.getElementById("lwip-insta-post-link").checked = postElement.instagramLink;
    document.getElementById("lwip-insta-post-share").checked = postElement.share;
    document.getElementById("lwip-insta-post-likes").checked = postElement.likeCount;
    document.getElementById("lwip-insta-post-comments").checked = postElement.commentCount;
    document.getElementById("lwip-insta-post-texts").checked = postElement.text;
}

// Function to update pop-up settings
function updatePopUpSettings(popUPSettings) {
    document.getElementById("lwip-post-element-user").checked = popUPSettings.user;
    document.getElementById("lwip-post-element-location").checked = popUPSettings.location;
    document.getElementById("lwip-post-element-follow-btn").checked = popUPSettings.followButton;
    document.getElementById("lwip-post-element-instagram-link").checked = popUPSettings.instagramLink;
    document.getElementById("lwip-post-element-like-count").checked = popUPSettings.likesCount;
    document.getElementById("lwip-post-element-share").checked = popUPSettings.share;
    document.getElementById("lwip-post-element-text").checked = popUPSettings.text;
    document.getElementById("lwip-post-element-date").checked = popUPSettings.date;
    document.getElementById("lwip-post-element-comments").checked = popUPSettings.comments;
}

// Function to update call-to-action buttons
function updateCallToAction(callToAction) {
    callToActionData = (callToAction || []).map(item => [item.instagramUrl, item.buttonUrl, item.buttonLabel]);
    localStorage.setItem('callToActionData', JSON.stringify(callToActionData)); // Store in local storage
    displayCallToActionButtons();
}

// Function to display call-to-action buttons
function displayCallToActionButtons() {
    const callToActionDiv = document.getElementById("lwip-call-to-action-btn-values-container");

    if (callToActionData.length > 0) {
        let callToActionHTML = "";
        callToActionData.forEach((item, index) => {
            callToActionHTML += `
            <div class="lwip-cta-item">
                <a>${item[1]}</a>
                <div class="lwip-cta-svgs">
                    <svg viewBox="64 64 896 896"  focusable="false" data-icon="more" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"></path>
                    </svg>
                </div>

                <div class="lwip-button-container">
                    <button class="lwip-update-btn" data-index="${index}">
                        <span>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                            </svg>
                            <span>Edit</span>
                        </span>
                    </button>

                    <button class="lwip-delete-btn" data-index="${index}">
                        <span>
                            <svg viewBox="64 64 896 896" focusable="false"  data-icon="delete" width="1em" height="1em" fill="" aria-hidden="true">
                                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                            </svg>
                            <span>Delete</span>
                        </span>
                    </button>
                </div>
            </div>`;
        });
        callToActionDiv.innerHTML = callToActionHTML;
        setupCallToActionButtonEvents();
        callToActionDiv.style.display = "block";
    } else {
        callToActionDiv.style.display = "none";
    }
}

// Function to set up events for call-to-action buttons
function setupCallToActionButtonEvents() {
    const deleteBtns = document.querySelectorAll(".lwip-delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener("click", handleDeleteCallToAction));

    const updateBtns = document.querySelectorAll(".lwip-update-btn");
    updateBtns.forEach(btn => btn.addEventListener("click", handleUpdateCallToAction));
}

// Function to handle deleting a call-to-action item
function handleDeleteCallToAction(event) {
    const button = event.target.closest(".lwip-delete-btn");
    if (!button) return; // Safety check

    const index = parseInt(button.getAttribute("data-index")); // Convert index to a number

    // Remove the item from the array
    const updatedCallToActionData = callToActionData.filter((item, idx) => idx !== index);
    callToActionData = updatedCallToActionData;

    // Update localStorage with the new data
    localStorage.setItem('callToActionData', JSON.stringify(callToActionData));

    // Call CreateOrUpdatePost to ensure any necessary updates are made
    createOrUpdatePost();

    // Re-render the call-to-action buttons
    displayCallToActionButtons();
}

// Function to handle updating a call-to-action item
function handleUpdateCallToAction(event) {
    const button = event.target.closest(".lwip-update-btn");
    if (!button) return; // Safety check

    const index = button.getAttribute("data-index");
    const item = callToActionData[index];
    document.getElementById("lwip-cta-insta-post-url").value = item[0];
    document.getElementById("lwip-cta-insta-post-redirect-btn-url").value = item[1];
    document.getElementById("lwip-cta-insta-post-btn-label").value = item[2];
    currentUpdateIndex = index;
    jQuery('#lwip-call-to-action-btn-container').show();
    jQuery('#lwip-side-menu-call-to-action-main-container').hide();
}

// Function to update style selection
function updateStyleSelection(getStyle) {
    const buttons = document.querySelectorAll('.lwip-simple-hover-sub-div button');
    let selectedButton = null;
    buttons.forEach(button => {
        if (button.getAttribute('data-poststyle') === getStyle) {
            button.classList.add('selected-style');
            selectedButton = button;
        } else {
            button.classList.remove('selected-style');
        }
    });
    hoverOrSimpleStyle = getStyle;

    if (!selectedButton && buttons.length > 0) {
        buttons[0].classList.add('selected-style');
        selectedButton = buttons[0];
    }

    if (selectedButton) {
        isProgrammaticClick = true;
        selectedButton.click();
    }
    updateSelectDropdown();
}

//Function to update custom style selection
function updateCustomStyleSection(getCustomStyle) {

    const fontFamily = getCustomStyle.fontFamily || "inherit";
    const fontColor = getCustomStyle.fontColor || "#000000";
    const borderWidth = getCustomStyle.borderWidth ?? 1;
    globalBorderWidth = borderWidth;
    const borderColor = getCustomStyle.borderColor || "#000000";
    const padding = getCustomStyle.padding ?? 4;
    const margin = getCustomStyle.margin ?? 4;
    const isDarkMode = getCustomStyle.isDarkMode || false;

    jQuery("#lwip-custom-font-family").val(fontFamily);
    jQuery("#lwip-font-color").val(fontColor);
    jQuery("#lwip-border-width").val(borderWidth);
    jQuery("#lwip-border-color").val(borderColor);
    jQuery("#lwip-card-padding").val(padding);
    jQuery("#lwip-card-margin").val(margin);
    jQuery("#lwip-dark-mode-switch").prop('checked', isDarkMode);

    // Trigger update functions to apply styles to card view
    setTimeout(() => {
        updateFontColor(fontColor);
        updateFontFamily(fontFamily);
        updateBorder(borderWidth, borderColor);
        updatePadding(padding);
        updateMargin(margin);
        updateDarkMode(isDarkMode);
    }, 300);

}

//Function to handle font color 
function updateFontColor(selectedColor) {
    if (selectedColor === undefined || selectedColor === null) return;
    jQuery(".lwip-header-card-username").css("color", selectedColor);
    jQuery(".lwip-header-card-date").css("color", selectedColor);
    jQuery(".lwip-card-caption").css("color", selectedColor);
    jQuery(".lwip-card-custom-color").css("color", selectedColor);
    jQuery(".lwip-card-custom-color-fill").css("fill", selectedColor);
    jQuery(".popup-username").css("color", selectedColor);
    jQuery(".popup-date").css("color", selectedColor);
    jQuery(".popup-follow-txt").css("color", selectedColor);
}

//Function to hanlde font family
function updateFontFamily(selectedFont) {
    if (selectedFont === undefined || selectedFont === null || selectedFont === "NULL") {
        selectedFont = "inherit";
    }
    jQuery(".lwip-content").css("font-family", selectedFont);
}

//Function to handle norder width and color
function updateBorder(borderWidth, borderColor) {
    if (borderWidth === undefined || borderWidth === null) borderWidth = 0;
    if (borderColor === undefined || borderColor === null) borderColor = "#000000";
    var borderWidthPx = borderWidth + 'px';
    jQuery(".lwip-post-wrapper .lwip-cards").css({
        "border-width": borderWidthPx,
        "border-color": borderColor
    });
    jQuery(".lwip-post-wrapper-slider .lwip-cards").css({
        "border-width": borderWidthPx,
        "border-color": borderColor
    });
}

//Function to handle padding
function updatePadding(paddingValue) {
    if (paddingValue === undefined || paddingValue === null) paddingValue = 0;
    var paddingPx = paddingValue + 'px';
    jQuery(".lwip-post-wrapper .lwip-cards-footer, .lwip-post-wrapper .lwip-card-content-header").css("padding", paddingPx);
    jQuery(".lwip-post-wrapper-slider .lwip-cards-footer, .lwip-post-wrapper-slider .lwip-card-content-header").css("padding", paddingPx);

}

//Function to handle margin
function updateMargin(marginValue) {
    if (marginValue === undefined || marginValue === null) marginValue = 0;
    var marginPx = marginValue + 'px';
    jQuery(".lwip-post-wrapper .lwip-cards-footer, .lwip-post-wrapper .lwip-card-content-header").css("margin", marginPx);
    jQuery(".lwip-post-wrapper-slider .lwip-cards-footer, .lwip-post-wrapper-slider .lwip-card-content-header").css("margin", marginPx);
}

//Function to handle dark mode
function updateDarkMode(isDarkMode) {
    if (isDarkMode === undefined || isDarkMode === null) {
        isDarkMode = false;
    }

    if (isDarkMode) {
        // Apply dark mode styles
        jQuery(".lwip-content").css({
            "color": "#f0f0f0",
            "background-color": "black"
        });
        jQuery(".lwip-cards-header").css({
            "color": "#f0f0f0",
            "background-color": "black"
        });
        jQuery(".lwip-cards-footer").css({
            "color": "#f0f0f0",
            "background-color": "black"
        });
        jQuery(".lwip-cards").css({
            "color": "#f0f0f0",
            "background-color": "black"
        });
    } else {
        // Apply light mode styles
        jQuery(".lwip-content").css({
            "color": "black",
            "background-color": "#f0f0f0"
        });
        jQuery(".lwip-cards-header").css({
            "color": "black",
            "background-color": "#f0f0f0"
        });
        jQuery(".lwip-cards-footer").css({
            "color": "black",
            "background-color": "#f0f0f0"
        });
        jQuery(".lwip-cards").css({
            "color": "black",
            "background-color": "#f0f0f0"
        });
    }
}

// Function to update the dropdown selection
function updateSelectDropdown() {
    const selectElement = document.getElementById('lwip-post-click-action-handler');
    const selectedOption = Array.from(selectElement.options).find(option => option.getAttribute('data-popclickaction') === popupDisplay);
    if (selectedOption) {
        selectElement.value = selectedOption.value;
        jQuery('#lwip-post-click-action-handler').trigger('change.select2');
    }
}

// Function to create or update post configuration
function createOrUpdatePost() {
    jQuery("#lwip-publish-account-btn").removeClass('lwip-disable-publish-button');
    const authToken = getAccessToken();
    const widgetId = getWidgetId();

    if (!authToken || !widgetId) {
        return;
    }

    // Select the button with the 'selected-style' class
    const selectedStyleButton = document.querySelector('.lwip-simple-hover-sub-div button.selected-style');
    if (!selectedStyleButton) {
        return;
    }

    const postStyle = selectedStyleButton.getAttribute('data-poststyle');

    const selectedOption = document.querySelector('select').selectedOptions[0];
    if (!selectedOption) {
        return;
    }
    const popClickAction = selectedOption.dataset.popclickaction;
    const event = new CustomEvent('popupDisplayChange', { detail: { popupDisplay: popupDisplay } });
    document.dispatchEvent(event);

    const postElement = {
        user: document.getElementById("lwip-insta-post-user").checked,
        date: document.getElementById("lwip-insta-post-date").checked,
        likeCount: document.getElementById("lwip-insta-post-likes").checked,
        commentCount: document.getElementById("lwip-insta-post-comments").checked,
        text: document.getElementById("lwip-insta-post-texts").checked,
        share: document.getElementById("lwip-insta-post-share").checked,
        instagramLink: document.getElementById("lwip-insta-post-link").checked
    };

    const popUPSettings = {
        user: document.getElementById("lwip-post-element-user").checked,
        location: document.getElementById("lwip-post-element-location").checked,
        followButton: document.getElementById("lwip-post-element-follow-btn").checked,
        instagramLink: document.getElementById("lwip-post-element-instagram-link").checked,
        likesCount: document.getElementById("lwip-post-element-like-count").checked,
        share: document.getElementById("lwip-post-element-share").checked,
        text: document.getElementById("lwip-post-element-text").checked,
        comments: document.getElementById("lwip-post-element-comments").checked,
        date: document.getElementById("lwip-post-element-date").checked
    };

    const postCustomStyle = {
        fontColor: jQuery("#lwip-font-color").val() || '',
        fontFamily: jQuery("#lwip-custom-font-family").val(),
        margin: jQuery("#lwip-card-margin").val() !== '' ? parseInt(jQuery("#lwip-card-margin").val(), 10) : isNaN(parseInt(jQuery("#lwip-card-margin").val(), 10)) ? null : 0,
        padding: jQuery("#lwip-card-padding").val() !== '' ? parseInt(jQuery("#lwip-card-padding").val(), 10) : isNaN(parseInt(jQuery("#lwip-card-padding").val(), 10)) ? null : 0,
        isDarkMode: jQuery("#lwip-dark-mode-switch").is(':checked'),
        borderStyle: "solid",
        borderColor: jQuery("#lwip-border-color").val() || '',
        borderWidth: jQuery("#lwip-border-width").val() !== '' ? parseInt(jQuery("#lwip-border-width").val(), 10) : isNaN(parseInt(jQuery("#lwip-border-width").val(), 10)) ? null : 0
    };

    //Update Global value
    globalCustomStyleSelection = postCustomStyle;

    if (currentUpdateIndex !== null) {
        callToActionData[currentUpdateIndex] = [
            document.getElementById("lwip-cta-insta-post-url").value,
            document.getElementById("lwip-cta-insta-post-redirect-btn-url").value,
            document.getElementById("lwip-cta-insta-post-btn-label").value
        ];
        currentUpdateIndex = null;
    } else {
        const newCallToAction = {
            instagramUrl: document.getElementById("lwip-cta-insta-post-url").value,
            buttonUrl: document.getElementById("lwip-cta-insta-post-redirect-btn-url").value,
            buttonLabel: document.getElementById("lwip-cta-insta-post-btn-label").value
        };

        if (newCallToAction.instagramUrl && newCallToAction.buttonUrl && newCallToAction.buttonLabel) {
            callToActionData.push([newCallToAction.instagramUrl, newCallToAction.buttonUrl, newCallToAction.buttonLabel]);
        }
    }

    const updatedCallToAction = callToActionData.map(item => ({
        instagramUrl: item[0],
        buttonUrl: item[1],
        buttonLabel: item[2]
    }));

    const variables = {
        data: {
            widgetId: widgetId,
            style: postStyle,
            postElement: postElement,
            clickAction: popClickAction,
            popUPSettings: popUPSettings,
            callToAction: updatedCallToAction,
            postCustomStyle: postCustomStyle
        }
    };

    const postData = {
        query: `mutation CreateOrUpdatePostConfig($data: CreateOrUpdatePostConfigInput!) {
            createOrUpdatePostConfig(data: $data) {
                style
                postElement {
                    user
                    date
                    likeCount
                    commentCount
                    text
                    share
                    instagramLink
                }
                clickAction
                popUPSettings {
                    user
                    location
                    followButton
                    instagramLink
                    likesCount
                    share
                    text
                    comments
                    date
                }
                callToAction {
                    instagramUrl
                    buttonUrl
                    buttonLabel
                }
                postCustomStyle {
                    fontColor
                    fontFamily
                    margin
                    padding
                    isDarkMode
                    borderStyle
                    borderColor
                    borderWidth
                }
            }
        }`,
        variables: variables
    };

    fetch(lwip_connect.graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error('Network response was not ok: ' + JSON.stringify(err));
                });
            }
            return response.json();
        })
        .catch(/*Handle error*/);
}

jQuery(document).ready(function ($) {

    //Handle post style event
    $('.lwip-simple-hover-sub-div button').click(function () {
        if (!isProgrammaticClick) { // Only call CreateOrUpdatePost() if not a programmatic click
            $('.lwip-simple-hover-sub-div button').removeClass('selected-style');
            $(this).addClass('selected-style');
            createOrUpdatePost();
        }
        isProgrammaticClick = false;
    });

    //Handle post style change image display on front-end and set click action image for drop-down
    setTimeout(function () {
        jQuery(document).ready(function ($) {

            if (isLifetimeDeal === false) {
                function custom_template(obj) {
                    var data = $(obj.element).data();
                    var text = $(obj.element).text();
                    if (data && data['img_src']) {
                        var img_src = data['img_src'];
                        var template = $("<div class='lwip-option-with-image'><img src=\"" + img_src + "\" /><p>" + text + "</p></div>");
                        return template;
                    } else {
                        return text;
                    }
                }

                var options = {
                    'templateSelection': function (obj) {
                        var text = $(obj.element).text();
                        return text;
                    },
                    'templateResult': custom_template,
                    'minimumResultsForSearch': -1
                };

                $('#lwip-post-click-action-handler').select2(options);
                $('.select2-container--default .select2-selection--single').css({ 'height': '40px', 'line-height': '40px' });

            }

        });
    }, 1000);

    // Event listener for select dropdown change
    $('#lwip-post-click-action-handler').change(function () {
        createOrUpdatePost();

        const selectedOption = $(this).find(':selected');
        const postStyle = selectedOption.data('popclickaction');
        popupDisplay = postStyle;

        if (isLifetimeDeal === true || postStyle !== 'POPUP') {
            if (selectedAccountType === "PERSONAL") {
                personalAccountData(sourceIdGlobal);
            } else if (selectedAccountType === "BUSINESS") {
                businessAccountData(sourceIdGlobal);
            } else {
                defaultMediaData();
            }
        } else {
            dynamicPremiumPopupMessage('Show posts in scrollable popup with reels and multiple slides/images.');
            $(this).find("option[data-popclickaction='POPUP']").prop('disabled', true);

            $(this).val($(this).find("option:not([disabled])").first().val());
            popupDisplay = $(this).val();

            if (selectedAccountType === "PERSONAL") {
                personalAccountData(sourceIdGlobal);
            } else if (selectedAccountType === "BUSINESS") {
                businessAccountData(sourceIdGlobal);
            } else {
                defaultMediaData();
            }
        }
    });

    // Event listener for done button
    $('#lwip-call-action-save-btn').click(function () {
        createOrUpdatePost();
        updatelayout();
    });

    /**
     * Event listeners for checkboxes, inputs and click events
     *  */
    $('#lwip-post-element-user, #lwip-post-element-location, #lwip-post-element-follow-btn, #lwip-post-element-instagram-link, #lwip-post-element-like-count, #lwip-post-element-share, #lwip-post-element-text, #lwip-post-element-date, #lwip-post-element-comments').click(function () {
        createOrUpdatePost();
    });

    $('#lwip-insta-post-user, #lwip-insta-post-date, #lwip-insta-post-link,#lwip-insta-post-texts').click(function () {
        createOrUpdatePost();
    });

    $('#lwip-insta-post-likes, #lwip-insta-post-comments').click(function () {
        if (isLifetimeDeal === true) {
            createOrUpdatePost();
        } else if (typeof isLifetimeDeal === 'undefined') {

        } else {
            dynamicPremiumPopupMessage('Show like count and comment count in post.');
        }
    });

    $('#lwip-insta-post-share').click(function () {
        if (isLifetimeDeal === true) {
            createOrUpdatePost();
        } else if (typeof isLifetimeDeal === 'undefined') {

        } else {
            dynamicPremiumPopupMessage('Show share button in post.');
        }
    });

    $("#lwip-cta-insta-post-url").on('input', function () {
        const InstagramPostURL = $(this).val();
        if (!InstagramPostURL) {
            $("#lwip-insta-post-url-err-message").text("Please enter an Instagram Post URL.");
        } else {
            $("#lwip-insta-post-url-err-message").text(isValidURL(InstagramPostURL) ? '' : "Please enter a valid Instagram Post URL.");
        }
        validateInputs();
    });

    $("#lwip-cta-insta-post-redirect-btn-url").on('input', function () {
        const ButtonURL = $(this).val();
        if (!ButtonURL) {
            $("#lwip-insta-bussiness-url-err-message").text("Please enter a Button URL.");
        } else {
            $("#lwip-insta-bussiness-url-err-message").text(isValidURL(ButtonURL) ? '' : "Please enter a valid Button URL.");
        }
        validateInputs();
    });

    $("#lwip-cta-insta-post-btn-label").on('input', function () {
        const ButtonLabel = $(this).val();
        $("#lwip-insta-button-label-err-message").text(ButtonLabel ? '' : "Please enter a Button Label.");
        validateInputs();
    });

    $("#lwip-font-color").on("input", function () {
        var selectedColor = $(this).val();
        updateFontColor(selectedColor);
        createOrUpdatePost();
    });

    $("#lwip-border-width").on("input", function () {
        var borderWidth = $(this).val();
        var borderColor = $("#lwip-border-color").val();
        updateBorder(borderWidth, borderColor);
        createOrUpdatePost();
        if (isMasonryStyle === true) {

            if (masonryLayout) {
                var columnNumber = columnValueGlobal;
                var baseWidth = getBaseWidth(columnNumber);
                var gutterY = calculateGutter(borderWidth, gapValueGlobal);

                // Reinitialize MiniMasonry with updated options
                masonryLayout = new MiniMasonry({
                    container: '.masonry',
                    baseWidth: baseWidth,
                    surroundingGutter: false,
                    minify: false,
                    gutterX: gapValueGlobal,
                    gutterY: gutterY
                });
                masonryLayout.layout();
            }
        }
    });


    $("#lwip-border-color").on("input", function () {
        var borderColor = $(this).val();
        var borderWidth = $("#lwip-border-width").val();
        updateBorder(borderWidth, borderColor);
        createOrUpdatePost();
    });

    $("#lwip-card-padding").on("input", function () {
        var padding = $(this).val();
        updatePadding(padding);
        createOrUpdatePost();
        if (isMasonryStyle === true) {
            masonryLayout.layout();
        }
    });

    $("#lwip-card-margin").on("input", function () {
        var margin = $(this).val();
        updateMargin(margin);
        createOrUpdatePost();
        if (isMasonryStyle === true) {
            masonryLayout.layout();
        }
    });

    $("#lwip-dark-mode-switch").on("change", function () {
        var isDarkMode = $(this).is(":checked");
        updateDarkMode(isDarkMode);
        createOrUpdatePost();
    });

    $("#lwip-custom-font-family").on("change", function () {
        var selectedFont = $(this).val();
        updateFontFamily(selectedFont);
        createOrUpdatePost();
    });

});

// Function for validating URL inputs
function validateInputs() {
    const ipuValid = isValidURL(jQuery('#lwip-cta-insta-post-url').val());
    const buValid = isValidURL(jQuery('#lwip-cta-insta-post-redirect-btn-url').val());
    const blValid = jQuery('#lwip-cta-insta-post-btn-label').val().trim() !== '';

    jQuery('#lwip-call-action-save-btn').prop('disabled', !(ipuValid && buValid && blValid));
}

// Function to check if a URL is valid
function isValidURL(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(url);
}

// Function to update layout
function updatelayout() {
    setTimeout(function () {
        jQuery(document).ready(function ($) {
            $('#lwip-calltoaction-add-btn').show();
            $('#lwip-side-menu-call-to-action-main-container').show();
            $('#lwip-call-to-action-btn-container').hide();
            $('#lwip-insta-post-url-err-message').text('');
            $('#lwip-insta-bussiness-url-err-message').text('');
            $('#lwip-insta-button-label-err-message').text('');
            getDefaultPost();
            $('#lwip-cta-insta-post-url').val('');
            $('#lwip-cta-insta-post-btn-label').val('');
            $('#lwip-cta-insta-post-redirect-btn-url').val('');
        });
    }, 1000);
}
