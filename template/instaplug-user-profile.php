<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
/**
 * Include the header template file for the social-media-feed-widget plugin.
 *
 * This file typically contains HTML and PHP code for rendering the top section
 * of the plugin's admin interface.
 */
require_once LWIP_PLUGIN_DIR . 'template/instaplug-header.php';
?>

<!-- HTML content for the social-media-feed-widget plugin user profile interface -->

<div class="lwip-profile-back-btn lwip-back-btn">
    <div class="lwip-user-profile-header">
        <span> <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
            </svg></span>
        <span><?php esc_html_e('Go Back', 'social-media-feed-widget') ?></span>
    </div>
</div>
<div class="lwip-user-profile-container">
    <div class="lwip-user-profile-form-card">
        <form id="lwip-user-profile-frm">

            <div class="lwip-user-profile-form-header">
                <h1 class="lwip-user-profile-form-card-heading"><?php esc_html_e('Profile', 'social-media-feed-widget') ?></h1>
                <div class="lwip-user-profile-btn-group">
                    <button type="button" class="lwip-user-profile-btn lwip-btn-danger lwip-back-btn"><?php esc_html_e('Cancel', 'social-media-feed-widget') ?></button>
                    <button type="submit" class="lwip-user-profile-btn lwip-btn-primary" id="lwip-save-user-updated-data"><?php esc_html_e('Save', 'social-media-feed-widget') ?></button>
                </div>
            </div>

            <div class="lwip-user-profile-form-card-body">
                <div class="lwip-user-profile-form-item">
                    <label for="firstName"><?php esc_html_e('First Name', 'social-media-feed-widget') ?></label>
                    <input type="text" id="lwip-user-profile-first-name" placeholder="<?php esc_attr_e('Enter First Name', 'social-media-feed-widget'); ?>" value="">
                    <button type="button" class="lwip-clear-input" id="lwip-clear-fname">&times;</button>

                    <span class="lwip-error-message" id="update-fname-error-message"></span>
                </div>
                <div class="lwip-user-profile-form-item">
                    <label for="lastName"><?php esc_html_e('Last Name', 'social-media-feed-widget') ?></label>
                    <input type="text" id="lwip-user-profile-last-name" placeholder="<?php esc_attr_e('Enter Last Name', 'social-media-feed-widget'); ?>" value="">
                    <button type="button" class="lwip-clear-input" id="lwip-clear-lname">&times;</button>
                    <span class="lwip-error-message" id="update-lname-error-message"></span>
                </div>
                <div class="lwip-user-profile-form-item">
                    <label for="email"><?php esc_html_e('Email', 'social-media-feed-widget') ?></label>
                    <input type="text" id="lwip-user-profile-email" placeholder="<?php esc_attr_e('Enter Email', 'social-media-feed-widget'); ?>" value="" disabled>
                </div>
            </div>
        </form>
    </div>

    <div class="lwip-user-profile-form-card" id="lwip-change-password-frm">
        <form id="lwip-change-user-password-frm">
            <div class="lwip-user-profile-form-header">
                <h1 class="lwip-user-profile-form-card-heading"><?php esc_html_e('Change Password', 'social-media-feed-widget') ?></h1>
                <div class="lwip-user-profile-btn-group">
                    <button type="button" class="lwip-user-profile-btn lwip-btn-danger lwip-back-btn"><?php esc_html_e('Cancel', 'social-media-feed-widget') ?></button>
                    <button type="submit" class="lwip-user-profile-btn lwip-btn-primary"><?php esc_html_e('Save', 'social-media-feed-widget') ?></button>
                </div>
            </div>
            <div class="lwip-user-profile-form-card-body">

                <div class="lwip-user-profile-form-item">
                    <label for="newPassword"><?php esc_html_e('New Password', 'social-media-feed-widget') ?></label>
                    <input type="password" id="lwip-user-new-password" placeholder="<?php esc_attr_e('Enter new password', 'social-media-feed-widget'); ?>">
                    <button type="button" class="lwip-clear-input-password" id="lwip-clear-password">&times;</button>
                    <span class="lwip-toggle-password" id="lwip-toggle-password-visibility">
                        <i class="fa fa-eye-slash" aria-hidden="true"></i>
                    </span>
                    <span class="lwip-error-message" id="lwip-changed-password-error-message"></span>
                </div>
                <div class="lwip-user-profile-form-item">
                    <label for="confirmPassword"><?php esc_html_e('Confirm Password', 'social-media-feed-widget') ?></label>
                    <input type="password" id="lwip-user-confirm-password" placeholder="<?php esc_attr_e('Re-enter password ', 'social-media-feed-widget'); ?>">
                    <button type="button" class="lwip-clear-input-password" id="lwip-clear-confirm-password">&times;</button>
                    <span class="lwip-toggle-password" id="lwip-toggle-confirm-password-visibility">
                        <i class="fa fa-eye-slash" aria-hidden="true"></i>
                    </span>
                    <span class="lwip-error-message" id="lwip-confirm-password-error-message"></span>
                </div>

            </div>
        </form>
    </div>
</div>