import { User } from './UserSearch'
import { AvatarUrls } from './CommonTypes'
import { WorklogResponse } from './Worklogs'

export interface IssueResponse {
    expand: string
    startAt: number
    maxResults: number
    total: number
    issues: Issue[]
}

export interface Issue {
    expand: string
    id: string
    self: string
    key: string
    fields: IssueFields
}

export interface IssueFields {
    statuscategorychangedate: string
    issuetype: IssueType
    project: Project
    fixVersions: any[]
    aggregatetimespent: number
    resolution: Resolution
    resolutiondate: string
    workratio: number
    watches: Watches
    lastViewed: string
    created: string
    priority: Priority
    labels: string[]
    aggregatetimeoriginalestimate: number
    timeestimate: number
    timespent: number
    versions: any[]
    issuelinks: any[]
    assignee: Assignee
    updated: string
    status: Status
    components: any[]
    timeoriginalestimate: number
    description: any
    security: any
    aggregatetimeestimate: number
    summary: string
    creator: User
    subtasks: any[]
    reporter: User
    aggregateprogress: Progress
    environment: any
    duedate: any
    progress: Progress
    votes: Votes
    worklog: WorklogResponse
}

interface IssueType {
    self: string
    id: string
    description: string
    iconUrl: string
    name: string
    subtask: boolean
    avatarId: number
    hierarchyLevel: number
}

export interface Project {
    self: string
    id: string
    key: string
    name: string
    projectTypeKey: string
    simplified: boolean
    avatarUrls: AvatarUrls
}

interface Resolution {
    self: string
    id: string
    description: string
    name: string
}

interface Watches {
    self: string
    watchCount: number
    isWatching: boolean
}

export interface Priority {
    self: string
    iconUrl: string
    name: string
    id: string
}

export interface Status {
    self: string
    description: string
    iconUrl: string
    name: string
    id: string
    statusCategory: StatusCategory
}

export type StatusCategoryKey = 'new' | 'indeterminate' | 'done'

export interface StatusCategory {
    self: string
    id: number
    key: StatusCategoryKey
    colorName: string
    name: string
}

interface Progress {
    progress: number
    total: number
    percent: number
}

interface Votes {
    self: string
    votes: number
    hasVoted: boolean
}

export interface Assignee {
    accountId: string
    accountType: string
    active: boolean
    applicationRoles: {
        items: any[]
        size: number
    }
    avatarUrls: AvatarUrls
    displayName: string
    emailAddress: string
    groups: {
        items: any[]
        size: number
    }
    key: string
    name: string
    self: string
    timeZone: string
}

export interface TransitionsResponse {
    transitions: Transition[]
}

export interface Transition {
    fields: {
        summary: FieldConfig
        colour?: FieldConfig
    }
    hasScreen: boolean
    id: string
    isAvailable: boolean
    isConditional: boolean
    isGlobal: boolean
    isInitial: boolean
    name: string
    to: Status
}

interface FieldConfig {
    allowedValues: string[]
    defaultValue: string
    hasDefaultValue: boolean
    key: string
    name: string
    operations: string[]
    required: boolean
    schema: {
        custom: string
        customId: number
        items: string
        type: string
    }
}
