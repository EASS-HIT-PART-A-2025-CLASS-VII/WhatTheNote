TEXT_CLEANUP_PROMPT = """
Given the following PDF text:
-- START OF TEXT --
\n{raw_text}\n
-- END OF TEXT --

Rewrite and organize this text using Markdown formatting while preserving paragraph meaning.

Respond with **only** the refined text — no explanations or additional content.
"""
