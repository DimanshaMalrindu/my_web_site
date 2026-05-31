import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getProfile } from "@/lib/content";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <div className="flex min-h-screen flex-col">
      <Header name={profile.name} />
      <main className="flex-1">{children}</main>
      <Footer
        name={profile.name}
        socials={{
          githubUrl: profile.githubUrl,
          linkedinUrl: profile.linkedinUrl,
          twitterUrl: profile.twitterUrl,
          websiteUrl: profile.websiteUrl,
          email: profile.email,
        }}
      />
    </div>
  );
}
