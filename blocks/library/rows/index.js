/**
 * External dependencies
 */
import { map, times, sum, reduce } from 'lodash';
import classnames from 'classnames';
import memoize from 'memize';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { BlockAlignmentToolbar, BlockControls, InnerBlocks } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';

const rows = [
	{ cols: [ 6, 6 ], title: 'col6 x 2',  description: __( '2 eq columns layout' ) },
	{ cols: [ 4, 4, 4 ], title: 'col4 x 3',  description: __( '3 eq columns layout' ) }, 
];

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnLayouts = memoize( ( columns ) => {
	return times( columns, ( n ) => ( {
		name: `column-${ n + 1 }`,
		label: sprintf( __( 'Column %d' ), n + 1 ),
		icon: 'columns',
	} ) );
} );

/**
 * Returns the block name
 * @param  {object} row Row object
 * @return {string}     Block name
 */
function getBlockName( row ) {
	if ( !row.cols ) {
		return false;
	}

	const cols = map( row.cols, col => `col${ col }` );
	return `rows/${ cols.join( '-' ) }`;
}

/**
 * Return the block settings
 * @param  {object} row Row object
 * @return {object}     Block settings object
 */
function getBlockSettings( row ) {

	return {
		title: row.title,
		description: row.description,
		icon: 'columns',
		category: 'rows',
		attributes: {
			columns: {
				type: 'number',
				default: row.cols.length,
			},
			align: {
				type: 'string',
			},
		},

		getEditWrapperProps( attributes ) {
			const { align } = attributes;

			return { 'data-align': align };
		},

		edit( { attributes, setAttributes, className, focus } ) {
			const { align, columns } = attributes;
			const classes = classnames( className, 'wp-block-columns', `wp-block-columns has-${ columns }-columns` );

			return [
				...focus ? [
					<BlockControls key="controls">
						<BlockAlignmentToolbar
							controls={ [ 'wide', 'full' ] }
							value={ align }
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>
					</BlockControls>,
				] : [],
				<div className={ classes } key="container">
					<InnerBlocks layouts={ getColumnLayouts( columns ) } />
				</div>,
			];
		},

		save( { attributes } ) {
			const { columns } = attributes;

			return (
				<div className={ `wp-block-columns has-${ columns }-columns` }>
					<InnerBlocks.Content />
				</div>
			);
		},
	};
}

export const blocks = reduce(rows, (res, row) => {
	if ( sum( row.cols ) == 12 ) {
		res.push( { 
			name: getBlockName( row ),
			settings: getBlockSettings( row ),
		} );
	}

	return res;
}, [ ] );
