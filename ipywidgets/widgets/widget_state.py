from traitlets import Unicode
from .domwidget import DOMWidget

class StateWidget(DOMWidget):
    _model_name = Unicode('StateModel').tag(sync=True)
    _model_module_version = Unicode('1.5.0').tag(sync=True)
    _model_module = Unicode('@jupyter-widgets/controls').tag(sync=True)

    value = Unicode('Hello World 3').tag(sync=True)
    def __init__(self, **kwargs):
        self.init_mode = True
        super().__init__(**kwargs)

    def set_value(self, str_val):
        self.value = str_val
