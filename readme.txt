=== Flexible Spacer Block ===
Contributors: wildworks
Tags: gutenberg, block, spacer, responsive
Donate link: https://www.paypal.me/thamanoJP
Requires at least: 7.1
Tested up to: 7.2
Stable tag: 2.10.0
Requires PHP: 8.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add white space between blocks and customize its height for each device.

== Description ==

Flexible Spacer Block switches the height of the spacer according to the device's screen width (breakpoints). This block has two adjustable breakpoints, so you can set a separate spacer height for smartphones, tablets, and desktops. These heights can be changed individually or all at once.

You can also set "negative space (negative margin)" instead of normal space. In addition, the block can be transformed from and to the core Spacer block.

== About negative space ==

"**Negative space**" reduces the space between the blocks above and below the spacer, and can even make them overlap.

If unintended overlap occurs, add a CSS class named "**fsb-style-show-front**" to the block you want to display in front. To apply the CSS class, select the block in the WordPress editor, open the "Advanced" panel in the block settings sidebar, and enter the class in the "Additional CSS class(es)" field.

== Installation ==

1. Upload the `flexible-spacer-block` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= What filters can I use? =

You can find a list of the available filters in the [GitHub README](https://github.com/t-hamano/flexible-spacer-block#filters).

== Screenshots ==

1. In the block editor
2. Settings page
3. Negative space example
4. Negative space example

== Resources ==

= Image used in screenshots =

* License: CC0 Public Domain
* Source: https://pxhere.com/ja/photo/245

== Changelog ==

= 2.10.0 =
* Tested up to WordPress 7.2
* Drop support for WordPress 7.0
* Drop support for PHP 8.0 and 8.1
* Enhancement: Load front-end styles only on pages that contain the block
* Enhancement: Polish editor and settings page style
* Fix: Spacers with a height of 100px on all devices are changed to the default values when the post is opened
* Fix: Block validation error on spacers whose height was cleared
* Fix: 0 cannot be saved as a default value on the settings page
* Fix: The `flexible_spacer_block_breakpoint` filter is not applied in the editor
* Fix: Default height is not shown in the editor preview when the height is unset

= 2.9.0 =
* Tested up to WordPress 7.1
* Drop support for WordPress 6.9
* Enhancement: Add spacing preset support
* Fix: Plugin default value settings are not deleted upon uninstallation

= 2.8.0 =
* Tested up to WordPress 7.0
* Drop support for WordPress 6.8
* Enhancement: Polish settings page style

= 2.7.0 =
* Tested up to WordPress 6.9
* Drop support for WordPress 6.6 and 6.7
* Update: Block icon and toolbar icon
* Enhancement: Polish settings sidebar layout
* Enhancement: Highlight active spacer
* Accessibility: Add aria-label to controls

= 2.6.0 =
* Tested up to WordPress 6.8
* Accessibility: Respect user preference for CSS transitions
* Drop support for WordPress 6.5

= 2.5.0 =
* Tested up to WordPress 6.7
* Drop support for WordPress 6.4

= 2.4.0 =
* Tested up to WordPress 6.6
* Drop support for WordPress 6.3

= 2.3.0 =
* Tested up to WordPress 6.5
* Enhancement: Polish block style
* Enhancement: Polish settings page style
* Fix: Remove unnecessary CSS class
* Drop support for WordPress 6.2

= 2.2.0 =
* Tested up to WordPress 6.4
* Drop support for WordPress 6.0 and 6.1

= 2.1.0 =
* Tested up to WordPress 6.3
* Add: Unit support
* Drop support for WordPress 5.9
* Drop support for PHP 7.3

= 2.0.0 =
* Tested up to WordPress 6.2
* Feature: Add default values setting
* Enhancement: Remove focus style for unit elements on the settings page
* Enhancement: Improve error messages on the settings page
* Fix: Responsive setting value becomes empty after certain operations
* Fix: Grammar on the settings page

= 1.4.1 =
* Clean: Remove files not needed for the release

= 1.4.0 =
* Tested up to WordPress 6.1
* Drop support for WordPress 5.6 through 5.8
* Fix: Incorrect transformation from the core Spacer block
* Enhancement: Polish settings page style

= 1.3.0 =
* Tested up to WordPress 6.0
* Update: Minify inline styles
* Add: Filter hooks
* Update: Block icon
* Update: Author name
* Fix: CSS files are not loaded in the iframe editor on WordPress 6.0

= 1.2.3 =
* Change: Ensure minimum height of the block
* Change: Minimum value of the spacer
* Fix: Unable to change the height of the spacer in WordPress 5.9.1

= 1.2.2 =
* Clean: Remove unnecessary file included in the release

= 1.2.1 =
* Fix: Wrong text domain

= 1.2.0 =
* Tested up to WordPress 5.9
* Add: Block control to change responsive view
* Change: Script handle names
* Change: Replace Dashicons with @wordpress/icons
* Remove: load_plugin_textdomain function

= 1.1.9 =
* Clean: Update npm packages and run a lint check

= 1.1.8 =
* Clean: Update npm packages
* Remove: Bundled language files

= 1.1.7 =
* Tested up to WordPress 5.8
* Clean: Update npm packages

= 1.1.6 =
* Fix: Build script error
* Fix: README.md screenshot

= 1.1.5 =
* Tested up to WordPress 5.7
* Clean: Update deploy flow (GitHub Actions)
* Clean: Update npm packages and organize the development environment

= 1.1.4 =
* Tested up to PHP 8

= 1.1.3 =
* Fix: Plugin configuration values are not deleted upon uninstallation

= 1.1.2 =
* Fix: Uninstallation error in PHP 8

= 1.1.1 =
* Add: Description of negative space

= 1.1.0 =
* Add: Negative space setting

= 1.0.0 =
* Initial release
