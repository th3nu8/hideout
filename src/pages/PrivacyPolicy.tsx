import { Navigation } from "@/components/Navigation";
import { GridBackground } from "@/components/GridBackground";
import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  usePageTitle('Privacy Policy');

  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-24 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6 text-foreground/90">
            <p>
              Welcome to Hideout Network. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              <p>
                We collect minimal information necessary to provide our services. This may include technical data such as 
                your browser type, IP address, and device information. We use local storage to save your preferences and 
                settings on your device, which remains under your control.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              <p>
                The information we collect is used solely to improve your experience on our platform. We use local storage 
                to remember your preferences, themes, and settings. We do not sell, trade, or transfer your personal 
                information to outside parties.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Cookies and Local Storage</h2>
              <p>
                Our website uses local storage to enhance your browsing experience. Local storage allows us to remember 
                your preferences and provide personalized features. You can clear this data at any time through your 
                browser settings or our Settings page.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Third-Party Services</h2>
              <p>
                We may use third-party services to operate our website and provide features. These services may have 
                access to your information only to perform specific tasks on our behalf and are obligated not to disclose 
                or use it for any other purpose.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, please note that 
                no method of transmission over the internet is 100% secure. While we strive to use commercially acceptable 
                means to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. You can clear all 
                locally stored data through the Settings page. If you have any questions about your data or our privacy 
                practices, please contact us through our GitHub repository.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new 
                privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy 
                policy periodically for any changes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please visit our GitHub 
                repository or join our Discord community for support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
