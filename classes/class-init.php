<?php
/**
 * @package responsive-spacer-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace responsive_spacer_block;

class Init {
	/**
	 * Constructor
	 */
	public function __construct() {
		// Load translated strings
		load_plugin_textdomain( 'responsive-spacer-block', false, dirname( RSB_BASENAME ) . '/languages' );

		// Uninstallation process
		register_uninstall_hook( RSB_BASENAME, 'responsive_spacer_block\Main::uninstall_responsive_spacer_block' );

		// Add a link to this plugin settings page in plugin list
		add_filter( 'plugin_action_links_' . RSB_BASENAME, array( $this, 'add_action_links' ) );

		// Load classes
		$this->load_classes();
	}

	/**
	 * Load classes
	 */
	private function load_classes() {
		require_once( RSB_PATH . '/classes/class-enqueue.php' );
		require_once( RSB_PATH . '/classes/class-options.php' );
	}

	/**
	 * Add a link to this plugin settings page in plugin list
	 */
	public function add_action_links( $links ) {
		$link = '<a href="' . admin_url( 'options-general.php?page=responsive-spacer-block-option' ) . '">' . __( 'Settings', 'responsive-spacer-block' ) . '</a>';
		array_unshift( $links, $link );
		return $links;
	}

	/**
	 * Uninstallation process
	 */
	public static function uninstall_responsive_spacer_block() {
		foreach ( $options as $key ) {
			delete_option( 'responsive_spacer_block_breakpoint' );
			delete_option( 'responsive_spacer_block_show_block' );
		}
	}
}
