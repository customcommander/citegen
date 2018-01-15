<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl">

  <xsl:import href="csl-citation.xsl"/>

  <xsl:output method="text" />

  <xsl:template match="csl:style">
    import citation from './lib/citation';

    <xsl:apply-templates select="csl:citation"/>
  </xsl:template>

</xsl:stylesheet>
