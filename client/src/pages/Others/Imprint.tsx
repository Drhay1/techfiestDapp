import { Box, Heading, Text } from '@chakra-ui/react';

function Imprint() {
  return (
    <Box p={4} maxWidth="800px" mx="auto" mb="2rem">
      <Heading as="h1" size="lg" mb={4}>
        Contact Information
      </Heading>
      <Text>
        This website is operated by:
        <br />
        EkoLance GmbH
        <br />
        8 Leinwebergasse60386
        <br />
        Frankfurt am Main
        <br />
        Germany
        <br />
        Represented by: Maria Eneva-Olms (CEO)
      </Text>
      <Heading as="h2" size="md" mt={6} mb={4}>
        Contact
      </Heading>
      <Text>Email: lara.hoffmann@ekolance.io</Text>
      <Heading as="h2" size="md" mt={6} mb={4}>
        Commercial Register
      </Heading>
      <Text>
        Company ID Number: HRB 129303
        <br />
        Court of jurisdiction: Frankfurt am Main
      </Text>

      <Heading as="h2" size="lg" my={4}>
        Disclaimer
      </Heading>
      <Heading as="h2" size="lg" mt={4} mb={4}>
        Responsible for Content
      </Heading>
      <Text>
        The content of our website was developed and compiled by us with great
        care. We accept no liability for the accuracy, completeness, or quality
        of the content. As a service provider, we are responsible for our own
        content on this site in accordance with the law and laws of general
        application. In accordance with the law, we are not obliged, however, as
        a service provider, to monitor relayed or stored third-party
        information, or to probe such information for circumstances that
        indicate illegal activity. Obligations to remove or block the use of
        information in accordance with laws of general application are not
        affected by this. Liability in this regard is only possible from the
        moment of becoming aware of a specific breach of law. We will
        immediately remove such content immediately upon becoming aware of
        corresponding breaches of the law.
      </Text>
      <Heading as="h2" size="lg" mt={4} mb={4}>
        Links
      </Heading>
      <Text>
        All rights and restrictions contained in this Agreement may be exercised
        and shall be applicable and binding only to the extent that they do not
        violate any applicable laws and are intended to be limited to the extent
        necessary so that they will not render this Agreement illegal, invalid
        or unenforceable. If any provision or portion of any provision of this
        Agreement shall be held to be illegal, invalid or unenforceable by a
        court of competent jurisdiction, it is the intention of the parties that
        the remaining provisions or portions thereof shall constitute their
        agreement with respect to the subject matter hereof, and all such
        remaining provisions or portions thereof shall remain in full force and
        effect.
      </Text>
      <Heading as="h2" size="lg" mt={4} mb={4}>
        Copyright Notice
      </Heading>
      <Text>
        The electronic databases, texts, images, graphics, layout, and other
        content of this website are protected by copyright law. Third-party
        contributions are designated as such. The reproduction, distribution,
        editing, or other use that is not expressly allowed by copyright law or
        other laws requires our consent in writing. This also applies to the
        content of this website that is placed on third-party websites or
        reproduced in any other way. Making downloads from and copies of this
        site are only permitted for non-commercial use. The operators of the
        site endeavor always to respect the copyright of other parties and/or to
        use work that it has produced itself or that is freeware.
      </Text>
    </Box>
  );
}

export default Imprint;
