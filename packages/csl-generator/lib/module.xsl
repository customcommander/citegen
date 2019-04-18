<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  xmlns:exsl="http://exslt.org/common"
  extension-element-prefixes="str exsl">

  <xsl:import href="../node_modules/@customcommander/csl-locales/lib/xml2json.xsl"/>

  <xsl:output method="text" />

  <xsl:template match="csl:*" mode="param-attrs">
    {
      <xsl:apply-templates select="." mode="param-attrs-extras"/>
      <xsl:for-each select="@*">
        '<xsl:value-of select="name()"/>': '<xsl:value-of select="."/>'<xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    }
  </xsl:template>

  <xsl:template match="csl:*" mode="param-attrs-extras">
  </xsl:template>

  <!--
  Why do we need `param-attrs-extras` templates?

  Some CSL rendering elements have knowledge of their parents. For example:

    <date variable="issued">
      <date-part name="year"/>
      <date-part name="month"/>
      <date-part name="day"/>
    </date>

  The `variable` attribute indicates that we will be processing the `issued` date of a document.
  It is set on the `<date>` element but it will be on each `<date-part>` element to extract
  the necessary information from the date.

  The CSL spec does not allow for the `variable` attribute to be set on `<date-part>` elements.
  Therefore when constructing the `attrs` object out of an element's attributes,
  that particular attribute won't be present and the JS implementation of `<date-part>` won't be able to know
  on which date property it must operate on.

  A `param-attrs-extras` template can be used to inject arbitrary key/value pairs into
  an element's `attrs` object.
  -->
  <xsl:template match="csl:date-part" mode="param-attrs-extras">
    variable: '<xsl:value-of select="../@variable"/>',
  </xsl:template>

  <xsl:template match="csl:*" mode="param-children">
    [<xsl:for-each select="csl:*">
      <xsl:apply-templates select="." mode="function-call"/>
      <xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>]
  </xsl:template>

  <!--
  Why do we need a special `param-children` template for `<names>`?

  The following snippets of CSL are equivalent:

  Snippet 1:

    <names variable="author">
      <name/>
    </names>

  Snippet 2:

    <names variable="author"/>

  Both will render all the names in the `author` variable delimited with
  the following string `, `.

  However the extraction of the names in the `author` variable, the rendering of names
  and the definition of the name delimiter is the responsibility of the `<name>` element.

  Since the `<name>` instance in the first snippet relies on default values and behaviour,
  it can be rewritten as shown in the second snippet.

  However in our implementation model where each CSL element has its own module with no
  knowledge of its ancestors or children, and where the code generator (i.e. this stylesheet)
  will only generate code from CSL elements that it can "see", the second snippet will produce
  code that won't be able to render anything.

  Therefore we must be able to detect snippet 2 and rewrite it into snippet 1.
  This template rewrites an abbreviated `<names>` tree into one that exposes
  its children explicitly to the code generator.

  So this `<names>` tree:

    <names variable="author"/>

  Is rewritten to:

    <names variable="author">
      <name/>
    </names>

  There is also another factor to consider.
  The `<names>` element also has an implicit order of its children:

  The following snippets are equivalent:

  Snippet 3:

    <names variable="author">
      <name/>
      <label prefix=" (" suffix=")"/>
    </names>

  Snippet 4:

    <names variable="author">
      <label prefix=" (" suffix=")"/>
    </names>

  Both will render "Doe, Smith (authors)". Since `<name/>` in snippet 3 relies on
  default values and behaviours, it can be omitted (as shown in snippet 4). However
  in both cases, the list of names is shown before its label.

  If the children in `<names>` are not explicitly exposed to the code generator,
  the generated code for snippet 4 wouldn't be able to render a list of names.

  Therefore when parsing the CSL tree for `<names>` this template must rewrite
  snippet 4 into snippet 3.

  *****************************************************************************

  What is this `<name-list>` that isn't documented in the CSL specification?

  The `<name-list>` element is a convenience method for encapsulating
  and delimiting lists of names from `<name>` elements when `<names>`
  has multiple name variables. (e.g. `<names variable="author editor">`.)

  The purpose of `<name-list>` is to capture the output of the entire `<names>` tree
  for each name variable. So that it's easier to separate two lists of names with
  a delimiter set on `<names>`.

  The following `<names>` tree:

  <names variable="author editor" delimiter="; ">
    <label/>
  </names>

  Will be rewritten (by this template) into:

  <names variable="author editor" delimiter="; ">
    <name-list variable="author">
      <name variable="author"/>
      <label/>
    </name-list>
    <name-list variable="editor">
      <name variable="editor"/>
      <label/>
    </name-list>
  </names>

  Both ultimately producing the same output,
  e.g. "Doe, Smith (authors); Brown, Baggins (editors)"

  Note:

  The `variable` attribute is passed to different elements
  (sometimes against the CSL specification) in order to tell
  each rendering function on which data to operate.

  Remember that each CSL element is implemented into its own,
  isolated module with no knowledge of its context or its ancestors or children.

  -->
  <xsl:template match="csl:names" mode="param-children">

    <xsl:variable name="original-node" select="."/>

    <xsl:variable name="reprocessed">
      <xsl:for-each select="str:tokenize($original-node/@variable)">
        <xsl:element name="csl:name-list">
          <xsl:attribute name="variable"><xsl:value-of select="."/></xsl:attribute>
          <!-- Recreating a <name> element with any existing attributes (plus some others) -->
          <xsl:element name="csl:name">
            <xsl:attribute name="variable"><xsl:value-of select="."/></xsl:attribute>
            <xsl:for-each select="$original-node/csl:name/@*">
              <xsl:attribute name="{name()}"><xsl:value-of select="."/></xsl:attribute>
            </xsl:for-each>
          </xsl:element>
        </xsl:element>
      </xsl:for-each>
    </xsl:variable>

    [<xsl:for-each select="exsl:node-set($reprocessed)/csl:name-list">
      <xsl:apply-templates select="." mode="function-call"/>
      <xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>]
  </xsl:template>

  <!--
  NOTICE: This is the only place where children elements aren't transformed into
          functions calls, but into sets of attributes instead!

  Why?

  <date>'s only allowed children are <date-part> elements.
  We rendered them as a sets of attributes instead of functions calls. Why?
  In a localized date context, each <date-part> element is used to override locale settings.
  -->
  <xsl:template match="csl:date" mode="param-children">
    [<xsl:for-each select="csl:date-part">
      <xsl:apply-templates select="." mode="param-attrs"/>
      <xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>]
  </xsl:template>

  <xsl:template match="csl:*" mode="function-call">
    lib['<xsl:value-of select="local-name()"/>'](locales, macros,
      <xsl:apply-templates select="self::node()" mode="param-attrs"/>,
      <xsl:apply-templates select="self::node()" mode="param-children"/>)
  </xsl:template>

  <xsl:template match="csl:style">
    var lib = require('@customcommander/csl-lib');
    var getLocales = require('@customcommander/csl-locales/lib/private');

    var styleLocales = [
      <xsl:for-each select="csl:locale">
        <xsl:apply-templates select="."/>
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    ];

    var macros = {
      <xsl:for-each select="csl:macro">
        <xsl:sort select="@name"/>
        "<xsl:value-of select="@name"/>": function (locales, macros, ref) {
          return lib.output({name: '<xsl:value-of select="@name"/>'}, 'macro', [
            <xsl:for-each select=".">
              <xsl:apply-templates mode="function-call"/>(ref)
              <xsl:if test="position() != last()">,</xsl:if>
            </xsl:for-each>
          ]);
        }
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    };

    module.exports = {
      citation: function (refs, langCode) {
        var locales = getLocales((langCode || '<xsl:value-of select="@default-locale"/>' || 'en-US'), styleLocales);
        var citation = lib.citation(locales, macros, {},
          <xsl:apply-templates select="csl:citation" mode="param-children"/>, refs);
        // Internally functions in the `csl-lib` package consume and produce objects.
        // The object returned by `lib.citation` has a toString() implementation that produces the final citation.
        return citation.toString();
      }
    };
  </xsl:template>

  <xsl:template match="csl:style[csl:info[csl:link[@rel='independent-parent']]]">
    <xsl:variable name="parent-path" select="str:tokenize(csl:info/csl:link[@rel='independent-parent']/@href, '/')[last()]"/>
    var parent = require('./<xsl:value-of select="$parent-path"/>');

    module.exports = {
      citation: function (refs, langCode) {
        return parent.citation(refs, (langCode || '<xsl:value-of select="@default-locale"/>'));
      }
    };
  </xsl:template>

</xsl:stylesheet>
