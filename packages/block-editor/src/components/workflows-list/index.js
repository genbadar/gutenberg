/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockTypesList from '../block-types-list';

function Workflow( { workflow, onFinish } ) {
	const { flow: Component } = workflow;
	return <Component onFinish={ onFinish } workflow={ workflow } />;
}

export default function WorkflowsList( props ) {
	const [ activeWorkflow, setActiveWorkflow ] = useState();

	return (
		<>
			<BlockTypesList
				{ ...props }
				onSelect={ ( workflow ) => {
					setActiveWorkflow( workflow );
				} }
				isDraggable={ false }
			/>
			{ !! activeWorkflow && (
				<Workflow
					workflow={ activeWorkflow }
					onFinish={ () => setActiveWorkflow( undefined ) }
				/>
			) }
		</>
	);
}
