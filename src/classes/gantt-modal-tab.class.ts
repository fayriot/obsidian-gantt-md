import {App, Modal} from 'obsidian';
import {GANTT_MODAL_TEXT, GANTT_MODAL_TITLE} from 'src/constants/modal.constants';

export class GanttModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const {contentEl, titleEl} = this;
        contentEl.innerHTML = GANTT_MODAL_TEXT;
        titleEl.setText(GANTT_MODAL_TITLE);
    }

    onClose() {
        const {contentEl, titleEl} = this;
        contentEl.empty();
        titleEl.empty();
    }
}

