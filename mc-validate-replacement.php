<?php
/**
 * Plugin Name: MailChimp Validate Replacement
 * Plugin URI: https://github.com/xwp/mc-validate-replacement
 * Description: Introduces the MailChimp mc-validate.js functionality via a more performant JS.
 * Version: 1.0.0
 * Author: XWP
 * Author URI: https://xwp.co
 * License: GPLv2+
 * Text Domain: mc-validate-replacement
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'MC_VALIDATE_REPLACEMENT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

add_action( 'wp_enqueue_scripts', function() {
    // Get plugin data to access the version.
    $plugin_version = null;
    if ( function_exists( 'get_plugin_data' ) ) {
        $plugin_data = get_plugin_data( __FILE__ );
        $plugin_version = isset( $plugin_data['Version'] ) ? $plugin_data['Version'] : null;
    }

    // Enqueue MailChimp validation
    wp_enqueue_script(
        'mc-validate',
		// Replaces https://downloads.mailchimp.com/js/mc-validate.js
        MC_VALIDATE_REPLACEMENT_PLUGIN_URL . 'assets/js/mc-validate.min.js',
        array(),
        $plugin_version,
        array(
            'in_footer' => true,
            'strategy' => 'defer',
        )
    );
    
    // Enqueue MailChimp validation styles
    wp_enqueue_style(
        'mc-validate',
        MC_VALIDATE_REPLACEMENT_PLUGIN_URL . 'assets/css/mc-validate.css',
        array(),
        $plugin_version
    );
} );

/**
 * Modify the CSS link tag for mc-validate to load asynchronously.
 *
 * @param string $html   The link tag HTML.
 * @param string $handle The style handle.
 * @return string Modified link tag HTML.
 */
function mc_validate_replacement_style_loader_tag( $html, $handle ) {
    if ( 'mc-validate' === $handle ) {
        $html = str_replace( "media='all'", "media='print' onload=\"this.media='all'; this.onload=null;\"", $html );
		// Add a fallback noscript tag for browsers with JavaScript disabled
		$noscript_fallback = '<noscript>' . str_replace( " media='print' onload=\"this.media='all'; this.onload=null;\"", '', $html ) . '</noscript>';
		$html .= $noscript_fallback;
    }
    return $html;
}
add_filter( 'style_loader_tag', 'mc_validate_replacement_style_loader_tag', 10, 2 );
