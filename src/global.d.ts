interface FsbConf {
	breakpoint: {
		md: string;
		sm: string;
	};
	defaultValue: {
		lg: string;
		md: string;
		sm: string;
		lg_unit: string;
		md_unit: string;
		sm_unit: string;
	};
	showBlock: boolean;
}

declare const fsbConf: FsbConf;

// `@wordpress/block-editor` does not ship its own type declarations.
declare module '@wordpress/block-editor';
