import React from 'react';

import styles from './Footer.module.scss';
import { FooterProps } from './Footer.props';
import cn from 'classnames';

export function Footer({ className }: FooterProps): React.ReactElement {
	return (
		<footer className={cn(styles.footer, className)}></footer>
	);
}

