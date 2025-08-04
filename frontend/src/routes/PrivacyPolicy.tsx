import { motion } from "framer-motion";

import { useAppSelector } from "../app/store";

const PrivacyPolicy = () => {
  const isOpen = useAppSelector((state) => state.hamburger);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`relative mx-1 md:ml-4 mt-3 md:mr-2 mb-2 ${
        !isOpen ? "w-[85vw]" : "w-full"
      }  overflow-y-auto hideScrollbar rounded-xl`}
    >
      <div className="w-full max-w-4xl p-8 mx-4 glass md:p-12">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.3 }}
          className="text-2xl font-bold tracking-tight text-center md:text-3xl xl:text-4xl text-slate-200"
        >
          Privacy Policy
        </motion.h1>

        <h2 className="mt-8 mb-4 text-2xl font-semibold text-zinc-200">
          Privacy Policy
        </h2>
        <p className="mb-4 text-zinc-400">Last updated: August 04, 2025</p>
        <p className="mb-4 leading-relaxed text-zinc-400">
          This Privacy Policy describes Our policies and procedures on the
          collection, use, and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <p className="mb-6 leading-relaxed text-zinc-400">
          We use Your Personal data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy. This Privacy Policy has been
          created with the help of the{" "}
          <a
            href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-yellow-200"
          >
            Free Privacy Policy Generator
          </a>
          .
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold text-zinc-200">
          Interpretation and Definitions
        </h2>
        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Interpretation
        </h3>
        <p className="mb-4 leading-relaxed text-zinc-400">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Definitions
        </h3>
        <p className="mb-4 text-zinc-400">
          For the purposes of this Privacy Policy:
        </p>
        <ul className="pl-6 space-y-3 list-disc text-zinc-400">
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              Account
            </strong>{" "}
            means your youtube account will be logged in to access my project
          </li>
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              Country
            </strong>{" "}
            refers to: Maharashtra, India
          </li>
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              Device
            </strong>{" "}
            means any device that can access the Service such as a computer, a
            cellphone or a digital tablet.
          </li>
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              Service
            </strong>{" "}
            refers to the Website.
          </li>
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              Website
            </strong>{" "}
            refers to YouPipe, accessible from{" "}
            <a
              href="https://youpipe-frontend.vercel.app"
              rel="external nofollow noopener"
              target="_blank"
              className="text-pink-400 hover:text-yellow-200"
            >
              https://youpipe-frontend.vercel.app
            </a>
          </li>
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              You
            </strong>{" "}
            means the individual accessing or using the Service, or the company,
            or other legal entity on behalf of which such individual is
            accessing or using the Service, as applicable.
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold text-zinc-200">
          Collecting and Using Your Personal Data
        </h2>
        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Types of Data Collected
        </h3>
        <h4 className="mt-5 mb-2 text-lg font-medium text-zinc-300">
          Personal Data
        </h4>
        <p className="mb-4 leading-relaxed text-zinc-400">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul className="pl-6 space-y-2 list-disc text-zinc-400">
          <li>Email address</li>
          <li>First name and last name</li>
        </ul>
        <p className="mt-2 mb-4 leading-relaxed text-zinc-400">
          When You access the Service by or through a mobile device, We may
          collect certain information like location details and youtube profile
          data for showing your youtube content.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Use of Your Personal Data
        </h3>
        <p className="mb-4 text-zinc-400">
          I'll use Personal Data for the following purposes:
        </p>
        <ul className="pl-6 space-y-3 list-disc text-zinc-400">
          <li>
            <strong className="font-semibold bg-pink-500 text-yellow-200 rounded-md p-[2px]">
              For showing your account data only
            </strong>
            : We may use Your information for mimicking your own youtube usage
            itself with a slight change in UI/UX.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Retention of Your Personal Data
        </h3>
        <p className="mb-4 leading-relaxed text-zinc-400">
          My console will probably save your email ID and youtube profile only
        </p>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Delete Your Personal Data
        </h3>
        <p className="mb-4 leading-relaxed text-zinc-400">
          You have the right to delete or request that We assist in deleting the
          Personal Data that We have collected about You.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Disclosure of Your Personal Data
        </h3>
        <h4 className="mt-5 mb-2 text-lg font-medium text-zinc-300">
          Business Transactions
        </h4>
        <p className="mb-4 leading-relaxed text-zinc-400">
          If the Company is involved in a merger, acquisition or asset sale,
          Your Personal Data may be transferred. We will provide notice before
          Your Personal Data is transferred and becomes subject to a different
          Privacy Policy.
        </p>

        <h4 className="mt-5 mb-2 text-lg font-medium text-zinc-300">
          Law enforcement
        </h4>
        <p className="mb-4 leading-relaxed text-zinc-400">
          Under certain circumstances, the Company may be required to disclose
          Your Personal Data if required to do so by law or in response to valid
          requests by public authorities (e.g. a court or a government agency).
        </p>

        <h4 className="mt-5 mb-2 text-lg font-medium text-zinc-300">
          Other legal requirements
        </h4>
        <p className="mb-4 leading-relaxed text-zinc-400">
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
        </p>
        <ul className="pl-6 space-y-2 list-disc text-zinc-400">
          <li>Comply with a legal obligation</li>
          <li>Protect and defend the rights or property of the Company</li>
          <li>
            Prevent or investigate possible wrongdoing in connection with the
            Service
          </li>
          <li>
            Protect the personal safety of Users of the Service or the public
          </li>
          <li>Protect against legal liability</li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-medium text-zinc-300">
          Security of Your Personal Data
        </h3>
        <p className="mb-4 leading-relaxed text-zinc-400">
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          acceptable means to protect Your Personal Data, We cannot guarantee
          its absolute security.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold text-zinc-200">
          Children's Privacy
        </h2>
        <p className="mb-4 leading-relaxed text-zinc-400">
          Our Service does not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from anyone
          under the age of 13. If You are a parent or guardian and You are aware
          that Your child has provided Us with Personal Data, please contact Us.
          If We become aware that We have collected Personal Data from anyone
          under the age of 13 without verification of parental consent, We take
          steps to remove that information from Our servers.
        </p>
        <p className="mb-4 leading-relaxed text-zinc-400">
          If We need to rely on consent as a legal basis for processing Your
          information and Your country requires consent from a parent, We may
          require Your parent's consent before We collect and use that
          information.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold text-zinc-200">
          Contact Us
        </h2>
        <p className="mb-4 text-zinc-400">
          If you have any questions about this Privacy Policy, You can contact
          us:
        </p>
        <ul className="pl-6 space-y-2 list-disc text-zinc-400">
          <li>By email: chhavimanichoubey@gmail.com</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
