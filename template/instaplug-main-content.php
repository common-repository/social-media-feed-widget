<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Check if the WP_List_Table class is already defined
if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

/**
 * Coding Standard Ignore because of custom tables CRUD
 */
// @codingStandardsIgnoreStart;
/**
 * Class Lwip_List_Widgets
 *
 * This class extends the WP_List_Table class to create a custom table for managing User created widgets  
 * in the WordPress admin area. It handles the display, sorting, and pagination of created widgets 
 * data within the WordPress dashboard.
 *
 * @package    social-media-feed-widget
 * @subpackage Admin
 *
 * @since      1.0.0
 *
 * @uses       WP_List_Table
 * @uses       WP_List_Table::get_columns()       To define the columns displayed in the table.
 * @uses       WP_List_Table::prepare_items()     To prepare and retrieve the data to be shown in the table.
 * @uses       WP_List_Table::column_default()    To handle the default column data display.
 *
 * @todo       Implement methods for handling actions (e.g., bulk actions) if needed.
 */
class Lwip_List_Widgets extends WP_List_Table
{
    /**
     * Constructor for the Lwip_List_Widgets class.
     * Initializes the WP_List_Table with specific settings.
     */
    function __construct()
    {
        parent::__construct(array(
            'singular'  => 'Feed',
            'plural'    => 'Feeds',
            'ajax'      => false
        ));
    }

    /**
     * Fetches widget data from the API using the provided access token.
     *
     * @param string $access_token The access token for API authentication.
     * @return array|void The fetched widget data or void on error.
     */
    public function lwip_fetch_widgets_data($access_token)
    {
        $pagination = array(
            'limit' => 10,
            'offset' => 0
        );

        $query = '
        query GetWidgets($pagination: WidgetPaginationInput) {
            getWidgets(pagination: $pagination) {
                data {
                    id
                    name
                    filters {
                        show
                        hide
                        totalNumberOfPost
                    }
                    createdAt
                    updatedAt
                    template
                    published
                    views
                }
                count
            }
        }
    ';

        $variables = array(
            'pagination' => $pagination
        );

        $api_url = LWIP_GRAPHQL_ENDPOINT;

        $post_data = array(
            'query' => $query,
            'variables' => $variables
        );

        $args = array(
            'body' => wp_json_encode($post_data),
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $access_token
            )
        );

        $response = wp_remote_post($api_url, $args);

        if (is_wp_error($response)) {
            wp_die(esc_html__('Error: Failed to fetch data. Please try again later.', 'social-media-feed-widget'));
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);

            if ($response_code == 200) {
                $data = json_decode($response_body, true);
                if (isset($data['errors'])) {
                    echo wp_json_encode($data['errors']['message']);
                    $error_messages = array_column($data['errors'], 'message');
                    if (in_array("Your Session has expired", $error_messages)) {
                        // Token has expired, refresh it
                        $this->lwip_update_access_token();
                    } else {
                        echo wp_json_encode($data['errors']['message']);
                    }
                } else {
                    return $data['data']['getWidgets']['data'];
                }
            } else {
                wp_die(esc_html__('Error: Failed to fetch data.', 'social-media-feed-widget'));
            }
        }
    }

    /**
     * Updates the access token if it has expired.
     *
     * Retrieves a new access token using a refresh token and updates the database.
     */
    private function lwip_update_access_token()
    {

        global $wpdb;

        $user_email = sanitize_email(get_transient('lwip_user_details'));

        $refresh = $wpdb->get_row($wpdb->prepare("SELECT refresh_token, login_status FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);

        if ($refresh['login_status'] === 0) {
            echo '<div class="notice notice-warning is-dismissible"><p>' . esc_html__('Please login to retrieve data.', 'social-media-feed-widget') . '</p></div>';
        }

        // Retrieve refresh token from the database
        $refreshToken = $refresh['refresh_token'];

        $query = '
        mutation NewAccessToken($refreshToken: String!) {
            newAccessToken(refreshToken: $refreshToken)
        }
    ';

        $variables = array(
            'refreshToken' => $refreshToken
        );

        $api_url = LWIP_GRAPHQL_ENDPOINT;

        $post_data = array(
            'query' => $query,
            'variables' => $variables
        );

        $args = array(
            'body' => wp_json_encode($post_data),
            'headers' => array(
                'Content-Type' => 'application/json'
            )
        );

        $response = wp_remote_post($api_url, $args);

        if (is_wp_error($response)) {
            wp_die(esc_html__('Error: Failed to refresh access token. Please try again later.', 'social-media-feed-widget'));
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);

            if ($response_code == 200) {
                $data = json_decode($response_body, true);
                if (isset($data['errors'])) {
                    echo wp_json_encode($data['errors']['message']);
                } else {
                    // Save the new access token in the database
                    $updated_access_token = sanitize_text_field($data['data']['newAccessToken']);

                    $data_to_update = array(
                        'access_token' => $updated_access_token,
                    );
                    $where = array('email' => $user_email);
                    $result = $wpdb->update($wpdb->lwip_users, $data_to_update, $where);

                    if ($result !== false) {

                        wp_add_inline_script('lwip-admin-script', 'localStorage.setItem("accessToken", "' . esc_js($updated_access_token) . '");');
                        $this->lwip_fetch_widgets_data($updated_access_token);
                    }
                }
            } else {
                wp_die(esc_html__('Error: Failed to refresh access token', 'social-media-feed-widget'));
            }
        }
    }

    /**
     * Prepares the list of items for display.
     *
     * Retrieves widget data, processes it, and sets up columns, hidden columns, and sortable columns.
     */
    public function prepare_items()
    {
        $this->delete_rec();
        global $wpdb;

        $user_email = sanitize_email(get_transient('lwip_user_details'));

        $user_details = $wpdb->get_row($wpdb->prepare("SELECT id, access_token, login_status FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);

        if ($user_details) {
            if ($user_details['login_status'] == 0) {
                $this->items = array();
            } else {
                $access_token = sanitize_text_field($user_details['access_token']);
                $items =  $this->lwip_fetch_widgets_data($access_token);

                foreach ($items as &$item) {
                    $widget_id = sanitize_text_field($item['id']);
                    $shortcode = $wpdb->get_var($wpdb->prepare("SELECT shortcode FROM $wpdb->lwip_feeds WHERE widget_id = %s", $widget_id));
                    $item['shortcode'] = !empty($shortcode) ? esc_html($shortcode) : 'N/A';
                }
                unset($item);

                $this->items = $items;
            }
        } else {
            $this->items = array();
        }

        // Columns setup
        $columns = $this->get_columns();
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = array($columns, $sortable);
        $this->process_bulk_action();

        // Check if no items and user not logged in, display the login notice
        if (empty($this->items) && (!$user_details || $user_details['login_status'] == 0)) {
            echo '<div class="notice notice-warning is-dismissible"><p>'  . esc_html__('Please login to retrieve data.', 'social-media-feed-widget') . '</p></div>';
        }
    }

    /**
     * Returns an array of bulk actions for the table.
     *
     * @return array List of bulk actions with their labels.
     */
    public function get_bulk_actions()
    {
        $actions = array(
            "delete" => "Delete"
        );
        return $actions;
    }

    /**
     * Returns an array of columns for the table.
     *
     * @return array List of column slugs and their labels.
     */
    public function get_columns()
    {
        $columns = array(
            "cb" => "<input type='checkbox' class='bulk-selected'>",
            "name" => "Name",
            "views" => "Views",
            "shortcode" => "Shortcode",
            "date" => "Last Modified",
            "published" => "Publish status",
            "actions" => "Actions"
        );
        return $columns;
    }

    /**
     * Displays the checkbox column in the table.
     *
     * @param array $item The data item for the row.
     * @return string HTML for the checkbox column.
     */
    public function column_cb($item)
    {
        return sprintf('<input type="checkbox" class="bulk-selected" name="bulk-selected[]" value="%s"/>',  $item['id']);
    }

    /**
     * Displays the content for a specific column in the table.
     *
     * @param array $item The data item for the row.
     * @param string $column_name The name of the column.
     * @return string HTML for the column content.
     */
    public function column_default($item, $column_name)
    {
        $edit_link = sprintf('?page=lwip_feed_builder_settings&action=edit&feed_id=%s', is_object($item) ? $item->id : (isset($item['id']) ? $item['id'] : ''));

        $value = '';
        switch ($column_name) {
            case 'name':
                $value = sprintf('<a href="%s">%s</a>', $edit_link, esc_html($item['name']));
                break;
            case 'views':
                $value = '<span> ' . esc_html($item['views']) . ' / ' . esc_html__('100000', 'social-media-feed-widget') . ' </span>';
                break;
            case 'shortcode':
                $shortcode = sprintf('[instaplug feed="%s"]', esc_attr($item['shortcode']));
                $encoded_shortcode = htmlspecialchars($shortcode);
                if ($item['shortcode'] === 'N/A') {
                    $value = '<div class="button-primary" onclick="openGeneratePopup(\'' . esc_attr($item['id']) . '\')">' .  esc_html__('Generate', 'social-media-feed-widget') . '</div>';
                } else {
                    $value = sprintf(
                        '%s <div class="lwip-tooltip"><button class="copy-shortcode" data-shortcode="%s" onclick="copyToClipboard(event, this)" onmouseout="outFunc()"><span class="tooltiptext" id="myTooltip">%s</span>%s</button></div>',
                        $encoded_shortcode,
                        $encoded_shortcode,
                        __('Copy to clipboard', 'social-media-feed-widget'),
                        __('Copy text', 'social-media-feed-widget')
                    );
                }
                break;
            case 'date':
                $dateString = $item['updatedAt'];
                $dateTime = new DateTime($dateString);
                $formattedDate = $dateTime->format('d-m-Y');
                $value = '<span> ' . esc_html($formattedDate) . ' </span>';
                break;
            case 'published':
                if ($item['published'] === false) {
                    $value = '<span class="ip-unpublished-widget">' . esc_html__('Un-published ', 'social-media-feed-widget')  . '</span>';
                } else {
                    $value = '<span class="ip-published-widget ip-pw-btn">' .  esc_html__('Published', 'social-media-feed-widget')  . '</span>';
                }
                break;
            case 'actions':
                $value = sprintf(
                    '<a href="%s">' . esc_html__('Edit', 'social-media-feed-widget') .  '</a> | <a href="#" class="delete-widget" data-widget-id="%s">' . esc_html__('Delete', 'social-media-feed-widget') . '</a>',
                    $edit_link,
                    esc_attr(is_object($item) ? $item->id : (isset($item['id']) ? $item['id'] : ''))
                );
                break;
            default:
                $value = "No Value";
        }

        return $value;
    }

    /**
     * Deletes records based on selected checkboxes or bulk actions.
     *
     * Processes the deletion of records both from the database and the API.
     */
    public function delete_rec()
    {
        global $wpdb;

        // Check if nonce is set and valid
        if (!isset($_POST['lwip_delete_feed_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['lwip_delete_feed_nonce'])), 'lwip_delete_feed')) {
            return;
        }

        //For multiple delete
        if (isset($_REQUEST['bulk-selected']) && is_array($_REQUEST['bulk-selected']) && !empty($_REQUEST['bulk-selected'])) {
            $user_email = sanitize_email(get_transient('lwip_user_details'));
            $user_details = $wpdb->get_row($wpdb->prepare("SELECT id, access_token FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);
            $access_token = sanitize_text_field($user_details['access_token']);
            $bulk_selected = array_map('sanitize_text_field', wp_unslash($_REQUEST['bulk-selected']));

            foreach ($bulk_selected as $feed_id) {
                $feed_id = sanitize_text_field($feed_id);
                $wpdb->delete($wpdb->lwip_feeds, array('widget_id' => $feed_id));
                $mutation_data = array(
                    'where' => array(
                        'id' => $feed_id
                    )
                );

                $api_url = LWIP_GRAPHQL_ENDPOINT;

                $post_data = array(
                    'query' => 'mutation removeWidget($where: WidgetWhereUniqueInput!) {
                                        removeWidget(where: $where) {
                                            message
                                        }
                                    }',
                    'variables' => $mutation_data
                );

                $args = array(
                    'body' => wp_json_encode($post_data),
                    'headers' => array(
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer ' . $access_token
                    )
                );

                $response = wp_remote_post($api_url, $args);
                if (is_wp_error($response)) {
                    //Handle error 
                } else {
                    $response_code = wp_remote_retrieve_response_code($response);
                    if ($response_code == 200) {
                        // handle Success
                    } else {
                        echo esc_html__('Error: Non-200 response code', 'social-media-feed-widget');
                    }
                }
            }
            echo '<div class="notice notice-success is-dismissible">
                <p>' . esc_html__('Deleted Successfully.', 'social-media-feed-widget') . '</p>
            </div>';
        }
    }
}

/**
 * Renders the layout for the Instagram feeds list table on the dashboard.
 *
 * Initializes the Lwip_List_Widgets instance, prepares the table items, 
 * and displays the table if the user is logged in. Generates the necessary form 
 * and nonce field for handling bulk delete actions.
 */
function lwip_widgets_dashboard_layout()
{
    $list_table = new Lwip_List_Widgets();
    $list_table->prepare_items();

    $user_email = sanitize_email(get_transient('lwip_user_details'));

    global $wpdb;
    $user_details = $wpdb->get_row($wpdb->prepare("SELECT id, access_token, login_status FROM $wpdb->lwip_users WHERE email = %s", $user_email), ARRAY_A);
    // @codingStandardsIgnoreEnd
?>
    <h1><?php esc_html_e('Dashboard', 'social-media-feed-widget') ?></h1>

    <?php
    // Check if the user is logged in
    if ($user_details && $user_details['login_status'] == 1) {
    ?>
        <div class="lwip-widget-dashboard">
            <div class="lwip-widget-header" id="lwip-widget-view-plan-container">
                <button class="lwip-widget-view-plans"><?php esc_html_e('View plans', 'social-media-feed-widget') ?></button> <span id="lwip-free-user-icon"><button type="button" class="lwip-widget-free-user-icon"><span class="lwip-ant-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" class="" height="20" width="20">
                                <g>
                                    <g fill="#ffb743">
                                        <path d="M2.837 20.977 1.012 9.115c-.135-.876.863-1.474 1.572-.942l5.686 4.264a1.359 1.359 0 0 0 1.945-.333l4.734-7.1c.5-.75 1.602-.75 2.102 0l4.734 7.1a1.359 1.359 0 0 0 1.945.333l5.686-4.264c.71-.532 1.707.066 1.572.942l-1.825 11.862zM27.79 27.559H4.21a1.373 1.373 0 0 1-1.373-1.373v-3.015h26.326v3.015c0 .758-.615 1.373-1.373 1.373z" fill="#ffb743" opacity="1" data-original="#ffb743" class=""></path>
                                    </g>
                                </g>
                            </svg></span><span><?php esc_html_e('Upgrade', 'social-media-feed-widget') ?></span></button></span>
            </div>
            <div class="lwip-widget-cards">
                <div class="lwip-widget-card">
                    <h2><?php esc_html_e('Active plan information', 'social-media-feed-widget') ?></h2>
                    <span class="lwip-widget-badge-free" id="lwip-free-widget-batch"> <?php esc_html_e('Free', 'social-media-feed-widget') ?></span>
                    <span class="lwip-widget-badge" id="lwip-life-time-deal-widget-batch"> <?php esc_html_e('Life Time Deal', 'social-media-feed-widget') ?></span>
                </div>
                <div class="lwip-widget-card">
                    <h2><?php esc_html_e('Widgets limit', 'social-media-feed-widget') ?></h2>
                    <span id="lwip-widget-usage"> </span> <span>/</span> <span id="lwip-widget-limit"></span>
                </div>
            </div>
        </div>

        <button href='' id='lwip-open-create-widget-popup' class='lwip-open-popup-crt-btn'>
            <span role="img" aria-label="plus" class="lwip-open-popup-plus-svg">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                    <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
                </svg>
            </span>
            <span class="lwip-open-popup-crt-btn-txt"><?php esc_html_e('Create Widget', 'social-media-feed-widget') ?></span>
        </button>
    <?php
    }
    ?>
    <div id='lwip-popup'>
        <form id='lwip-create-new-widget-frm'>
            <div class="lwip-widget-form-header"><?php esc_html_e('Enter widget name', 'social-media-feed-widget') ?></div>

            <input type='text' id='lwip-widget-name' name='lwip-widget-name' placeholder='<?php esc_attr_e('Enter widget name', 'social-media-feed-widget'); ?>' required>
            <div class="lwip-widget-form-btns">

                <div class="lwip-widget-form-cncl-btns">
                    <button class='ip-create-widget-btn ip-cncl-btn' type="button" onclick='closePopupByButton()'><?php esc_html_e('Cancel', 'social-media-feed-widget') ?></button><br>
                </div>

                <div class="lwip-widget-form-crt-btns">
                    <button class='ip-create-widget-btn ip-crt-btn' type='submit' id='lwip-create-widget-save-btn'><?php esc_html_e('Create', 'social-media-feed-widget') ?></button><br>
                </div>

            </div>
            <span class="lwip-error-message" id="create-widget-error-message"></span>
            <span class="lwip-success-message" id="create-widget-success-message"></span>
        </form>
        <button href="<?php echo esc_url(LWIP_SCRIPT_ENDPOINT) . 'manage-pricing'; ?>" id="lwip-buy-premium-btn" class="button-primary" style="display: none;"><?php esc_html_e('Buy Premium', 'social-media-feed-widget') ?></button>
    </div>

    <div id='lwip-generate-widget-custom-shortcode'>
        <form id='lwip-generate-shortcode'>
            <h2><?php esc_html_e('Generate Shortcode', 'social-media-feed-widget') ?></h2> <span class='lwip-close-btn dashicons dashicons-no' id='close-generate' onclick='closeGeneratePopup()'></span>

            <input type='hidden' id='lwip-generate-widget-id'>
            <input type='text' id='lwip-new-shortcode' name='lwip-new-shortcode' placeholder='<?php esc_attr_e('Enter new shortcode', 'social-media-feed-widget'); ?>' required>
            <button class='button-primary' type='submit'><?php esc_html_e('Generate', 'social-media-feed-widget') ?></button><br>
            <span class="lwip-error-message" id="generate-error-message"></span>
            <span class="lwip-success-message" id="generate-success-message"></span>
        </form>
    </div>

<?php
    echo "<form action='" . esc_url(LWIP_ADMIN_URL) . "' method='post'>";
    wp_nonce_field('lwip_delete_feed', 'lwip_delete_feed_nonce');
    $list_table->display();
    echo "</form>";
}

lwip_widgets_dashboard_layout();
