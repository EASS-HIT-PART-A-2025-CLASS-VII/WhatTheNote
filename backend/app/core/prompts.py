QUERY_PROMPT = """
You must answer the user's question **exclusively** using the content below.

Document Content:
{content}

User Question:
{question}

- If the answer is not explicitly stated in the content, respond only with: "Not found in the document."
- Be brief and direct.
- Use Markdown formatting if needed for emphasis and clarity.
- Response with **only** the answer.
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
Given the following PDF text:
-- START OF TEXT --
\n{raw_text}\n
-- END OF TEXT --

Rewrite and organize this text using Markdown formatting while preserving paragraph meaning.

Respond with **only** the refined text — no explanations or additional content.
"""
