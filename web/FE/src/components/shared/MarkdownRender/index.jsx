import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MarkdownRenderer = ({ content, sender }) => {
    const linkColor =
        sender === 'user'
            ? 'text-white underline hover:text-gray-200'
            : 'text-blue-600 underline hover:text-blue-800'
    const codeBg =
        sender === 'user'
            ? 'bg-blue-700 text-white'
            : 'bg-gray-100 text-red-500'

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...props }) => (
                    <p {...props} className="mb-1 last:mb-0 break-words" />
                ),
                a: ({ node, ...props }) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-semibold ${linkColor}`}
                    />
                ),
                ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-5 mb-2 space-y-1" />
                ),
                ol: ({ node, ...props }) => (
                    <ol
                        {...props}
                        className="list-decimal pl-5 mb-2 space-y-1"
                    />
                ),
                li: ({ node, ...props }) => <li {...props} className="pl-1" />,
                strong: ({ node, ...props }) => (
                    <strong {...props} className="font-bold" />
                ),
                code: ({ node, inline, ...props }) =>
                    inline ? (
                        <code
                            {...props}
                            className={`px-1 py-0.5 rounded text-sm font-mono ${codeBg}`}
                        />
                    ) : (
                        <div className="overflow-x-auto my-2">
                            <code
                                {...props}
                                className={`block p-2 rounded text-sm font-mono ${codeBg}`}
                            />
                        </div>
                    ),
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-2">
                        <table
                            {...props}
                            className="min-w-full border-collapse border border-gray-300 text-sm"
                        />
                    </div>
                ),
                th: ({ node, ...props }) => (
                    <th
                        {...props}
                        className="border border-gray-300 px-2 py-1 bg-gray-200 font-bold text-gray-700"
                    />
                ),
                td: ({ node, ...props }) => (
                    <td
                        {...props}
                        className="border border-gray-300 px-2 py-1"
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default MarkdownRenderer
