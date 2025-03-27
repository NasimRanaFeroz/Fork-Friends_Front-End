import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LegalPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="bg-[#1a1a1a] text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold bebas-neue mb-4 text-center">
            Legal Information
          </h1>
          <div className="w-20 h-1 bg-[#ff5722] mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto text-center roboto-light">
            Our commitment to protecting your data and ensuring a trustworthy
            recommendation experience
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center border-b border-gray-200">
          <button
            className={`py-4 px-6 text-lg font-medium border-b-2 ${
              activeTab === "privacy"
                ? "border-[#ff5722] text-[#ff5722]"
                : "border-transparent hover:text-gray-700"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Policy
          </button>
          <button
            className={`py-4 px-6 text-lg font-medium border-b-2 ${
              activeTab === "terms"
                ? "border-[#ff5722] text-[#ff5722]"
                : "border-transparent hover:text-gray-700"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("terms")}
          >
            Terms of Service
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          {activeTab === "privacy" && (
            <div className="legal-content">
              <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
              <p className="text-sm text-gray-500 mb-6">
                Last Updated: March 14, 2025
              </p>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
                <p className="mb-4">
                  At Fork & Friends, we respect your privacy and are committed
                  to protecting your personal information. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our restaurant recommendation
                  platform, including our website, mobile application, and
                  related services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or
                  using our services, you acknowledge that you have read,
                  understood, and agree to be bound by all the terms of this
                  Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  2. Information We Collect
                </h3>
                <h4 className="text-lg font-medium mb-2">
                  2.1 Personal Information
                </h4>
                <p className="mb-4">
                  We may collect personal information that you provide directly
                  to us, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Contact information (name, email address, phone number)
                  </li>
                  <li>Account credentials (username, password)</li>
                  <li>
                    Profile information (profile picture, bio, food preferences)
                  </li>
                  <li>Restaurant reviews, ratings, and comments</li>
                  <li>Dining history and preferences</li>
                  <li>Friend connections and social network information</li>
                  <li>Payment information (when applicable)</li>
                  <li>Communication preferences</li>
                </ul>

                <h4 className="text-lg font-medium mb-2">
                  2.2 Automatically Collected Information
                </h4>
                <p className="mb-4">
                  When you visit our website or use our mobile application, we
                  may automatically collect certain information about your
                  device and usage, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>IP address and device identifiers</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on those pages</li>
                  <li>Search queries and filtering preferences</li>
                  <li>Click patterns and interaction with recommendations</li>
                  <li>Location information (with your consent)</li>
                  <li>Referral sources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  3. How We Use Your Information
                </h3>
                <p className="mb-4">
                  We use the information we collect for various purposes,
                  including to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Create and maintain your account</li>
                  <li>
                    Provide personalized restaurant recommendations based on
                    your preferences, location, and past behavior
                  </li>
                  <li>
                    Improve our recommendation algorithms and machine learning
                    models
                  </li>
                  <li>
                    Connect you with friends and other users with similar dining
                    preferences
                  </li>
                  <li>
                    Display user-generated content like reviews, ratings, and
                    photos
                  </li>
                  <li>
                    Process and analyze search queries and filter selections
                  </li>
                  <li>
                    Communicate with you about new features, restaurants, or
                    promotions
                  </li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>
                    Conduct research and analytics to improve our offerings
                  </li>
                  <li>
                    Detect and prevent fraudulent reviews or abusive behavior
                  </li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  4. Our Recommendation Algorithm
                </h3>
                <p className="mb-4">
                  Our platform uses sophisticated algorithms to provide
                  personalized restaurant recommendations. Here's how we process
                  your data for recommendations:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    We analyze your explicit preferences (cuisine types, price
                    ranges, etc.)
                  </li>
                  <li>
                    We consider your implicit preferences based on browsing
                    behavior, searches, and clicks
                  </li>
                  <li>
                    We use collaborative filtering to identify patterns among
                    users with similar tastes
                  </li>
                  <li>
                    We process your location data (when permitted) to recommend
                    nearby restaurants
                  </li>
                  <li>
                    We incorporate your past ratings and reviews to refine
                    future recommendations
                  </li>
                  <li>
                    We may consider your friends' preferences and
                    recommendations when suggesting restaurants
                  </li>
                </ul>
                <p>
                  You can adjust your recommendation preferences in your account
                  settings at any time.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  5. Sharing Your Information
                </h3>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Other users (your public profile, reviews, ratings, and
                    photos)
                  </li>
                  <li>
                    Restaurant owners and managers (for reviews and feedback you
                    provide about their establishments)
                  </li>
                  <li>
                    Service providers who perform services on our behalf
                    (hosting, analytics, customer support)
                  </li>
                  <li>
                    Social media platforms (if you choose to connect your
                    account or share content)
                  </li>
                  <li>
                    API partners and third-party integrations (with your
                    consent)
                  </li>
                  <li>Legal authorities when required by law</li>
                  <li>
                    Business partners in the event of a merger, acquisition, or
                    sale of assets
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  6. Your Rights and Choices
                </h3>
                <p className="mb-4">
                  Depending on your location, you may have certain rights
                  regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Accessing, correcting, or deleting your personal information
                  </li>
                  <li>Withdrawing consent for processing your information</li>
                  <li>Opting out of marketing communications</li>
                  <li>Requesting a copy of your personal information</li>
                  <li>
                    Controlling the visibility of your reviews and profile
                    information
                  </li>
                  <li>Managing location tracking and permissions</li>
                  <li>
                    Controlling how your data is used in our recommendation
                    system
                  </li>
                  <li>Lodging a complaint with a supervisory authority</li>
                </ul>
                <p>
                  To exercise these rights, please visit your account settings
                  or contact us using the information provided in the "Contact
                  Us" section below.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">7. Data Security</h3>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information from unauthorized access,
                  disclosure, alteration, or destruction. However, no method of
                  transmission over the Internet or electronic storage is 100%
                  secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  8. Children's Privacy
                </h3>
                <p>
                  Our services are not directed to individuals under the age of
                  16. We do not knowingly collect personal information from
                  children. If you believe we have inadvertently collected
                  information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  9. Changes to This Privacy Policy
                </h3>
                <p>
                  We may update this Privacy Policy from time to time. The
                  updated version will be indicated by an updated "Last Updated"
                  date. We encourage you to review this Privacy Policy
                  periodically to stay informed about how we are protecting your
                  information.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">10. Contact Us</h3>
                <p className="mb-4">
                  If you have any questions or concerns about this Privacy
                  Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-black">
                  <p className="mb-1">Fork & Friends</p>
                  <p className="mb-1">Email: feroznasimrana@gmail.com</p>
                  <p className="mb-1">Phone: +86 132 2814 2082</p>
                  <p>Address: Chengdu, Sichuan Province</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="legal-content">
              <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
              <p className="text-sm text-gray-500 mb-6">
                Last Updated: March 14, 2025
              </p>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  1. Acceptance of Terms
                </h3>
                <p className="mb-4">
                  By accessing or using the website, mobile application, and
                  services provided by Fork & Friends, you agree to be bound by
                  these Terms of Service ("Terms"). If you do not agree to these
                  Terms, please do not use our services.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you
                  and RestaurantFinder regarding your use of our restaurant
                  recommendation platform, including our website, mobile
                  application, and related services (collectively, the
                  "Services").
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  2. Modifications to Terms
                </h3>
                <p>
                  We reserve the right to modify these Terms at any time. Any
                  changes will be effective immediately upon posting the updated
                  Terms on our website. Your continued use of our Services after
                  any such changes constitutes your acceptance of the new Terms.
                  It is your responsibility to review these Terms periodically.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  3. Use of Services
                </h3>
                <h4 className="text-lg font-medium mb-2">3.1 Eligibility</h4>
                <p className="mb-4">
                  You must be at least 18 years old to use our Services. By
                  using our Services, you represent and warrant that you are at
                  least 18 years old and have the legal capacity to enter into
                  these Terms.
                </p>

                <h4 className="text-lg font-medium mb-2">
                  3.2 Account Registration
                </h4>
                <p className="mb-4">
                  Some features of our Services may require you to create an
                  account. You agree to provide accurate, current, and complete
                  information during the registration process and to update such
                  information to keep it accurate, current, and complete. You
                  are responsible for safeguarding your password and for all
                  activities that occur under your account.
                </p>

                <h4 className="text-lg font-medium mb-2">
                  3.3 Prohibited Conduct
                </h4>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Use our Services for any illegal purpose or in violation of
                    any local, state, national, or international law
                  </li>
                  <li>
                    Post fake or intentionally misleading restaurant reviews
                  </li>
                  <li>
                    Create multiple accounts to manipulate ratings or
                    recommendations
                  </li>
                  <li>
                    Impersonate any person or entity, or falsely state or
                    otherwise misrepresent your affiliation with a person or
                    entity
                  </li>
                  <li>
                    Attempt to access or use another user's account without
                    authorization
                  </li>
                  <li>
                    Engage in review trading, review selling, or other
                    fraudulent review practices
                  </li>
                  <li>
                    Post content that is defamatory, obscene, or otherwise
                    objectionable
                  </li>
                  <li>
                    Interfere with or disrupt the operation of our Services
                  </li>
                  <li>
                    Use automated means to access or use our Services without
                    our permission
                  </li>
                  <li>
                    Attempt to reverse engineer any aspect of our recommendation
                    algorithm
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  4. Restaurant Reviews and Ratings
                </h3>
                <p className="mb-4">
                  Our platform allows users to post reviews and ratings of
                  restaurants. By posting reviews, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Provide honest, accurate, and fair assessments based on your
                    actual experience
                  </li>
                  <li>Only review restaurants you have personally visited</li>
                  <li>
                    Avoid conflicts of interest (such as reviewing your own
                    restaurant or a competitor's)
                  </li>
                  <li>
                    Comply with our content guidelines, which prohibit hate
                    speech, threats, harassment, and spam
                  </li>
                  <li>
                    Acknowledge that we may remove reviews that violate our
                    policies or appear fraudulent
                  </li>
                </ul>
                <p>
                  We reserve the right to implement systems to detect and
                  prevent fraudulent reviews, including algorithmic detection
                  and manual review processes.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  5. Recommendation System
                </h3>
                <p className="mb-4">
                  Our restaurant recommendation system uses various factors to
                  suggest restaurants, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>User preferences and past behavior</li>
                  <li>Restaurant ratings and reviews</li>
                  <li>Location data (when permitted)</li>
                  <li>Similar user preferences</li>
                  <li>Restaurant attributes and categories</li>
                </ul>
                <p className="mb-4">You acknowledge that:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Recommendations are algorithmic and may not always match
                    your preferences
                  </li>
                  <li>
                    We do not guarantee the accuracy or reliability of
                    recommendations
                  </li>
                  <li>
                    Restaurants do not pay for higher placement in organic
                    recommendation results
                  </li>
                  <li>
                    Sponsored or promoted content will be clearly labeled as
                    such
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  6. Intellectual Property
                </h3>
                <p className="mb-4">
                  All content, features, and functionality of our Services,
                  including but not limited to text, graphics, logos, icons,
                  images, audio clips, digital downloads, and software, are
                  owned by RestaurantFinder, our licensors, or other providers
                  and are protected by copyright, trademark, and other
                  intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative
                  works of, publicly display, publicly perform, republish,
                  download, store, or transmit any of the material on our
                  Services without our prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">7. User Content</h3>
                <p className="mb-4">
                  By submitting reviews, photos, comments, suggestions, or other
                  content to our Services, you:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Grant us a non-exclusive, royalty-free, perpetual,
                    irrevocable, and fully sublicensable right to use,
                    reproduce, modify, adapt, publish, translate, create
                    derivative works from, distribute, and display such content
                    throughout the world in any media
                  </li>
                  <li>
                    Represent and warrant that you own or control all rights to
                    the content you submit
                  </li>
                  <li>
                    Agree that your content will not violate any third party's
                    rights or these Terms
                  </li>
                  <li>
                    Acknowledge that your content may be used by our
                    recommendation algorithm to improve suggestions for other
                    users
                  </li>
                  <li>
                    Understand that your public profile information may appear
                    alongside your reviews and contributions
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  8. Social Features and Friend Connections
                </h3>
                <p className="mb-4">
                  Our platform includes social features that allow you to
                  connect with friends and see their restaurant recommendations.
                  By using these features, you:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Agree to only send friend requests to people you know
                    personally
                  </li>
                  <li>
                    Understand that your public activity (reviews, ratings,
                    check-ins) may be visible to your connections
                  </li>
                  <li>
                    Acknowledge that your friends' activities may influence your
                    personalized recommendations
                  </li>
                  <li>
                    Agree not to use our social features for harassment,
                    spamming, or other prohibited conduct
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  9. Disclaimer of Warranties
                </h3>
                <p className="mb-4">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                  ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE
                  FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
                  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                  PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="mb-4">WE DO NOT WARRANT THAT:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>OUR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE</li>
                  <li>DEFECTS WILL BE CORRECTED</li>
                  <li>OUR RECOMMENDATIONS WILL MEET YOUR EXPECTATIONS</li>
                  <li>RESTAURANT INFORMATION IS ACCURATE OR UP-TO-DATE</li>
                  <li>
                    OUR SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE
                    FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  10. Limitation of Liability
                </h3>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL FORK
                  & FRIENDS, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS,
                  DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR
                  ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                  SERVICES.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  11. Indemnification
                </h3>
                <p>
                  You agree to indemnify, defend, and hold harmless Fork &
                  Friend, its affiliates, and their respective officers,
                  directors, employees, and agents from and against any and all
                  claims, liabilities, damages, losses, costs, expenses, or fees
                  (including reasonable attorneys' fees) that arise from or
                  relate to your use of our Services or violation of these
                  Terms.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  12. Governing Law and Jurisdiction
                </h3>
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of the State of California, without regard to
                  its conflict of law provisions. You agree to submit to the
                  personal jurisdiction of the courts located in San Francisco
                  County, California for the resolution of any disputes arising
                  out of or relating to these Terms or our Services.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">
                  13. Contact Information
                </h3>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-black">
                  <p className="mb-1">Fork & Friends</p>
                  <p className="mb-1">Email: feroznasimrana@gmail.com</p>
                  <p className="mb-1">Phone: +86 132 2814 2082</p>
                  <p>Address: Chengdu, Sichuan Province</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="container mx-auto px-4 py-8 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center justify-center bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          Back to Top
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default LegalPage;
