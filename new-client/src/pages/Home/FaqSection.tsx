import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/react';

const Faqs = () => {
  const faqItems = [
    {
      question: 'How do I participate in a techFiesta hackathon?',
      answer:
        'Participating in a techFiesta hackathon is easy! Simply browse through the ongoing hackathons and select the one that interests you and click on the "Register" button. Create your profile, and you\'ll be ready to dive into the exciting world of hackathons!',
    },
    {
      question: 'How are payments made to developers after a hackathon?',
      answer:
        "At techFiesta, we ensure fast and secure payments through our partnership with HUMAN Protocol. Once your work has been evaluated and approved by the hackathon sponsor, payments are triggered and processed via stablecoins using HUMAN Protocol's escrow system. This eliminates any disputes or delays, ensuring a seamless payment experience.",
    },
    {
      question:
        'Are there any educational resources available for developers on techFiesta?',
      answer:
        'Absolutely! As a techFiesta participant, you gain access to a wealth of educational resources. We offer educational workshops, seminars, and events where you can enhance your skills and stay updated with the latest technologies. We believe in continuous learning and provide opportunities for developers to upskill and grow.',
    },
    {
      question: 'Can I collaborate with other developers during a hackathon?',
      answer:
        'Collaboration is highly encouraged at techFiesta hackathons! Our platform provides real-time interaction and communication channels where you can connect with other developers, form teams, and collaborate on projects. This collaborative environment fosters innovation, allows for knowledge sharing, and creates a vibrant community of like-minded individuals.',
    },
    {
      question: 'Are the hackathons only for developers?',
      answer:
        'We welcome anyone with an interest in technology, innovation, and collaborative problem-solving. Whether you are a developer, project manager, designer, entrepreneur, or tech enthusiast, you can participate in our hackathons and benefit from the opportunities and resources we offer.',
    },
    {
      question: 'Why do I need techFiesta?',
      answer:
        'techFiesta offers a unique platform to showcase your skills, connect with top companies, and gain recognition in the tech industry. By participating in our hackathons, you can accelerate your learning, expand your network, and have the chance to birth innovative solutions. Additionally, you receive bounties on chain in stable coins and we provide access to educational workshops and upskilling opportunities. Joining techFiesta opens doors to valuable experiences, collaborations, and career growth in the tech ecosystem.',
    },
  ];

  return (
    <Box
      padding={{ lg: '16px', md: '20px' }}
      mt={{ base: '66px', lg: '120px' }}
      mb={{
        base: '49px',
        lg: '120px',
      }}
      w={{ base: 'full' }}
      maxW={{ lg: '1199px' }}
      mx="auto"
    >
      <Text
        color="ek.primary"
        fontSize={{ base: '24', lg: '36px' }}
        textAlign="center"
        fontWeight="bold"
        display={{
          base: 'none',
          lg: 'block',
          sm: 'block',
          md: 'block',
        }}
        mb={{
          lg: '86px',
        }}
      >
        F.A.Qs
      </Text>

      <Box
        mt={{ base: '22px', lg: '80px' }}
        mx={{ lg: 'auto' }}
        w={{
          lg: '780px',
          base: 'full',
          sm: 'full',
        }}
      >
        <Accordion defaultIndex={[0]}>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} border="unset" my="20px">
              <h2>
                <AccordionButton bg="#FAFAFA">
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontSize={{ base: '16px', lg: '20px' }}
                    fontWeight="500"
                  >
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>{item.answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
};

export default Faqs;
