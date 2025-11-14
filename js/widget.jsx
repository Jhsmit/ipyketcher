import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./widget.css";
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import 'ketcher-react/dist/index.css';

const structServiceProvider = new StandaloneStructServiceProvider();

const render = createRender(() => {
	const [ketcherInstance, setKetcherInstance] = React.useState(null);
	const [initialMolecule, setInitialMolecule] = useModelState("initial_molecule");
	const [returnFormats, setReturnFormats] = useModelState('return_formats');
	//  height hooks
	const [height, setHeight] = useModelState('height');
	// width hooks
	const [width, setWidth] = useModelState('width');

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

		// expose ketcher instance
		// see: https://github.com/epam/ketcher/issues/7388
		// appears to be needed for using ketcher.setMolecule
		// https://github.com/epam/ketcher/blob/9e8bdf651db4e6a8804f3ba1aeb405f3b2e6f57b/packages/ketcher-core/src/utilities/KetcherLogger.ts#L14
		window.ketcher = ketcher;

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


	return (
		<div className="ipyketcher">
			{/* Ketcher Editor Container */}

			<div style={{ width: width, height: height }}>
				<Editor
					staticResourcesUrl={process.env.PUBLIC_URL} // is undefined
					structServiceProvider={structServiceProvider}
					onInit={handleKetcherInit}
				/>
			</div>
			{/* <div style={{ margin: '20px 0' }}>
				<button onClick={getMolecule} >
					Get SMILES
				</button> */}
			{/* <button onClick={getMolfile} style={buttonStyle}>
					Get Molfile
				</button>
				<button onClick={clearEditor} style={buttonStyle}>
					Clear
				</button> */}
			{/* </div> */}
		</div>


	);
});

export default { render };
