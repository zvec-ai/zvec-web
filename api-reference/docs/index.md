# Python API Reference

This documentation covers the public Python API for [Zvec](https://zvec.org/en/).

## Installation

```bash
pip install zvec
```

## Core Components

The Zvec API is built around the following components:

- [Global Configuration](./config.md): Configure Zvec's runtime behavior, including logging, threading, memory limits, etc.
- [Types](./types.md): Enumerations that define supported data types, indexing strategies, and similarity metrics.
- [Collection Schema](./schema.md): Declare the structure of a collection (e.g., field names, data types, etc.).
- [Collection Class](./collection.md): Manage vector data through collections — the containers for storing, organizing, and querying documents. Collections are analogous to tables in a relational database like MySQL, and are defined by a schema.
- [Doc Class](./doc.md): Represent individual data records. A document is the basic unit of storage in Zvec, analogous to a row in a relational table, and must conform to the schema of its collection.
- [Parameters](./params.md): Structured configuration objects for collections, indexes, and queries.
- [Extension](./extension.md): Enhance Zvec with additional utilities.
