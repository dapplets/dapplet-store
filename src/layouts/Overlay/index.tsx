import React from 'react';
import cn from 'classnames';
import { OverlayProps } from './Overlay.props';

import styles from './Overlay.module.scss';

export function Overlay({ className }: OverlayProps): React.ReactElement {
	return (
		<div className={cn(styles.overlay, className)}>
			<p>Ширина: 420 px</p>

			<p>
				Предусмотреть свободное поле
				для открытия оверлея - на этом
				месте не должно быть важной
				информации, которую нельзя
				перекрывать.
			</p>

			<p>В идеале - пустота или фон.</p>
		</div>
	);
}
