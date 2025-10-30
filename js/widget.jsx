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

	// Output format state hooks
	const [smiles, setSmiles] = useModelState('smiles');
	const [molfile, setMolfile] = useModelState('molfile');
	const [rxn, setRxn] = useModelState('rxn');
	const [ket, setKet] = useModelState('ket');
	const [smarts, setSmarts] = useModelState('smarts');
	const [cml, setCml] = useModelState('cml');
	const [sdf, setSdf] = useModelState('sdf');
	const [cdxml, setCdxml] = useModelState('cdxml');
	const [cdx, setCdx] = useModelState('cdx');
	const [inchi, setInchi] = useModelState('inchi');
	const [inchiKey, setInchiKey] = useModelState('inchi_key');

	// Function to sync all requested formats from Ketcher to Python
	const syncFormats = async (ketcher) => {
		// Map of format names to their getter functions and setters
		const formatHandlers = {
			'smiles': { getter: () => ketcher.getSmiles(), setter: setSmiles },
			'molfile': { getter: () => ketcher.getMolfile(), setter: setMolfile },
			'rxn': { getter: () => ketcher.getRxn(), setter: setRxn },
			'ket': { getter: () => ketcher.getKet(), setter: setKet },
			'smarts': { getter: () => ketcher.getSmarts(), setter: setSmarts },
			'cml': { getter: () => ketcher.getCml(), setter: setCml },
			'sdf': { getter: () => ketcher.getSdf(), setter: setSdf },
			'cdxml': { getter: () => ketcher.getCDXml(), setter: setCdxml },
			'cdx': { getter: () => ketcher.getCDX(), setter: setCdx },
			'inchi': { getter: () => ketcher.getInchi(), setter: setInchi },
			'inchi_key': { getter: () => ketcher.getInchiKey(), setter: setInchiKey }
		};

		// Process each requested format
		for (const format of returnFormats) {
			if (formatHandlers[format]) {
				try {
					const value = await formatHandlers[format].getter();
					formatHandlers[format].setter(value);
					console.log(`Updated ${format}:`, format === 'smiles' ? value : `(${value.length} chars)`);
				} catch (error) {
					// Handle errors gracefully - set to empty string if format can't be generated
					console.warn(`Could not get ${format}:`, error.message);
					formatHandlers[format].setter('');
				}
			}
		}
	};

	const handleKetcherInit = async (ketcher) => {
		console.log('Ketcher initialized:', ketcher);
		setKetcherInstance(ketcher);

		// Wait for structService to be ready
		await ketcher.structService;

		if (initialMolecule) {
			try {
				await ketcher.setMolecule(initialMolecule);
				console.log('Initial molecule set successfully:', initialMolecule);
			} catch (error) {
				console.error('Error setting initial molecule:', error);
			}
		}

		// Sync formats after initialization (whether we loaded a molecule or not)
		await syncFormats(ketcher);

		// Subscribe to change events to sync structure back to Python
		const subscriber = ketcher.editor.subscribe('change', async (eventData) => {
			console.log('Structure changed:', eventData);
			await syncFormats(ketcher);
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
