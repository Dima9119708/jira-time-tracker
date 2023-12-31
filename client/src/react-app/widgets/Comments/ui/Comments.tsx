import { BoxComments, queryGetComments, Comment } from '../../../entities/Comments'
import { useComment } from '../../../entities/Comments/lib/useComment'
import { AddComment } from '../../../features/AddComment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Skeleton } from '@mantine/core'

interface CommentsProps {
    issueId: string
}

const Comments = (props: CommentsProps) => {
    const { issueId } = props
    const open = useComment((state) => state.open)

    const { data, isLoading } = useInfiniteQuery(queryGetComments(issueId))

    return (
        <BoxComments open={open}>
            {({ open }) =>
                open && (
                    <>
                        <AddComment className="mb-[2rem]" />

                        {isLoading &&
                            Array.from({ length: 10 }, (_, idx) => (
                                <Skeleton
                                    h={100}
                                    mb={10}
                                    key={idx}
                                />
                            ))}

                        {data?.pages.map(
                            (page) =>
                                page?.comments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        document={comment.body}
                                        created={comment.created}
                                        displayName={comment.author.displayName}
                                        avatarUrl={comment.author.avatarUrls['48x48']}
                                    />
                                ))
                        )}
                    </>
                )
            }
        </BoxComments>
    )
}

export default Comments
