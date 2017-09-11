import { Component } from '@angular/core'
import { MdInputModule, MdButtonModule, MdSelectModule } from '@angular/material'
import { ngxModuleCollector } from '@brickyard/ngx-module-collector'
import * as Github from 'github-api'
import * as _ from 'lodash'

@Component({
	selector: 'brickyard-app',
	templateUrl: './app.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	private github: any
	private username: String = ''
	private password: String = ''
	private repos: Array<Object>
	private selectedRepo: any
	private issueNumbers: String
	private issues: Array<Object>

	constructor() {
	}
	async login() {
		this.github = new Github({
			username: this.username,
			password: this.password,
		})
		const res = await this.github.getUser().listRepos()
		this.repos = _.chain(res.data).map(e => _.pick(e, 'full_name', 'name', 'owner.login')).sortBy('full_name').value()
		console.log(this.repos)
	}
	async loadIssues() {
		this.issues = []
		for (let num of this.issueNumbers.match(/\d+/g) || []) {
			const res = await this.github.getIssues(this.selectedRepo.owner.login, this.selectedRepo.name).getIssue(num)
			const issue = _.pick(res.data, 'number', 'title')
			this.issues.push(issue)
			console.log(issue)
		}
	}
}

ngxModuleCollector.registerNgModuleImports(MdInputModule, MdButtonModule, MdSelectModule)
ngxModuleCollector.registerNgModuleDeclarations(AppComponent)
ngxModuleCollector.registerNgModuleBootstrap(AppComponent)
