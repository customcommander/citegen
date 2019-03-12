<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  extension-element-prefixes="str">

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
    lib['<xsl:value-of select="name()"/>'](locales, macros,
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

    var macros = {};

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
