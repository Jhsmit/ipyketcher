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

			try {
				// Process each requested return format
				if (returnFormats.includes('smiles')) {
					const smilesValue = await ketcher.getSmiles();
					setSmiles(smilesValue);
					console.log('Updated SMILES:', smilesValue);
				}

				if (returnFormats.includes('molfile')) {
					const molfileValue = await ketcher.getMolfile();
					setMolfile(molfileValue);
					console.log('Updated Molfile');
				}

				if (returnFormats.includes('rxn')) {
					const rxnValue = await ketcher.getRxn();
					setRxn(rxnValue);
					console.log('Updated RXN');
				}

				if (returnFormats.includes('ket')) {
					const ketValue = await ketcher.getKet();
					setKet(ketValue);
					console.log('Updated KET');
				}

				if (returnFormats.includes('smarts')) {
					const smartsValue = await ketcher.getSmarts();
					setSmarts(smartsValue);
					console.log('Updated SMARTS');
				}

				if (returnFormats.includes('cml')) {
					const cmlValue = await ketcher.getCml();
					setCml(cmlValue);
					console.log('Updated CML');
				}

				if (returnFormats.includes('sdf')) {
					const sdfValue = await ketcher.getSdf();
					setSdf(sdfValue);
					console.log('Updated SDF');
				}

				if (returnFormats.includes('cdxml')) {
					const cdxmlValue = await ketcher.getCDXml();
					setCdxml(cdxmlValue);
					console.log('Updated CDXml');
				}

				if (returnFormats.includes('cdx')) {
					const cdxValue = await ketcher.getCDX();
					setCdx(cdxValue);
					console.log('Updated CDX');
				}

				if (returnFormats.includes('inchi')) {
					const inchiValue = await ketcher.getInchi();
					setInchi(inchiValue);
					console.log('Updated InChI');
				}

				if (returnFormats.includes('inchi_key')) {
					const inchiKeyValue = await ketcher.getInchiKey();
					setInchiKey(inchiKeyValue);
					console.log('Updated InChI Key');
				}
			} catch (error) {
				console.error('Error updating formats on change:', error);
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
