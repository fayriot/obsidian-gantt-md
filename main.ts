import {Editor, MarkdownView, Plugin} from 'obsidian';
import {GanttSettingsTab} from 'src/classes/gantt-settings-tab.class';
import {DEFAULT_SETTINGS, GANTT_RIBBON_ICON} from 'src/constants';
import {DEFAULT_EDITOR_BLOCK_DATES, DEFAULT_EDITOR_BLOCK_YEARS, DEFAULT_NOTE_EXAMPLE} from 'src/constants/editor.constants';
import {drawContainerBackground, drawEvents, drawPeriods, drawWrapper, filterDates, getFilesCollection, parseOptions} from 'src/helpers';
import {GanttOptions, GanttPluginSettings, InputFileMetaTypeEnum} from 'src/interfaces';

export default class GanttPlugin extends Plugin {
    settings: GanttPluginSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('chart-gantt', 'Gantt.md, create note', (evt: MouseEvent) => {
            this.createNoteWithCode();
        });
        ribbonIconEl.innerHTML = GANTT_RIBBON_ICON;

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

                if (codeContent.startsWith('gantt-md')) {
                    const opts = parseOptions(codeContent);
                    const htmlContent = this.generateHtmlContent(opts);
                    block.replaceWith(drawWrapper(opts, htmlContent));
                }
            });
        });
    }

    generateHtmlContent(opts: GanttOptions): string {
        const links = getFilesCollection(this.app, opts.path).filter(link => filterDates(link, opts));
        const events = links.filter(link => link.type === InputFileMetaTypeEnum.EVENT);
        const periods = links.filter(link => link.type === InputFileMetaTypeEnum.PERIOD);
        const subperiods = links.filter(link => link.type === InputFileMetaTypeEnum.SUBPERIOD);
        let result = '';

        result += drawContainerBackground(opts, this.settings);
        result += drawPeriods(opts, periods, this.app);
        result += drawPeriods(opts, subperiods, this.app);
        result += drawEvents(opts, events, this.app);

        return result;
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async createNoteWithCode() {
        const codeContent = DEFAULT_NOTE_EXAMPLE;
        const filename = 'New Note ' + new Date().toISOString().split('.')[0].replace(/:/g, '-') + '.md';
        const file = await this.app.vault.create(filename, codeContent);
        const leaf = this.app.workspace.getLeaf(false); // open in the current tab

        leaf.openFile(file);
    }
}

