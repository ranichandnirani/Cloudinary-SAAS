import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { NextResponse } from "next/server";

type AccountUpdate = {
  firstName: string;
  lastName: string;
  username: string;
};

function isAccountUpdate(value: unknown): value is AccountUpdate {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const fields = value as Record<string, unknown>;
  return (
    typeof fields.firstName === "string" &&
    typeof fields.lastName === "string" &&
    typeof fields.username === "string"
  );
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isAccountUpdate(body)) {
    return NextResponse.json(
      { error: "First name, last name, and username must be text." },
      { status: 400 },
    );
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      ...(body.username.trim() ? { username: body.username.trim() } : {}),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update account details in Clerk", error);
    if (isClerkAPIResponseError(error)) {
      const message = error.errors
        .map((clerkError) => clerkError.longMessage || clerkError.message)
        .find(Boolean);
      return NextResponse.json(
        { error: message || "Clerk rejected the profile values." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Could not save your profile right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
