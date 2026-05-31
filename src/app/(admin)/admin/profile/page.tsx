import { requireSession } from "@/lib/session";
import { getProfile } from "@/lib/content";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  await requireSession();
  const profile = await getProfile();
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Identity, bio, socials, and visual style.</p>
      </div>
      <ProfileForm
        initial={{
          name: profile.name,
          title: profile.title,
          tagline: profile.tagline ?? "",
          bio: profile.bio ?? "",
          location: profile.location ?? "",
          photoUrl: profile.photoUrl ?? "",
          resumeUrl: profile.resumeUrl ?? "",
          accentColor: profile.accentColor ?? "#0ea5e9",
          email: profile.email ?? "",
          githubUrl: profile.githubUrl ?? "",
          linkedinUrl: profile.linkedinUrl ?? "",
          twitterUrl: profile.twitterUrl ?? "",
          websiteUrl: profile.websiteUrl ?? "",
        }}
      />
    </div>
  );
}
