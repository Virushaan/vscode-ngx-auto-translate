import * as vscode from 'vscode';
import { TranslateStringBody, stringToTranslateSnakeCase } from './lib';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('html', new AutoTranslate(), {
			providedCodeActionKinds: AutoTranslate.providedCodeActionKinds
		}), 
		vscode.commands.registerCommand('extension.setTranslationFile', () => {
			getTranslationsFile();
		})
	);
}

/**
 * Provides code actions for converting :) to an smiley emoji.
 */
export class AutoTranslate implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
		const textToTranslate = this.getHtmlString(document, range);

		if (textToTranslate.length === 0) {
			return;
		}

		const translateBody: TranslateStringBody = stringToTranslateSnakeCase(textToTranslate, 'accounts');

		const replaceWithTranslationFix = this.createFix(document, range, translateBody);
		replaceWithTranslationFix.isPreferred = true;
		return [
			replaceWithTranslationFix,
		];

	}

	private getHtmlString(document: vscode.TextDocument, range: vscode.Range): string {
		return document.getText(range);
	}

	private createFix(document: vscode.TextDocument, range: vscode.Range, translateBody: TranslateStringBody): vscode.CodeAction {
		const fix = new vscode.CodeAction(`Add to translation`, vscode.CodeActionKind.QuickFix);

		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, range, translateBody.key);
		return fix;
	}
}

function getTranslationsFile() {
	// const quickPick = vscode.window.createQuickPick();
	// quickPick.items = [{label: 'tutorial.json'}, {label: 'accounts.json'}, {label: 'test.json'}];
	// quickPick.placeholder = 'Select translations file';
	// quickPick.onDidAccept(() => { 
	// 	vscode.window.showInformationMessage(`Translation file set to ${quickPick.selectedItems[0].label}`);
	// 	quickPick.hide();
	// });
	// quickPick.show();
	const openDialogOptions: vscode.OpenDialogOptions = {
		openLabel: 'Add translation file',
		filters: { 'Translation files': ['json']	}
	};
	vscode.window.showOpenDialog(openDialogOptions).then(
		file => {
			if (file && file[0]) {
				const path = file[0].path;
				vscode.window.showInformationMessage(`Translation file set to ${path.split('/').slice(-1)[0]}`);
			}
		}
	);
}
