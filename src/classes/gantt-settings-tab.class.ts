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
            .setName('Max Ticks')
            .setDesc('Maximum ticks. If generated ticks exceed this value, their number will be adjusted to this value. Large values may cause performance issues.')
            .addText(text =>
                text
                    .setPlaceholder('Enter value')
                    .setValue(this.plugin.settings.maxTicks)
                    .onChange(async value => {
                        this.plugin.settings.maxTicks = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}

