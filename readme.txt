=== Flexible Spacer Block ===
Contributors: wildworks
Tags: gutenberg,rich text,highlighter,formatting
Donate link: https://www.paypal.me/thamanoJP
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 1.1.7
Requires PHP: 7.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add white space between blocks and customize its height for each device.

== Description ==
Flexible Spacer Block switches the height of the spacer according to the device screen width (breakpoints).
This block has two variable breakpoints, and you can adjust the height of the spacer for smartphones, tablets, and desktops respectively.
The height of the spacers can be changed individually or in batches.
Also available to set "negative space (negative margin)" instead of the normal space.
And this block supports transform from and to core spacer block.

== About negative space ==
"**Negative space**" narrows the margins both blocks above and below the spacer, and it is also possible to overlap the blocks.
If unintended overlap occurs, add a CSS class named "**fsb-style-show-front**" to the block you want to show in the front.
To apply the CSS class to the block, click on the block on WordPress editor, and check the block settings on the right for the Advanced setting ,then enter the CSS class.

== Installation ==
1. Upload the `flexible-spacer-block` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the \'Plugins\' menu in WordPress.

== Screenshots ==

1. On Block Editor
2. Setting page
2. Negative space example
2. Negative space example

== Resources ==

= Image for screenshot =
License: CC0 Public Domain
Source: https://pxhere.com/ja/photo/245

== Changelog ==

= 1.1.7 =
* Tested to WordPress 5.8
* Clean: Update npm packages

= 1.1.6 =
* Fix: build script error
* Fix: README.md screenshot

= 1.1.5 =
* Tested to WordPress 5.7
* Clean: Update deploy flow (github actions)
* Clean: Update npm packages and organize development env

= 1.1.4 =
* Tested to PHP 8

= 1.1.3 =
* Fix: Problem about plugin configuration values are not deleted upon uninstallation

= 1.1.2 =
* Fix: Problem about uninstallation error in PHP 8

= 1.1.1 =
* Add: Description about negative space

= 1.1.0 =
* Add: Negative space setting

= 1.0.0 =
* Initial release
