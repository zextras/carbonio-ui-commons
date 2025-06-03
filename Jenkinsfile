/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

def nodeCmd(String cmd) {
	sh '. load_nvm && nvm install && nvm use && npm ci && ' + cmd
}

def getPackageName() {
	return sh(script: 'grep \'"name":\' package.json | sed -n --regexp-extended \'s/.*"name": "([^"]+).*/\\1/p\' ', returnStdout: true).trim()
}

void npmLogin(String npmAuthToken) {
	if (!fileExists(file: '.npmrc')) {
		sh(
				script: """
                touch .npmrc;
                echo "//registry.npmjs.org/:_authToken=${npmAuthToken}" > .npmrc
            """,
				returnStdout: false
		)
	}
}

pipeline {
	agent {
		node {
			label 'nodejs-agent-v4'
		}
	}
	options {
		timeout(time: 20, unit: 'MINUTES')
		buildDiscarder(logRotator(numToKeepStr: '50'))
	}
	stages {
		stage("Npm login + stash .npmrc") {
			steps {
				withCredentials([
						usernamePassword(
								credentialsId: "npm-zextras-bot-auth-token",
								usernameVariable: "NPM_USERNAME",
								passwordVariable: "NPM_PASSWORD"
						)
				]) {
					script {
						npmLogin(NPM_PASSWORD)
					}
				}
				stash(
						includes: ".npmrc",
						name: ".npmrc"
				)
			}
		}
		stage('Tests') {
			parallel {
				stage('Prettify') {
					agent {
						node {
							label 'nodejs-agent-v4'
						}
					}
					steps {
						unstash(name: ".npmrc")
						nodeCmd('npm run prettify:check')
					}
				}
				stage('Lint') {
					agent {
						node {
							label 'nodejs-agent-v4'
						}
					}
					steps {
						unstash(name: ".npmrc")
						nodeCmd('npm run lint')
					}
				}
				stage('TypeCheck') {
					agent {
						node {
							label "nodejs-agent-v4"
						}
					}
					steps {
						unstash(name: ".npmrc")
						nodeCmd('npm run type-check')
					}
				}
				stage('Unit Tests') {
					agent {
						node {
							label 'nodejs-agent-v4'
						}
					}
					steps {
						unstash(name: ".npmrc")
						nodeCmd('npm run test')
						script {
							if (fileExists('coverage/lcov.info')) {
								stash(
										includes: 'coverage/lcov.info',
										name: 'lcov.info'
								)
							}
						}
					}
					post {
						always {
							junit 'junit.xml'
							recordCoverage(tools: [[parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']])
						}
					}
				}
			}
		}

		stage('SonarQube analysis') {
			agent {
				node {
					label 'nodejs-agent-v4'
				}
			}
			steps {
				script {
					unstash(name: 'lcov.info')
					nodeCmd('npm i -D sonarqube-scanner')
				}
				withSonarQubeEnv(credentialsId: 'sonarqube-user-token', installationName: 'SonarQube instance') {
					nodeCmd("npx sonar-scanner -Dsonar.projectKey=${getPackageName().replaceAll("@zextras/", "")} -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info")
				}
			}
		}

		stage("Build") {
			agent {
				node {
					label "nodejs-agent-v4"
				}
			}
			steps {
				script {
					unstash(name: '.npmrc')
					nodeCmd('npm run build')
				}
			}
		}

		stage('Release to NPM') {
			when {
				branch 'release'
			}
			steps {
				script {
					withCredentials([usernamePassword(credentialsId: 'npm-zextras-bot-auth-token', usernameVariable: 'AUTH_USERNAME', passwordVariable: 'NPM_TOKEN')]) {
						withCredentials([usernamePassword(credentialsId: 'tarsier-bot-pr-token-github', usernameVariable: 'GH_USERNAME', passwordVariable: 'GH_TOKEN')]) {
							nodeCmd("npx semantic-release")
						}
					}
				}
			}
		}
	}
	post {
		always {
			script {
				commitEmail = sh(
						script: 'git --no-pager show -s --format=\'%ae\'',
						returnStdout: true
				).trim()
			}
			emailext (
					attachLog: true,
					body: '$DEFAULT_CONTENT',
					recipientProviders: [requestor()],
					subject: '$DEFAULT_SUBJECT',
					to: "${commitEmail}"
			)
		}
	}
}