<?php
/**
 * @package Flexible_Spacer_Block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Options {

	private $options;

	/**
	 * Constructor
	 */
	public function __construct() {
		// Add option page
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		// Initialize option page
		add_action( 'admin_init', array( $this, 'init_options_page' ) );
	}

	/**
	 * Add option page
	 */
	public function add_options_page() {
		add_options_page(
			__( 'Flexible Spacer Block', 'flexible-spacer-block' ),
			__( 'Flexible Spacer Block', 'flexible-spacer-block' ),
			'manage_options',
			'flexible-spacer-block-option',
			array( $this, 'create_options_page' )
		);
	}

	/**
	 * Initialize option page
	 */
	public function init_options_page() {
		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_breakpoint',
			array( $this, 'sanitize_breakpoint' )
		);

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_show_block',
			array( $this, 'sanitize_checkbox' )
		);

		add_settings_section(
			'flexible_spacer_block_section',
			'',
			'',
			'flexible-spacer-block-group'
		);

		add_settings_field(
			'flexible_spacer_block_breakpoint_field',
			__( 'Responsive Setting', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_breakpoint_display_field' ),
			'flexible-spacer-block-group',
			'flexible_spacer_block_section'
		);

		add_settings_field(
			'flexible_spacer_block_editor_field',
			__( 'Block Editor Setting', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_editor_display_field' ),
			'flexible-spacer-block-group',
			'flexible_spacer_block_section'
		);
	}

	/**
	 * Create option page
	 */
	public function create_options_page() {
		$this->options = get_option( 'flexible_spacer_block_breakpoint' );
		?>
		<div class="wrap">
			<h1><?php _e( 'Flexible Spacer Block', 'flexible-spacer-block' ); ?></h1>
			<form class="fsb-option-form" method="post" action="options.php">
				<?php
				settings_fields( 'flexible-spacer-block-group' );
				do_settings_sections( 'flexible-spacer-block-group' );
				?>
				<h2><?php _e( 'About Negative Space', 'flexible-spacer-block' ); ?></h2>
				<p>
					<?php _e( '"<strong>Negative space</strong>" narrows the margins both blocks above and below the spacer, and it is also possible to overlap the blocks.', 'flexible-spacer-block' ); ?><br>
					<?php _e( 'If unintended overlap occurs, <strong>add a CSS class</strong> named <code>fsb-style-show-front</code> to the block you want to show in the front.', 'flexible-spacer-block' ); ?><br>
					<?php _e( 'To apply the CSS class to the block, click on the block on WordPress editor, and check the block settings on the right for the Advanced setting ,then enter the CSS class.', 'flexible-spacer-block' ); ?>
				</p>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Display field (Responsive Setting)
	 */
	public function flexible_spacer_block_breakpoint_display_field() {
		$breakpoint_sm = isset( $this->options['sm'] ) ? $this->options['sm'] : FSB_BREAKPOINT_SM;
		$breakpoint_md = isset( $this->options['md'] ) ? $this->options['md'] : FSB_BREAKPOINT_MD;
		?>
		<div class="fsb-option-breakpoint">
			<div class="fsb-option-breakpoint__device">
				<span class="dashicons dashicons-smartphone"></span><?php _e( 'Mobile', 'flexible-spacer-block' ); ?>
			</div>
			<span class="fsb-option-breakpoint__sign">&le;</span>
			<div class="fsb-option-breakpoint__input">
				<input type="number" name="flexible_spacer_block_breakpoint[sm]" min="<?php echo FSB_BREAKPOINT_MIN; ?>" max="<?php echo FSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_sm ); ?>">
				<span class="fsb-option-breakpoint__unit">px</span>
			</div>
			<span class="fsb-option-breakpoint__sign">&lt;</span>
			<div class="fsb-option-breakpoint__device">
				<span class="dashicons dashicons-tablet"></span><?php _e( 'Tablet', 'flexible-spacer-block' ); ?>
			</div>
			<span class="fsb-option-breakpoint__sign">&le;</span>
			<div class="fsb-option-breakpoint__input">
				<input type="number" name="flexible_spacer_block_breakpoint[md]" min="<?php echo FSB_BREAKPOINT_MIN; ?>" max="<?php echo FSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_md ); ?>">
				<span class="fsb-option-breakpoint__unit">px</span>
			</div>
			<span class="fsb-option-breakpoint__sign">&lt;</span>
			<div class="fsb-option-breakpoint__device">
				<span class="dashicons dashicons-desktop"></span><?php _e( 'Desktop', 'flexible-spacer-block' ); ?>
			</div>
		</div>
		<p><?php _e( 'Enter the screen width (breakpoint) that will be the basis for switching between each device.', 'flexible-spacer-block' ); ?></p>
		<p><?php _e( 'If both values are the same, The spacer setting for tablets will be disabled.', 'flexible-spacer-block' ); ?></p>
		<?php
	}

	/**
	 * Display field (Block Editor Setting)
	 */
	public function flexible_spacer_block_editor_display_field() {
		?>
		<fieldset>
			<label>
				<input type="checkbox" name="flexible_spacer_block_show_block" value="1" <?php checked( get_option( 'flexible_spacer_block_show_block', false ) ); ?>><?php _e( 'Always show blocks in block editor editor content area', 'flexible-spacer-block' ); ?>
			</label>
		</fieldset>
		<?php
	}

	/**
	 * Sanitizer (breakpoint)
	 * @param array $input input values.
	 *
	 * @return array
	 */
	public function sanitize_breakpoint( $input ) {
		$this->options = get_option( 'flexible_spacer_block_breakpoint' );

		$new_input = array();

		$breakpoint_md = isset( $input['md'] ) ? absint( $input['md'] ) : '';
		$breakpoint_sm = isset( $input['sm'] ) ? absint( $input['sm'] ) : '';

		if ( 0 === $breakpoint_md || 0 === $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-null',
				__( 'Fill in both fields in Responsive Setting.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->options['md'] ) ? $this->options['md'] : '',
				'sm' => isset( $this->options['sm'] ) ? $this->options['sm'] : '',
			);
		} elseif ( $breakpoint_md < $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-compare',
				__( 'The Device Width Setting value in the left field must be equal to or smaller than the value in the right field.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->options['md'] ) ? $this->options['md'] : '',
				'sm' => isset( $this->options['sm'] ) ? $this->options['sm'] : '',
			);
		} else {
			$new_input = array(
				'md' => min( max( $breakpoint_md, FSB_BREAKPOINT_MIN ), FSB_BREAKPOINT_MAX ),
				'sm' => min( max( $breakpoint_sm, FSB_BREAKPOINT_MIN ), FSB_BREAKPOINT_MAX ),
			);
		}
		return $new_input;
	}

	/**
	 * Sanitizer (Chechbox)
	 * @param string $value input value.
	 *
	 * @return boolean
	 */
	public static function sanitize_checkbox( $value ) {
		return ( isset( $value ) ? true : false );
	}
}

if ( is_admin() ) {
	new Options();
}
