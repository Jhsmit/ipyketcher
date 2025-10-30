# %%
import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("ipyketcher")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"

# %%
return_formats = {}


class Widget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"

    initial_molecule = traitlets.Unicode("").tag(sync=True)

    return_formats = traitlets.List[str]().tag(sync=True)

    smiles = traitlets.Unicode("").tag(sync=True)

    def _return_formats_default(self):
        return ["smiles"]
