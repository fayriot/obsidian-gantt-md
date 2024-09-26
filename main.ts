import {Editor, MarkdownView, Plugin} from 'obsidian';
import {GanttModal} from 'src/classes/gantt-modal-tab.class';
import {GanttSettingsTab} from 'src/classes/gantt-settings-tab.class';
import {DEFAULT_SETTINGS} from 'src/constants';
import {DEFAULT_EDITOR_BLOCK_DATES, DEFAULT_EDITOR_BLOCK_YEARS} from 'src/constants/editor.constants';
import {GANTT_MODAL_RIBBON_ICON} from 'src/constants/modal.constants';
import {drawContainerBackground, drawEvents, drawPeriods, drawWrapper, filterDates, getFilesCollection, parseOptions} from 'src/helpers';
import {GanttOptions, GanttPluginSettings} from 'src/interfaces';

export default class GanttPlugin extends Plugin {
    settings: GanttPluginSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('chart-gantt', 'Gantt.md', (evt: MouseEvent) => {
            new GanttModal(this.app).open();
        });
        ribbonIconEl.innerHTML = GANTT_MODAL_RIBBON_ICON;

        this.addCommand({
            id: 'gantt-md-insert-years-command',
            name: 'Insert, Years format',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection(DEFAULT_EDITOR_BLOCK_YEARS);
            },
        });

        this.addCommand({
            id: 'gantt-md-insert-dates-command',
            name: 'Insert, Dates format',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection(DEFAULT_EDITOR_BLOCK_DATES);
            },
        });

        this.addSettingTab(new GanttSettingsTab(this.app, this));

        this.registerMarkdownPostProcessor((element, context) => {
            const codeBlocks = element.querySelectorAll('pre');

            codeBlocks.forEach(block => {
                const codeContent = block.innerText;

                const opts = parseOptions(codeContent);

                if (codeContent.startsWith('gantt-md')) {
                    const htmlContent = this.generateHtmlContent(opts);
                    block.replaceWith(drawWrapper(opts, htmlContent));
                }
            });
        });
    }

    generateHtmlContent(opts: GanttOptions): string {
        const links = getFilesCollection(this.app, opts.path).filter(link => filterDates(link, opts));
        let result = '';

        result += drawContainerBackground(opts);
        result += drawPeriods(opts);
        result += drawEvents(opts, links, this.app);

        return result;
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

