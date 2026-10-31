import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <section className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <Image
            src="/cloudinary-showcase-logo.png"
            alt="Cloudinary Showcase logo"
            width={96}
            height={96}
            priority
            className="rounded-2xl"
          />
          <h1 className="card-title text-3xl">Cloudinary Showcase</h1>
          <p>Upload, manage, and share your videos in one place.</p>
          <div className="card-actions mt-4 w-full flex-col">
            <Link href="/sign-up" className="btn btn-primary w-full">
              Sign up
            </Link>
            <Link href="/sign-in" className="btn btn-outline w-full">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
