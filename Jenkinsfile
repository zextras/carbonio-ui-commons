/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// FLAGS
String nodeVersion

def getNodeVersion() {
    return sh(
        script: 'sed "s/^[vV]//" .nvmrc | cut -d. -f1',
        returnStdout: true
    ).trim()
}

void npmLogin(String npmAuthToken) {
	if (!fileExists(file: '.npmrc')) {
		sh(
			script: """
                echo "//registry.npmjs.org/:_authToken=${npmAuthToken}" >> .npmrc
            """,
				returnStdout: false
		)
	}
}

pipeline {
	agent {
		node {
			label 'nodejs-v1'
		}
	}
	options {
		timeout(time: 20, unit: 'MINUTES')
		buildDiscarder(logRotator(numToKeepStr: '50'))
	}
	stages {
        stage("Read settings") {
            steps {
                container('base') {
                    script {
                        nodeVersion = getNodeVersion()
                        echo "NodeJS Major Version: $nodeVersion"
                    }
                }
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
            }
        }
        stage('Install dependencies') {
            steps {
                container('nodejs-' + nodeVersion) {
                    script {
                        sh 'npm ci'
                    }
                }
            }
        }
		stage('Tests') {
			parallel {
				stage('Prettify') {
					steps {
						container('nodejs-' + nodeVersion) {
							sh 'npm run prettify:check'
						}
					}
				}
				stage('Lint') {
					steps {
						container('nodejs-' + nodeVersion) {
							sh 'npm run lint'
						}
					}
				}
				stage('TypeCheck') {
					steps {
						container('nodejs-' + nodeVersion) {
							sh 'npm run type-check'
						}
					}
				}
				stage('Unit Tests') {
					steps {
						container('nodejs-' + nodeVersion) {
							sh 'npm run test'
						}
					}
					post {
						always {
							container('nodejs-' + nodeVersion) {
								junit 'junit.xml'
								recordCoverage(tools: [[parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']])
							}
						}
					}
				}
			}
		}

		stage('SonarQube analysis') {
			steps {
				container('nodejs-' + nodeVersion) {
					withSonarQubeEnv(credentialsId: 'sonarqube-user-token', installationName: 'SonarQube instance') {
						sh "npx sonar-scanner -Dsonar.projectKey='carbonio-ui-commons' -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
					}
				}
			}
		}

		stage("Build") {
			steps {
				container('nodejs-' + nodeVersion) {
					script {
						sh 'npm run build'
					}
				}
			}
		}

		stage('Release to NPM') {
			when {
				anyOf {
					branch 'release'
					branch 'devel'
				}
			}
			steps {
				container('nodejs-' + nodeVersion) {
					script {
						withCredentials([usernamePassword(credentialsId: 'npm-zextras-bot-auth-token', usernameVariable: 'AUTH_USERNAME', passwordVariable: 'NPM_TOKEN')]) {
							withCredentials([usernamePassword(credentialsId: 'tarsier-bot-pr-token-github', usernameVariable: 'GH_USERNAME', passwordVariable: 'GH_TOKEN')]) {
								sh "npx semantic-release"
							}
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