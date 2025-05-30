import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkMetadata } from "@/services/clerk";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const data = evt.data;

        const email = data.email_addresses[0].email_address;
        const name = `${data.first_name} ${data.last_name}`;

        if (eventType === "user.created") {
          const newUser = await insertUser({
            email,
            name,
            imageUrl: evt.data.image_url,
            clerkId: evt.data.id,
          });

          if (newUser) {
            await syncClerkMetadata({
              userId: newUser.id,
              clerkId: evt.data.id,
              role: "user",
            });
          }
        } else {
          await updateUser(
            {
              role: evt.data.public_metadata.role,
              name: `${evt.data.first_name} ${evt.data.last_name}`,
              imageUrl: evt.data.image_url,
            },
            evt.data.public_metadata.userId,
          );
        }
        break;
      }
      case "user.deleted": {
        await deleteUser(evt.data.id!);
        break;
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
