const atlassianURL = new URL('https://auth.atlassian.com/authorize')

atlassianURL.searchParams.set('audience', 'api.atlassian.com')
atlassianURL.searchParams.set('client_id', process.env.CLIENT_ID)
atlassianURL.searchParams.set(
    'scope',
    [
        'offline_access',
        'read:jira-work',
        'manage:jira-configuration',
        'read:jira-user',
        'write:jira-work',
        'read:application-role:jira',
        'read:avatar:jira',
        'read:filter:jira',
        'write:filter:jira',
        'delete:filter:jira',
        'read:filter.column:jira',
        'write:filter.column:jira',
        'delete:filter.column:jira',
        'read:filter.default-share-scope:jira',
        'write:filter.default-share-scope:jira',
        'read:group:jira',
        'read:issue-type:jira',
        'read:issue-type-hierarchy:jira',
        'read:user:jira',
        'read:project:jira',
        'read:project-category:jira',
        'read:project.component:jira',
        'read:project-role:jira',
        'read:project-version:jira',
        'read:issue.time-tracking:jira',
        'read:jql:jira',
        'read:user-configuration:jira',
    ].join(' ')
)
atlassianURL.searchParams.set('redirect_uri', process.env.REDIRECT_URL)
atlassianURL.searchParams.set('state', 'YOUR_USER_BOUND_VALUE')
atlassianURL.searchParams.set('response_type', 'code')
atlassianURL.searchParams.set('prompt', 'consent')

module.exports = atlassianURL
