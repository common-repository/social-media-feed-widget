<?php

/**
 * Renders the full view of the page for the main functionality.
 *
 * This function outputs the complete HTML and PHP code required for the main 
 * feature on the page. It includes the layout, structure, and any inline PHP 
 * code necessary to generate dynamic content and interact with the backend. 
 * The main view typically involves the display of images, controls, and 
 * additional user interface elements for navigating through the main content.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

function lwip_widget_builder()
{
    // Define the path for images and icons
    $image_url = LWIP_PLUGIN_PATH . 'admin/images/instalogo.png';
    $logo_url = LWIP_PLUGIN_PATH . 'admin/images/logo.png';
    $premium_svg_url = LWIP_PLUGIN_PATH . 'admin/images/svg.jpg';

    global $wpdb;

    //get user detail transient
    $user_email = get_transient('lwip_user_details');

    /**
     * Coding Standard Ignore because of custom tables
     */
    // @codingStandardsIgnoreStart;
    if (!empty($user_email)) {
        $userDetails = $wpdb->get_row($wpdb->prepare("SELECT id, access_token FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);
    }

    // Sanitize feed_id from $_GET
    $feed_id = filter_input(INPUT_GET, 'feed_id', FILTER_SANITIZE_URL);

    // Sanitize token from $_GET
    $token = filter_input(INPUT_GET, 'token', FILTER_SANITIZE_URL);

    // Use sanitized values
    $widget_id = !empty($feed_id) ? $feed_id : '';
    $ig_token = !empty($token) ? $token : '';

    $connected_ac_status = $wpdb->get_row($wpdb->prepare("SELECT ig_token,ac_type FROM $wpdb->lwip_feeds WHERE widget_id = %s", $widget_id), ARRAY_A);

    if ($ig_token) {
        if (empty($connected_ac_status['ig_token'])) {

            $data_to_update = array(
                'ig_token' => $ig_token,
            );
            $where = array(
                'lwip_user_id' => $userDetails['id'],
                'widget_id' => $widget_id
            );

            $result = $wpdb->update($wpdb->lwip_feeds, $data_to_update, $where);
            // @codingStandardsIgnoreEnd
            if ($result !== false) {
                $current_screen = get_current_screen();
                if ($current_screen->id === 'admin_page_lwip_feed_builder_settings') {
                    do_action('lwip_remove_token');
                }
            }
        }
    }

    // Output JavaScript code to initialize the UI and ensure a connection
    // The script waits for the document to be fully loaded and then calls the `ensureConnection` function,
    // which handles account switching and sets up necessary data from the UI.
    wp_add_inline_script('lwip-admin-insta-content-script', 'jQuery(document).ready(function($) { ensureConnection(); });');

?>

    <!-- HTML content for the social-media-feed-widget plugin widget UI  -->

    <div id="lwip-loader-wrapper">
        <div id="lwip-loader" class="lwip-loader"> </div>
    </div>
    <div id="lwip-premium-purchase-popup"></div>

    <!-- primium popup for none premium user -->
    <div id="new-popup" class="lwip-ant-modal-content-primium" style="display: none;">
        <div class="lwip-ant-modal-body">
            <button type="button" id="lwip-close-premium-purchase-popup" aria-label="Close" class="lwip-ant-modal-close">
                <span class="ant-modal-close-x">
                    <span role="img" aria-label="close" class="anticon anticon-close ant-modal-close-icon">
                        <svg class="lwip-premium-popup-cancel-btn-svg" fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                        </svg>
                    </span>
                </span>
            </button>
            <div class="lwip-feature-wrapper lwip-d-flex flex-vertical justify-between p-10 full-height">
                <div class="lwip-feature-modal-header lwip-premium-popup-header">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="premium-icon" height="20" width="20">
                        <g>
                            <g fill="#ffb743">
                                <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                            </g>
                        </g>
                    </svg>
                    <?php esc_html_e('Upgrade your plan to unlock this feature!', 'social-media-feed-widget') ?>
                </div>
                <div class="lwip-feature-modal-info">
                    <span id="dynamic-message"></span>
                    <div class="lwip-mt-8">
                        <?php esc_html_e('Please contact us for more Information', 'social-media-feed-widget') ?><a style="text-decoration: none;" href="mailto:support@instaplug.app?subject=<?php echo urlencode(esc_html__('Support for: Show Post popup when clicking on post', 'social-media-feed-widget')); ?>" target="_blank" rel="noreferrer" class="lwip-lwip-premium-footer-btn"><span class="lwip-font-bold"> <?php echo esc_html('support@instaplug.app'); ?> </span></a>
                    </div>
                </div>
            </div>
            <div class="lwip-premium-footer-btn">
                <button type="button" class="lwip-premium-popup-btn css-1ym4yry lwip-ant-btn-default" onclick="window.open('<?php echo esc_url(LWIP_SCRIPT_ENDPOINT) . 'manage-pricing'; ?> ', '_blank');">
                    <span><?php esc_html_e('Upgrade plan', 'social-media-feed-widget') ?></span>
                </button>
            </div>
        </div>
    </div>
    <!-- primium end -->

    <!-- Mobile view -->
    <div class="lwip-mobile-button">
        <button type="button" class="moblie-view" id="lwip-mobile-view" data-setView="MOBILE">
            <svg class="lwip-mobile-desktop-view-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M15 3a2 2 0 012 2v13a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h6zm-3 14.5a1 1 0 100 2 1 1 0 000-2zM15 4H9a1 1 0 00-1 1v11a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1z"></path>
            </svg>
        </button>
        <button type="button" class="desktop-view" id="lwip-desktop-view" data-setView="DESKTOP" style="display: none;">
            <svg class="lwip-mobile-desktop-view-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M19 3a2 2 0 012 2v10a2 2 0 01-2 2h-6.401v1.9H15a.6.6 0 01.097 1.192L15 20.1H9a.6.6 0 01-.097-1.192L9 18.9h2.399V17H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm0 1H5a1 1 0 00-.993.883L4 5v9a1 1 0 00.883.993L5 15h14a1 1 0 00.993-.883L20 14V5a1 1 0 00-1-1z"></path>
            </svg>
        </button>
    </div>
    <!-- Mobile view end-->

    <!-- Rename widgte popup -->
    <div class="lwip-ant-modal-content" id="lwip-open-rename-widget-popup">
        <div class="ant-modal-header">
            <div class="lwip-ant-modal-title" id=":r0:"><?php esc_html_e('Rename widget', 'social-media-feed-widget') ?></div>
        </div>
        <form action="" id="lwip-rename-widget-name-frm">
            <div class="ant-modal-body">
                <div class="lwip-ant-form-item">
                    <div class="ant-row ant-form-item-row">
                        <div class="ant-col lwip-ant-form-item-label">
                            <span class="lwip-ant-form-item-label-content"></span><label for="name" class="ant-form-item-required" title="Widget name"><?php esc_html_e('Widget name', 'social-media-feed-widget') ?></label>
                        </div>
                        <div class="ant-col ant-form-item-control">
                            <div class="ant-form-item-control-input">
                                <div class="ant-form-item-control-input-content">
                                    <span class="ant-input-affix-wrapper">
                                        <input id="lwip-widget-input-name" aria-required="true" class="lwip-ant-input custom-search-input" type="search">
                                        <span class="ant-input-suffix">
                                            <span class="lwip-ant-input-clear-icon" role="button" tabindex="-1">
                                                <span role="img" aria-label="close-circle" class="anticon anticon-close-circle"></span>
                                            </span>
                                        </span>
                                    </span>
                                    <div id="rename-widget-error-message" style="color: red;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lwip-ant-form-item">
                    <div class="ant-row ant-form-item-row">
                        <div class="ant-col ant-form-item-control">
                            <div class="ant-form-item-control-input">
                                <div class="ant-form-item-control-input-content">
                                    <div class="lwip-d-flex col-gap-6">
                                        <button type="button" id="lwip-rename-widget-cancel-btn" class="lwip-ant-btn-primary lwip-ant-btn-dangerous lwip-full-width-popup-button all-btn lwip-btn-rounded">
                                            <span><?php esc_html_e('Cancel', 'social-media-feed-widget') ?></span>
                                        </button>
                                        <button type="submit" id="lwip-rename-widget-save-btn" class="lwip-ant-btn-primary lwip-full-width-popup-button all-btn lwip-btn-rounded">
                                            <span><?php esc_html_e('Save', 'social-media-feed-widget') ?></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- Rename widgte popup end-->

    <!-- Main div that handle main UI -->
    <div class="lwip-main" id="lwip-main-div">
        <div class="lwip-post-container-header">
            <div> <img src="<?php echo esc_url($image_url); ?>" class="lwip-top-header-logo" id="lwip-close-widget-logo" style="cursor: pointer;"></div>
            <button type="button" class="lwip-rename-widget-btns" id="lwip-edit-widget-name-btn">
                <svg class="lwip-rename-widget-svg" viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                </svg>
                <span class="lwip-rename-widget-span" id="lwip-currenct-widget-name"></span>
            </button>

            <div class="lwip-top-right-header">
                <button class="publish-button-lwip" id="lwip-publish-account-btn"><?php esc_html_e('Publish', 'social-media-feed-widget') ?></button>
                <button class="lwip-view-plans-button" id="lwip-view-purchase-plan-btn"><?php esc_html_e('View Plans', 'social-media-feed-widget') ?></button>
                <button class="lwip-cancel-button" id="lwip-close-widget-btn"><?php esc_html_e('Close', 'social-media-feed-widget') ?></button>
            </div>

        </div>
        <div class="lwip-top-container" id="lwip-main-container-cls">
            <div class="lwip-menus">
                <div class="lwip-side-menu-handler-icons">
                    <div class="change-color-on-hover">
                        <button class="lwip-side-menu-icons lwip-side-menu-source-icon" data-target="#lwip-connect-action-source" id="source-id-default" onclick="toggleIconColor(this)">
                            <svg class="lwip-side-menu-handler-svg-icons" viewBox="64 64 896 896" focusable="false" data-icon="api" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 00-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 000 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM578.9 546.7a8.03 8.03 0 00-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 00-11.3 0L363 475.3l-43-43a7.85 7.85 0 00-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 68.9-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 000 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2z"></path>
                            </svg>
                            <span class="lwip-side-menu-icon-txts"><?php esc_html_e('Source', 'social-media-feed-widget') ?></span>
                        </button>
                    </div>
                    <div class="change-color-on-hover">
                        <button class="lwip-side-menu-icons" data-target="#lwip-side-menu-layout-container" onclick="toggleIconColor(this)">
                            <svg class="lwip-side-menu-handler-svg-icons" viewBox="64 64 896 896" focusable="false" data-icon="layout" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M384 912h496c17.7 0 32-14.3 32-32V340H384v572zm496-800H384v164h528V144c0-17.7-14.3-32-32-32zm-768 32v736c0 17.7 14.3 32 32 32h176V112H144c-17.7 0-32 14.3-32 32z"></path>
                            </svg>
                            <span class="lwip-side-menu-icon-txts"><?php esc_html_e('Layout', 'social-media-feed-widget') ?></span>
                        </button>
                    </div>
                    <div class="change-color-on-hover">
                        <button class="lwip-side-menu-icons" data-target="#action-post" onclick="toggleIconColor(this)">
                            <svg class="lwip-side-menu-handler-svg-icons" viewBox="64 64 896 896" focusable="false" data-icon="picture" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM338 304c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm513.9 437.1a8.11 8.11 0 01-5.2 1.9H177.2c-4.4 0-8-3.6-8-8 0-1.9.7-3.7 1.9-5.2l170.3-202c2.8-3.4 7.9-3.8 11.3-1 .3.3.7.6 1 1l99.4 118 158.1-187.5c2.8-3.4 7.9-3.8 11.3-1 .3.3.7.6 1 1l229.6 271.6c2.6 3.3 2.2 8.4-1.2 11.2z"></path>
                            </svg>
                            <span class="lwip-side-menu-icon-txts"><?php esc_html_e('Post', 'social-media-feed-widget') ?></span>
                        </button>
                    </div>
                    <div class="change-color-on-hover">
                        <button class="lwip-side-menu-icons" data-target="#action-setting" onclick="toggleIconColor(this)">
                            <svg class="lwip-side-menu-handler-svg-icons" viewBox="64 64 896 896" focusable="false" data-icon="setting" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8-21.1 21.2-32.8 49.2-32.8 79.1 0 29.9 11.7 57.9 32.8 79.1 21.2 21.1 49.2 32.8 79.1 32.8 29.9 0 57.9-11.7 79.1-32.8 21.1-21.2 32.8-49.2 32.8-79.1 0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 00-79.1-32.8zm412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 009.3-35.2l-.9-2.6a442.5 442.5 0 00-79.6-137.7l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.3a353.44 353.44 0 00-98.9 57.3l-81.8-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a445.93 445.93 0 00-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57 0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0025.8 25.7l2.7.5a448.27 448.27 0 00158.8 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35zm-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8 175.8 78.7 175.8 175.8-78.7 175.8-175.8 175.8z"></path>
                            </svg>
                            <span class="lwip-side-menu-icon-txts"><?php esc_html_e('Setting', 'social-media-feed-widget') ?></span>
                        </button>
                    </div>
                </div>
                <div class="lwip-sub-side-bar">
                    <div class="lwip-label-icon-title" id="lwip-connect-action-source">
                        <form action="" method="post" id='lwip-connnect-account-frm'>
                            <span class="lwip-side-menu-inner-container-heading"><?php esc_html_e('Source', 'social-media-feed-widget') ?></span>
                            <h3 class="lwip-sub-inner-container-h3 top"><?php esc_html_e('Source type', 'social-media-feed-widget') ?></h3>
                            <div class="lwip-account-type">
                                <div class="lwip-business-radio-container">
                                    <input type="radio" name="account" class="lwip-select-account-type" id="business" value="BUSINESS" data-source-type="BUSINESS_ACCOUNT">
                                    <label class="lwip-radio-btn-label" for="business"> </label>
                                    <span><?php esc_html_e('My Business Account', 'social-media-feed-widget') ?></span>
                                </div>
                                <div class="lwip-personal-radio-container">
                                    <input type="radio" name="account" class="lwip-select-account-type" id="personal" value="PERSONAL" data-source-type="PERSONAL_ACCOUNT">
                                    <label for="personal" class="lwip-business-radio-label"> </label>
                                    <span><?php esc_html_e('My Personal Account', 'social-media-feed-widget') ?></span>
                                </div>
                            </div>
                            <input type="hidden" name="hidden-widget-id" id="hidden-widget-id" value="<?php echo esc_attr($widget_id); ?>">
                            <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Instagram sources', 'social-media-feed-widget') ?></h3>
                            <div class="lwip-white-container" id="lwip-instagram-personal-account-container">
                                <div id="personal-account-disconnect" style="display: none;">
                                    <h3 class="lwip-white-box-heading" id="insta-connect-button"><?php esc_html_e('Instagram Disconnect', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-connected-ac-txt"><?php esc_html_e('Successfully connected as', 'social-media-feed-widget') ?> <span id="connected-personal-account-name"></span>
                                    </div>
                                    <span class="span-btn"><button id="disconnect-account-disable" class="disconnect-account"><?php esc_html_e('Disconnect Account', 'social-media-feed-widget') ?></button></span>
                                </div>
                                <div id="personal-account-connect" style="display: none;">
                                    <h3 class="lwip-white-box-heading" id="insta-connect-button"><?php esc_html_e('Instagram Connect', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-connected-ac-txt"><?php esc_html_e('Authorize in your Instagram account to display profile.', 'social-media-feed-widget') ?></div>
                                    <span class="span-btn"><button type="submit"><svg viewBox="64 64 896 896" focusable="false" data-icon="instagram" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                <path d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 01-47.9 47.9z"></path>
                                            </svg><span class="lwip-white-container-txt"><?php esc_html_e('Instagram Account', 'social-media-feed-widget') ?></span></button></span>
                                </div>
                            </div>

                            <div class="lwip-white-container lwip-white-container-facebook" id="lwip-instagram-personal-fb-account-container">
                                <div id="lwip-facebook-account-disconnect" style="display: none;">
                                    <h3 class="lwip-white-box-heading" id="insta-connect-button"><?php esc_html_e('Facebook Disconnect', 'social-media-feed-widget') ?></h3>

                                    <div class="lwip-connected-ac-txt"><?php esc_html_e('Successfully connected as', 'social-media-feed-widget') ?> <span id="connected-business-account-name"></span></div>
                                    <span class="span-btn"><button id="disconnect-account-disable" class="disconnect-account"><?php esc_html_e('Disconnect Account', 'social-media-feed-widget') ?></button></span>
                                </div>
                                <div id="lwip-facebook-account-connect" style="display: none;">
                                    <h3 class="lwip-white-box-heading" id="insta-connect-button"><?php esc_html_e('Facebook Connect', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-connected-ac-txt"><?php esc_html_e('Authorize in your Facebook account that has access to the Facebook Business page linked to your Instagram business account.', 'social-media-feed-widget') ?></div>
                                    <span class="span-btn"><button type="submit"><svg viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z"></path>
                                            </svg><span class="lwip-white-container-txt"><?php esc_html_e('Facebook Account', 'social-media-feed-widget') ?></span></button></span>
                                </div>
                            </div>
                        </form>
                        <div class="filter-actions" id="filter-actions">
                            <button type="button" class="lwip-ant-btn-filter css-1ym4yry lwip-ant-btn-primary lwip-ant-btn-lg lwip-full-width-filter-home all-btn feed-info-card" id="lwip-side-menu-main-filter-btn">
                                <span role="img" aria-label="filter" class="anticon anticon-filter">
                                    <svg viewBox="64 64 896 896" class="filter-svg-lwip" focusable="false" data-icon="filter" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z"></path>
                                    </svg>
                                </span>
                                <span class="lwip-filter-span-text"><?php esc_html_e('Filters', 'social-media-feed-widget') ?></span>
                            </button>
                        </div>

                        <div class="text-color" id="lwip-side-menu-filters-container">
                            <div class="filter-section">
                                <div class="lwip-hide-menu-inner-header-controller" id="">
                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Filters', 'social-media-feed-widget') ?></h3>
                                    <button type="button" class="lwip-back" id="lwip-filters-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                                </div>
                                <div>
                                    <h4 class="lwip-filter-text-white-color"><?php esc_html_e('Show post containing these words', 'social-media-feed-widget') ?></h4>
                                    <div class="lwip-full-width"></div>
                                    <div id="lwip-show-post-list" class="lwip-white-label-filter" style="display: none;"></div>
                                    <button type="button" class="add-lwip-ant-btn-filter css-1ym4yry lwip-ant-btn-primary full-width-filter all-btn" id="lwip-add-new-show-filter-btn">
                                        <div class="lwip-d-flex justify-center col-gap-6 align-center">
                                            <span class="leading-1"> <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg> <?php esc_html_e('Add Filter', 'social-media-feed-widget') ?></span>
                                            <span role="img" aria-label="plus" class="anticon anticon-plus">
                                                <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                                                    <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                                <div>
                                    <h4 class="lwip-filter-text-white-color"><?php esc_html_e('Hide post containing these words', 'social-media-feed-widget') ?></h4>
                                    <div class="lwip-full-width"></div>
                                    <div id="lwip-hide-post-list" class="lwip-white-label-filter" style="display: none;"></div>
                                    <button type="button" class="add-lwip-ant-btn-filter css-1ym4yry lwip-ant-btn-primary full-width-filter all-btn" id="lwip-add-new-hide-filter-btn">
                                        <div class="lwip-d-flex justify-center col-gap-6 align-center">
                                            <span class="leading-1"> <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg> <?php esc_html_e('Add Filter', 'social-media-feed-widget') ?></span>
                                            <span role="img" aria-label="plus" class="anticon anticon-plus">
                                                <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                                                    <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                                <div>
                                    <div class="ant-row css-1ym4yry" style="margin-left: -4px; margin-right: -4px; row-gap: 8px;">
                                        <div class="ant-col css-1ym4yry" style="padding-left: 4px; padding-right: 4px;">
                                            <div class="ant-card ant-card-bordered ant-card-small mt-24 css-1ym4yry">
                                                <div class="ant-card-body">
                                                    <div class="lwip-filter-number-inc">
                                                        <span class=""><?php esc_html_e('Total number of posts to display', 'social-media-feed-widget') ?></span>
                                                        <div class="lwip-input-container">
                                                            <input id="lwip-filter-total-number-posts" autocomplete="off" role="spinbutton" aria-valuemin="0" aria-valuenow="6" step="1" type="number" class="ant-input-number-input lwip-web-appearance" value="0" min="0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="lwip-filter-text">
                                            <span><?php esc_html_e('Set the required number to restrict the count of loaded posts. Leave this option empty or 0 to show all available posts.', 'social-media-feed-widget') ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="lwip-add-new-filter-show-container" style="display: none;">
                            <div class="lwip-hide-menu-inner-header-controller" id="add-new-filter-btn">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Add button', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-done" id="lwip-save-show-filter"><span><?php esc_html_e('Done', 'social-media-feed-widget') ?></span></button>
                                <button type="button" class="lwip-back" id="lwip-back-show-filter"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <input type="url" class="lwip-filter-input-type" id="lwip-add-new-show-filter-val" placeholder="<?php esc_attr_e('Enter @username of #hashtag', 'social-media-feed-widget'); ?>" required>
                            <span class="lwip-error-message-filter" id="lwip-add-new-show-filter-btn-err-message"></span>
                        </div>

                        <div id="lwip-add-new-filter-hide-container" style="display: none;">
                            <div class="lwip-hide-menu-inner-header-controller" id="add-new-filter-btn">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Add button', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-done" id="lwip-save-hide-filter"><span><?php esc_html_e('Done', 'social-media-feed-widget') ?></span></button>
                                <button type="button" class="lwip-back" id="lwip-back-hide-filter"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <input type="url" class="lwip-filter-input-type" id="lwip-add-new-hide-filter-val" placeholder="<?php esc_attr_e('Enter @username of #hashtag', 'social-media-feed-widget'); ?>" required>
                            <span class="lwip-error-message-filter" id="lwip-add-new-hide-filter-btn-err-message"></span>
                        </div>
                    </div>

                    <div class="lwip-label-icon-title" id="lwip-side-menu-layout-container">
                        <span class="lwip-side-menu-inner-container-heading" id="lwip-layout-header-span"><?php esc_html_e('Layout', 'social-media-feed-widget') ?></span>
                        <div id="lwip-layouts-types">
                            <div class="lwip-side-menu-all-layout-style-control">

                                <div class="lwip-side-menu-layout-style-handler" id="lwip-post-layout-slider">
                                    <div class="lwip-slider-view-cls" id="lwip-slider-view-btn" data-slider="SLIDER">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="lwip-svg-img-fill svg-slider">
                                            <path fill-rule="evenodd" d="M22 21a1 1 0 011 1v21a1 1 0 01-1 1H9a1 1 0 01-1-1V22a1 1 0 011-1h13zm17 0a1 1 0 011 1v21a1 1 0 01-1 1H26a1 1 0 01-1-1V22a1 1 0 011-1h13zm16 0a1 1 0 011 1v21a1 1 0 01-1 1H43a1 1 0 01-1-1V22a1 1 0 011-1h12zm4.302 7.307a1.016 1.016 0 011.455 0l2.64 2.71a2.126 2.126 0 010 2.967l-2.64 2.709c-.402.41-1.053.41-1.455 0a1.063 1.063 0 010-1.484l1.911-1.967a1.063 1.063 0 000-1.484l-1.911-1.967a1.063 1.063 0 010-1.484zm-54.604 0c.403.41.403 1.074 0 1.484l-1.911 1.967a1.063 1.063 0 000 1.484l1.911 1.967c.403.41.403 1.074 0 1.484-.402.41-1.053.41-1.455 0l-2.64-2.71a2.127 2.127 0 010-2.967l2.64-2.709a1.016 1.016 0 011.455 0z">
                                            </path>
                                        </svg>

                                        <span class="span-slider"><?php esc_html_e('Slider', 'social-media-feed-widget') ?></span>
                                    </div>
                                </div>

                                <div class="lwip-side-menu-layout-style-handler" id="lwip-grid-view">
                                    <div class="lwip-grid-view-cls" id="lwip-grid-view-btn" data-slider="GRID">
                                        <svg class="lwip-svg-img-fill lwip-grid-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="lwip-svg-img-fill">
                                            <path fill-rule="evenodd" d="M22 42a1 1 0 011 1v13a1 1 0 01-1 1H9a1 1 0 01-1-1V43a1 1 0 011-1h13zm17 0a1 1 0 011 1v13a1 1 0 01-1 1H26a1 1 0 01-1-1V43a1 1 0 011-1h13zm16 0a1 1 0 011 1v13a1 1 0 01-1 1H43a1 1 0 01-1-1V43a1 1 0 011-1h12zM22 25a1 1 0 011 1v13a1 1 0 01-1 1H9a1 1 0 01-1-1V26a1 1 0 011-1h13zm17 0a1 1 0 011 1v13a1 1 0 01-1 1H26a1 1 0 01-1-1V26a1 1 0 011-1h13zm16 0a1 1 0 011 1v13a1 1 0 01-1 1H43a1 1 0 01-1-1V26a1 1 0 011-1h12zM22 8a1 1 0 011 1v13a1 1 0 01-1 1H9a1 1 0 01-1-1V9a1 1 0 011-1h13zm17 0a1 1 0 011 1v13a1 1 0 01-1 1H26a1 1 0 01-1-1V9a1 1 0 011-1h13zm16 0a1 1 0 011 1v13a1 1 0 01-1 1H43a1 1 0 01-1-1V9a1 1 0 011-1h12z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="lwip-grid-span"><?php esc_html_e('Grid', 'social-media-feed-widget') ?></span>
                                    </div>
                                </div>

                                <div class="lwip-side-menu-layout-style-handler" id="lwip-masonry-view">
                                    <div class="lwip-masonry-view-cls" id="lwip-masonry-view-btn" data-slider="MASONRY">
                                        <svg fill="#000000" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" stroke="#000000" stroke-width="0.00512" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" class="active-layout layout-icon lwip-svg-img-fill">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="11.264"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <g>
                                                    <g>
                                                        <g>
                                                            <rect x="192" y="277.333" width="128" height="234.667"></rect>
                                                            <rect x="192" width="128" height="234.667"></rect>
                                                            <rect x="362.667" width="149.333" height="234.667"></rect>
                                                            <rect width="149.333" height="512"></rect>
                                                            <rect x="362.667" y="277.333" width="149.333" height="234.667"></rect>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <div class="lwip-masonry-svg">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                <g>
                                                    <g fill="#ffb743">
                                                        <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                    </g>
                                                </g>
                                            </svg>
                                            <span class="lwip-grid-span"><?php esc_html_e('Masonry', 'social-media-feed-widget') ?></span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div id="lwip-slider-bottons-container">
                                <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-column-row-btn"><span><?php esc_html_e('Columns and Rows', 'social-media-feed-widget') ?></span></button>
                                <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-layout-header"><span><?php esc_html_e('Headers', 'social-media-feed-widget') ?></span></button>
                                <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-layout-slider"><span><?php esc_html_e('Slider Settings', 'social-media-feed-widget') ?></span></button>
                                <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-layout-feed-title"><span><?php esc_html_e('Feed Title', 'social-media-feed-widget') ?></span></button>
                            </div>

                            <div class="lwip-hide-menu-inner-header-controller" id="lwip-side-menu-column-row-container">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Columns and Rows', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-column-row-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>

                            <div class="column-row-container-lwip" id="lwip-column-row-container">
                                <div class="lwip-column-texts">
                                    <span><?php esc_html_e('Column mode', 'social-media-feed-widget') ?></span>
                                </div>
                                <div class="lwip-column-menu-content">
                                    <div class="lwip-column-menu-sub-content">
                                        <div class="lwip-column-auto-manuall-content">
                                            <button id="lwip-side-menu-auto-btn" data-auto="AUTO" class="lwip-auto-button lwip-hover-btn lwip-hover-simple lwip-hover-radius"><?php esc_html_e('Auto', 'social-media-feed-widget') ?></button>
                                            <button id="lwip-side-menu-manuall-btn" data-auto="MANUAL" class="lwip-menual-button lwip-hover-btn lwip-hover-simple lwip-simple-radius"><?php esc_html_e('Manual', 'social-media-feed-widget') ?></button>
                                        </div>

                                        <div class="lwip-column-manual-button-conteiner" id="action-menual-id">
                                            <div id="lwip-column-btn">
                                                <span class="lwip-column-manual-button-conteiner-text"><?php esc_html_e('Column', 'social-media-feed-widget') ?></span>
                                                <input type="number" class="lwip-column-manual-button-conteiner-column-number lwip-web-appearance" id="lwip-manuall-column-counter" value="" min="1" max="10" step="1">
                                            </div>
                                            <div id="lwip-row-btn">
                                                <span class="lwip-column-manual-button-conteiner-text"><?php esc_html_e('Row', 'social-media-feed-widget') ?></span>
                                                <input type="number" class="lwip-column-manual-button-conteiner-row-number lwip-web-appearance" id="lwip-manuall-row-counter" value="" min="1" max="5" step="1">
                                            </div>

                                            <div id="lwip-gap-btn">
                                                <span class="lwip-column-manual-button-conteiner-text"><?php esc_html_e('Gap', 'social-media-feed-widget') ?></span>
                                                <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In px">
                                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                                        <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                                    </svg>
                                                </span>
                                                <input type="number" class="lwip-column-manual-button-conteiner-gap-number lwip-web-appearance" id="lwip-manuall-gap-counter" value="" min="0" step="1">
                                            </div>
                                            <div id="lwip-width-btn">
                                                <span class="lwip-column-manual-button-conteiner-text"><?php esc_html_e('Width', 'social-media-feed-widget') ?></span>
                                                <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In px">
                                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                                        <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                                    </svg>
                                                </span>
                                                <input type="text" class="lwip-column-manual-button-conteiner-width-number" id="lwip-width-counter" value="auto" min="0" step="1">
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="" id="lwip-side-menu-header-elements-container">
                            <div class="lwip-hide-menu-inner-header-controller" id="layout-headers">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Header', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-header-back-btn"><span>Back</span></button>
                            </div>
                            <div class="lwip-slider-header">
                                <div class="lwip-layout-inner-head-txt">
                                    <span class="lwip-layout-head-element"><?php esc_html_e('Show header', 'social-media-feed-widget') ?></span>
                                    <!-- Rounded switch -->
                                    <label class="lwip-round-switch">
                                        <input type="checkbox" id="lwip-main-header-elemets-switch">
                                        <span class="lwip-slider-switch lwip-slider-round"></span>
                                    </label>
                                </div>
                                <div class="lwip-main-header-element-container" id="lwip-main-header-element-container-id">
                                    <div>
                                        <div class="lwip-layout-head-element"><span><?php esc_html_e('Header Elements', 'social-media-feed-widget') ?></span></div>
                                        <div>
                                            <div>
                                                <input type="checkbox" id="lwip-main-header-profile-pic-checkbox" name="profile-picture" checked>
                                                <label for="lwip-main-header-profile-pic-checkbox"><?php esc_html_e('Profile Picture', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-user-fullname-checkbox" name="full-name" checked>
                                                <label for="lwip-main-header-user-fullname-checkbox"><?php esc_html_e('Full Name', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-username-checkbox" name="username" checked>
                                                <label for="lwip-main-header-username-checkbox"><?php esc_html_e('Username', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-verify-badge-checkbox" name="verified-badge" checked>
                                                <label for="lwip-main-header-verify-badge-checkbox"><?php esc_html_e('Verified Badge', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-post-count-checkbox" name="post-count" checked>
                                                <label for="lwip-main-header-post-count-checkbox"><?php esc_html_e('Post Count', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-followers-count-checkbox" name="follower-count" checked>
                                                <label for="lwip-main-header-followers-count-checkbox"><?php esc_html_e('Follower Count', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-following-count-checkbox" name="following-count" checked>
                                                <label for="lwip-main-header-following-count-checkbox"><?php esc_html_e('Following Count', 'social-media-feed-widget') ?></label>
                                            </div>

                                            <div>
                                                <input type="checkbox" id="lwip-main-header-follow-btn-checkbox" name="lwip-follow-button" checked>
                                                <label for="lwip-main-header-follow-btn-checkbox"><?php esc_html_e('Follow Button', 'social-media-feed-widget') ?></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="sliders-setting" id="lwip-layout-slider-settings">
                            <div class="lwip-hide-menu-inner-header-controller" id="layout-headers">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Slider setting', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-side-menu-slider-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <div class="lwip-slider-setting-div">
                                <div class="lwip-slider-setting-arrow-control-container">
                                    <span><?php esc_html_e('Arrow Control', 'social-media-feed-widget') ?></span>
                                    <label class="lwip-round-switch lwip-arrow-toggle">
                                        <input type="checkbox" id="lwip-slider-arrow-control-btn">
                                        <span class="lwip-slider-switch lwip-slider-round"></span>
                                    </label>
                                </div>
                                <div class="lwip-slider-setting-drag-control-container"><span><?php esc_html_e('Drag Control', 'social-media-feed-widget') ?></span>
                                    <label class="lwip-round-switch lwip-drag-toggle">
                                        <input type="checkbox" id="lwip-slider-drag-controll">
                                        <span class="lwip-slider-switch lwip-slider-round "></span>
                                    </label>
                                </div>
                                <div class="lwip-slider-setting-aenimation-container">
                                    <span><?php esc_html_e('Animation', 'social-media-feed-widget') ?></span>
                                    <input type="number" class="lwip-column-manual-button-conteiner-animation lwip-long-width-inputs lwip-web-appearance" id="lwip-slider-animation-counter" value="0" min="0" step="1">
                                    <div>
                                        <input id="lwip-slider-range-controller" name="range1" type="range" class="lwip-animation-range-slider lwip-long-width-inputs" min="0" max="5" value="0">
                                    </div>
                                </div>

                                <div class="lwip-slider-setting-autoplay-container">
                                    <span><?php esc_html_e('Auto Play', 'social-media-feed-widget') ?></span>
                                    <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In sec"><svg viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                            <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                        </svg>
                                    </span>
                                    <input type="number" class="lwip-column-manual-button-conteiner-autoplay lwip-web-appearance" id="lwip-slider-auto-play-counter" value="0" min="0" step="1">
                                </div>
                            </div>
                        </div>
                        <div class="feed-titles" id="lwip-side-menu-feed-title-container">
                            <div class="lwip-hide-menu-inner-header-controller">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Feed Title', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-feed-title-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <div class="lwip-feed-title-content-container">
                                <input type="text" id="lwip-feed-title" class="lwip-feed-title-input" placeholder="<?php esc_attr_e('Enter Title of Feed', 'social-media-feed-widget'); ?>">
                                <div class="lwip-side-menu-about-txts">
                                    <span class="note"><?php esc_html_e('URLs, hashtags (with #) and Instagram usernames (with @) will be
                                        automatically displayed as clickable links.', 'social-media-feed-widget') ?></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lwip-label-icon-title" id="action-post">
                        <span class="lwip-side-menu-inner-container-heading lwip-post-margin" id="lwip-post-container"><?php esc_html_e('Post', 'social-media-feed-widget') ?></span>
                        <div id="lwip-side-menu-post-container">
                            <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-post-style">
                                <span class="lwip-side-menu-inner-container-post-span"><?php esc_html_e('Post style', 'social-media-feed-widget') ?></span>
                                <div class="ant-col ant-col-2 css-1ym4yry">
                                    <span role="img" aria-label="right" class="anticon anticon-right">
                                        <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                            <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-post-popup-settings-btn">
                                <svg class="lwip-button-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                </svg>
                                <span class="lwip-side-menu-inner-container-post-span">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                        <g>
                                            <g>
                                                <g fill="#ffb743">
                                                    <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg> <?php esc_html_e('Pop up setting', 'social-media-feed-widget') ?></span>
                                <div class="ant-col ant-col-2 css-1ym4yry">
                                    <span role="img" aria-label="right" class="anticon anticon-right">
                                        <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                            <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-side-menu-post-call-to-action-btn">
                                <span class="lwip-side-menu-inner-container-post-span"> <?php esc_html_e('Call to Action Button', 'social-media-feed-widget') ?></span>
                                <div class="ant-col ant-col-2 css-1ym4yry"><span role="img" aria-label="right" class="anticon anticon-right">
                                        <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                            <button class="lwip-post-click-btn-drop-down">
                                <span class="lwip-side-menu-inner-container-post-span"><?php esc_html_e('Post Click Action', 'social-media-feed-widget') ?></span>
                                <div class="dropdown-content popup-dropdown-content">
                                    <select id="lwip-post-click-action-handler" class="lwip-select-option-dropdown popup-selected-option">
                                        <option id="post-in-popup" data-popclickaction="POPUP" data-img_src="<?php echo  esc_url($premium_svg_url) ?>"><?php esc_html_e('In Popup', 'social-media-feed-widget') ?></option>
                                        <option id="post-in-instagram" data-popclickaction="INSTAGRAM"><?php esc_html_e('In Instagram', 'social-media-feed-widget') ?></option>
                                        <option id="post-in-none" data-popclickaction="NONE"><?php esc_html_e('None', 'social-media-feed-widget') ?></option>
                                    </select>
                                </div>
                            </button>
                            <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-custom-post-css">
                                <span class="lwip-side-menu-inner-container-post-span">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                        <g>
                                            <g fill="#ffb743">
                                                <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                            </g>
                                        </g>
                                    </svg>
                                    <?php esc_html_e('Post Custom CSS', 'social-media-feed-widget') ?></span>
                                <div class="ant-col ant-col-2 css-1ym4yry"><span role="img" aria-label="right" class="anticon anticon-right">
                                        <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div id="lwip-post-style-container">
                            <div class="lwip-hide-menu-inner-header-controller">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Post style', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-post-style-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <div class="lwip-sub-elements-posts" id="hovers-element-post">
                                <div class="lwip-bottom-content">
                                    <div class="lwip-simple-hover-btn-css">
                                        <div class="lwip-side-menu-images" id="lwip-side-menu-hover-image">
                                            <?php $hoverimage = LWIP_PLUGIN_PATH . 'admin/images/Hoverimage.png';
                                            ?>
                                            <img src="<?php echo esc_url($hoverimage); ?>" class="lwip-sidem-menu-simple-hover-img">
                                        </div>
                                        <div class="lwip-side-menu-images" id="lwip-side-menu-simple-image">
                                            <?php $hoverimage = LWIP_PLUGIN_PATH . 'admin/images/Simpleimage.png';
                                            ?>
                                            <img src="<?php echo esc_url($hoverimage); ?>" class="lwip-sidem-menu-simple-hover-img">
                                        </div>
                                        <div class="lwip-simple-hover-sub-div">

                                            <button id="lwip-post-style-hover-btn" data-poststyle="HOVER" class="lwip-hover-btn lwip-hover-simple lwip-hover-radius">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg> <?php esc_html_e('Hover', 'social-media-feed-widget') ?></button>
                                            <button id="lwip-post-style-simple-btn" data-poststyle="SIMPLE" class="lwip-hover-btn lwip-hover-simple lwip-simple-radius">
                                                <?php esc_html_e('Simple', 'social-media-feed-widget') ?></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="post-style-elements" id="lwip-hover-simple-elements">
                                    <div class="lwip-insta-post-card-header-elements">
                                        <div id="lwip-insta-post-hover-elements">
                                            <span><?php esc_html_e('Post Element', 'social-media-feed-widget') ?></span>
                                        </div>
                                        <div id="lwip-insta-post-simple-elements">
                                            <span><?php esc_html_e('Post Element', 'social-media-feed-widget') ?></span>
                                        </div>
                                        <div id="lwip-insta-post-user-container">
                                            <input type="checkbox" id="lwip-insta-post-user" name="user-checkbox" checked>
                                            <label for="lwip-insta-post-user"><?php esc_html_e('User', 'social-media-feed-widget') ?></label>
                                        </div>
                                        <div id="lwip-insta-post-date-container">
                                            <input type="checkbox" id="lwip-insta-post-date" name="date-checkbox" checked>
                                            <label for="lwip-insta-post-date"><?php esc_html_e('Date', 'social-media-feed-widget') ?></label>
                                        </div>
                                        <div id="lwip-insta-post-insta-link-container">
                                            <input type="checkbox" id="lwip-insta-post-link" name="link-checkbox" checked>
                                            <label for="lwip-insta-post-link"><?php esc_html_e('Instagram Link', 'social-media-feed-widget') ?></label>
                                        </div>
                                        <div id="lwip-insta-post-share-container">
                                            <input type="checkbox" id="lwip-insta-post-share" name="share-checkbox" checked>
                                            <label for="lwip-insta-post-share" class="removeTickColor"><?php esc_html_e('Share', 'social-media-feed-widget') ?><svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </label>
                                        </div>
                                        <div id="like-checkbox">
                                            <input type="checkbox" id="lwip-insta-post-likes" name="like-checkbox" checked>
                                            <label for="lwip-insta-post-likes" class="removeTickColor"> <?php esc_html_e('Like Count', 'social-media-feed-widget') ?><svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </label>
                                        </div>
                                        <div id="comments-checkbox">
                                            <input type="checkbox" id="lwip-insta-post-comments" name="comments-checkbox" checked>
                                            <label for="lwip-insta-post-comments" class="removeTickColor"> <?php esc_html_e('Comments Count', 'social-media-feed-widget') ?><svg xmlns="http://www.w3.org/2000/svg" class="lwip-filter-svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="h-20 w-20" height="20" width="20">
                                                    <g>
                                                        <g fill="#ffb743">
                                                            <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                                        </g>
                                                    </g>
                                                </svg></label>
                                        </div>
                                        <div id="text-checkbox">
                                            <input type="checkbox" id="lwip-insta-post-texts" name="text-checkbox" checked>
                                            <label for="lwip-insta-post-texts"> <?php esc_html_e('Text', 'social-media-feed-widget') ?></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="lwip-popup-setting-container">
                            <div class="lwip-hide-menu-inner-header-controller">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Pop up Settings', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-popup-setting-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <div class="" id="">
                                <div class="lwip-slider-header-popup">
                                    <div class="lwip-elements-posts" id="lwip-popup-element-css">
                                        <div>
                                            <div class="lwip-popup-elements-span"><span><?php esc_html_e('Popup Elements', 'social-media-feed-widget') ?></span></div>
                                            <div>
                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-user" name="user">
                                                    <label for="lwip-post-element-user"><?php esc_html_e('User', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-location" name="location">
                                                    <label for="lwip-post-element-location"><?php esc_html_e('Location', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-follow-btn" name="lwip-follow-button">
                                                    <label for="lwip-post-element-follow-btn"><?php esc_html_e('Follow Button', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-instagram-link" name="instagram-link">
                                                    <label for="lwip-post-element-instagram-link"><?php esc_html_e('Instagram Link', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-like-count" name="like-count">
                                                    <label for="lwip-post-element-like-count"><?php esc_html_e('Like Count', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-share" name="share">
                                                    <label for="lwip-post-element-share"><?php esc_html_e('Share', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-text" name="text">
                                                    <label for="lwip-post-element-text"><?php esc_html_e('Text', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-date" name="date">
                                                    <label for="lwip-post-element-date"><?php esc_html_e('Date', 'social-media-feed-widget') ?></label>
                                                </div>

                                                <div>
                                                    <input type="checkbox" id="lwip-post-element-comments" name="comments">
                                                    <label for="lwip-post-element-comments"><?php esc_html_e('Comments', 'social-media-feed-widget') ?></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="post-call-to-action-dispaly">
                            <div id="lwip-side-menu-call-to-action-main-container">
                                <div class="lwip-hide-menu-inner-header-controller">
                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Action button', 'social-media-feed-widget') ?></h3>
                                    <button type="button" class="lwip-back" id="lwip-call-to-action-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                                </div>
                                <div id="lwip-calltoaction-add-btn">
                                    <div>
                                        <div class="lwip-side-menu-about-txts"><span><?php esc_html_e('The buttons will be displayed on the popup. You can set a specific call to
                                                action for each post. Call to action buttons encourage your visitors to
                                                perform the actions you need (buy a product or contact you).', 'social-media-feed-widget') ?></span></div>

                                        <div id="lwip-call-to-action-btn-values-container" style="display: none;"></div>

                                    </div>
                                    <div>
                                        <button type="button" class="lwip-side-menu-inner-container-btns" id="lwip-call-to-action-new-value-add-btn">
                                            <span><?php esc_html_e('+ Add Button', 'social-media-feed-widget') ?></span></button>
                                    </div>
                                </div>
                            </div>
                            <div id="lwip-call-to-action-btn-container" class="call-to-action-all-btn">
                                <div class="lwip-hide-menu-inner-header-controller" id="edit-btn">
                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Edit button', 'social-media-feed-widget') ?></h3>
                                    <button type="button" class="lwip-done" id="lwip-call-action-save-btn"><span><?php esc_html_e('Done', 'social-media-feed-widget') ?></span></button>
                                    <button type="button" class="lwip-back" id="lwip-call-to-action-cancel-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                                </div>
                                <div>
                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Instagram Post URL', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-feed-title-input-type">
                                        <input type="url" id="lwip-cta-insta-post-url" class="lwip-filter-input-type" required>

                                    </div>
                                    <div style="color: #ff4d4f;" id="lwip-insta-post-url-err-message"></div>
                                    <div class="lwip-side-menu-about-txts"> <span><?php esc_html_e('Set the Instagram URL of the target post from your feed you need to add the button
                                            to.', 'social-media-feed-widget') ?></span></div>

                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Button URL', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-feed-title-input-type">
                                        <input type="url" id="lwip-cta-insta-post-redirect-btn-url" class="lwip-filter-input-type" required>
                                    </div>
                                    <div style="color: #ff4d4f;" id="lwip-insta-bussiness-url-err-message"></div>
                                    <div class="lwip-side-menu-about-txts"><span><?php esc_html_e('Set the button redirect link (product page, contact page)', 'social-media-feed-widget') ?></span></div>

                                    <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Button Label', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-feed-title-input-type">
                                        <input type="text" id="lwip-cta-insta-post-btn-label" class="lwip-filter-input-type">
                                    </div>
                                    <div style="color: #ff4d4f;" id="lwip-insta-button-label-err-message"></div>
                                    <div class="lwip-side-menu-about-txts"><span><?php esc_html_e('Set the compelling button text your visitors won\'t resist.', 'social-media-feed-widget') ?></span></div>
                                </div>
                            </div>
                        </div>

                        <div id="lwip-side-menu-post-custom-css-container">
                            <div class="lwip-hide-menu-inner-header-controller">
                                <h3 class="lwip-sub-inner-container-h3"><?php esc_html_e('Custom CSS', 'social-media-feed-widget') ?></h3>
                                <button type="button" class="lwip-back" id="lwip-post-custom-css-back-btn"><span><?php esc_html_e('Back', 'social-media-feed-widget') ?></span></button>
                            </div>
                            <div class="settings">
                                <div class="font-settings lwip-custom-container">
                                    <h3 class="lwip-custom-css-heading lwip-custom-css-heading-border"><?php esc_html_e('Font settings', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-custom-input-container">
                                        <span class="lwip-left-text"><?php esc_html_e('Family', 'social-media-feed-widget') ?></span>
                                        <select id="lwip-custom-font-family" class="lwip-select-option-dropdown">
                                            <option value="inherit" style="font-family: 'inherit';"><?php esc_html_e('No Selection', 'social-media-feed-widget') ?></option>
                                            <option value="Arial" style="font-family: 'Arial';"><?php esc_html_e('Arial', 'social-media-feed-widget') ?></option>
                                            <option value="Caveat" style="font-family: 'Caveat';"><?php esc_html_e('Caveat', 'social-media-feed-widget') ?></option>
                                            <option value="Comfortaa" style="font-family: 'Comfortaa';"><?php esc_html_e('Comfortaa', 'social-media-feed-widget') ?></option>
                                            <option value="EB Garamond" style="font-family: 'EB Garamond';"><?php esc_html_e('EB Garamond', 'social-media-feed-widget') ?></option>
                                            <option value="Lexend" style="font-family: 'Lexend';"><?php esc_html_e('Lexend', 'social-media-feed-widget') ?></option>
                                            <option value="Lobster" style="font-family: 'Lobster';"><?php esc_html_e('Lobster', 'social-media-feed-widget') ?></option>
                                            <option value="Lora" style="font-family: 'Lora';"><?php esc_html_e('Lora', 'social-media-feed-widget') ?></option>
                                            <option value="Merriweather" style="font-family: 'Merriweather';"><?php esc_html_e('Merriweather', 'social-media-feed-widget') ?></option>
                                            <option value="Montserrat" style="font-family: 'Montserrat';"><?php esc_html_e('Montserrat', 'social-media-feed-widget') ?></option>
                                            <option value="Nunito" style="font-family: 'Nunito';"><?php esc_html_e('Nunito', 'social-media-feed-widget') ?></option>
                                            <option value="Oswald" style="font-family: 'Oswald';"><?php esc_html_e('Oswald', 'social-media-feed-widget') ?></option>
                                            <option value="Pacifico" style="font-family: 'Pacifico';"><?php esc_html_e('Pacifico', 'social-media-feed-widget') ?></option>
                                            <option value="Playfair Display" style="font-family: 'Playfair Display';"><?php esc_html_e('Playfair Display', 'social-media-feed-widget') ?></option>
                                            <option value="Roboto" style="font-family: 'Roboto';"><?php esc_html_e('Roboto', 'social-media-feed-widget') ?></option>
                                            <option value="Roboto Mono" style="font-family: 'Roboto Mono';"><?php esc_html_e('Roboto Mono', 'social-media-feed-widget') ?></option>
                                            <option value="Roboto Serif" style="font-family: 'Roboto Serif';"><?php esc_html_e('Roboto Serif', 'social-media-feed-widget') ?></option>
                                            <option value="Spectral" style="font-family: 'Spectral';"><?php esc_html_e('Spectral', 'social-media-feed-widget') ?></option>
                                        </select>
                                    </div>
                                    <div class="lwip-custom-input-container">
                                        <label for="font-color"><?php esc_html_e('Color', 'social-media-feed-widget') ?></label>
                                        <input class="lwip-custom-color" type="color" id="lwip-font-color" value="#ff0000">
                                    </div>
                                </div>

                                <div class="border-settings lwip-custom-container">
                                    <h3 class="lwip-custom-css-heading lwip-custom-css-heading-border"><?php esc_html_e('Border settings', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-custom-input-container">
                                        <label for="border-width"><?php esc_html_e('Width', 'social-media-feed-widget') ?></label>
                                        <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In px">
                                            <svg class="lwip-custom-message-svg" viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                                <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                            </svg>
                                        </span>
                                        <input type="number" id="lwip-border-width" value="3" min="0" max="16" class="lwip-web-appearance">
                                    </div>
                                    <div class="lwip-custom-input-container">
                                        <label for="border-color"><?php esc_html_e('Color', 'social-media-feed-widget') ?></label>
                                        <input class="lwip-custom-color" type="color" id="lwip-border-color" value="#000000">
                                    </div>
                                </div>

                                <div class="lwip-other-settings lwip-custom-container">
                                    <h3 class="lwip-custom-css-heading lwip-custom-css-heading-border"><?php esc_html_e('Other settings', 'social-media-feed-widget') ?></h3>
                                    <div class="lwip-custom-input-container">
                                        <label for="padding"><?php esc_html_e('Padding', 'social-media-feed-widget') ?></label>
                                        <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In px">
                                            <svg class="lwip-custom-message-svg" viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                                <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                            </svg></span>
                                        <input type="number" id="lwip-card-padding" value="4" min="0" max="16" class="lwip-web-appearance">
                                    </div>
                                    <div class="lwip-custom-input-container">
                                        <label for="margin"><?php esc_html_e('Margin', 'social-media-feed-widget') ?></label>
                                        <span role="img" aria-label="question-circle" class="anticon anticon-question-circle ml-8 pointer" data-tooltip="In px">
                                            <svg class="lwip-custom-message-svg" viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                                <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                                            </svg>
                                        </span>
                                        <input type="number" id="lwip-card-margin" value="4" min="0" max="16" class="lwip-web-appearance">
                                    </div>
                                    <div class="lwip-custom-input-container">
                                        <label for="dark-mode"><?php esc_html_e('Dark Mode', 'social-media-feed-widget') ?></label>
                                        <label class="lwip-switch">
                                            <input type="checkbox" id="lwip-dark-mode-switch">
                                            <span class="lwip-slider lwip-round">
                                                <span class="lwip-slider-text lwip-on"><?php esc_html_e('on', 'social-media-feed-widget') ?></span>
                                                <span class="lwip-slider-text lwip-off"><?php esc_html_e('off', 'social-media-feed-widget') ?></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lwip-label-icon-title" id="action-setting">
                        <span class="lwip-side-menu-inner-container-heading"><?php esc_html_e('Settings', 'social-media-feed-widget') ?></span>
                        <div class="lwip-langue-container">
                            <h3 class="lwip-langue-box-heading"><?php esc_html_e('Select Language', 'social-media-feed-widget') ?></h3>
                            <div class="lwip-langue-setting-btn-drop-down">
                                <span class="lwip-left-text"><?php esc_html_e('Language', 'social-media-feed-widget') ?></span>
                                <select id="lwip-select-langues" class="lwip-select-option-dropdown">
                                    <option value="en"><?php esc_html_e('English', 'social-media-feed-widget') ?></option>
                                    <option value="az"><?php esc_html_e('Azərbaycan', 'social-media-feed-widget') ?></option>
                                    <option value="cs"><?php esc_html_e('Čeština', 'social-media-feed-widget') ?></option>
                                    <option value="da"><?php esc_html_e('Dansk', 'social-media-feed-widget') ?></option>
                                    <option value="de"><?php esc_html_e('Deutsch', 'social-media-feed-widget') ?></option>
                                    <option value="el"><?php esc_html_e('Ελληνικά', 'social-media-feed-widget') ?></option>
                                    <option value="es"><?php esc_html_e('Español', 'social-media-feed-widget') ?></option>
                                    <option value="fa"><?php esc_html_e('فارسی', 'social-media-feed-widget') ?></option>
                                    <option value="fi"><?php esc_html_e('Suomi', 'social-media-feed-widget') ?></option>
                                    <option value="fr"><?php esc_html_e('Français', 'social-media-feed-widget') ?></option>
                                    <option value="he"><?php esc_html_e('עברית', 'social-media-feed-widget') ?></option>
                                    <option value="hi"><?php esc_html_e('हिन्दी', 'social-media-feed-widget') ?></option>
                                    <option value="hr"><?php esc_html_e('Hrvatski', 'social-media-feed-widget') ?></option>
                                    <option value="hu"><?php esc_html_e('Magyar', 'social-media-feed-widget') ?></option>
                                    <option value="it"><?php esc_html_e('Italiano', 'social-media-feed-widget') ?></option>
                                    <option value="ja"><?php esc_html_e('日本語', 'social-media-feed-widget') ?></option>
                                    <option value="ko"><?php esc_html_e('한국어', 'social-media-feed-widget') ?></option>
                                    <option value="lt"><?php esc_html_e('Lietuvių', 'social-media-feed-widget') ?></option>
                                    <option value="nl"><?php esc_html_e('Nederlands', 'social-media-feed-widget') ?></option>
                                    <option value="no"><?php esc_html_e('Norsk', 'social-media-feed-widget') ?></option>
                                    <option value="pl"><?php esc_html_e('Polski', 'social-media-feed-widget') ?></option>
                                    <option value="pt"><?php esc_html_e('Português', 'social-media-feed-widget') ?></option>
                                    <option value="ro"><?php esc_html_e('Română', 'social-media-feed-widget') ?></option>
                                    <option value="ru"><?php esc_html_e('Русский', 'social-media-feed-widget') ?></option>
                                    <option value="sk"><?php esc_html_e('Slovenčina', 'social-media-feed-widget') ?></option>
                                    <option value="sl"><?php esc_html_e('Slovenščina', 'social-media-feed-widget') ?></option>
                                    <option value="sv"><?php esc_html_e('Svenska', 'social-media-feed-widget') ?></option>
                                    <option value="tr"><?php esc_html_e('Türkçe', 'social-media-feed-widget') ?></option>
                                    <option value="uk"><?php esc_html_e('Українська', 'social-media-feed-widget') ?></option>
                                    <option value="vi"><?php esc_html_e('Tiếng Việt', 'social-media-feed-widget') ?></option>
                                    <option value="zh"><?php esc_html_e('中文', 'social-media-feed-widget') ?></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lwip-content" id="lwip-main-content">
                <div class="lwip-font-header-size" id="lwip-feed-custom-header-name"></div>
                <div class="lwip-header-wrapper" id="lwip-main-header-container">
                    <div id="lwip-header-logo" class="lwip-d-flex align-center justify-center lwip-header-logo">
                        <img src="" class="lwip-instagram-logo-border" id="lwip-main-header-insta-logo" height="50px" width="50px">
                        <div class="lwip-user-info lwip-card-custom-color">
                            <div class="lwip-user-full-name" id="lwip-main-header-insta-user-fullname-container">
                                <span id="lwip-main-header-insta-user-fullname"></span>
                            </div>
                            <div class="lwip-user-name lwip-card-custom-color" id="lwip-insta-username-header"> </div>
                        </div>
                    </div>
                    <div class="lwip-user-following-info lwip-d-flex col-gap-20 lwip-card-custom-color">
                        <div class="lwip-user-count-wrapper" id="lwip-main-header-insta-posts-container">
                            <div class="lwip-font-bold lwip-font-m lwip-lwip-premium-footer-btn," data-="225" id="lwip-main-header-insta-user-post-count"> </div>
                            <div class="lwip-font-s lwip-lwip-premium-footer-btn" id="lwip-main-header-user-posts-txt"><?php esc_html_e('Posts', 'social-media-feed-widget') ?></div>
                        </div>
                        <div class="lwip-user-count-wrapper" id="lwip-main-header-insta-follow-container">
                            <div class="lwip-font-bold lwip-font-m lwip-lwip-premium-footer-btn" id="lwip-main-header-insta-user-followers-count"> </div>
                            <div class="lwip-font-s lwip-lwip-premium-footer-btn" id="lwip-main-header-user-followers-txt"><?php esc_html_e('Followers', 'social-media-feed-widget') ?></div>
                        </div>
                        <div class="lwip-user-count-wrapper" id="lwip-main-header-insta-following-container">
                            <div class="lwip-font-bold lwip-font-m lwip-lwip-premium-footer-btn" id="lwip-main-header-insta-user-following-count"> </div>
                            <div class="lwip-font-s lwip-lwip-premium-footer-btn" id="lwip-main-header-user-following-txt"><?php esc_html_e('Following', 'social-media-feed-widget') ?></div>
                        </div>
                    </div>
                    <div>
                        <a href="" class="lwip-header-follow-btn-link" id="lwip-main-header-insta-user-follow-btn-url" target="_blank">
                            <button type="button" class="lwip-ant-btn" id="lwip-main-header-user-follow-btn">
                                <svg viewBox="64 64 896 896" class="lwip-follow-button" focusable="false" data-icon="instagram" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z">
                                    </path>
                                </svg>
                                <span class="header-follows-btn"><?php esc_html_e('Follow', 'social-media-feed-widget') ?></span>
                            </button>
                        </a>
                    </div>
                </div>

                <div class="lwip-post-wrapper masonry" id="lwip-modal-preview-grid">
                </div>

                <div class="lwip-post-wrapper-slider" id="lwip-modal-preview-slider">
                </div>

                <div class="lwip-footer-wrapper" id="lwip-load-more-post-container">
                    <button type="button" id="lwip-load-more-btn" class="lwip-ant-btn">
                        <span><?php esc_html_e('Load more', 'social-media-feed-widget') ?></span>
                    </button>
                </div>
                <div class="lwip-watermark" id="lwip-free-watermark">
                    <img src="<?php echo esc_url($logo_url); ?>" alt="water mark">
                </div>
                <div id="modal" class="lwip-modal-unique">
                    <div class="lwip-modal-header-unique">

                    </div>
                    <div class="lwip-modal-body-unique" id="modals-body-unique">

                    </div>
                </div>
                <div id="overlay"></div>
            </div>
        </div>
    </div>
    <!-- Main div end -->
<?php

}
lwip_widget_builder();
?>