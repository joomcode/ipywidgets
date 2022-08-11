// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
    DOMWidgetModel,
    ISerializers,
} from '@jupyter-widgets/base';

import {JUPYTER_CONTROLS_VERSION} from './version';
// import {WidgetManager} from '@jupyter-widgets/jupyterlab-manager';

export class StateModel extends DOMWidgetModel {

    findCell(init: boolean) {
        const next_cell_id = this.widget_manager.getTracker().activeCell.model.id;
        const cells = this.widget_manager.context.model.cells;
        let cell = undefined;
        for (let i = 0; i < cells.length; i++) {
            if (cells.get(i).id === next_cell_id) {
                // active cell is changed after cell evaluate and before widget initialization
                if (init) {
                    cell = cells.get(i - 1);
                } else {
                    cell = cells.get(i);
                }
                break;
            }
        }
        return cell;
    }

    initialize(
        attributes: any,
        options: { model_id: string; comm?: any; widget_manager: any/*WidgetManager*/ }
    ) {
        super.initialize(attributes, options);

        if (options.widget_manager.getTracker().activeCell && this.findCell(true)) {
            const saverValue = this.findCell(true).metadata.get('saver_value');
            if (saverValue) {
                this.set('value', saverValue);
                this.save_changes(); // send updated value to python code
            }
        }
        this.on('change:value', this.value_changed, this);
    }

    value_changed() {
        const value = this.get('value');
        if (value) {
            this.findCell(false).metadata.set('saver_value', value);
        }
    }

    defaults() {
        return {
            ...super.defaults(),
            _model_name: 'StateModel',
            _model_module_version: JUPYTER_CONTROLS_VERSION,
            _model_module: '@jupyter-widgets/controls',
            value: 'Hello World',
        };
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        // Add any extra serializers here
    };
}
