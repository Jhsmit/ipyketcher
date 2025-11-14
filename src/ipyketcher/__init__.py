# %%
import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("ipyketcher")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class KetcherEditor(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"

    initial_molecule = traitlets.Unicode("").tag(sync=True)
    return_formats = traitlets.List[str]().tag(sync=True)

    height = traitlets.Unicode("500px").tag(sync=True)
    width = traitlets.Unicode("100%").tag(sync=True)

    # Output format traitlets
    smiles = traitlets.Unicode("").tag(sync=True)
    molfile = traitlets.Unicode("").tag(sync=True)
    rxn = traitlets.Unicode("").tag(sync=True)
    ket = traitlets.Unicode("").tag(sync=True)
    smarts = traitlets.Unicode("").tag(sync=True)
    cml = traitlets.Unicode("").tag(sync=True)
    sdf = traitlets.Unicode("").tag(sync=True)
    cdxml = traitlets.Unicode("").tag(sync=True)
    cdx = traitlets.Unicode("").tag(sync=True)
    inchi = traitlets.Unicode("").tag(sync=True)
    inchi_key = traitlets.Unicode("").tag(sync=True)

    def _return_formats_default(self):
        return ["smiles"]
