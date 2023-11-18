import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import PageLoader from '../../reusable/components/PageLoader';

const NewFooter = React.lazy(
  () => import('../../reusable/components/NewFooter'),
);

const BodyWrapper = React.lazy(
  () => import('../../reusable/components/BodyWrapper'),
);

const HomeNavbar = React.lazy(
  () => import('../../reusable/components/HomeNavbar'),
);

const MetaTags = React.lazy(() => import('../../reusable/components/MetaTags'));

function Terms() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MetaTags
        title={'techFiesta'}
        description={
          'Participate in hackathons where developers thrive, ideas flourish, and success begins'
        }
        pageUrl={window.location.href}
      />
      <HomeNavbar />
      <BodyWrapper>
        <>
          <Box px={{ base: '1rem' }}>
            <Box
              mt="90px"
              w="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              h={{ lg: '390px', md: '288px', base: '158px' }}
              borderRadius={{ base: '8px', lg: '40px', md: '24px' }}
              boxShadow="0px 3px 4px rgba(60, 77, 109, 0.25)"
              background="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%)"
            >
              <Heading as="h1" size="lg" mb="4">
                TERMS and Conditions
              </Heading>
            </Box>

            <Box
              mx="auto"
              my="6rem"
              p={4}
              mb="2rem"
              bg="white"
              mt="2rem"
              borderRadius={'1rem'}
            >
              <Text fontSize="sm" mt="4" fontWeight="bold">
                This Terms of Use Agreement ("Agreement") constitutes a legally
                binding agreement made between you, whether personally or on
                behalf of an entity ("user" or "you" or "developer"), and
                techFiesta, operated by Ekolance GmbH, incorporated in Germany
                and its affiliated companies (collectively, "Company" or "we" or
                "us" or "our"), concerning your access to and use of the
                techFiesta website as well as any other media form, media
                channel, mobile website related or connected thereto
                (collectively, the "Website"). The Website provides the
                following services:
              </Text>

              <Text fontSize="sm" mt="4" ml="4">
                - Participant’s profile creation and display ("Profile").
              </Text>
              <Text fontSize="sm" ml="4">
                - Participants use their profiles to apply for Hackathons
                ("Hackathon") and other developer events.
              </Text>
              <Text fontSize="sm" ml="4">
                - Participants submit and display projects with techFiesta.
              </Text>
              <Text fontSize="sm" ml="4">
                - Participants and other users create and participate in bounty
                programs, get rewards by completing tasks and winning
                competitions ("Bounty").
              </Text>
              <Text fontSize="sm" ml="4">
                - Organizations’ profile creation and display ("Profile").
              </Text>
              <Text fontSize="sm" ml="4">
                - Organizations use their profiles to create and launch
                Hackathons ("Hackathon") and other events.
              </Text>
              <Text fontSize="sm" ml="4">
                - Organizations review and score projects on techFiesta.
              </Text>
              <Text fontSize="sm" ml="4" mb="4">
                - Organizations reward participants in hackathons and bounty
                programs in crypto currencies.
              </Text>

              <Text fontSize="sm">
                Supplemental terms and conditions or documents that may be
                posted on the Website from time to time are hereby expressly
                incorporated into this Agreement by reference.
              </Text>

              <Text fontSize="sm" mt="4">
                techFiesta makes no representation that the Website is
                appropriate or available in other locations other than where it
                is operated by techFiesta. The information provided on the
                Website is not intended for distribution to or use by any person
                or entity in any jurisdiction or country where such distribution
                or use would be contrary to law or regulation or which would
                subject techFiesta to any registration requirement within such
                jurisdiction or country. Accordingly, those persons who choose
                to access the Website from other locations do so on their own
                initiative and are solely responsible for compliance with local
                laws, if and to the extent local laws are applicable.
              </Text>

              <Text fontSize="sm" mt="4">
                All users who are minors in the jurisdiction in which they
                reside (generally under the age of 18) are not permitted to
                register for the Website or use the techFiesta Services. All
                users who are minors in the jurisdiction in which they reside
                (generally under the age of 18) must have the permission of, and
                be directly supervised by, their parent or guardian to use the
                Website. If you are a minor, you must have your parent or
                guardian read and agree to this Agreement prior to your using
                the Website. Persons under the age of 13 are not permitted to
                register for the Website or use the techFiesta Services.
              </Text>

              <Text fontSize="sm" mt="4">
                YOU ACCEPT AND AGREE TO BE BOUND BY THIS AGREEMENT BY
                ACKNOWLEDGING SUCH ACCEPTANCE DURING THE REGISTRATION PROCESS
                (IF APPLICABLE) AND ALSO BY CONTINUING TO USE THE WEBSITE. IF
                YOU DO NOT AGREE TO ABIDE BY THIS AGREEMENT OR TO MODIFICATIONS
                THAT TECHFIESTA MAY MAKE TO THIS AGREEMENT IN THE FUTURE, DO NOT
                USE OR ACCESS OR CONTINUE TO USE OR ACCESS THE TECHFIESTA
                SERVICES OR THE WEBSITE.
              </Text>

              <Heading as="h2" size="md" mt="8" mb="2">
                SERVICES
              </Heading>
              <Text fontSize="sm" mt="2">
                By using the techFiesta Services, you agree to accept the
                following arrangements:
              </Text>

              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>
                  To create and display your profile as required by the Website.
                </ListItem>
                <ListItem>
                  In the case of a participant registration, to use your profile
                  to apply for Hackathons.
                </ListItem>
                <ListItem>
                  In the case of an organization registration, to use your
                  profile to create and launch hackathons.
                </ListItem>
                <ListItem>
                  In the case of a participant registration, to submit and
                  display subjects with Bounty using techFiesta.
                </ListItem>
                <ListItem>
                  In the case of an organization registration, to review, score,
                  and reward users submissions.
                </ListItem>
              </UnorderedList>

              <Heading as="h2" size="md" mt="8" mb="2">
                SMART CONTRACTS
              </Heading>
              <Text fontSize="sm" mt="2">
                For your use of techFiesta, you agree and accept the smart
                contracts generated from the Website. The operators of
                techFiesta are not responsible in case of loss of funds by using
                the smart contracts.
              </Text>

              <Heading as="h2" size="md" mt="8" mb="2">
                PAYMENT & FEES
              </Heading>
              <Text fontSize="sm" mt="2">
                For your use of techFiesta, as an organization, you agree to set
                a Bounty while submitting and displaying your hackathon on the
                Website. As a developer, you agree to submit and display
                projects on the Website and receive Bounties. The Bounties and
                rewards are only distributed in crypto currencies ("Currency").
                The following stablecoins are accepted as Currency:
              </Text>

              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>USDC</ListItem>
              </UnorderedList>

              <Heading as="h2" size="md" mt="8" mb="2">
                REFUND POLICY
              </Heading>
              <Text fontSize="sm" mt="2">
                All techFiesta Fees and Bounties are final, and no refunds shall
                be issued.
              </Text>

              <Heading as="h2" size="md" mt="8" mb="2">
                FUND POLICY
              </Heading>
              <Text fontSize="sm" mt="2">
                You, as a developer, specifically agree and acknowledge that all
                the Bounty or Funds collected by the Website or Company shall
                not consist of any activities related to fundraising or
                securities initiation.
              </Text>

              <Heading as="h2" size="md" mt="8" mb="2">
                USER REPRESENTATIONS
              </Heading>
              <Text fontSize="sm" mt="2">
                Regarding Your Registration:
              </Text>

              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>
                  All registration information you submit is truthful and
                  accurate.
                </ListItem>
                <ListItem>
                  You will maintain the accuracy of such information.
                </ListItem>
                <ListItem>
                  You will keep your password confidential and will be
                  responsible for all use of your password and account.
                </ListItem>
                <ListItem>
                  You are not a minor in the jurisdiction in which you reside,
                  or if a minor, you have received parental permission to use
                  this Website.
                </ListItem>
                <ListItem>
                  Your use of the techFiesta Services does not violate any
                  applicable law or regulation.
                </ListItem>
              </UnorderedList>

              <Text fontSize="sm" mt="2">
                You also agree to:
              </Text>

              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>
                  Provide true, accurate, current, and complete information
                  about yourself as prompted by the Website's registration form.
                </ListItem>
                <ListItem>
                  Maintain and promptly update registration data to keep it
                  true, accurate, current, and complete.
                </ListItem>
              </UnorderedList>

              <Text fontSize="sm" mt="2">
                If you provide any information that is untrue, inaccurate, not
                current, or incomplete, or techFiesta has reasonable grounds to
                suspect that such information is untrue, inaccurate, not
                current, or incomplete, techFiesta has the right to suspend or
                terminate your account and refuse any and all current or future
                use of the Website (or any portion thereof). techFiesta reserves
                the right to remove, reclaim, or change a username you select if
                we determine it appropriate in our discretion, such as when the
                username is obscene or otherwise objectionable or when a
                trademark owner complains about a username that does not closely
                relate to a user's actual name.
              </Text>

              <Text fontSize="sm" mt="2">
                Regarding Content You Provide:
              </Text>

              <Text fontSize="sm" mt="2">
                The Website may invite you to chat or participate in blogs,
                message boards, online forums, and other functionality and may
                provide you with the opportunity to create, submit, post,
                display, transmit, perform, publish, distribute, or broadcast
                content and materials to techFiesta and/or to or via the
                Website, including, without limitation, text, writings, video,
                audio, photographs, graphics, comments, suggestions, subjects,
                personally identifiable information, or other material
                (collectively "Contributions"). Any Contributions you transmit
                to techFiesta will be treated as non-confidential and
                non-proprietary.
              </Text>

              <Text fontSize="sm" mt="2">
                By creating or making available a Contribution, you represent
                and warrant that:
              </Text>

              <Text fontSize="sm" mt="2">
                Regarding Your Registration:
              </Text>

              {/* User Representations List */}
              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>
                  The creation, distribution, transmission, public display and
                  performance, accessing, downloading, and copying of your
                  Contribution do not and will not infringe the proprietary
                  rights, including but not limited to the copyright, patent,
                  trademark, trade secret, or moral rights of any third party.
                </ListItem>
                <ListItem>
                  You are the creator and owner of or have the necessary
                  licenses, rights, consents, releases, and permissions to use
                  and to authorize techFiesta and the Website users to use your
                  Contributions as necessary to exercise the licenses granted by
                  you under this Agreement.
                </ListItem>
                <ListItem>
                  You have the written consent, release, and/or permission of
                  each and every identifiable individual person in the
                  Contribution to use the name or likeness of each and every
                  such identifiable individual person to enable inclusion and
                  use of the Contribution in the manner contemplated by this
                  Website.
                </ListItem>
                <ListItem>
                  Your Contribution is not obscene, lewd, lascivious, filthy,
                  violent, harassing, or otherwise objectionable (as determined
                  by techFiesta), libelous or slanderous, does not ridicule,
                  mock, disparage, intimidate, or abuse anyone, does not
                  advocate the violent overthrow of any government, does not
                  incite, encourage, or threaten physical harm against another,
                  does not violate any applicable law, regulation, or rule, and
                  does not violate the privacy or publicity rights of any third
                  party.
                </ListItem>
                <ListItem>
                  Your Contribution does not contain material that solicits
                  personal information from anyone under 18 or exploits people
                  under the age of 18 in a sexual or violent manner, and does
                  not violate any law concerning child pornography or otherwise
                  intended to protect the health or well-being of minors.
                </ListItem>
                <ListItem>
                  Your Contribution does not include any offensive comments that
                  are connected to race, national origin, gender, sexual
                  preference, or physical handicap.
                </ListItem>
                <ListItem>
                  Your Contribution does not otherwise violate, or link to
                  material that violates, any provision of this Agreement or any
                  applicable law or regulation.
                </ListItem>
              </UnorderedList>

              {/* CONTRIBUTION LICENSE */}
              <Heading as="h2" size="md" mt="8" mb="2">
                CONTRIBUTION LICENSE
              </Heading>
              <Text fontSize="sm" mt="2">
                By posting Contributions to any part of the Website or making
                them accessible to the Website by linking your account to any of
                your social network accounts, you automatically grant, and you
                represent and warrant that you have the right to grant, to
                techFiesta an unrestricted, unconditional, unlimited,
                irrevocable, perpetual, non-exclusive, transferable,
                royalty-free, fully-paid, worldwide right and license to host,
                use, copy, reproduce, disclose, sell, resell, publish,
                broadcast, retitle, archive, store, cache, publicly perform,
                publicly display, reformat, translate, transmit, excerpt (in
                whole or in part), and distribute such Contributions (including,
                without limitation, your image and voice) for any purpose,
                commercial, advertising, or otherwise, to prepare derivative
                works of or incorporate into other works such Contributions, and
                to grant and authorize sublicenses of the foregoing.
              </Text>

              <Text fontSize="sm" mt="2">
                The use and distribution may occur in any media formats and
                through any media channels. Such use and distribution license
                will apply to any form, media, or technology now known or
                hereafter developed and includes techFiesta's use of your name,
                company name, and franchise name, as applicable, and any of the
                trademarks, service marks, trade names, and logos, personal and
                commercial images you provide.
              </Text>

              <Text fontSize="sm" mt="2">
                techFiesta does not assert any ownership over your
                Contributions; rather, as between us and you, subject to the
                rights granted to us in this Agreement, you retain full
                ownership of all your Contributions and any intellectual
                property rights or other proprietary rights associated with your
                Contributions. techFiesta has the right, in our sole and
                absolute discretion, to:
              </Text>

              {/* Contribution License List */}
              <UnorderedList fontSize="sm" mt="2" ml="4">
                <ListItem>
                  Edit, redact, or otherwise change any Contributions.
                </ListItem>
                <ListItem>
                  Re-categorize any Contributions to place them in more
                  appropriate locations.
                </ListItem>
                <ListItem>
                  Pre-screen or delete any Contributions that are determined to
                  be inappropriate or otherwise in violation of this Agreement.
                </ListItem>
              </UnorderedList>

              <Text fontSize="sm" mt="2">
                By uploading your Contributions to the Website, you authorize
                techFiesta to grant to each end-user a personal, limited,
                non-transferable, perpetual, non-exclusive, royalty-free,
                fully-paid license to access, download, print, and otherwise use
                your Contributions for their internal purposes and not for
                distribution, transfer, sale, or commercial exploitation of any
                kind.
              </Text>

              {/* INTELLECTUAL PROPERTY RIGHTS */}
              <Heading as="h2" size="md" mt="8" mb="2">
                INTELLECTUAL PROPERTY RIGHTS
              </Heading>

              <Text fontSize="sm" mt="2">
                A. techFiesta Content: The content on the Platform, including
                trademarks, service marks, algorithms, codes, programs,
                subjects, and logos ("Company Content"), is owned by or licensed
                to techFiesta and is subject to copyright and other intellectual
                property rights.
              </Text>

              <Text fontSize="sm" mt="2">
                B. You may access and use the Company Content for personal,
                non-commercial purposes with proper authorization. Unauthorized
                use, copying, reproduction, distribution, or exploitation of the
                Company Content is strictly prohibited.
              </Text>

              <Text fontSize="sm" mt="2">
                B. Third-Party Websites and Content: The Platform may contain
                links to Third Party Websites and Third Party Content.
                techFiesta is not responsible for the content, accuracy, or
                privacy practices of Third Party Websites or Third Party
                Content. Your interactions with Third Party Websites or use of
                Third Party Content are at your own risk, and techFiesta's terms
                and policies do not govern them.
              </Text>

              {/* SITE MANAGEMENT */}
              <Heading as="h2" size="md" mt="8" mb="2">
                SITE MANAGEMENT
              </Heading>

              <Text fontSize="sm" mt="2">
                A. techFiesta reserves the right to monitor the Platform for
                violations of this Agreement and take appropriate legal action
                against violators.
              </Text>

              <Text fontSize="sm" mt="2">
                B. techFiesta may modify or discontinue the Platform, in whole
                or in part, with or without notice.
              </Text>

              {/* PRIVACY POLICY */}
              <Heading as="h2" size="md" mt="8" mb="2">
                PRIVACY POLICY
              </Heading>

              <Text fontSize="sm" mt="2">
                A. Your personal data transferred to and processed by techFiesta
                is subject to the Privacy Policy.
              </Text>

              <Text fontSize="sm" mt="2">
                B. By using the Platform, you consent to the terms of the
                Privacy Policy.
              </Text>

              {/* LIMITATIONS OF LIABILITY */}
              <Heading as="h2" size="md" mt="8" mb="2">
                LIMITATIONS OF LIABILITY
              </Heading>

              <Text fontSize="sm" mt="2">
                In no event shall Company or its directors, employees, or agents
                be liable to you or any third party for any direct, indirect,
                consequential, exemplary, incidental, special, or punitive
                damages.
              </Text>

              <Text fontSize="sm" mt="2">
                You agree to defend, indemnify, and hold Company and its
                subsidiaries and affiliates, and their respective officers,
                agents, partners, and employees ("Company Parties"), harmless
                from and against any loss, damage, liability, claim, or demand,
                including reasonable attorneys’ fees and expenses, made by any
                third party due to or arising out of your contributed content,
                use of the Company Services, and/or arising from a breach of
                this Agreement and/or any breach of your representations and
                warranties set forth above.
              </Text>

              {/* TERM AND TERMINATION */}
              <Heading as="h2" size="md" mt="8" mb="2">
                TERM AND TERMINATION
              </Heading>

              <Text fontSize="sm" mt="2">
                a. This Agreement remains in effect as long as you use the
                Platform.
              </Text>

              <Text fontSize="sm" mt="2">
                b. techFiesta reserves the right to deny access, terminate
                accounts, and delete user profiles and content without notice or
                liability for any reason or no reason at all.
              </Text>

              <Text fontSize="sm" mt="2">
                c. Certain provisions of this Agreement survive termination to
                fulfill their purposes.
              </Text>

              {/* DISPUTE AND RESOLUTION */}
              <Heading as="h2" size="md" mt="8" mb="2">
                DISPUTE AND RESOLUTION
              </Heading>

              <Text fontSize="sm" mt="2">
                a. Disputes between users: techFiesta is not obligated to
                resolve disputes between users; organizations or between users
                or organizations and third parties.
              </Text>

              <Text fontSize="sm" mt="2">
                b. Disputes with techFiesta: The Company wants to address your
                concerns without the need for a formal legal dispute. Before
                filing a claim against us, you agree to try to resolve the
                Dispute informally by contacting us at hello@techfiesta.dev to
                notify us of the actual or potential Dispute. Any legal actions
                or disputes arising from or related to this Agreement shall be
                governed by the laws of the Federal Republic of Germany.
              </Text>

              {/* MODIFICATIONS */}
              <Heading as="h2" size="md" mt="8" mb="2">
                MODIFICATIONS
              </Heading>

              <Text fontSize="sm" mt="2">
                Company may modify this Agreement from time to time. Any and all
                changes to this Agreement will be posted on the Website, and
                revisions will be indicated by date. You agree to be bound to
                any changes to this Agreement when you use the Company Services
                after any such modification becomes effective.
              </Text>

              <Text fontSize="sm" mt="2">
                Company may also, in its discretion, choose to alert all users
                with whom it maintains email information of such modifications
                by means of an email to their most recently provided email
                address.
              </Text>

              <Text fontSize="sm" mt="2">
                Company reserves the right at any time to modify or discontinue,
                temporarily or permanently, the Terms and Conditions (or any
                part thereof) with or without notice.
              </Text>

              {/* CORRECTIONS */}
              <Heading as="h2" size="md" mt="8" mb="2">
                CORRECTIONS
              </Heading>

              <Text fontSize="sm" mt="2">
                techFiesta strives for accuracy but may occasionally contain
                errors or inaccuracies. techFiesta reserves the right to correct
                any such errors or update information without prior notice.
              </Text>

              {/* MISCELLANEOUS */}
              <Heading as="h2" size="md" mt="8" mb="2">
                MISCELLANEOUS
              </Heading>

              <Text fontSize="sm" mt="2">
                This Agreement constitutes the entire agreement between you and
                Company regarding the use of the Company Services.
              </Text>

              <Text fontSize="sm" mt="2">
                The failure of the Company to exercise or enforce any right or
                provision of this Agreement shall not operate as a waiver of
                such right or provision.
              </Text>

              <Text fontSize="sm" mt="2">
                This Agreement operates to the fullest extent permissible by
                law. This Agreement and your account may not be assigned by you
                without our express written consent.
              </Text>

              <Text fontSize="sm" mt="2">
                Company may assign any or all of its rights and obligations to
                others at any time.
              </Text>

              <Text fontSize="sm" mt="2">
                If any provision or part of a provision of this Agreement is
                unlawful, void, or unenforceable, that provision or part of the
                provision is deemed severable from this Agreement and does not
                affect the validity and enforceability of any remaining
                provisions.
              </Text>

              <Text fontSize="sm" mt="2">
                You hereby waive any right of action against Company arising
                from any loss or corruption of data transferred or related to
                any activity undertaken using the Company Services.
              </Text>

              <Text fontSize="sm" mt="2">
                Your use of the Company Services includes the ability to enter
                into agreements and/or to make transactions electronically. Your
                electronic submissions constitute your agreement and intent to
                be bound by and to pay for such agreements and transactions.
              </Text>

              {/* CONTACT US */}
              <Heading as="h2" size="md" mt="8" mb="2">
                CONTACT US
              </Heading>

              <Text fontSize="sm" mt="2">
                To resolve complaints or receive further information, please
                contact us at:
              </Text>

              <Text fontSize="sm" fontWeight="bold" mt="2">
                hello@techfiesta.dev
              </Text>
            </Box>
          </Box>
          <NewFooter />
        </>
      </BodyWrapper>
    </Suspense>
  );
}

export default Terms;
