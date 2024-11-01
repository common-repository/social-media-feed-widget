<?php

/**
 * Lwip_Instaplug_Ajax_Management Class
 *
 * Manages various functionalities of the social-media-feed-widget plugin,
 * including user sign-up, login, widget data management,
 * shortcode generation, and user validation.
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 *
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 */
// @codingStandardsIgnoreStart;
class Lwip_Instaplug_Ajax_Management
{
    /**
     * @since 1.0.0 
     */
    public static function init()
    {
        add_action('init', array(__CLASS__, 'lwip_set_table_name'));
        add_action('wp_ajax_lwip_store_signup_data', array(__CLASS__, 'lwip_store_signup_data_cb'));
        add_action('wp_ajax_lwip_store_login_data', array(__CLASS__, 'lwip_store_login_data_cb'));
        add_action('wp_ajax_lwip_create_shortcode', array(__CLASS__, 'lwip_create_shortcode_cb'));
        add_action('wp_ajax_lwip_delete_user_widget', array(__CLASS__, 'lwip_delete_user_widget_cb'));
        add_action('wp_ajax_lwip_user_logout', array(__CLASS__, 'lwip_user_logout_cb'));
        add_action('wp_ajax_lwip_disconnect_account', array(__CLASS__, 'lwip_disconnect_account_cb'));
        add_action('wp_ajax_lwip_store_publish_widget', array(__CLASS__, 'lwip_store_publish_widget_cb'));
        add_action('wp_ajax_lwip_store_account_type', array(__CLASS__, 'lwip_store_account_type_cb'));
        add_action('wp_ajax_lwip_generate_shortcode', array(__CLASS__, 'lwip_generate_shortcode_cb'));
        add_action('wp_ajax_lwip_validate_loggedIn_user', array(__CLASS__, 'lwip_validate_loggedIn_user_cb'));
        add_action('lwip_remove_token', array(__CLASS__, 'lwip_remove_token_cb'));
    }

    /**
     * Callback function to handle custom table registration.
     * this function responsible for adding custom tables in global wpdb array
     */
    public static function lwip_set_table_name()
    {
        global $wpdb;

        $user_table          = 'lwip_users';
        $feeds_table          = 'lwip_feeds';

        $wpdb->lwip_users          = $wpdb->prefix . $user_table;
        $wpdb->lwip_feeds          = $wpdb->prefix . $feeds_table;

        $wpdb->tables[] = 'lwip_users';
        $wpdb->tables[] = 'lwip_feeds';
    }

    /**
     * Callback function to handle user sign-up data.
     */
    public static function lwip_store_signup_data_cb()
    {

        if (!isset($_POST['lwip_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['lwip_nonce'])), 'lwip_signup_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if (isset($_POST['user_data']) && !empty($_POST['user_data']) && isset($_POST['verification_data']) && !empty($_POST['verification_data'])) {

            // Decode JSON data received via POST
            $user_data = json_decode(sanitize_text_field(wp_unslash($_POST['user_data'])), true);
            $verification_data = json_decode(sanitize_text_field(wp_unslash($_POST['verification_data'])), true);

            // Extract user details
            $user_id = sanitize_text_field($user_data['id']);
            $user_email = sanitize_email($user_data['email']);
            $user_password = wp_hash_password(sanitize_text_field($user_data['password']));
            $verification_message = sanitize_text_field($verification_data['message']);
            $user_access_token = sanitize_text_field($verification_data['accessToken']);
            $user_refresh_token = sanitize_text_field($verification_data['refreshToken']);

            // Extract additional user details
            $user_first_name = sanitize_text_field($user_data['firstName']);
            $user_last_name = sanitize_text_field($user_data['lastName']);
            $user_date_of_birth = sanitize_text_field($user_data['dateOfBirth']);
            $user_phone_number = sanitize_text_field($user_data['phoneNo']);
            $user_occupation = sanitize_text_field($user_data['occupation']);
            $user_roles = sanitize_text_field($user_data['roles']);
            $user_auth_provider = sanitize_text_field($user_data['authProvider']);
            $user_auth_ref_data = sanitize_text_field($user_data['authRefData']);
            $user_auth_ref_id = sanitize_text_field($user_data['authRefId']);

            // Prepare user details as JSON
            $user_details = wp_json_encode(array(
                'first_name' => $user_first_name,
                'last_name' => $user_last_name,
                'date_of_birth' => $user_date_of_birth,
                'occupation' => $user_occupation,
                'phone_number' => $user_phone_number,
                'roles' => $user_roles,
                'auth_provider' => $user_auth_provider,
                'auth_ref_data' => $user_auth_ref_data,
                'auth_ref_id' => $user_auth_ref_id
            ));

            // Prepare data for insertion
            $data_to_insert = array(
                'lwip_user_id' => $user_id,
                'email' => $user_email,
                'password' => $user_password,
                'message' => $verification_message,
                'lwip_user_details' => $user_details,
                'access_token' => $user_access_token,
                'refresh_token' => $user_refresh_token,
                'login_status' => true
            );

            // Perform database insertion
            $inserted_id = $wpdb->insert($wpdb->lwip_users, $data_to_insert);

            // Handle success or failure
            if ($inserted_id) {
                set_transient('lwip_user_details', $user_email, MONTH_IN_SECONDS * 2);
                wp_send_json_success(array('message' => __('Data stored successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message' => __('Failed to store data.', 'social-media-feed-widget')));
            }

            wp_die();
        }
    }

    /**
     * Callback function to handle user login data.
     */
    public static function lwip_store_login_data_cb()
    {
        //Validate nonce
        if (!isset($_POST['login_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['login_nonce'])), 'lwip_login_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if (isset($_POST['login_data']) && !empty($_POST['login_data']) && isset($_POST['email']) && !empty($_POST['email'])) {

            // Decode JSON data received via POST
            $login_data = json_decode(sanitize_text_field(wp_unslash($_POST['login_data'])), true);
            $user_email = sanitize_email($_POST['email']);

            // Extract login details
            $verification_message = sanitize_text_field($login_data['message']);
            $user_access_token = sanitize_text_field($login_data['accessToken']);
            $user_refresh_token = sanitize_text_field($login_data['refreshToken']);

            //Get Existing user
            $existing_user = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);

            // Update or insert data based on user existence
            if ($existing_user) {
                // Update existing entry
                $data_to_update = array(
                    'message' => $verification_message,
                    'access_token' => $user_access_token,
                    'refresh_token' => $user_refresh_token,
                    'login_status' => true
                );
                $where = array('email' => $user_email);
                $result = $wpdb->update($wpdb->lwip_users, $data_to_update, $where);
            } else {
                // Insert new entry
                $data_to_insert = array(
                    'email' => $user_email,
                    'message' => $verification_message,
                    'access_token' => $user_access_token,
                    'refresh_token' => $user_refresh_token,
                    'login_status' => true
                );
                $result = $wpdb->insert($wpdb->lwip_users, $data_to_insert);
            }

            // Handle success or failure
            if ($result !== false) {
                set_transient('lwip_user_details', $user_email, MONTH_IN_SECONDS * 2);
                wp_send_json_success(array('message' => __('Data updated successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message' => __('Failed to update data.', 'social-media-feed-widget')));
            }
        }
    }

    /**
     * Callback function to create a shortcode at widget creation time.
     */
    public static function lwip_create_shortcode_cb()
    {
        //Validate nonce
        if (!isset($_POST['create_shortcode_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['create_shortcode_nonce'])), 'lwip_create_shortcode_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if (isset($_POST['data']) && !empty($_POST['data']) && isset($_POST['email']) && !empty($_POST['email'])) {

            $email = sanitize_email($_POST['email']);
            $data = json_decode(sanitize_text_field(wp_unslash($_POST['data'])), true);

            $parent_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM $wpdb->lwip_users WHERE email = %s", $email));

            if (!empty($parent_id)) {
                $feed = sanitize_text_field($data['name']);
                $widget_id = sanitize_text_field($data['id']);

                // Ensure $feed is unique by appending a counter if it already exists in the database
                $original_feed = $feed;
                $counter = 1;
                while ($wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $wpdb->lwip_feeds WHERE lwip_user_id = %d AND shortcode = %s",
                    $parent_id,
                    $feed
                )) > 0) {
                    $feed = $original_feed . $counter;
                    $counter++;
                }

                //prrpare data to insert
                $shortcode_data = array(
                    'widget_id' => $widget_id,
                    'lwip_user_id' => $parent_id,
                    'shortcode' => $feed
                );

                $result =  $wpdb->insert($wpdb->lwip_feeds, $shortcode_data);
                if ($result) {
                    wp_send_json_success(array('message' => __('Shortcode created successfully.', 'social-media-feed-widget')));
                } else {
                    wp_send_json_error(array('message' => __('Something went wrong', 'social-media-feed-widget')));
                }
            } else {
                wp_send_json_error(array('result' => __('Not getting data', 'social-media-feed-widget')));
            }
        }
        wp_die();
    }

    /**
     * Callback function to delete a user widget.
     */
    public static function lwip_delete_user_widget_cb()
    {
        // Verify nonce
        if (!isset($_POST['delete_widget_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['delete_widget_nonce'])), 'lwip_delete_widget_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            return;
        }

        global $wpdb;

        // Check if data is set and not empty
        if (isset($_POST['data']) && !empty($_POST['data'])) {
            $widget_id = sanitize_text_field($_POST['data']);

            // Attempt to delete the widget
            $result = $wpdb->delete(
                $wpdb->lwip_feeds,
                array('widget_id' => $widget_id)
            );

            // Check if the delete operation was successful
            if ($result !== false) {
                wp_send_json_success(array('message' => __('Widget delete successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(__('Error deleting widget.', 'social-media-feed-widget'));
            }
        } else {
            wp_send_json_error(__('Invalid widget ID.', 'social-media-feed-widget'));
        }
    }

    /**
     * Callback function to handle user logout.
     */
    public static function lwip_user_logout_cb()
    {
        // Verify nonce
        if (!isset($_POST['logout_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['logout_nonce'])), 'lwip_logout_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if ($_POST['email'] && !empty($_POST['email'])) {

            $user_email = sanitize_email($_POST['email']);

            $data_to_update = array(
                'login_status' => 0
            );
            $where = array('email' => $user_email);

            $result = $wpdb->update($wpdb->lwip_users, $data_to_update, $where);
            delete_transient('lwip_user_details');
            if ($result !== false) {
                wp_send_json_success(array('message' => __('Logged out successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message' => __('Logged out failed.', 'social-media-feed-widget')));
            }
        } else {
            wp_send_json_error(__('No email available', 'social-media-feed-widget'));
        }
    }

    /**
     * Callback function to disconnect an account.
     */
    public static function lwip_disconnect_account_cb()
    {
        // Verify nonce
        if (!isset($_POST['dissconnect_account_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dissconnect_account_nonce'])), 'lwip_dissconnect_account_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if ($_POST['widgetId'] && !empty($_POST['widgetId'])) {
            $widget_id = sanitize_text_field($_POST['widgetId']);

            $data_to_update = array(
                'ig_token' => Null
            );
            $where = array('widget_id' => $widget_id);

            $result = $wpdb->update($wpdb->lwip_feeds, $data_to_update, $where);

            if ($result !== false) {
                wp_send_json_success(array('message' => __('Account disconnected successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(__('Failed', 'social-media-feed-widget') . ' ' . $widget_id);
            }
        } else {
            wp_send_json_error(__('No widget available', 'social-media-feed-widget'));
        }
    }

    /**
     * Callback function to store account type.
     */
    public static function lwip_store_account_type_cb()
    {

        // Verify nonce
        if (!isset($_POST['account_type_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['account_type_nonce'])), 'lwip_account_type_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if (isset($_POST['accountType']) && !empty($_POST['accountType']) && isset($_POST['widgetId']) && !empty($_POST['widgetId'])) {
            $account_type = sanitize_text_field($_POST['accountType']);
            $widget_id = sanitize_text_field($_POST['widgetId']);

            $data_to_update = array(
                'ac_type' => $account_type
            );
            $where = array('widget_id' => $widget_id);

            $result = $wpdb->update($wpdb->lwip_feeds, $data_to_update, $where);

            if ($result !== false) {
                wp_send_json_success(array('message' => __('Account type store successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message' => __('Account type store failed.', 'social-media-feed-widget')));
            }
        } else {
            wp_send_json_error(array('result' => __('Not getting data', 'social-media-feed-widget')));
        }

        wp_die();
    }

    /**
     * Callback function to generate a shortcode.
     */
    public static function lwip_generate_shortcode_cb()
    {
        // Verify nonce
        if (!isset($_POST['generate_shortcode_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['generate_shortcode_nonce'])), 'lwip_generate_shortcode_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        // Ensure required fields are present
        if (!isset($_POST['email']) && empty($_POST['email']) && !isset($_POST['data']) && empty($_POST['data'])) {
            wp_send_json_error(array('message' => __('Invalid request.', 'social-media-feed-widget')));
            wp_die();
        }

        $email = sanitize_email($_POST['email']);
        $data = json_decode(sanitize_text_field(wp_unslash($_POST['data'])), true);

        // Fetch the parent ID
        $parent_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM $wpdb->lwip_users WHERE email = %s", $email));

        if (!$parent_id) {
            wp_send_json_error(array('message' => __('User not found.', 'social-media-feed-widget')));
            wp_die();
        }

        if ($data) {
            $widget_id = sanitize_text_field($data['id']);
            $feed = sanitize_text_field($data['shortcode']);

            // Ensure $feed is unique by appending a counter if it already exists in the database
            $original_feed = $feed;
            $counter = 1;
            while ($wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $wpdb->lwip_feeds WHERE lwip_user_id = %d AND shortcode = %s",
                $parent_id,
                $feed
            )) > 0) {
                $feed = $original_feed . $counter;
                $counter++;
            }

            // Check if the widget already exists for this user
            $existing_entry = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM  $wpdb->lwip_feeds WHERE lwip_user_id = %d AND widget_id = %s",
                $parent_id,
                $widget_id
            ));

            if ($existing_entry) {
                // Widget already exists, update the shortcode
                $data_to_update = array(
                    'shortcode' => $feed
                );
                $where = array('widget_id' => $widget_id);

                $result = $wpdb->update($wpdb->lwip_feeds, $data_to_update, $where);

                if ($result !== false) {
                    wp_send_json_success(array('message' => __('Shortcode generated successfully.', 'social-media-feed-widget')));
                } else {
                    wp_send_json_error(array('message' => __('Failed to update shortcode.', 'social-media-feed-widget')));
                }
            } else {
                // Widget does not exist, insert new entry
                $shortcode_data = array(
                    'widget_id' => $widget_id,
                    'lwip_user_id' => $parent_id,
                    'shortcode' => $feed
                );

                $result = $wpdb->insert($wpdb->lwip_feeds, $shortcode_data);

                if ($result) {
                    wp_send_json_success(array('message' => __('Shortcode generated successfully.', 'social-media-feed-widget')));
                } else {
                    wp_send_json_error(array('message' => __('Failed to save shortcode.', 'social-media-feed-widget')));
                }
            }
        } else {
            wp_send_json_error(array('message' => __('Invalid data received.', 'social-media-feed-widget')));
        }

        wp_die();
    }

    /**
     * Callback function to validate logged-in user.
     */
    public static function lwip_validate_loggedIn_user_cb()
    {
        // Verify nonce
        if (!isset($_POST['validate_loggedIn_user_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['validate_loggedIn_user_nonce'])), 'lwip_validate_loggedIn_user_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        $validate_user = get_transient('lwip_user_details') !== false;

        if ($validate_user) {

            $email = get_transient('lwip_user_details');

            if (!empty($email) && is_email($email)) {
                $login_status = $wpdb->get_var($wpdb->prepare("SELECT login_status FROM $wpdb->lwip_users WHERE email = %s", $email));
            }

            if ($login_status == 1) {
                $access_token = $wpdb->get_var($wpdb->prepare("SELECT access_token FROM $wpdb->lwip_users WHERE email = %s", $email));
                wp_send_json_success(array('access_token' => $access_token, 'usermail' => $email, 'message' => __('User Logged In Successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message' => __('User is not logged in.', 'social-media-feed-widget')));
            }
        } else {
            wp_send_json_error(array('message' => __('Invalid data received.', 'social-media-feed-widget')));
        }
        wp_die();
    }

    /**
     * Callback function to publish.
     */
    public static function lwip_store_publish_widget_cb()
    {
        // Verify nonce
        if (!isset($_POST['publsh_widget_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['publsh_widget_nonce'])), 'lwip_publsh_widget_action')) {
            wp_send_json_error(array('message' => __('Invalid nonce.', 'social-media-feed-widget')));
            wp_die();
        }

        global $wpdb;

        if (isset($_POST['widgetId']) && !empty($_POST['widgetId'])) {

            $widgetId = sanitize_text_field($_POST['widgetId']);

            // Construct the feed settings HTML
            $feed_settings = true;

            $data_to_update = array(
                'feed_setting' => $feed_settings
            );
            $where = array('widget_id' => $widgetId);

            $result = $wpdb->update($wpdb->lwip_feeds, $data_to_update, $where);

            if ($result !== false) {
                wp_send_json_success(array('message' => __('Widget store successfully.', 'social-media-feed-widget')));
            } else {
                wp_send_json_error(array('message ' => __('failed', 'social-media-feed-widget')));
            }
        } else {
            wp_send_json_error(array('result' => __('Not getting data', 'social-media-feed-widget')));
        }

        wp_die();
    }

    // Custome script for remove token
    public static function lwip_remove_token_cb()
    {

        // Add the inline script that manipulates localStorage and the URL
        $inline_js = "
          localStorage.setItem('connectStatus', true);
          var url = window.location.href;
          var urlObj = new URL(url);
          urlObj.searchParams.delete('token');
          history.replaceState(null, '', urlObj.href);
      ";
        wp_add_inline_script('lwip-admin-insta-content-script', wp_kses($inline_js, array()));
    }
}
// @codingStandardsIgnoreEnd
