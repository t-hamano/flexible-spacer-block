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
		// Add a link to this plugin settings page in plugin list
		add_filter( 'plugin_action_links_' . FSB_BASENAME, array( $this, 'add_action_links' ) );

		// Load classes
		$this->init_classes();
	}

	/**
	 * Load and instantiate classes
	 */
	private function init_classes() {
		require_once FSB_PATH . '/classes/class-enqueue.php';
		require_once FSB_PATH . '/classes/class-options.php';

		new Enqueue();

		if ( is_admin() ) {
			new Options();
		}
	}

	/**
	 * Add a link to this plugin settings page in plugin list
	 */
	public function add_action_links( $links ) {
		$link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'options-general.php?page=flexible-spacer-block-option' ) ),
			__( 'Settings', 'flexible-spacer-block' )
		);
		array_unshift( $links, $link );
		return $links;
	}
}
