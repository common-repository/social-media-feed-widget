<?php

/**
 * Fired during plugin deactivation 
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 *
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 * @author     Logicwind Pvt. Ltd 
 */

/**
 *  It's good practice to use coding standards and document why certain coding standards are ignored in this context.
 *  In this case, the @codingStandardsIgnoreStart and @codingStandardsIgnoreEnd annotations are used
 *  to temporarily ignore coding standards checks for the following block of code
 *  because we are directly dropping custom tables that are specific to our plugin.
 *  */
class Lwip_Instaplug_Management_Deactivator
{

    /**
     * Perform cleanup tasks during deactivation, including handling
     * network-wide deactivation if on a multisite network.
     *
     * @param bool $network_wide - Whether the plugin is deactivated network-wide.
     * @since 1.1.0
     */
    public static function lwip_deactivate($network_wide)
    {
        global $wpdb;

        if (is_multisite() && $network_wide) {
            // If deactivating network-wide, loop through each site
            $sites = get_sites();

            foreach ($sites as $site) {
                switch_to_blog($site->blog_id);
                self::cleanup_site_data();
                restore_current_blog();
            }
        } else {
            // Deactivation for a single site
            self::cleanup_site_data();
        }
    }

    /**
     * Clean up data specific to the plugin for the current site.
     * Deletes transient data and optionally truncates plugin tables.
     *
     * @since 1.1.0
     */
    private static function cleanup_site_data()
    {
        global $wpdb;

        // Delete transient
        delete_transient('lwip_user_details');

        // @codingStandardsIgnoreStart;
        /**  
         *Disable foreign key checks
         *These tables are specific to our plugin and will be TRUNCATE during deactivatation.
         */
        $wpdb->query("SET FOREIGN_KEY_CHECKS = 0;");

        // Truncate tables
        $wpdb->query("TRUNCATE TABLE $wpdb->lwip_feeds");
        $wpdb->query("TRUNCATE TABLE $wpdb->lwip_users");

        // Re-enable foreign key checks
        $wpdb->query("SET FOREIGN_KEY_CHECKS = 1;");
        // @codingStandardsIgnoreEnd
    }
}
