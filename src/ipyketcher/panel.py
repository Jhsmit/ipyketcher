import pathlib

try:
    from panel.custom import AnyWidgetComponent
    import param
except ImportError:
    msg = "To use ipypmolstar as panel AnyWidgetComponent, the panel package needs to be installed"
    raise ImportError(msg)


class KetcherEditor(AnyWidgetComponent):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _stylesheets = [str(pathlib.Path(__file__).parent / "static" / "widget.css")]

    initial_molecule = param.String(default="")
    return_formats = param.List(default=["smiles"])

    height = param.String(default="500px")

    # Output format parameters
    smiles = param.String(default="")
    molfile = param.String(default="")
    rxn = param.String(default="")
    ket = param.String(default="")
    smarts = param.String(default="")
    cml = param.String(default="")
    sdf = param.String(default="")
    cdxml = param.String(default="")
    cdx = param.String(default="")
    inchi = param.String(default="")
    inchi_key = param.String(default="")
