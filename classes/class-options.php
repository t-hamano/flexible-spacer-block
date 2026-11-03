<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Options {

	private $units = array(
		'px',
		'%',
		'em',
		'rem',
		'vw',
		'vh',
	);

	/**
	 * Constructor
	 */
	public function __construct() {
		// Register settings
		add_action( 'init', array( $this, 'register_settings' ) );
		// Add option page
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		// Initialize option page
		add_action( 'admin_init', array( $this, 'init_options_page' ) );
	}

	/**
	 * Get devices
	 *
	 * @return array
	 */
	private function get_devices() {
		return array(
			'sm' => array(
				'label' => __( 'Mobile', 'flexible-spacer-block' ),
				'icon'  => 'core/mobile',
			),
			'md' => array(
				'label' => __( 'Tablet', 'flexible-spacer-block' ),
				'icon'  => 'core/tablet',
			),
			'lg' => array(
				'label' => __( 'Desktop', 'flexible-spacer-block' ),
				'icon'  => 'core/desktop',
			),
		);
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
	 * Register settings
	 */
	public function register_settings() {
		$devices = array_keys( $this->get_devices() );

		$height_defaults = array();

		foreach ( $devices as $slug ) {
			$height_defaults[ $slug ]           = FSB_DEFAULT_SPACER_HEIGHT;
			$height_defaults[ $slug . '_unit' ] = FSB_DEFAULT_SPACER_HEIGHT_UNIT;
		}

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_breakpoint',
			array(
				'type'              => 'object',
				'default'           => array(
					'md' => FSB_BREAKPOINT_MD,
					'sm' => FSB_BREAKPOINT_SM,
				),
				'sanitize_callback' => array( $this, 'sanitize_breakpoint' ),
			)
		);

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_default_value',
			array(
				'type'              => 'object',
				'default'           => $height_defaults,
				'sanitize_callback' => array( $this, 'sanitize_default_value' ),
			)
		);

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_show_block',
			array(
				'type'              => 'boolean',
				'default'           => false,
				'sanitize_callback' => 'rest_sanitize_boolean',
			)
		);

		// Values saved by older versions may lack some properties, such as the units added in 2.1.0.
		add_filter( 'option_flexible_spacer_block_breakpoint', array( $this, 'merge_option_defaults' ), 10, 2 );
		add_filter( 'option_flexible_spacer_block_default_value', array( $this, 'merge_option_defaults' ), 10, 2 );
	}

	/**
	 * Fill properties missing from a saved setting with the registered defaults
	 *
	 * @param mixed  $value  Saved setting value.
	 * @param string $option Option name.
	 *
	 * @return array
	 */
	public function merge_option_defaults( $value, $option ) {
		$default = get_registered_settings()[ $option ]['default'];

		return is_array( $value ) ? array_merge( $default, $value ) : $default;
	}

	/**
	 * Initialize option page
	 */
	public function init_options_page() {
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
			'flexible_spacer_block_default_value_field',
			__( 'Default Values', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_default_value_display_field' ),
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
		?>
		<div class="wrap">
			<h1><?php _e( 'Flexible Spacer Block', 'flexible-spacer-block' ); ?></h1>
			<form class="fsb-option-form" method="post" action="options.php">
				<?php
				settings_fields( 'flexible-spacer-block-group' );
				do_settings_sections( 'flexible-spacer-block-group' );
				?>
				<h2><?php _e( 'About Negative Space', 'flexible-spacer-block' ); ?></h2>
				<ul>
					<li><?php _e( '"<strong>Negative space</strong>" narrows the margins both blocks above and below the spacer, and it is also possible to overlap the blocks.', 'flexible-spacer-block' ); ?></li>
					<li><?php _e( 'If unintended overlap occurs, <strong>add a CSS class</strong> named <code>fsb-style-show-front</code> to the block you want to show in the front.', 'flexible-spacer-block' ); ?></li>
					<li><?php _e( 'To apply the CSS class to the block, click on the block on WordPress editor, and check the block settings on the right for the Advanced setting ,then enter the CSS class.', 'flexible-spacer-block' ); ?></li>
				</ul>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Display field (Responsive Setting)
	 */
	public function flexible_spacer_block_breakpoint_display_field() {
		$breakpoints = get_option( 'flexible_spacer_block_breakpoint' );
		$breakpoints = array(
			'sm' => $breakpoints['sm'],
			'md' => $breakpoints['md'],
		);
		?>
		<div class="fsb-option-breakpoint">
			<?php foreach ( $this->get_devices() as $slug => $device ) : ?>
				<div class="fsb-option-breakpoint__device">
					<?php echo wp_get_icon( $device['icon'], array( 'size' => 48 ) ); ?>
					<?php echo esc_html( $device['label'] ); ?>
				</div>
				<?php if ( isset( $breakpoints[ $slug ] ) ) : ?>
					<span class="fsb-option-breakpoint__sign">&le;</span>
					<div class="fsb-option-breakpoint__input-wrapper">
						<input class="fsb-option-breakpoint__input" type="number" name="flexible_spacer_block_breakpoint[<?php echo esc_attr( $slug ); ?>]" min="<?php echo FSB_BREAKPOINT_MIN; ?>" max="<?php echo FSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoints[ $slug ] ); ?>">
						<span class="fsb-option-breakpoint__unit">px</span>
					</div>
					<span class="fsb-option-breakpoint__sign">&lt;</span>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
		<ul>
			<li><?php _e( 'Enter the screen width (breakpoint) that will be the basis for switching between each device.', 'flexible-spacer-block' ); ?></li>
			<li><?php _e( 'If both values are the same, The spacer setting for tablets will be disabled.', 'flexible-spacer-block' ); ?></li>
		</ul>
		<?php
	}


	/**
	 * Display field (Default Values)
	 */
	public function flexible_spacer_block_default_value_display_field() {
		$default_value = get_option( 'flexible_spacer_block_default_value' );
		?>
		<div class="fsb-option-default-values">
			<?php foreach ( $this->get_devices() as $slug => $device ) : ?>
				<?php
				$value = $default_value[ $slug ];
				$unit  = $default_value[ $slug . '_unit' ];
				?>
				<div class="fsb-option-default-values__col">
					<div class="fsb-option-breakpoint__device">
						<?php echo wp_get_icon( $device['icon'], array( 'size' => 48 ) ); ?>
						<?php echo esc_html( $device['label'] ); ?>
					</div>
					<div class="fsb-option-default-values__input-wrapper">
						<input class="fsb-option-default-values__input" type="number" name="flexible_spacer_block_default_value[<?php echo esc_attr( $slug ); ?>]" min="<?php echo FSB_MIN_SPACER_HEIGHT; ?>" max="<?php echo FSB_MAX_SPACER_HEIGHT; ?>" value="<?php echo esc_attr( $value ); ?>">
						<select class="fsb-option-default-values__unit" name="flexible_spacer_block_default_value[<?php echo esc_attr( $slug ); ?>_unit]">
							<?php
							foreach ( $this->units as $option_unit ) {
								echo '<option value="' . esc_attr( $option_unit ) . '"' . selected( $option_unit, $unit, false ) . '>' . esc_html( $option_unit ) . '</option>';
							}
							?>
						</select>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<p class="description"><?php _e( 'These values are applied when a new block is inserted. They do not affect blocks that already exist in your content.', 'flexible-spacer-block' ); ?></p>
		<?php
	}


	/**
	 * Display field (Block Editor Setting)
	 */
	public function flexible_spacer_block_editor_display_field() {
		?>
		<fieldset>
			<label>
				<input type="checkbox" name="flexible_spacer_block_show_block" value="1" <?php checked( get_option( 'flexible_spacer_block_show_block' ) ); ?>>
				<?php _e( 'Always show blocks in the block editor', 'flexible-spacer-block' ); ?>
			</label>
			<p class="description"><?php _e( 'The block will always be visible even when it is not selected.', 'flexible-spacer-block' ); ?></p>
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
		$breakpoints = get_option( 'flexible_spacer_block_breakpoint' );

		$new_input = array();

		$breakpoint_md = isset( $input['md'] ) ? absint( $input['md'] ) : '';
		$breakpoint_sm = isset( $input['sm'] ) ? absint( $input['sm'] ) : '';

		if ( 0 === $breakpoint_md || 0 === $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-null',
				__( 'Responsive Setting: Fill in both fields.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => $breakpoints['md'],
				'sm' => $breakpoints['sm'],
			);
		} elseif ( $breakpoint_md < $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-compare',
				__( 'Responsive Setting: the screen width value in the left field must be equal to or smaller than the value in the right field.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => $breakpoints['md'],
				'sm' => $breakpoints['sm'],
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
	 * Sanitizer (default values)
	 * @param array $input input values.
	 *
	 * @return array
	 */
	public function sanitize_default_value( $input ) {
		$default_value = get_option( 'flexible_spacer_block_default_value' );

		$devices   = array_keys( $this->get_devices() );
		$values    = array();
		$units     = array();
		$has_empty = false;

		foreach ( $devices as $slug ) {
			$values[ $slug ] = isset( $input[ $slug ] ) ? absint( $input[ $slug ] ) : '';
			$units[ $slug ]  = isset( $input[ $slug . '_unit' ] ) && in_array( $input[ $slug . '_unit' ], $this->units, true ) ? $input[ $slug . '_unit' ] : 'px';

			if ( 0 === $values[ $slug ] ) {
				$has_empty = true;
			}
		}

		if ( $has_empty ) {
			add_settings_error(
				'flexible-spacer-block-default-values',
				'flexible-spacer-block-default-values-null',
				__( 'Default Value: Fill in all fields.', 'flexible-spacer-block' )
			);
		}

		$new_input = array();

		foreach ( $devices as $slug ) {
			$new_input[ $slug ] = $has_empty
				? $default_value[ $slug ]
				: min( max( $values[ $slug ], FSB_MIN_SPACER_HEIGHT ), FSB_MAX_SPACER_HEIGHT );
		}

		foreach ( $devices as $slug ) {
			$new_input[ $slug . '_unit' ] = $has_empty
				? $default_value[ $slug . '_unit' ]
				: $units[ $slug ];
		}

		return $new_input;
	}
}
