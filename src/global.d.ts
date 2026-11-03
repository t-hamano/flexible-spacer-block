interface FsbConf {
	breakpoint: {
		md: string;
		sm: string;
	};
	// Block deprecations read this to reproduce the content saved by older
	// versions, so do not change its shape.
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
