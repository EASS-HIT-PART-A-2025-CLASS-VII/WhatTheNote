QUERY_PROMPT = """
Based on the following document content, answer the user's question.
Document Content: {content}
User Question: {question}
Respond with the answer only, make it concise.
"""

UPLOAD_PROMPT = """
Analyze the following content:
-- START OF CONTENT --
\n{text}\n
-- END OF CONTENT --
Return a concise JSON object with the following structure:
- "title": a brief, meaningful title that's relevant to the whole content (max 5 words)
- "subject": most relevant keyword, max 2 words
- "summary": summarize the key points of this document (max 40 words)
Respond with **only** valid JSON. No explanations, markdown, or extra text.
"""

TEXT_CLEANUP_PROMPT = """
For this PDF text: 
-- START OF TEXT --
\n{raw_text}\n
-- END OF TEXT --
Remove extra dots, fix line breaks, use Markdown if needed and preserve paragraph meaning.
Respond with **only** the refined text. No explanations or extra text.
"""