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
- "summary": a short summary of what this content is about (max 40 words)
Respond with **only** valid JSON. No explanations, markdown, or extra text.
"""
