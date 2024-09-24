import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { GanttSettingsTab } from 'src/classes/gantt-settings-tab.class';
import { DEFAULT_SETTINGS } from 'src/constants';
import { parseOptions } from 'src/helpers';
import { GanttOptions, MyPluginSettings } from 'src/interfaces';


export default class GanttPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
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

            codeBlocks.forEach((block) => {
                const codeContent = block.innerText;

				const opts = parseOptions(codeContent);
				
                if (this.isTargetCodeBlock(codeContent)) {
                    const htmlContent = this.generateHtmlContent(opts);

                    const div = document.createElement('div');
					div.addClass('gantt-md-wrapper');
					
                    div.innerHTML = '<div class="gantt-md-container" style="width: ' + opts.width + 'px;">' + htmlContent + '</div>'; 
                    block.replaceWith(div);
                }
            });
        });
	}

	isTargetCodeBlock(code: string): boolean {
        return code.startsWith('gantt-md');
    }

    generateHtmlContent(opts: GanttOptions): string {
		const links = this.getFilesCollection();
		let result = '';

		result += `
		<div class="gantt-md-container-background">
		`;

		for (let i = 0; i <= 100; i++) {
			const width = Number(opts.periodFrom) - Number(opts.periodTo);
			if (i % 5 === 0) {
				result += `
				<div class="gantt-md-container-background-scale" style="left: ${i}%">
					<div class="gantt-md-container-background-scale-text">
					${width - (width / 100 * i)}
					</div>
				</div>
				`;
			} else {
				result += `
				<div class="gantt-md-container-background-scale faded-03" style="left: ${i}%"></div>
				`;
			}
		}

		result += `
		</div>
		`;

		result += `
		<div class="gantt-md-container-periods">
          <div class="gantt-md-container-period">
            <div
              class="gantt-md-container-period-item green"
              style="width: 30%"
            >
              Период 1
            </div>
            <div class="gantt-md-container-period-item blue" style="width: 70%">
              Период 2
            </div>
          </div>
          <div class="gantt-md-container-period">
            <div class="gantt-md-container-period-item red" style="width: 10%">
              Субпериод 1
            </div>
            <div
              class="gantt-md-container-period-item green"
              style="width: 70%"
            >
              Субпериод 2
            </div>
          </div>
        </div>
		`;

		result += `
		<div class="gantt-md-container-items">
		`;

		links.forEach((link: any) => {
			const width = Number(opts.periodFrom) - Number(opts.periodTo);
			const start = Math.abs(Number(link.relDateFrom) / width * 100);
			// const end = Number(link.relDateTo) / width * 100;
			const itemWidth = Math.abs((Number(link.relDateFrom) - Number(link.relDateTo))) /  Math.abs(Number(width)) * 100;

			const margin = width < 0 ? 100 - start : start;

			result += `
			<div
            class="gantt-md-container-item"
            style="width: ${itemWidth}%; margin-left: ${margin}%; background-color: ${link.color}"
			onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=${link.path}', '_self')"
          	>
            	<div class="gantt-md-container-item-title">${link.name}</div>
          	</div>
			`;
		})

		result += `
		</div>
		`;

		return result;	
    }

	onunload() {

	}

	getFilesCollection() { 
		const files = this.app.vault.getMarkdownFiles();
		const sortedFiles = files.filter(file => file.parent?.path === 'd/files');
		const result: any = [];

		sortedFiles.forEach(file => {
			// console.log(file);
			// const content =this.app.vault.cachedRead(file);
			const metadata = this.app.metadataCache.getFileCache(file);
			// console.log(metadata);
			result.push({
				name: file.basename,
				path: file.path,
				dateFrom:  metadata?.frontmatter?.dateFrom,
				dateTo:  metadata?.frontmatter?.dateTo,
				relDateFrom:  metadata?.frontmatter?.relDateFrom,
				relDateTo:  metadata?.frontmatter?.relDateTo,
				color: metadata?.frontmatter?.color
			});			
		});
		// console.log(result);
		return result;
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
