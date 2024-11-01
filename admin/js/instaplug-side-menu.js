
function updateSliderBackground(slider) {
    const max = parseInt(slider.attr('max'));
    const value = parseInt(slider.val());
    const progress = (value / max) * 100;
    slider.css('background', `linear-gradient(to right, #a4f5f2 ${progress}%, #ccc ${progress}%)`);
}

/**
 * This file contains the code for managing side menus.
 * It handles click actions to show and hide UI elements based on user interactions.
 *
 * Key functionalities include:
 * - Displaying side menus when triggered by user clicks
 * - Hiding side menus when necessary
 * - Managing the state and transitions of UI elements related to the menus
 *
 * Ensure that any modifications to the menu behavior are tested thoroughly to maintain
 * a smooth and responsive user experience.
 */

jQuery(document).ready(function ($) {

    $('#lwip-side-menu-auto-btn').click(function () {
        $('#lwip-row-btn').show();
        $('#lwip-gap-btn').show();
        $('#lwip-width-btn').show();
        $('#lwip-column-btn').hide();
        $('.column-row-container-lwip').css('height', '305px');

        // Change background color and text color of the Auto button
        $(this).css({
            'background-color': '#27c4cf',
            'color': 'white'
        });

        // Reset background color and text color of the Manual button
        $('#lwip-side-menu-manuall-btn').css({
            'background-color': '',
            'color': ''
        });
    });

    $('#lwip-side-menu-manuall-btn').click(function () {
        $('#lwip-row-btn').show();
        $('#lwip-gap-btn').show();
        $('#lwip-width-btn').show();
        $('#lwip-column-btn').show();
        $('.column-row-container-lwip').css('height', '370px');

        // Change background color and text color of the Manual button
        $(this).css({
            'background-color': '#27c4cf',
            'color': 'white'
        });

        // Reset background color and text color of the Auto button
        $('#lwip-side-menu-auto-btn').css({
            'background-color': '',
            'color': ''
        });
    });

    $("#lwip-column-row-btn").click(function () {
        $('#lwip-side-menu-column-row-container').show();
        $('#lwip-column-row-container').show();
        $('#lwip-slider-bottons-container').hide();
        $('#lwip-post-layout-slider').hide();
        $('#lwip-grid-view').hide();
        $('#lwip-masonry-view').hide();
        $("#lwip-layout-header-span").hide();
    });

    $("#lwip-side-menu-column-row-container").click(function () {
        $('#lwip-side-menu-column-row-container').hide();
        $('#lwip-slider-bottons-container').show();
        $('#lwip-post-layout-slider').show();
        $('#lwip-grid-view').show();
        $('#lwip-masonry-view').show();
        $('#lwip-column-row-container').hide();
    });

    $('#lwip-column-row-back-btn').on('click', function () {
        $('#lwip-side-menu-layout-container').show();
        $("#lwip-layout-header-span").show();
    });

    $('#lwip-side-menu-header-elements-container').hide();

    $('#lwip-side-menu-layout-header').click(function () {
        $('#lwip-side-menu-header-elements-container').toggle();
        $('#lwip-layouts-types').hide();
        $("#lwip-layout-header-span").hide();
    });

    $('#lwip-header-back-btn').on('click', function () {
        $('#lwip-layouts-types').show();
        $('#lwip-side-menu-header-elements-container').hide();
        $("#lwip-layout-header-span").show();
    });

    $('#lwip-main-header-elemets-switch').prop('checked', true);

    $('#lwip-main-header-elemets-switch').change(function () {
        var isChecked = $(this).prop('checked');

        if (isChecked) {
            $('#lwip-main-header-profile-pic-checkbox, #lwip-main-header-user-fullname-checkbox, #lwip-main-header-username-checkbox, #lwip-main-header-verify-badge-checkbox, #lwip-main-header-post-count-checkbox, #lwip-main-header-followers-count-checkbox, #lwip-main-header-following-count-checkbox, #lwip-main-header-follow-btn-checkbox').prop('checked', true);

            if (selectedAccountType !== undefined && selectedAccountType === 'PERSONAL') {
                $('#lwip-main-header-container,.lwip-user-full-name, .lwip-user-name, #lwip-main-header-user-follow-btn').show();
            }
            else {
                $('#lwip-main-header-container, #lwip-main-header-insta-logo, .lwip-user-full-name, .lwip-user-name, #lwip-main-header-insta-posts-container, #lwip-main-header-insta-follow-container, #lwip-main-header-insta-following-container, #lwip-main-header-user-follow-btn').show();
            }
            $('.lwip-main-header-element-container').show();
            $('.lwip-slider-header').css('height', '326px');
        } else {
            $('#lwip-main-header-profile-pic-checkbox, #lwip-main-header-user-fullname-checkbox, #lwip-main-header-username-checkbox, #lwip-main-header-verify-badge-checkbox, #lwip-main-header-post-count-checkbox, #lwip-main-header-followers-count-checkbox, #lwip-main-header-following-count-checkbox, #lwip-main-header-follow-btn-checkbox').prop('checked', false);
            $('#lwip-main-header-container').hide();
            $('.lwip-main-header-element-container').hide();
            $('.lwip-slider-header').css('height', '35px');

        }
    }).change();

    $('#lwip-layout-slider-settings').hide();

    $('#lwip-side-menu-layout-slider').click(function () {
        $('#lwip-layouts-types').hide();
        $('#lwip-layout-slider-settings').show();
        $("#lwip-layout-header-span").hide();
    });

    $('#lwip-side-menu-slider-back-btn').on('click', function () {
        $('#lwip-layouts-types').show();
        $('#lwip-layout-slider-settings').hide();
        $("#lwip-layout-header-span").show();
    });

    $('#lwip-slider-animation-counter').on('input', function () {
        var value = $(this).val();
        $('.rangenumber').text(value);
    });

    var numberInput = $('#lwip-slider-animation-counter');

    var rangeInput = $('#lwip-slider-range-controller');

    numberInput.on('input', function () {
        const value = $(this).val();
        rangeInput.val(value);
        updateSliderBackground(rangeInput);
    });

    rangeInput.on('input', function () {
        const value = $(this).val();
        numberInput.val(value);
        updateSliderBackground($(this));
    });

    setTimeout(function () {
        updateSliderBackground(rangeInput);
    }, 2000);

    $('#lwip-side-menu-feed-title-container').hide();

    $('#lwip-side-menu-layout-feed-title').click(function () {
        $('#lwip-layouts-types').hide();
        $('#lwip-side-menu-feed-title-container').show();
        $("#lwip-layout-header-span").hide();
    });

    $('#lwip-feed-title-back-btn').on('click', function () {
        $('#lwip-layouts-types').show();
        $('#lwip-side-menu-feed-title-container').hide();
        $("#lwip-layout-header-span").show();
    });

    $('.lwip-label-icon-title').not('#lwip-connect-action-source').hide();

    $('.lwip-side-menu-icons').click(function (e) {
        e.preventDefault();
        var targetId = $(this).data('target');
        $('.lwip-label-icon-title').hide();
        $(targetId).show();
    });

    $('#lwip-post-style-container').hide();

    $('#lwip-side-menu-post-style').on('click', function () {
        $('#lwip-side-menu-post-container').hide();
        $('#lwip-post-style-container').show();
        $('#lwip-post-container').hide();
    });

    $('#lwip-post-style-back-btn').on('click', function () {
        $('#lwip-post-style-container').hide();
        $('#lwip-side-menu-post-container').show();
        $('#lwip-post-container').show();
    });

    $('#lwip-insta-post-simple-elements').hide();
    $('#lwip-side-menu-simple-image').hide();
    $('#lwip-post-style-hover-btn').click(function () {
        if (isLifetimeDeal === true) {
            $('#lwip-insta-post-hover-elements').show();
            $('#lwip-side-menu-hover-image').show();
            $('#lwip-side-menu-simple-image').hide();
            $('#lwip-insta-post-simple-elements').hide();
            $('#lwip-insta-post-user-container,#lwip-insta-post-date-container,#lwip-insta-post-insta-link-container,#lwip-insta-post-share-container').hide();
            $('#lwip-post-style-hover-btn').addClass('clicked');
            $('#lwip-post-style-simple-btn').removeClass('clicked');
            $('#lwip-post-style-hover-btn').addClass('hover-color');
            $('#lwip-post-style-simple-btn').removeClass('hover-color');
        } else if (typeof isLifetimeDeal === 'undefined') {

        } else {
            dynamicPremiumPopupMessage('Show post with hover effect');
        }
    });

    $('#lwip-post-style-simple-btn').click(function () {
        $('#lwip-insta-post-hover-elements').hide();
        $('#lwip-insta-post-simple-elements').show();
        $('#lwip-side-menu-simple-image').show();
        $('#lwip-side-menu-hover-image').hide();
        $('.lwip-insta-post-card-header-elements').show();
        $('#lwip-insta-post-user-container,#lwip-insta-post-date-container,#lwip-insta-post-insta-link-container,#lwip-insta-post-share-container').show();
        $('#lwip-post-style-simple-btn').addClass('clicked');
        $('#lwip-post-style-hover-btn').removeClass('clicked');
        $('#lwip-post-style-simple-btn').addClass('hover-color');
        $('#lwip-post-style-hover-btn').removeClass('hover-color');
    });

    $('#lwip-post-style-hover-btn').click(function () {
        if (isLifetimeDeal === true) {
            $('.lwip-hover-btn').removeClass('hover-color');
            $(this).addClass('hover-color');
        }
    });

    $('#lwip-post-style-simple-btn').click(function () {
        $('.lwip-hover-btn').removeClass('hover-color');
        $(this).addClass('hover-color');
    });

    $('#lwip-popup-setting-container').hide();

    $('#lwip-side-menu-post-popup-settings-btn').click(function () {
        if (isLifetimeDeal === true) {
            $('#lwip-popup-setting-container').show();
            $('#lwip-side-menu-post-container').hide();
            $('#lwip-post-container').hide();
        } else if (typeof isLifetimeDeal === 'undefined') { } else {
            dynamicPremiumPopupMessage('Show posts in scrollable popup with reels and multiple slides/images.')

        }
    });

    $('#lwip-popup-setting-back-btn').click(function () {
        $('#lwip-popup-setting-container').hide();
        $('#lwip-side-menu-post-container').show();
        $('#lwip-post-container').show();
    });

    $('#lwip-side-menu-call-to-action-main-container').hide();
    $('#lwip-call-to-action-btn-container').hide();
    $('#lwip-side-menu-post-call-to-action-btn').click(function () {
        $('#lwip-side-menu-call-to-action-main-container').show();
        $('#lwip-calltoaction-add-btn').show();
        $('#lwip-side-menu-post-container').hide();
        $('#lwip-call-to-action-btn-container').hide();
        $('#lwip-post-container').hide();
    });

    $("#lwip-side-menu-post-custom-css-container").hide();
    $('#lwip-custom-post-css').click(function () {
        if (isLifetimeDeal === true) {
            $('#lwip-side-menu-post-container').hide();
            $('#lwip-call-to-action-btn-container').hide();
            $('#lwip-post-container').hide();
            $("#lwip-side-menu-post-custom-css-container").show();
        } else if (typeof isLifetimeDeal === 'undefined') { } else {
            dynamicPremiumPopupMessage('Enhance your posts with Custom CSS styling for a personalized look and feel.')
        }
    });

    $("#lwip-post-custom-css-back-btn").on('click', function () {
        $('#lwip-side-menu-post-custom-css-container').hide();
        $('#lwip-side-menu-post-container').show();
        $('#lwip-post-container').show();
    });

    $('#lwip-call-to-action-cancel-btn').click(function () {
        $('#lwip-calltoaction-add-btn').show();
        $('#lwip-side-menu-call-to-action-main-container').show();
        $('#lwip-call-to-action-btn-container').hide();
        $('#lwip-insta-post-url-err-message').text('');
        $('#lwip-insta-bussiness-url-err-message').text('');
        $('#lwip-insta-button-label-err-message').text('');
        $('#lwip-cta-insta-post-url').val('');
        $('#lwip-cta-insta-post-btn-label').val('');
        $('#lwip-cta-insta-post-redirect-btn-url').val('');
    });

    $('#lwip-call-to-action-back-btn').click(function () {
        $('#lwip-calltoaction-add-btn').hide();
        $('#lwip-side-menu-call-to-action-main-container').hide();
        $('#lwip-side-menu-post-container').show();
        $('#lwip-post-container').show();

    });

    $('#lwip-call-to-action-new-value-add-btn').click(function () {
        $('#lwip-call-to-action-btn-container').show();
        $('#lwip-side-menu-call-to-action-main-container').hide();
    });

    $('.lwip-slider-view-cls').click(function () {
        $('.lwip-svg-img-fill', this).css('fill', '#27c4cf');
        $('span', this).css('color', '#27c4cf');
        $('.lwip-grid-view-cls .lwip-svg-img-fill').css('fill', '');
        $('.lwip-grid-view-cls span').css('color', '');
        $('.lwip-masonry-view-cls .lwip-svg-img-fill').css('fill', '');
        $('.lwip-masonry-view-cls span').css('color', '');
    });

    $('.lwip-grid-view-cls').click(function () {
        $('.lwip-svg-img-fill', this).css('fill', '#27c4cf');
        $('span', this).css('color', '#27c4cf');
        $('.lwip-slider-view-cls .lwip-svg-img-fill').css('fill', '');
        $('.lwip-slider-view-cls span').css('color', '');
        $('.lwip-masonry-view-cls .lwip-svg-img-fill').css('fill', '');
        $('.lwip-masonry-view-cls span').css('color', '');
    });

    $('.lwip-masonry-view-cls').click(function () {
        if (isLifetimeDeal === true) {
            $('.lwip-svg-img-fill', this).css('fill', '#27c4cf');
            $('span', this).css('color', '#27c4cf');
            $('.lwip-slider-view-cls .lwip-svg-img-fill').css('fill', '');
            $('.lwip-slider-view-cls span').css('color', '');
            $('.lwip-grid-view-cls .lwip-svg-img-fill').css('fill', '');
            $('.lwip-grid-view-cls span').css('color', '');
        }
    });

    $('#lwip-side-menu-header-elements-container').hide();
    $('#lwip-side-menu-column-row-container').hide();
    $('#lwip-column-row-container').hide();

    $('.lwip-slider-view-cls').click(function () {
        $('#lwip-side-menu-layout-slider').show();
        $('#lwip-slider-bottons-container').show();
    });

    $('.lwip-grid-view-cls').click(function () {
        $('#lwip-slider-bottons-container').show();
        $('#lwip-side-menu-layout-slider').hide();
    });

    //Default icon selection
    var targetIcon = document.getElementById('source-id-default');
    if (targetIcon) {
        toggleIconColor(targetIcon);
    }

    // This function handle updates in layout
    function createOrUpdateLayout(styleType, autoormenual) {
        var type = styleType ? styleType.toString() : '';
        var mode = autoormenual ? autoormenual.toString() : '';
        var headerSwitch = $("#lwip-main-header-elemets-switch").prop("checked");
        var profilePictureChecked = $("#lwip-main-header-profile-pic-checkbox").prop("checked");
        var fullNameChecked = $("#lwip-main-header-user-fullname-checkbox").prop("checked");
        var userNameChecked = $("#lwip-main-header-username-checkbox").prop("checked");
        var verifiedBadgeChecked = $("#lwip-main-header-verify-badge-checkbox").prop("checked");
        var postCountChecked = $("#lwip-main-header-post-count-checkbox").prop("checked");
        var followerCountChecked = $("#lwip-main-header-followers-count-checkbox").prop("checked");
        var followingCountChecked = $("#lwip-main-header-following-count-checkbox").prop("checked");
        var followButtonChecked = $("#lwip-main-header-follow-btn-checkbox").prop("checked");
        var rowValue = $('#lwip-manuall-row-counter').val();
        var columnValue = $('#lwip-manuall-column-counter').val();
        columnValueGlobal = columnValue;
        var MGcounter = $('#lwip-manuall-gap-counter').val();
        var widthcounter = $('#lwip-width-counter').val().toString();
        var Arrowcontrol = $("#lwip-slider-arrow-control-btn").prop("checked");
        var Dragcontrol = $("#lwip-slider-drag-controll").prop("checked");
        var range1 = $('#lwip-slider-animation-counter').val();
        var autoplay = $('#lwip-slider-auto-play-counter').val();
        var feedTitleValue = $('#lwip-feed-title').val().toString();
        var authToken = getAccessToken();
        var widgetId = getWidgetId();

        if (!authToken || !widgetId) {
            return;
        }

        var sliderSettings = {
            arrowControl: Arrowcontrol,
            dragControl: Dragcontrol,
            animationSpeed: parseFloat(range1),
            autoPlay: parseInt(autoplay)
        };

        var columnsAndRows = {
            mode: autoormenual,
            config: {
                columns: parseInt(columnValue),
                rows: parseInt(rowValue),
                gap: parseInt(MGcounter),
                width: widthcounter
            }
        };

        var feedTitle = feedTitleValue;

        var headers = {
            showHeaders: headerSwitch,
            config: {
                profilePicture: profilePictureChecked,
                fullName: fullNameChecked,
                userName: userNameChecked,
                verifiedBadge: verifiedBadgeChecked,
                postsCount: postCountChecked,
                followersCount: followerCountChecked,
                followingCount: followingCountChecked,
                followButton: followButtonChecked
            }
        };

        var mutation = "mutation CreateOrUpdateLayout($data: CreateOrUpdateLayout!) { createOrUpdateLayout(data: $data) { type sliderSettings { arrowControl dragControl animationSpeed autoPlay } columnsAndRows { mode config { columns rows gap width } } feedTitle headers { showHeaders config { profilePicture fullName userName verifiedBadge postsCount followersCount followingCount followButton } } } }";

        var variables = {
            data: {
                widgetId: widgetId,
                type: type,
                sliderSettings: sliderSettings,
                columnsAndRows: columnsAndRows,
                feedTitle: feedTitle,
                headers: headers
            }
        };

        var postData = {
            query: mutation,
            variables: variables
        };

        $.ajax({
            type: 'POST',
            url: lwip_connect.graphqlEndpoint,
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            data: JSON.stringify(postData),
            success: function (response) {
                var data = response;
                if (data.data && data.data.createOrUpdateLayout) {
                    var layoutData = data.data.createOrUpdateLayout;
                    gapValueGlobal = layoutData.columnsAndRows.config.gap;
                }
            },
            error: function (xhr, status, error) {
                // Handle error
            }
        });
        $("#lwip-publish-account-btn").removeClass('lwip-disable-publish-button');
    }

    var autoormenual = "AUTO";

    $('#lwip-slider-view-btn, #lwip-grid-view-btn').click(function () {
        styleType = $(this).data('slider');
        createOrUpdateLayout(styleType, autoormenual);
    });

    $('#lwip-masonry-view-btn').click(function () {
        if (isLifetimeDeal === true) {
            styleType = $(this).data('slider');
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $(' #lwip-manuall-row-counter').on('change', function () {
        if (minMaxRow()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $(' #lwip-manuall-gap-counter').on('change', function () {
        createOrUpdateLayout(styleType, autoormenual);

    });

    $('#lwip-manuall-column-counter').on('change', function () {
        if (minMaxColumn()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $('#lwip-manuall-row-counter').on('click', function () {
        if (minMaxRowclick()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $('#lwip-manuall-gap-counter').on('click', function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $('#lwip-manuall-column-counter').on('click', function () {
        if (minMaxColumnclick()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $('#lwip-manuall-column-counter').on('input', function () {
        if (minMaxColumn()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $('#lwip-manuall-row-counter').on('input', function () {
        if (minMaxRow()) {
            createOrUpdateLayout(styleType, autoormenual);
        }
    });

    $('#lwip-manuall-gap-counter').on('input', function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $('#lwip-side-menu-auto-btn, #lwip-side-menu-manuall-btn').click(function () {
        autoormenual = $(this).data('auto');
        createOrUpdateLayout(styleType, autoormenual);
    });

    $("#lwip-main-header-elemets-switch, #lwip-main-header-profile-pic-checkbox, #lwip-main-header-user-fullname-checkbox, #lwip-main-header-username-checkbox, #lwip-main-header-verify-badge-checkbox, #lwip-main-header-post-count-checkbox, #lwip-main-header-followers-count-checkbox, #lwip-main-header-following-count-checkbox, #lwip-main-header-follow-btn-checkbox").change(function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $('#lwip-feed-title').on('input', function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $('#lwip-width-counter').on('input', function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $("#lwip-slider-arrow-control-btn, #lwip-slider-drag-controll, #lwip-slider-range-controller, #lwip-slider-auto-play-counter,#lwip-slider-animation-counter").change(function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    $("#lwip-slider-range-controller").on("input", function () {
        const tempSliderValue = $(this).val();

        $('#lwip-slider-animation-counter').val(tempSliderValue);

        $('.value').text(tempSliderValue);

        const max = parseInt($(this).attr('max'));
        const progress = (tempSliderValue / max) * 100;

        $(this).css('background', `linear-gradient(to right, #a4f5f2 ${progress}%, #ccc ${progress}%)`);

    });

    $("#lwip-slider-animation-counter,#lwip-slider-auto-play-counter").on('input', function () {
        createOrUpdateLayout(styleType, autoormenual);
    });

    //Filter button

    let currentShowFilters = [];
    let currentHideFilters = [];
    let currentTotalPost = null;
    $("#lwip-side-menu-filters-container").hide();
    $("#lwip-add-new-show-filter-btn").show();
    $("#lwip-add-new-filter-show-container").hide();
    $("#lwip-add-new-filter-hide-container").hide();
    $("#lwip-side-menu-main-filter-btn").on('click', function () {
        $("#lwip-connnect-account-frm").hide();
        $("#lwip-side-menu-filters-container").show();
        $("#lwip-side-menu-main-filter-btn").hide();
        $("#lwip-add-new-filter-show-container").hide();
        $("#lwip-add-new-filter-hide-container").hide();
    });

    $("#lwip-filters-back-btn").on('click', function () {
        $("#lwip-connnect-account-frm").show();
        $("#lwip-side-menu-filters-container").hide();
        $("#lwip-side-menu-main-filter-btn").show();
    });

    $("#lwip-add-new-show-filter-btn").on('click', function () {
        if (isLifetimeDeal === true) {
            $("#lwip-side-menu-filters-container").hide();
            $("#lwip-add-new-filter-show-container").show();
        } else if (typeof isLifetimeDeal === 'undefined') { } else {
            dynamicPremiumPopupMessage('Show post containing specific words or mentions.');
        }
    });

    $("#lwip-add-new-hide-filter-btn").on('click', function () {
        if (isLifetimeDeal === true) {
            $("#lwip-side-menu-filters-container").hide();
            $("#lwip-add-new-filter-hide-container").show();
        } else if (typeof isLifetimeDeal === 'undefined') { } else {
            dynamicPremiumPopupMessage('Hide post containing specific words or mentions.');
        }
    });

    $("#lwip-back-show-filter").on('click', function () {
        $("#lwip-add-new-filter-show-container").hide();
        $("#lwip-side-menu-filters-container").show();
        $('#lwip-add-new-show-filter-btn-err-message').text('');
    });

    $("#lwip-back-hide-filter").on('click', function () {
        $("#lwip-add-new-filter-hide-container").hide();
        $("#lwip-side-menu-filters-container").show();
        $('#lwip-add-new-hide-filter-btn-err-message').text('');
    });

    //Handle Update in existing filter
    function updateFilters({ showFilterValue = null, hideFilterValue = null, totalNumberOfPost = null }) {

        const widgetId = getWidgetId();
        const accessToken = getAccessToken();

        if (!accessToken || !widgetId) {
            return;
        }

        const requestData = {
            query: `
            mutation CreateOrUpdateFilters($data: CreateOrUpdateFiltersInput!) {
                createOrUpdateFilters(data: $data) {
                    show
                    hide
                    totalNumberOfPost
                }
            }`,
            variables: {
                data: {
                    widgetId: widgetId,
                    filters: {
                        show: showFilterValue ? currentShowFilters.concat([showFilterValue]) : currentShowFilters,
                        hide: hideFilterValue ? currentHideFilters.concat([hideFilterValue]) : currentHideFilters,
                        totalNumberOfPost: totalNumberOfPost !== null ? parseInt(totalNumberOfPost, 10) : currentTotalPost
                    }
                }
            }
        };

        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify(requestData),
            success: function (response) {
                jQuery("#lwip-publish-account-btn").removeClass('lwip-disable-publish-button');
                fetchFilterData();
                if (selectedAccountType === "PERSONAL") {
                    personalAccountData(sourceIdGlobal);
                } else if (selectedAccountType === "BUSINESS") {
                    businessAccountData(sourceIdGlobal);
                } else {
                    defaultMediaData();
                }
            },
            error: function (error) {
                //Handle error
            }
        });
    }

    //Handle create new filter
    function createFilterLabel(value, type) {
        const label = $(`<div class="lwip-filter-label">${value} <button class="delete-filter" data-type="${type}" data-value="${value}"><svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>   </button></div>`);
        label.find(".delete-filter").on("click", function () {
            const valueToDelete = $(this).data("value");
            const type = $(this).data("type");
            if (type === 'show') {
                currentShowFilters = currentShowFilters.filter(v => v !== valueToDelete);
                updateFilters({ showFilterValue: null });
            } else if (type === 'hide') {
                currentHideFilters = currentHideFilters.filter(v => v !== valueToDelete);
                updateFilters({ hideFilterValue: null });
            }
        });
        return label;
    }

    //Update UI and diaplay created filters
    function updateFilterDisplay() {

        $("#lwip-show-post-list").empty().show();
        $("#lwip-hide-post-list").empty().show();
        currentShowFilters.forEach(value => {
            $("#lwip-show-post-list").append(createFilterLabel(value, 'show'));
        });
        currentHideFilters.forEach(value => {
            $("#lwip-hide-post-list").append(createFilterLabel(value, 'hide'));
        });
        $("#lwip-filter-total-number-posts").val(currentTotalPost);
    }

    $("#lwip-save-show-filter").on('click', function () {
        const showFilterValue = $("#lwip-add-new-show-filter-val").val();
        if (showFilterValue) {
            updateFilters({ showFilterValue });
            $("#lwip-add-new-filter-show-container").hide();
            $("#lwip-side-menu-filters-container").show();
            $("#lwip-add-new-show-filter-val").val('');
        } else {
            $('#lwip-add-new-show-filter-btn-err-message').text("'show' is required");
            $('#lwip-add-new-show-filter-btn-err-message').addClass('lwip-show-msg');
            $('#lwip-add-new-show-filter-btn-err-message').removeClass('lwip-error-message-filter');
        }
    });

    $("#lwip-save-hide-filter").on('click', function () {
        const hideFilterValue = $("#lwip-add-new-hide-filter-val").val();
        if (hideFilterValue) {
            updateFilters({ hideFilterValue });
            $("#lwip-add-new-filter-hide-container").hide();
            $("#lwip-side-menu-filters-container").show();
            $("#lwip-add-new-hide-filter-val").val('');
        } else {
            $('#lwip-add-new-hide-filter-btn-err-message').text("'hide' is required");
            $('#lwip-add-new-hide-filter-btn-err-message').addClass('lwip-show-msg');
            $('#lwip-add-new-hide-filter-btn-err-message').removeClass('lwip-error-message-filter');
        }
    });

    $("#lwip-filter-total-number-posts").on('input', function () {
        const totalNumberOfPost = $(this).val();
        updateFilters({ totalNumberOfPost: totalNumberOfPost !== '' ? totalNumberOfPost : null });
    });

    //get filter default values from server
    function fetchFilterData() {
        const widgetId = getWidgetId();
        var accessToken = getAccessToken();

        if (!accessToken || !widgetId) {
            return;
        }

        const query = `
        query GetWidget($widgetId: ID!) {
            getWidget(widgetId: $widgetId) {
              filters {
                show
                hide
                totalNumberOfPost
              }
                selectedSourceType
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
                    showMessage(data.errors[0].message, 'error');
                } else {
                    const filters = data.data.getWidget.filters;
                    if (filters) {
                        currentShowFilters = filters.show;
                        currentHideFilters = filters.hide;
                        currentTotalPost = filters.totalNumberOfPost;
                        updateFilterDisplay();
                    } else {
                        // handle error
                    }
                }
            })
            .catch(/*Handle error*/);
    }
    fetchFilterData();

    $('input[name="account"]').on('change', function () {
        if ($(this).val() === 'PERSONAL') {
            $('#lwip-instagram-personal-account-container').show();
            $('#lwip-instagram-personal-fb-account-container').hide();
        } else if ($(this).val() === 'BUSINESS') {
            $('#lwip-instagram-personal-account-container').hide();
            $('#lwip-instagram-personal-fb-account-container').show();
        }
    });

    if ($('input[name="account"]:checked').val() === 'PERSONAL') {
        $('#lwip-instagram-personal-account-container').show();
        $('#lwip-instagram-personal-fb-account-container').hide();
    } else if ($('input[name="account"]:checked').val() === 'BUSINESS') {
        $('#lwip-instagram-personal-account-container').hide();
        $('#lwip-instagram-personal-fb-account-container').show();
    }

    $('#lwip-premium-purchase-popup').on('click', function () {
        $('.lwip-ant-modal-content-primium').fadeIn();
        $('#lwip-main-div').addClass('lwip-opacity-0-5');
        $('.lwip-content').css('background-color', '#100f0f');
    });

    $('#lwip-close-premium-purchase-popup').on('click', function () {
        $('.lwip-ant-modal-content-primium').fadeOut();
        $('#lwip-main-div').removeClass('lwip-opacity-0-5');
        $('.lwip-content').css('background-color', '');

    });

});

//Handle side menu options
function toggleIconColor(icon) {
    var icons = document.getElementsByClassName('lwip-side-menu-icons');
    for (var i = 0; i < icons.length; i++) {
        icons[i].style.backgroundColor = '';
        icons[i].style.color = '';
        icons[i].style.borderRadius = '';
    }
    icon.style.backgroundColor = 'white';
    icon.style.color = '#27c4cf';
    icon.style.borderRadius = '10px';
}

//Rename Widget
document.addEventListener('DOMContentLoaded', function () {
    const openButton = document.getElementById('lwip-edit-widget-name-btn');
    const closeButton = document.querySelector('.lwip-full-width-popup-button');
    const modal = document.getElementById('lwip-open-rename-widget-popup');
    const main = document.querySelector('.lwip-main');

    //check null
    if (modal !== null) {
        modal.style.display = 'none';
    }

    //Handle open modal event
    if (openButton) {
        openButton.addEventListener('click', function () {
            setTimeout(function () {
                modal.style.display = 'block';
                main.classList.add('lwip-opacity-0-5');
            }, 1000);

            setTimeout(function () {
                modal.style.animation = '';
            }, 1500);
        });
    }

    //Handle close modal event
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            modal.style.animation = 'topToCenter 0.5s ease reverse';
            setTimeout(function () {
                modal.style.display = 'none';
                main.classList.remove('lwip-opacity-0-5');
                modal.style.animation = '';
            }, 500);
        });
    }

    // Define the closeWidgetNamePopup function within the DOMContentLoaded event listener
    function closeWidgetNamePopup() {
        modal.style.animation = 'topToCenter 0.5s ease reverse';
        setTimeout(function () {
            modal.style.display = 'none';
            main.classList.remove('lwip-opacity-0-5');
            modal.style.animation = '';
        }, 500);
    }

    jQuery(document).ready(function ($) {
        var $renameErrorMessage = $('#rename-widget-error-message');
        var $saveButton = $('#lwip-rename-widget-save-btn');
        var widgetName = $('#lwip-currenct-widget-name').text().trim();

        // Function to check if widget name is valid
        function isValidWidgetName(name) {
            var pattern = /^[a-zA-Z0-9\s]*$/;
            return pattern.test(name);
        }

        // Function to check if widget name is valid
        function isValidWidgetName(name) {
            var pattern = /^[a-zA-Z0-9\s]*$/;
            return pattern.test(name);
        }

        // Function to update button state based on input value
        function updateButtonState() {
            var inputValue = $('.custom-search-input').val().trim();

            // Check if input is empty
            if (inputValue === '') {
                $renameErrorMessage.text('Please enter widget name.');
                $saveButton.prop('disabled', true);
                $saveButton.addClass('disabled');
                return;
            }

            // Check if input contains special characters
            if (!isValidWidgetName(inputValue)) {
                $renameErrorMessage.text('Widget name cannot contain special characters!');
                $saveButton.prop('disabled', true);
                $saveButton.addClass('disabled');
                return;
            }

            // If all checks pass, clear error message and enable save button
            $renameErrorMessage.text('');
            $saveButton.prop('disabled', false);
            $saveButton.removeClass('disabled');
        }

        // Bind keyup event to input field
        $('.custom-search-input').on('keyup', function () {
            updateButtonState();
        });

        //Handle rename widget form submission
        $('#lwip-rename-widget-name-frm').submit(function (event) {
            event.preventDefault();

            const feedID = getWidgetId();
            const accessToken = getAccessToken();

            if (!accessToken || !feedID) {
                return;
            }

            var newName = $('.custom-search-input').val().trim();

            // Construct GraphQL mutation for login
            var mutation = `
           mutation UpdateWidget($where: WidgetWhereUniqueInput!, $data: UpdateWidgetInput) {
                updateWidget(where: $where, data: $data) {
                    message
                    data {
                    name
                    language
                    }
                }
            }
         `;

            // Prepare variables for the GraphQL mutation
            var variables = {
                "where": {
                    "id": feedID
                },
                "data": {
                    "name": newName,
                    "language": selectedLanguageGlobal
                }
            };

            // Construct the GraphQL request body
            var postData = {
                'query': mutation,
                'variables': variables
            };

            $.ajax({
                url: lwip_connect.graphqlEndpoint,
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: JSON.stringify(postData),
                success: function (response) {

                    if (response.errors) {
                        // Handle errors if any
                        var errorMessage = response.errors[0].message;
                        $('#rename-widget-error-message').text(errorMessage);
                    } else {
                        var updatedWidgetName = response.data.updateWidget.data.name;
                        $('#lwip-currenct-widget-name').text(updatedWidgetName);
                        $('#lwip-widget-input-name').val(updatedWidgetName);
                        showMessage('Widget updated successfully!', 'success');
                        closeWidgetNamePopup();

                        // Clear any previous error messages
                        $('#rename-widget-error-message').text('');
                    }
                },
                error: function (error) {
                    showMessage('Failed to update name.', 'error');
                }
            });
        });

        $('#lwip-rename-widget-cancel-btn').on('click', function () {
            $renameErrorMessage.text('');
            const currentWidgetName = $('#lwip-currenct-widget-name').text();
            $("#lwip-widget-input-name").val(currentWidgetName);
        });

    });
});

/* Mobile View Handler
 *This code manages the transition between mobile and desktop views.
 *It listens for changes in the viewport size and applies appropriate styles or functionality
 *based on whether the view is mobile or desktop .
 */

// Mobile View
let setView = 'DesktopView';

document.getElementById('lwip-desktop-view').style.display = 'none';
document.getElementById('lwip-desktop-view').addEventListener('click', function () {
    // Show the mobile view button and hide the desktop view button
    document.getElementById('lwip-desktop-view').style.display = 'none';
    document.getElementById('lwip-mobile-view').style.display = 'block';
    const modalUnique = document.querySelector('.lwip-modal-unique');
    const containerssElement = document.getElementById('lwip-main-container-cls');
    const contentElement = document.getElementById('lwip-main-content');
    const postWrapperSlider = document.querySelector('.lwip-post-wrapper-slider');
    const postWrapper = document.querySelector('.lwip-post-wrapper');
    postWrapper.style.height = '75vh';
    postWrapper.style.display = 'grid';
    postWrapper.style.flexDirection = '';
    containerssElement.classList.remove('lwip-mobile-containers');
    containerssElement.classList.add('lwip-top-container');
    contentElement.classList.remove('lwip-lwip-mobile-button');
    contentElement.classList.add('content');
    document.querySelector('.lwip-post-wrapper').style.padding = '0px 10px';
    postWrapperSlider.style.overflowX = 'auto';
    postWrapperSlider.style.overflowY = 'auto';
    const headerFooterWrappers = document.querySelectorAll('.lwip-header-wrapper, .lwip-footer-wrapper');

    headerFooterWrappers.forEach(wrapper => {
        wrapper.style.padding = '';
        wrapper.style.flexDirection = '';
        wrapper.style.gap = '';
    });
    if (popupDisplay === 'POPUP') {
        if (modalUnique) {
            modalUnique.style.top = '50%';
            modalUnique.style.left = '50%';
            modalUnique.style.marginLeft = '0px';
            modalUnique.style.width = '80%';

        }
    }
    if (styleType === 'GRID') {
        postWrapper.style.display = 'grid';
    } else {
        postWrapper.style.display = 'none';
    }
    jQuery(document).ready(function ($) {
        var slidesToShowValue = parseInt($('#lwip-manuall-column-counter').val());
        var rowsValue = parseInt($('#lwip-manuall-row-counter').val());
        var draggableValue = $('#lwip-slider-drag-controll').prop('checked');
        var animation = parseInt($('#lwip-slider-animation-counter').val());
        var animationValue = animation > 0 ? animation * 1000 : 2000;

        var autoplayValue = parseInt($('#lwip-slider-auto-play-counter').val());
        var autoplaySpeedValue = autoplayValue * 1000;

        $('.list').slick('unslick');
        $('.list').slick({
            infinite: true,
            slidesToShow: slidesToShowValue,
            slidesToScroll: slidesToShowValue,
            rows: rowsValue,
            speed: animationValue,
            draggable: draggableValue,
            autoplay: autoplayValue > 0,
            autoplaySpeed: autoplaySpeedValue
        });
    });
    setView = 'DesktopView';
    initializeSlick();
});
document.getElementById('lwip-mobile-view').addEventListener('click', function () {
    document.getElementById('lwip-mobile-view').style.display = 'none';
    document.getElementById('lwip-desktop-view').style.display = 'block';
    const modalUnique = document.querySelector('.lwip-modal-unique');
    const containerssElement = document.getElementById('lwip-main-container-cls');
    const contentElement = document.getElementById('lwip-main-content');
    const postWrapperSlider = document.querySelector('.lwip-post-wrapper-slider');
    const postWrapper = document.querySelector('.lwip-post-wrapper');
    const headerFooterWrappers = document.querySelectorAll('.lwip-header-wrapper, .lwip-footer-wrapper');
    postWrapper.style.height = 'auto';


    containerssElement.classList.remove('lwip-top-container');
    containerssElement.classList.add('lwip-mobile-containers');
    contentElement.classList.add('lwip-lwip-mobile-button');
    contentElement.classList.remove('content');
    document.querySelector('.lwip-post-wrapper').style.padding = '0';
    postWrapperSlider.style.overflowX = 'unset';
    postWrapperSlider.style.overflowY = 'unset';
    headerFooterWrappers.forEach(wrapper => {
        wrapper.style.padding = '10px';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '10px';
    });
    if (popupDisplay === 'POPUP') {
        if (modalUnique) {
            modalUnique.style.top = '44%';
            modalUnique.style.left = '0%';
            modalUnique.style.marginLeft = '-16px';
            modalUnique.style.width = '100%';
        }
    }

    if (setView === 'DesktopView' && styleType === "GRID") {
        postWrapper.style.display = 'grid';
        postWrapper.style.display = 'flex';
        postWrapper.style.flexDirection = 'column';

    } else {
        postWrapper.style.display = 'none';
    }

    jQuery(document).ready(function ($) {

        var slidesToShowValue = parseInt($('#lwip-manuall-column-counter').val());
        var rowsValue = parseInt($('#lwip-manuall-row-counter').val());
        var multiplyRowandcolumn = slidesToShowValue * rowsValue;
        var draggableValue = $('#lwip-slider-drag-controll').prop('checked');
        var animation = parseInt($('#lwip-slider-animation-counter').val());
        var animationValue = animation > 0 ? animation * 1000 : 2000;
        var autoplayValue = parseInt($('#autopllwip-slider-auto-play-counteraycounter').val());
        var autoplaySpeedValue = autoplayValue * 1000;

        $('.list').slick('unslick');
        $('.list').slick({
            infinite: true,
            rows: multiplyRowandcolumn,
            speed: animationValue,
            draggable: draggableValue,
            autoplay: autoplayValue > 0,
            autoplaySpeed: autoplaySpeedValue
        });
    });
    setView = 'MobileView';
    initializeSlick();
});
document.getElementById('lwip-slider-view-btn').addEventListener('click', function () {
    const sliderValue = this.getAttribute('data-slider');

    if (setView === 'MobileView') {
        postWrapperSlider.style.overflowX = 'unset';
        postWrapperSlider.style.overflowY = 'unset';

    }
});
document.getElementById('lwip-grid-view-btn').addEventListener('click', function () {
    const sliderValue = this.getAttribute('data-slider');
    const postWrapper = document.querySelector('.lwip-post-wrapper');
    if (setView === 'MobileView') {
        postWrapper.style.display = 'flex';
        postWrapper.style.flexDirection = 'column';
    }
    if (setView === 'DesktopView') {
        postWrapper.style.display = 'grid';
    }
});
// Mobile View end

// Handle valid input for minium and maxium row number on click
function minMaxRowclick() {
    var mrValue = document.getElementById('lwip-manuall-row-counter').value.trim(); // Get the trimmed value

    // Check if mrValue is a valid number
    if (!mrValue || isNaN(mrValue)) {
        showMessage('Please enter a valid number for rows. ', 'warning');
        document.getElementById('lwip-manuall-row-counter').value = '';
        return false; // Return false if input is invalid
    }

    mrValue = parseInt(mrValue);

    if (mrValue >= 5) {
        showMessage('Max rows reached. ', 'warning');
        return false;
    } else if (mrValue <= 1) {
        showMessage('Rows cannot be less than 1. ', 'warning');
        return false;
    }

    return true;
}

// Handle valid input for minium and maxium row number 
function minMaxRow() {
    var mrValue = document.getElementById('lwip-manuall-row-counter').value.trim();

    // Check if mrValue is a valid number
    if (!mrValue || isNaN(mrValue)) {
        showMessage('Please enter a valid number for rows. ', 'warning');
        document.getElementById('lwip-manuall-row-counter').value = '';
        return false;
    }

    mrValue = parseInt(mrValue);

    if (mrValue > 5) {
        showMessage('Max rows reached. ', 'warning');
        return false;
    } else if (mrValue < 1) {
        showMessage('Rows cannot be less than 1. ', 'warning');
        return false;
    }

    return true;
}

// Handle valid input for minium and maxium column number 
function minMaxColumn() {
    var mcValue = document.getElementById('lwip-manuall-column-counter').value.trim();

    // Check if mcValue is a valid number
    if (!mcValue || isNaN(mcValue)) {
        showMessage('Please enter a valid number for columns. ', 'warning');
        document.getElementById('lwip-manuall-column-counter').value = '';
        return false;
    }

    mcValue = parseInt(mcValue);

    if (mcValue > 10) {
        showMessage('Max columns reached. ', 'warning');
        return false;
    } else if (mcValue < 1) {
        showMessage('Columns cannot be less than 1. ', 'warning');
        return false;
    }

    return true;
}

// Handle valid input for minium and maxium row number click
function minMaxColumnclick() {
    var mcValue = document.getElementById('lwip-manuall-column-counter').value.trim();

    // Check if mcValue is a valid number
    if (!mcValue || isNaN(mcValue)) {
        showMessage('Please enter a valid number for columns. ', 'warning');
        document.getElementById('lwip-manuall-column-counter').value = '';
        return false;
    }

    mcValue = parseInt(mcValue);

    if (mcValue >= 10) {
        showMessage('Max columns reached. ', 'warning');
        return false;
    } else if (mcValue <= 1) {
        showMessage('Columns cannot be less than 1. ', 'warning');
        return false;
    }

    return true;
}