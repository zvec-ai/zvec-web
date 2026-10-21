#!/usr/bin/env bash
# Generate the Zvec Java API reference (Javadoc) into public/api-reference/java/.
set -euo pipefail

cd "$(dirname "$0")"

OUT="../../public/api-reference/java"
CENTRAL="https://repo1.maven.org/maven2/org/zvec/zvec-java"
VERSION="${ZVEC_JAVA_VERSION:-$(curl -fsS "$CENTRAL/maven-metadata.xml" | sed -n 's:.*<release>\(.*\)</release>.*:\1:p')}"

if [ -z "${VERSION}" ]; then
  echo "error: could not resolve the latest zvec-java release version" >&2
  exit 1
fi

# Javadoc 11 dropped frame-based output, so the generated site looks completely
# different between JDKs. Pin one: $JAVADOC wins, then the JDK CI builds with
# (21), then any JDK 17+, then whatever is on PATH.
JAVADOC_BIN=""
if [ -n "${JAVADOC:-}" ]; then
  JAVADOC_BIN="$JAVADOC"
elif [ -x /usr/libexec/java_home ]; then
  for spec in 21 17+; do
    if candidate="$(/usr/libexec/java_home -v "${spec}" 2>/dev/null)"; then
      JAVADOC_BIN="${candidate}/bin/javadoc"
      break
    fi
  done
fi
if [ -z "${JAVADOC_BIN}" ]; then
  JAVADOC_BIN="$(command -v javadoc || true)"
fi

if [ -z "${JAVADOC_BIN}" ] || [ ! -x "${JAVADOC_BIN}" ]; then
  echo "error: no javadoc binary found; set JAVADOC=/path/to/javadoc" >&2
  exit 1
fi

raw_version="$("$JAVADOC_BIN" -J-version 2>&1 | head -1)"
major="${raw_version#*version \"}"
major="${major%%\"*}"
case "${major}" in
  1.*) major="${major#1.}"; major="${major%%.*}" ;;
  *) major="${major%%.*}" ;;
esac

if ! [ "${major:-0}" -ge 17 ] 2>/dev/null; then
  echo "error: ${JAVADOC_BIN} is JDK ${major:-?}; javadoc needs JDK 17+ (set JAVADOC=/path/to/javadoc)" >&2
  exit 1
fi

echo "==> Building Javadoc for org.zvec:zvec-java:${VERSION} with ${JAVADOC_BIN}"

rm -rf build "${OUT}"
mkdir -p build/src build/deps "${OUT}"

curl -fsS -o build/zvec-java.pom "${CENTRAL}/${VERSION}/zvec-java-${VERSION}.pom"
curl -fsS -o build/sources.jar "${CENTRAL}/${VERSION}/zvec-java-${VERSION}-sources.jar"
unzip -q -o build/sources.jar -d build/src

# Examples are guides, not API surface.
rm -rf build/src/org/zvec/binding/examples

# Javadoc 9+ reports unresolved symbols as errors, so fetch the JavaCPP artifact
# the JNI bindings are annotated with.
JAVACPP_VERSION="${JAVACPP_VERSION:-$(sed -n 's:.*<javacpp.version>\(.*\)</javacpp.version>.*:\1:p' build/zvec-java.pom | head -1)}"
if [ -z "${JAVACPP_VERSION}" ]; then
  echo "error: could not resolve the javacpp version from the zvec-java POM" >&2
  exit 1
fi
curl -fsS -o build/deps/javacpp.jar \
  "https://repo1.maven.org/maven2/org/bytedeco/javacpp/${JAVACPP_VERSION}/javacpp-${JAVACPP_VERSION}.jar"

# JavaCPP copies the Doxygen comments of zvec/c_api.h verbatim, and javadoc
# renders what it cannot parse: escape stray angle brackets and drop the
# Doxygen-only commands before generating.
python3 scripts/clean_doc_comments.py build/src

# -J-Duser.* keeps docs and tool messages in English regardless of host locale.
"$JAVADOC_BIN" \
  -J-Duser.language=en -J-Duser.country=US \
  -quiet \
  -encoding UTF-8 -charset UTF-8 -docencoding UTF-8 \
  -Xdoclint:none \
  -use -splitindex \
  -windowtitle "Zvec Java API Reference" \
  -doctitle "Zvec Java API Reference" \
  -header "Zvec Java ${VERSION}" \
  -d "${OUT}" \
  -sourcepath build/src \
  -classpath build/deps/javacpp.jar \
  -subpackages org.zvec

# Site branding: favicon plus light styling on top of the default Javadoc theme.
cp styles/extra.css "${OUT}/zvec-extra.css"
python3 - "${OUT}" <<'PYINJECT'
import pathlib
import re
import sys

out = pathlib.Path(sys.argv[1])
inject = (
    '<link rel="icon" href="/favicon.ico">'
    '<link rel="stylesheet" href="/api-reference/java/zvec-extra.css">'
    '</head>'
)
# Doc comments such as "std::shared_ptr<zvec::Collection>*" are not valid HTML,
# so javadoc swaps the offending character for a marker that ends up rendered in
# the page. Restore the character it reported; the text around it is already
# escaped correctly.
MARKER = re.compile("<span class=\"invalid-tag\">invalid input: '(.*?)'</span>")

branding = repaired = 0
leftover = []
for html in out.rglob('*.html'):
    text = html.read_text(encoding='utf-8', errors='replace')
    original = text
    text, hits = MARKER.subn(lambda match: match.group(1), text)
    repaired += hits
    if '</head>' in text:
        text = text.replace('</head>', inject, 1)
        branding += 1
    if text != original:
        html.write_text(text, encoding='utf-8')
    if 'invalid-tag' in text:
        leftover.append(str(html))
print(f"==> Injected branding into {branding} html files")
print(f"==> Restored {repaired} javadoc 'invalid input' markers")
if leftover:
    print(f"warning: {len(leftover)} files still contain invalid-tag markup", file=sys.stderr)
PYINJECT

echo "==> Java API reference written to ${OUT} (zvec-java ${VERSION})"
