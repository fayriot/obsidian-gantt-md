import {Editor, MarkdownView, Plugin} from 'obsidian';
import {GanttSettingsTab} from 'src/classes/gantt-settings-tab.class';
import {DEFAULT_EDITOR_BLOCK, DEFAULT_SETTINGS} from 'src/constants';
import {drawContainerBackground, drawEvents, drawPeriods, drawWrapper, filterDates, getFilesCollection, parseOptions} from 'src/helpers';
import {GanttOptions, MyPluginSettings} from 'src/interfaces';

export default class GanttPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        await this.loadSettings();

        // This creates an icon in the left ribbon.
        // const ribbonIconEl = this.addRibbonIcon('dice', 'Gantt.md', (evt: MouseEvent) => {
        //     new Notice('This is a notice!');
        // });
        // ribbonIconEl.addClass('gantt-md-ribbon-class');

        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: 'gantt-md-insert-command',
            name: 'Insert',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection(DEFAULT_EDITOR_BLOCK);
            },
        });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new GanttSettingsTab(this.app, this));

        // this.registerDomEvent(document, 'click', async (evt: MouseEvent) => {
        // 	console.log('click', evt);
        // });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        // this.registerInterval(window.setInterval(() => console.log('setInterval'), 30 * 1000));

        //-----------

        // this.createNoteLinks();

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

