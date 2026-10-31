"use client";

import { FormEvent, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function AccountPage() {
  const { isLoaded, user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isLoaded) {
    return <p className="p-4">Loading account...</p>;
  }

  if (!user) {
    return <p className="p-4">Account information is unavailable.</p>;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "No email address";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Not set";

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();

    setIsSaving(true);
    try {
      await user.update({
        firstName: firstName || null,
        lastName: lastName || null,
        username: username || null,
      });
      setIsEditing(false);
      setSuccess("Account details updated.");
    } catch (updateError) {
      console.error("Failed to update account details", updateError);
      setError(
        "Could not update your account. Check that profile fields are enabled in your Clerk settings and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Account</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="mb-4 flex items-center gap-4">
            <Image
              src={user.imageUrl}
              alt={`${fullName} profile`}
              width={80}
              height={80}
              className="rounded-full"
              unoptimized
            />
            <div>
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <p className="text-sm opacity-70">Account profile</p>
            </div>
          </div>
          {error && (
            <p role="alert" className="alert alert-error mb-4">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="alert alert-success mb-4">
              {success}
            </p>
          )}
          {isEditing ? (
            <form onSubmit={handleSave}>
              <label className="form-control mb-4 w-full">
                <span className="label-text mb-2">First name</span>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={user.firstName ?? ""}
                  autoComplete="given-name"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control mb-4 w-full">
                <span className="label-text mb-2">Last name</span>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={user.lastName ?? ""}
                  autoComplete="family-name"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control mb-4 w-full">
                <span className="label-text mb-2">Username</span>
                <input
                  name="username"
                  type="text"
                  defaultValue={user.username ?? ""}
                  autoComplete="username"
                  className="input input-bordered w-full"
                />
              </label>
              <div className="mb-4">
                <p className="text-sm opacity-70">Email</p>
                <p className="break-all font-medium">{email}</p>
                <p className="mt-1 text-xs opacity-60">
                  Email changes are managed through your sign-in provider.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={isSaving}
                  onClick={() => {
                    setError(null);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="divide-y divide-base-300">
                <div className="py-4">
                  <p className="text-sm opacity-70">Email</p>
                  <p className="break-all font-medium">{email}</p>
                </div>
                <div className="py-4">
                  <p className="text-sm opacity-70">Username</p>
                  <p className="font-medium">{user.username || "Not set"}</p>
                </div>
                <div className="py-4">
                  <p className="text-sm opacity-70">Member since</p>
                  <p className="font-medium">
                    {user.createdAt
                      ? new Intl.DateTimeFormat(undefined, {
                          dateStyle: "long",
                        }).format(user.createdAt)
                      : "Not available"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setIsEditing(true);
                }}
              >
                Edit account
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
