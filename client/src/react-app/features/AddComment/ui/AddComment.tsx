import { CollapsedEditor, Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core'
import React, { useState } from 'react'
import { cn } from '../../../shared/lib/classNames '

interface AddCommentProps {
    className?: string
}

const AddComment = (props: AddCommentProps) => {
    const { className } = props
    const [focus, setFocus] = useState(false)

    return (
        <div className={cn('[&_.assistive]:hidden', className)}>
            {/* @ts-ignore */}
            <EditorContext>
                <WithEditorActions
                    render={(actions) => (
                        <CollapsedEditor
                            isExpanded={focus}
                            onFocus={() => setFocus(true)}
                            placeholder="Add a comment..."
                        >
                            <Editor
                                appearance="comment"
                                shouldFocus={focus}
                                onSave={() => {}}
                                onChange={() => {}}
                                onCancel={() => setFocus(false)}
                                allowAnalyticsGASV3={true}
                            />
                        </CollapsedEditor>
                    )}
                />
            </EditorContext>
        </div>
    )
}

export default AddComment
