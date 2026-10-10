# Zvec Java API Reference

This is the official Java API reference documentation for the Zvec Java SDK
(`org.zvec:zvec-java`), built with [Javadoc](https://docs.oracle.com/en/java/javase/21/docs/specs/javadoc/javadoc.html)
from the sources published on Maven Central.

## Requirements

- JDK 17 or newer — CI builds with Temurin 21. Javadoc 11 dropped frame-based
  output, so the generated site looks completely different between JDKs; the
  build script picks `$JAVADOC`, then JDK 21, then any JDK 17+, and refuses to
  run on anything older.
- `curl`, `unzip` and `python3` on `PATH`.

## Instructions

### 1. Build the Static Site

```bash
./build.sh
```

This command creates a **/public/api-reference/java/** directory containing all
the static assets. Since the output consists only of static files, you can host
it on virtually any web server or platform (e.g., GitHub Pages).

The script:

- resolves the latest `zvec-java` release from Maven metadata (override with
  `ZVEC_JAVA_VERSION=0.7.0 ./build.sh`);
- downloads the `-sources.jar` together with the `org.bytedeco:javacpp` artifact
  the JNI bindings are annotated with (Javadoc 9+ reports unresolved symbols as
  errors), and drops the `examples` package (guides, not API surface);
- cleans the Doxygen leftovers JavaCPP copies out of `zvec/c_api.h`
  (`scripts/clean_doc_comments.py`): escapes angle brackets that javadoc would
  otherwise render as a visible `invalid input` marker (the header mentions C++
  types such as `std::shared_ptr<zvec::Collection>*`), and rewrites the
  `\brief` / `\note` commands javadoc does not understand;
- runs `javadoc` with English output regardless of the host locale;
- restores any character javadoc still replaced with an `invalid input` marker,
  as a fallback should a future comment slip past the cleaning step;
- injects the site favicon plus `styles/extra.css` for light branding.

Generated files should not be edited by hand — change this project and rebuild
instead.
