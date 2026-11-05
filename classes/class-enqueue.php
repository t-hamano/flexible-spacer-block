<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Enqueue {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Register block
		add_action( 'init', array( $this, 'register_block' ) );

		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );

		// Add block CSS to the editor style
		if ( is_admin() ) {
			add_action( 'enqueue_block_assets', array( $this, 'add_css_to_editor_style' ) );
		}

		// Add block CSS to the front-end style
		add_action( 'wp_enqueue_scripts', array( $this, 'add_css_to_front_end_style' ) );

		// Enqueue admin option page scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Register block
	 */
	public function register_block() {
		// Front-end styles have no file and are generated from the plugin settings.
		// They are registered as `style` rather than `viewStyle` so that classic themes
		// print them in the head even when block styles are not hoisted from the footer.
		// The editor also enqueues this handle, but prints nothing as it has no CSS there.
		wp_register_style( 'fsb-flexible-spacer-style', false );

		register_block_type( FSB_PATH . '/build' );
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		$config = array(
			'breakpoint'   => $this->get_breakpoint( true ),
			'showBlock'    => (bool) get_option( 'flexible_spacer_block_show_block' ),
			// Block deprecations read this to reproduce the content saved by older
			// versions, so do not change its shape.
			'defaultValue' => get_option( 'flexible_spacer_block_default_value' ),
		);

		$inline_script = sprintf(
			'window.fsbConf = %s;',
			wp_json_encode( $config )
		);

		wp_add_inline_script( generate_block_asset_handle( 'fsb/flexible-spacer', 'editorScript' ), $inline_script, 'before' );
	}

	/**
	 * Add block CSS to the editor style
	 */
	public function add_css_to_editor_style() {
		wp_add_inline_style( generate_block_asset_handle( 'fsb/flexible-spacer', 'editorStyle' ), $this->create_inline_style( true ) );
	}

	/**
	 * Add block CSS to the front-end style
	 */
	public function add_css_to_front_end_style() {
		wp_add_inline_style( 'fsb-flexible-spacer-style', $this->create_inline_style( false ) );
	}

	/**
	 * Enqueue admin option page scripts
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( ! str_contains( $hook, 'flexible-spacer-block' ) ) {
			return;
		}
		wp_enqueue_style( 'flexible-spacer-block-option', FSB_URL . '/build/admin-style.css', array( 'wp-theme' ) );
	}

	/**
	 * Get media query breakpoints
	 *
	 * @param bool $is_editor Whether it is rendered on the editor.
	 *
	 * @return array{md: int, sm: int}
	 */
	private function get_breakpoint( $is_editor ) {
		$breakpoint = get_option( 'flexible_spacer_block_breakpoint' );

		/**
		 * Filters media query breakpoints.
		 *
		 * @since 1.3.0
		 *
		 * @param array $breakpoint {
		 *     Media query breakpoints in pixels.
		 *
		 *     @type int $md Breakpoint between large and medium devices.
		 *     @type int $sm Breakpoint between medium and small devices.
		 * }
		 * @param bool $is_editor Whether it is rendered on the editor.
		 */
		$breakpoint = apply_filters( 'flexible_spacer_block_breakpoint', $breakpoint, $is_editor );

		$breakpoint = array(
			'md' => absint( $breakpoint['md'] ?? FSB_BREAKPOINT_MD ),
			'sm' => absint( $breakpoint['sm'] ?? FSB_BREAKPOINT_SM ),
		);

		return $breakpoint;
	}

	/**
	 * Generate inline styles to be passed to the block editor and front-end
	 *
	 * @return string
	 */
	private function create_inline_style( $is_editor = true ) {
		$breakpoint = $this->get_breakpoint( $is_editor );

		$breakpoint_lg_min = $breakpoint['md'] + 1;
		$breakpoint_md_max = $breakpoint['md'];
		$breakpoint_md_min = $breakpoint['sm'] + 1;
		$breakpoint_sm_max = $breakpoint['sm'];

		// The editor only hides devices of spacers with responsive mode enabled.
		$prefix = $is_editor ? '.fsb-flexible-spacer.is-responsive ' : '';
		$lg     = "{$prefix}.fsb-flexible-spacer__device--lg";
		$md     = "{$prefix}.fsb-flexible-spacer__device--md";
		$sm     = "{$prefix}.fsb-flexible-spacer__device--sm";

		$css = '';

		if ( ! $is_editor ) {
			$css .= '.fsb-style-show-front{position:relative;z-index:2;}';
		}

		$css .= "@media screen and (min-width:{$breakpoint_lg_min}px){{$md},{$sm}{display:none;}}";

		if ( $breakpoint['md'] !== $breakpoint['sm'] ) {
			$css .= "@media screen and (min-width:{$breakpoint_md_min}px) and (max-width:{$breakpoint_md_max}px){{$lg},{$sm}{display:none;}}";
		}

		$css .= "@media screen and (max-width:{$breakpoint_sm_max}px){{$lg},{$md}{display:none;}}";

		/**
		 * Filters Generated inline styles.
		 *
		 * @since 1.3.0
		 *
		 * @param string $css Generated inline styles.
		 * @param bool $is_editor Whether it is rendered on the editor.
		 */
		return apply_filters( 'flexible_spacer_block_inline_css', $css, $is_editor );
	}
}
