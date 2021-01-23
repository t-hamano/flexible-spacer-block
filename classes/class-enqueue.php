<?php
/**
 * @package responsive-spacer-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace responsive_spacer_block;

class Enqueue {

	/**
	 * Constructor
	 */
	function __construct() {
		// Enqueue front-end inline styles
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );

		// Enqueue admin option page scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		// Register block
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Enqueue front-end inline styles
	 */
	public function enqueue_scripts() {
		// Generate media query breakpoints.
		$defaults = array(
			'md' => RSB_BREAKPOINT_MD,
			'sm' => RSB_BREAKPOINT_SM,
		);

		$breakpoint = get_option( 'responsive_spacer_block_breakpoint', $defaults );

		$breakpoint_lg_min = $breakpoint['md'] + 1;
		$breakpoint_md_max = $breakpoint['md'];
		$breakpoint_md_min = $breakpoint['sm'] + 1;
		$breakpoint_sm_max = $breakpoint['sm'];

		$css = <<<EOM
		@media screen and (min-width:{$breakpoint_lg_min}px) {
			.rsb-responsive-spacer__device--md,
			.rsb-responsive-spacer__device--sm {
				display: none;
			}
		}
		EOM;

		if ( $breakpoint['md'] !== $breakpoint['sm'] ) {
			$css .= <<<EOM
			@media screen and (min-width:{$breakpoint_md_min}px) and (max-width:{$breakpoint_md_max}px) {
				.rsb-responsive-spacer__device--lg,
				.rsb-responsive-spacer__device--sm {
					display: none;
				}
			}
			EOM;
		}

		$css .= <<<EOM
		@media screen and (max-width:{$breakpoint_sm_max}px) {
			.rsb-responsive-spacer__device--lg,
			.rsb-responsive-spacer__device--md {
				display: none;
			}
		}
		EOM;

		wp_register_style( 'responsive-spacer-block-style', false );
		wp_enqueue_style( 'responsive-spacer-block-style' );
		wp_add_inline_style( 'responsive-spacer-block-style', $css );
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		$asset_file = include( RSB_PATH . '/build/js/index.asset.php' );

		wp_enqueue_style(
			'responsive-spacer-block-editor-style',
			RSB_URL . '/build/css/editor-style.css',
			array(),
			filemtime( RSB_PATH . '/build/css/editor-style.css' )
		);

		wp_enqueue_script(
			'responsive-spacer-block-editor',
			RSB_URL . '/build/js/index.js',
			$asset_file['dependencies'],
			filemtime( RSB_PATH . '/build/js/index.js' )
		);

		wp_localize_script( 'responsive-spacer-block-editor', 'rsbConf', $this->create_editor_config() );

		wp_set_script_translations( 'responsive-spacer-block-editor', 'responsive-spacer-block', RSB_PATH . '/languages' );
	}

	/**
	 * Enqueue admin option page scripts
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( false === strpos( $hook, 'responsive-spacer-block' ) ) {
			return;
		}
		wp_enqueue_style( 'responsive-spacer-block-option', RSB_URL . '/build/css/admin-style.css' );
	}

	/**
	 * Register block
	 */
	public function register_block() {
		register_block_type_from_metadata(
			RSB_PATH . '/src/block.json',
			array(
				'editor_script' => 'responsive-spacer-block-script',
				'editor_style'  => 'responsive-spacer-block-editor-style',
			)
		);
	}

	/**
	 * Generate settings to be passed to the block editor
	 *
	 * @return array
	 */
	private function create_editor_config() {
		$breakpoint_defaults = array(
			'md' => RSB_BREAKPOINT_MD,
			'sm' => RSB_BREAKPOINT_SM,
		);

		$breakpoint = get_option( 'responsive_spacer_block_breakpoint', $breakpoint_defaults );
		$show_block = get_option( 'responsive_spacer_block_show_block', false );

		$config = array(
			'breakpoint' => $breakpoint,
			'showBlock'  => $show_block,
		);

		return $config;
	}
}

new Enqueue();
