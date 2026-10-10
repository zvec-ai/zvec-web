"""Clean Doxygen leftovers in Java doc comments before javadoc runs.

JavaCPP copies the Doxygen comments of ``zvec/c_api.h`` verbatim into the
generated bindings, but javadoc reads a doc comment as HTML and only knows
javadoc tags. Two things therefore leak into the published pages:

* a raw ``<`` that cannot start an HTML tag (``std::shared_ptr<zvec::Collection>*``)
  makes javadoc render its own ``invalid input: '<'`` marker in the text;
* commands javadoc does not know (``\\brief``, ``\\note``) are printed literally.

Both are fixed here, in the sources, so javadoc never produces the broken
output in the first place. Only ``/** ... */`` comments are touched, string
and char literals are skipped, and ``{@code ...}`` / ``{@link ...}`` spans are
left alone because javadoc already escapes their content.

Usage: ``clean_doc_comments.py <source-root> [--dry-run]``
"""

import pathlib
import re
import sys

INLINE_TAG = re.compile(r'\{@[^{}]*\}')
VALID_TAG = re.compile(r'<(?:!--|![A-Za-z]|/?[A-Za-z][A-Za-z0-9-]*(?=[\s/>]))')
DOXYGEN_COMMANDS = (
    (re.compile(r'\\brief\s*'), ''),
    (re.compile(r'\\note\s*'), 'Note: '),
)


def escape_invalid_lt(text):
    out = []
    index = 0
    escaped = 0
    while True:
        pos = text.find('<', index)
        if pos == -1:
            out.append(text[index:])
            break
        out.append(text[index:pos])
        if VALID_TAG.match(text, pos):
            out.append('<')
        else:
            out.append('&lt;')
            escaped += 1
        index = pos + 1
    return ''.join(out), escaped


def clean_comment(comment):
    parts = INLINE_TAG.split(comment)
    tags = INLINE_TAG.findall(comment)
    escaped = rewritten = 0
    out = []
    for index, part in enumerate(parts):
        cleaned = part
        for pattern, replacement in DOXYGEN_COMMANDS:
            cleaned, hits = pattern.subn(replacement, cleaned)
            rewritten += hits
        cleaned, hits = escape_invalid_lt(cleaned)
        escaped += hits
        out.append(cleaned)
        if index < len(tags):
            out.append(tags[index])
    return ''.join(out), escaped, rewritten


def clean_source(source):
    out = []
    index = 0
    size = len(source)
    escaped = rewritten = 0
    while index < size:
        char = source[index]
        following = source[index + 1] if index + 1 < size else ''
        if char in '"\'':
            end = index + 1
            while end < size:
                if source[end] == '\\':
                    end += 2
                    continue
                if source[end] == char:
                    end += 1
                    break
                end += 1
            out.append(source[index:end])
            index = end
        elif char == '/' and following == '/':
            end = source.find('\n', index)
            end = size if end == -1 else end
            out.append(source[index:end])
            index = end
        elif char == '/' and following == '*':
            start = index + 3 if source.startswith('/**', index) else index + 2
            end = source.find('*/', start)
            end = size if end == -1 else end + 2
            chunk = source[index:end]
            if source.startswith('/**', index):
                chunk, hit_escape, hit_rewrite = clean_comment(chunk)
                escaped += hit_escape
                rewritten += hit_rewrite
            out.append(chunk)
            index = end
        else:
            out.append(char)
            index += 1
    return ''.join(out), escaped, rewritten


def main():
    root = pathlib.Path(sys.argv[1])
    dry_run = '--dry-run' in sys.argv
    files = escaped_total = rewritten_total = 0
    for path in sorted(root.rglob('*.java')):
        source = path.read_text(encoding='utf-8')
        cleaned, escaped, rewritten = clean_source(source)
        escaped_total += escaped
        rewritten_total += rewritten
        if cleaned == source:
            continue
        files += 1
        if dry_run:
            print(f"--- {path}")
            for before, after in zip(source.splitlines(), cleaned.splitlines()):
                if before != after:
                    print(f"-{before}\n+{after}")
        else:
            path.write_text(cleaned, encoding='utf-8')
    verb = 'Would clean' if dry_run else 'Cleaned'
    print(
        f"==> {verb} doc comments in {files} files: "
        f"escaped {escaped_total} '<', rewrote {rewritten_total} Doxygen commands"
    )


if __name__ == '__main__':
    main()
