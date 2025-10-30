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
	const [value, setValue] = useModelState("value");

	const handleKetcherInit = async (ketcher) => {
		console.log('Ketcher initialized:', ketcher);
		setKetcherInstance(ketcher);

		if (value) {
			try {
				// Wait for Ketcher's structService to be ready, then set molecule
				await ketcher.structService;
				await ketcher.setMolecule(value);
				console.log('Initial molecule set successfully:', value);
			} catch (error) {
				console.error('Error setting initial molecule:', error);
			}
		}
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
