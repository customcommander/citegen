<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:csl="http://purl.org/net/xbiblio/csl">

  <xsl:template match="csl:citation">
    export const generateCitation = () => (
      citation()
    );
  </xsl:template>

</xsl:stylesheet>
