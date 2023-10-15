<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Init {
	/**
	 * Constructor
	 */
	public function __construct() {
		// Uninstallation process
		register_uninstall_hook( FSB_BASENAME, 'Flexible_Spacer_Block\Init::uninstall_flexible_spacer_block' );

		// Add a link to this plugin settings page in plugin list
		add_filter( 'plugin_action_links_' . FSB_BASENAME, array( $this, 'add_action_links' ) );

		// Load classes
		$this->load_classes();
	}

	/**
	 * Load classes
	 */
	private function load_classes() {
		require_once FSB_PATH . '/classes/class-enqueue.php';
		require_once FSB_PATH . '/classes/class-options.php';
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
		delete_option( 'flexible_spacer_block_breakpoint' );
		delete_option( 'flexible_spacer_block_show_block' );
	}
}
