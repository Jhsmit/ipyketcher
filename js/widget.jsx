import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./widget.css";
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import 'ketcher-react/dist/index.css';

const structServiceProvider = new StandaloneStructServiceProvider();

const render = createRender(() => {
	const [ketcherInstance, setKetcherInstance] = React.useState(null);
	const [output, setOutput] = React.useState('');
	const [initialMolecule, setInitialMolecule] = useModelState("initial_molecule");
	const [returnFormats, setReturnFormats] = useModelState('return_formats');
	const [smiles, setSmiles] = useModelState('smiles');
	const [update, setUpdate] = React.useState(true);

	const handleKetcherInit = async (ketcher) => {
		console.log('Ketcher initialized:', ketcher);
		setKetcherInstance(ketcher);

		if (initialMolecule) {
			try {
				// Wait for Ketcher's structService to be ready, then set molecule
				await ketcher.structService;
				await ketcher.setMolecule(initialMolecule);
				console.log('Initial molecule set successfully:', initialMolecule);
			} catch (error) {
				console.error('Error setting initial molecule:', error);
			}
		}

		// Subscribe to change events to sync structure back to Python
		const subscriber = ketcher.editor.subscribe('change', async (eventData) => {
			console.log('Structure changed:', eventData);
			console.log('return formats', returnFormats);
			try {
				if (returnFormats.includes('smiles')) {
					const smiles = await ketcher.getSmiles();
					setSmiles(smiles);
					console.log('Updated SMILES value:', smiles);
				}
			} catch (error) {
				console.error('Error getting SMILES on change:', error);
			}
		});

		// Store subscriber for cleanup (optional - if we need to unsubscribe later)
		return () => {
			ketcher.editor.unsubscribe('change', subscriber);
		};
	}



	const getMolecule = async () => {
		if (ketcherInstance) {
			try {
				const smiles = await ketcherInstance.getSmiles();
				setOutput(`SMILES: ${smiles}`);
				console.log('SMILES:', smiles);

				// // Send to Python backend
				// await fetch('http://localhost:5000/api/save_molecule', {
				//   method: 'POST',
				//   headers: { 'Content-Type': 'application/json' },
				//   body: JSON.stringify({ format: 'smiles', data: smiles })
				// });
			} catch (error) {
				console.error('Error getting SMILES:', error);
				setOutput(`Error: ${error.message}`);
			}
		} else {
			setOutput('Ketcher not initialized yet');
		}
	};

	return (
		<div className="ipyketcher">
			<div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
				<Editor
					staticResourcesUrl={process.env.PUBLIC_URL}
					structServiceProvider={structServiceProvider}
					onInit={handleKetcherInit}
				/>
			</div>
			<div style={{ margin: '20px 0' }}>
				<button onClick={getMolecule} >
					Get SMILES
				</button>
				{/* <button onClick={getMolfile} style={buttonStyle}>
					Get Molfile
				</button>
				<button onClick={clearEditor} style={buttonStyle}>
					Clear
				</button> */}
			</div>
		</div>


	);
});

export default { render };
