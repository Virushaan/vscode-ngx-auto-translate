import * as vscode from 'vscode';
import { TranslateStringBody, stringToTranslateSnakeCase } from './lib';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('html', new AutoTranslate(), {
			providedCodeActionKinds: AutoTranslate.providedCodeActionKinds
		}));
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

	private getTranslationsFile() {
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = [{label: 'tutorial.json'}, {label: 'accounts.json'}, {label: 'test.json'}];
		quickPick.placeholder = 'Select translations file';
		quickPick.onDidAccept(() => {
			console.log('the valueeee', quickPick.selectedItems[0].label);
			quickPick.hide();
		});
		quickPick.show();
		return new Promise((res, rej) => {
			quickPick.onDidAccept(() => {
				res(quickPick.selectedItems[0].label);
			});
		});
	}

	private createFix(document: vscode.TextDocument, range: vscode.Range, translateBody: TranslateStringBody): vscode.CodeAction {
		const fix = new vscode.CodeAction(`Add to translation`, vscode.CodeActionKind.QuickFix);

		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, range, translateBody.key);
		return fix;
	}
}

