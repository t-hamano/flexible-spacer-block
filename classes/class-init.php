<?php
/**
 * @package flexible-spacer-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace flexible_spacer_block;

class Init {
	/**
	 * Constructor
	 */
	public function __construct() {
		// Load translated strings
		load_plugin_textdomain( 'flexible-spacer-block', false, dirname( FSB_BASENAME ) . '/languages' );

		// Uninstallation process
		register_uninstall_hook( FSB_BASENAME, 'flexible_spacer_block\Main::uninstall_flexible_spacer_block' );

		// Add a link to this plugin settings page in plugin list
		add_filter( 'plugin_action_links_' . FSB_BASENAME, array( $this, 'add_action_links' ) );

		// Load classes
		$this->load_classes();
	}

	/**
	 * Load classes
	 */
	private function load_classes() {
		require_once( FSB_PATH . '/classes/class-enqueue.php' );
		require_once( FSB_PATH . '/classes/class-options.php' );
	}

	/**
	 * Add a link to this plugin settings page in plugin list
	 */
	public function add_action_links( $links ) {
		$link = '<a href="' . admin_url( 'options-general.php?page=flexible-spacer-block-option' ) . '">' . __( 'Settings', 'flexible-spacer-block' ) . '</a>';
		array_unshift( $links, $link );
		return $links;
	}

	/**
	 * Uninstallation process
	 */
	public static function uninstall_flexible_spacer_block() {
		foreach ( $options as $key ) {
			delete_option( 'flexible_spacer_block_breakpoint' );
			delete_option( 'flexible_spacer_block_show_block' );
		}
	}
}
