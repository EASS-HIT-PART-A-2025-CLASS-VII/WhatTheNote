QUERY_PROMPT = """
You must answer the user's question **exclusively** using the content below.

Document Content:
{content}

User Question:
{question}

- Use prior knowledge.
- If the question or part of it is not relevant to the content, respond with: "Not relevant to this file content." regarding this question.
- Answer only the relevant questions for this file content.
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
