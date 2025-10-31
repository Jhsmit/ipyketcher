# ipyketcher

## How to use

```python
from ipyketcher import KetcherEditor

editor = KetcherEditor(
    initial_molecule="OCC",
    return_formats=["smiles", "molfile"],
)

editor
```

You can now draw a structure, and access the currently drawn molecule in smiles or molfile format via
`editor.smiles` or `editor.molfile`.

Other supported formats are: 'rxn', 'ket', 'smarts', 'cml', 'sdf', 'cdxml', 'cdx', 'inchi', 'inchi_key'. Set the format you want synchronized back to Python using the `return_formats` parameter, and observe the output via the corresponding attribute on the `KetcherEditor` instance.


## Installation

```sh
pip install ipyketcher
```

or with [uv](https://github.com/astral-sh/uv):

```sh
uv add ipyketcher
```

## Development

We recommend using [uv](https://github.com/astral-sh/uv) for development.
It will automatically manage virtual environments and dependencies for you.

```sh
uv run jupyter lab example.ipynb
```

Alternatively, create and manage your own virtual environment:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
jupyter lab example.ipynb
```

The widget front-end code bundles it's JavaScript dependencies. After setting up Python,
make sure to install these dependencies locally:

```sh
npm install
```

While developing, you can run the following in a separate terminal to automatically
rebuild JavaScript as you make changes:

```sh
npm run dev
```

Open `example.ipynb` in JupyterLab, VS Code, or your favorite editor
to start developing. Changes made in `js/` will be reflected
in the notebook.

### Hot reloading

Set anywidget hot reloading on windows:

```
set ANYWIDGET_HMR=1
```

## Resources

- [Ketcher Home page](https://lifescience.opensource.epam.com/ketcher/index.html)
- [Ketcher Help](https://github.com/epam/ketcher/blob/master/documentation/help.md)
- [Ketcher API docs](https://github.com/epam/ketcher/blob/master/README.md#ketcher-api)
- [Streamlit Ketcher](https://github.com/mik-laj/streamlit-ketcher)