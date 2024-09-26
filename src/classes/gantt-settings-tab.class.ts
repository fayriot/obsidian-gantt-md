import GanttPlugin from 'main';
import {App, PluginSettingTab, Setting} from 'obsidian';

export class GanttSettingsTab extends PluginSettingTab {
    plugin: GanttPlugin;

    constructor(app: App, plugin: GanttPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Title')
            .setDesc('Description')
            .addText(text =>
                text
                    .setPlaceholder('Enter value')
                    .setValue(this.plugin.settings.setting)
                    .onChange(async value => {
                        this.plugin.settings.setting = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}

