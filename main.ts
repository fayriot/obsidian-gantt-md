import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
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

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		this.addCommand({
            id: 'sample-editor-command--blocks',
            name: 'Insert Blocks',
            callback: () => this.insertBlocks(),
        });


		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', async (evt: MouseEvent) => {
			console.log('click', evt);
			this.createNoteLinks();
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 30 * 1000));

		//----------- 

		this.createNoteLinks();

		this.registerMarkdownPostProcessor((element, context) => {
            const codeBlocks = element.querySelectorAll('pre');

            codeBlocks.forEach((block) => {
                const codeContent = block.innerText;

                // Убедитесь, что содержимое блока соответствует вашим критериям
                if (this.isTargetCodeBlock(codeContent)) {
                    const htmlContent = this.generateHtmlContent();

                    // Замените блок кода на HTML
                    const div = document.createElement('div');
                    div.innerHTML = htmlContent;
                    block.replaceWith(div);
                }
            });
        });
	}

	isTargetCodeBlock(code: string): boolean {
        // Здесь вы можете сделать проверку, чтобы понять, является ли блок целевым
        return code.startsWith('fffffuck');
    }

    generateHtmlContent(): string {
		const links = this.createNoteLinks();
		let result = '';
        // Генерация HTML-контента с разноцветными блоками
		links.forEach((link: any) => {
			result += `
			<div>
			<div style="position: relative;cursor: pointer; background-color: grey; padding: 10px; margin: 30px;" onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=${link.path}', '_self')">
			<div style="color: white;">${link.name}</div>	
			<div style="position: absolute; bottom: -20px; left: 0;">${link.dateFrom}</div>
			<div style="position: absolute; bottom: -20px; right: 0;">${link.dateTo}</div>
			</div>
			</div>`;
		})

		return result;	

        // return `
        //     <div style="background-color: red; padding: 10px; margin: 5px;" onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=d/files/test1', '_self')">Block 1</div>
        //     <div style="background-color: green; padding: 10px; margin: 5px;" onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=d/files/test2', '_self')">Block 2</div>
        //     <div style="background-color: blue; padding: 10px; margin: 5px;" onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=d/files/test3', '_self')">Block 3</div>
        // `;
    }

	onunload() {

	}

	createNoteLinks() { 
		const files = this.app.vault.getMarkdownFiles();
		const sortedFiles = files.filter(file => file.parent?.path === 'd/files');
		const result: any = [];

		sortedFiles.forEach(file => {
			console.log(file);
			// const content =this.app.vault.cachedRead(file);
			const metadata = this.app.metadataCache.getFileCache(file);
			console.log(metadata);
			const dateFrom = metadata?.frontmatter?.dateFrom;
			const dateTo = metadata?.frontmatter?.dateTo;
			result.push({
				name: file.basename,
				path: file.path,
				dateFrom,
				dateTo
			});			
		});
		console.log(result);
		return result;
	}

	insertBlocks() {
        const activeEditor = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeEditor) {
            const colorBlocksHTML = `
				<div style="display: flex;">
                <div style="display: block; color: black; background-color: #FFCCCB; padding: 10px; margin: 10px 0;" onclick="window.open('obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=d/files/test1', '_self')">test1</div>
                <div style="display: block; color: black; background-color: #ADD8E6; padding: 10px; margin: 10px 0;">test2</div>
                <div style="display: block; color: black; background-color: #90EE90; padding: 10px; margin: 10px 0;">test3</div>
				</div>
            `;
            // activeEditor.replaceSelection(colorBlocksHTML);
			const contentWrapper = activeEditor.contentEl.getElementsByClassName('cm-contentContainer')[0];

			contentWrapper.innerHTML += colorBlocksHTML;
        }


		console.log(activeEditor);
    }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
