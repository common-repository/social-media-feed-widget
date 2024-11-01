<?php

/**
 * Fired during plugin activation
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 *
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 * @author     Logicwind Pvt. Ltd
 */
class Lwip_Instaplug_Management_Activator
{

    /**
     * Runs activation processes for the plugin.
     *
     * @since    1.1.0
     * @param    bool    $network_wide    Whether the plugin is being activated network-wide.
     */
    public static function lwip_activate($network_wide)
    {
        if (is_multisite() && $network_wide) {
            // Loop through each site in the network and activate the plugin.
            $sites = get_sites();

            foreach ($sites as $site) {
                switch_to_blog($site->blog_id);
                self::create_tables();
                restore_current_blog();
            }
        } else {
            // Single site activation
            self::create_tables();
        }
    }

    /**
     * Create the required tables for the plugin.
     *
     * @since    1.1.0
     */
    public static function create_tables()
    {

        global $wpdb, $table_prefix;
        $charset_collate = $wpdb->get_charset_collate();

        $user_table = $wpdb->prefix . 'lwip_users';
        $feed_table = $wpdb->prefix . 'lwip_feeds';

        /**
         * lwip_users responsible for store user data
         */
        $user_table_query = "CREATE TABLE IF NOT EXISTS $user_table (
        `id` INT NOT NULL AUTO_INCREMENT,
        `lwip_user_id` VARCHAR(50) NULL,
        `email` VARCHAR(255) NULL,
        `password` TEXT NULL,
        `access_token` TEXT NULL,
        `refresh_token` TEXT NULL,
        `message` VARCHAR(100) NULL,
        `lwip_user_details` TEXT NULL,
        `login_status` BOOLEAN DEFAULT FALSE,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
        ) $charset_collate;";

        /**
         * lwip_users responsible for store user feeds data
         */
        $feed_table_query = "CREATE TABLE IF NOT EXISTS $feed_table (
        `feed_id` INT NOT NULL AUTO_INCREMENT,
        `widget_id` VARCHAR(50) NULL,
        `shortcode` VARCHAR(256) NULL,
        `ig_token` TEXT NULL,
        `lwip_user_id` INT NULL,
        `feed_setting` TEXT NULL,
        `ac_type` VARCHAR(20) NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`feed_id`),
        CONSTRAINT `fk_{$wpdb->prefix}lwip_feeds_lwip_user_id` FOREIGN KEY (`lwip_user_id`) REFERENCES `{$wpdb->prefix}lwip_users` (`id`)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($user_table_query);
        dbDelta($feed_table_query);
    }
}
